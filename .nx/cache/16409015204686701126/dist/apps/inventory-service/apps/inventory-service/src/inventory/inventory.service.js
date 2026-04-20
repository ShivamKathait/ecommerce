"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_entity_1 = require("./entities/inventory.entity");
const inventory_reservation_entity_1 = require("./entities/inventory-reservation.entity");
const Errors = require("../../../../libs/shared/src/error-handler/error-service");
const utils_1 = require("../../../../libs/shared/src/common/utils");
const crypto = require("crypto");
const redis_1 = require("redis");
let InventoryService = InventoryService_1 = class InventoryService {
    inventoryModel;
    reservationModel;
    configService;
    logger = new common_1.Logger(InventoryService_1.name);
    redisClient;
    constructor(inventoryModel, reservationModel, configService) {
        this.inventoryModel = inventoryModel;
        this.reservationModel = reservationModel;
        this.configService = configService;
    }
    async getInventoryForProduct(productId) {
        const inventory = await this.inventoryModel.findOne({
            where: { product_id: productId },
        });
        if (!inventory) {
            throw new Errors.InventoryNotFound();
        }
        return { data: inventory };
    }
    async createInventoryForProduct(productId, dto) {
        const existing = await this.inventoryModel.findOne({
            where: { product_id: productId },
        });
        if (existing) {
            return { data: existing };
        }
        const inventory = this.inventoryModel.create({
            product_id: productId,
            quantity: dto.quantity ?? 0,
            lowStockThreshold: dto.lowStockThreshold ?? 5,
            trackInventory: dto.trackInventory ?? true,
            status: utils_1.InventoryStatus.OUT_OF_STOCK,
        });
        inventory.updateStatus();
        const created = await this.inventoryModel.save(inventory);
        await this.syncRedisAvailableForProduct(productId, created);
        return { data: created };
    }
    async listLowStock(limit = 20, page = 1) {
        const take = Math.max(1, Math.min(limit, 100));
        const currentPage = Math.max(page, 1);
        const skip = (currentPage - 1) * take;
        const [items, total] = await this.inventoryModel.findAndCount({
            where: { status: utils_1.InventoryStatus.LOW_STOCK },
            order: { updated_at: 'DESC' },
            skip,
            take,
        });
        return {
            data: items,
            meta: {
                total,
                page: currentPage,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }
    async updateProductInventory(productId, updateInventoryDto) {
        const { lowStockThreshold, trackInventory } = updateInventoryDto;
        const { data: inventory } = await this.getInventoryForProduct(productId);
        if (lowStockThreshold !== undefined) {
            inventory.lowStockThreshold = lowStockThreshold;
        }
        if (trackInventory !== undefined) {
            inventory.trackInventory = trackInventory;
        }
        inventory.updateStatus();
        const updatedInventory = await this.inventoryModel.save(inventory);
        await this.syncRedisAvailableForProduct(productId, updatedInventory);
        return {
            message: 'Inventory updated successfully',
            data: updatedInventory,
        };
    }
    async updateInventory(productId, dto) {
        const { quantity, action } = dto;
        const { data: inventory } = await this.getInventoryForProduct(productId);
        switch (action) {
            case utils_1.Action.ADD:
                inventory.quantity += quantity;
                break;
            case utils_1.Action.SUBTRACT:
                if (inventory.quantity < quantity && inventory.trackInventory) {
                    throw new Errors.InsufficientInventory();
                }
                inventory.quantity = Math.max(0, inventory.quantity - quantity);
                break;
            case utils_1.Action.SET:
            default:
                inventory.quantity = quantity;
        }
        inventory.updateStatus();
        const data = await this.inventoryModel.save(inventory);
        await this.syncRedisAvailableForProduct(productId, data);
        return { data };
    }
    async reserveInventory(productId, dto) {
        const reservationId = dto.reservationId ?? crypto.randomUUID();
        const existingReservation = await this.reservationModel.findOne({
            where: { reservation_id: reservationId, product_id: productId },
        });
        if (existingReservation && existingReservation.status === 'reserved') {
            return {
                data: {
                    reservation_id: existingReservation.reservation_id,
                    product_id: existingReservation.product_id,
                    quantity: existingReservation.quantity,
                    status: existingReservation.status,
                },
                idempotent: true,
            };
        }
        const useRedis = this.shouldUseRedisReservationPath();
        let redisReserved = false;
        if (useRedis) {
            const inventory = await this.inventoryModel.findOne({
                where: { product_id: productId },
            });
            if (!inventory) {
                throw new Errors.InventoryNotFound();
            }
            await this.ensureRedisAvailableSeed(productId, inventory);
            const reserved = await this.reserveInRedis(productId, reservationId, dto.quantity);
            if (!reserved) {
                throw new Errors.InsufficientInventory();
            }
            redisReserved = true;
        }
        try {
            const result = await this.inventoryModel.manager.transaction(async (manager) => {
                const inventoryRepo = manager.getRepository(inventory_entity_1.Inventory);
                const reservationRepo = manager.getRepository(inventory_reservation_entity_1.InventoryReservation);
                const inventory = await inventoryRepo.findOne({
                    where: { product_id: productId },
                    lock: { mode: 'pessimistic_write' },
                });
                if (!inventory) {
                    throw new Errors.InventoryNotFound();
                }
                const available = inventory.quantity - inventory.reserved_quantity;
                if (inventory.trackInventory && available < dto.quantity) {
                    throw new Errors.InsufficientInventory();
                }
                const existing = await reservationRepo.findOne({
                    where: { reservation_id: reservationId, product_id: productId },
                });
                if (existing) {
                    if (existing.status === 'reserved') {
                        return {
                            data: {
                                reservation_id: existing.reservation_id,
                                product_id: existing.product_id,
                                quantity: existing.quantity,
                                status: existing.status,
                            },
                            idempotent: true,
                        };
                    }
                    throw new Errors.InventoryReservationNotFound();
                }
                inventory.reserved_quantity += dto.quantity;
                inventory.updateStatus();
                await inventoryRepo.save(inventory);
                const reservation = reservationRepo.create({
                    reservation_id: reservationId,
                    product_id: productId,
                    quantity: dto.quantity,
                    status: 'reserved',
                    expires_at: new Date(Date.now() + 15 * 60 * 1000),
                });
                const saved = await reservationRepo.save(reservation);
                return {
                    data: {
                        reservation_id: saved.reservation_id,
                        product_id: saved.product_id,
                        quantity: saved.quantity,
                        status: saved.status,
                    },
                };
            });
            return result;
        }
        catch (error) {
            if (redisReserved) {
                await this.releaseInRedis(productId, reservationId);
            }
            throw error;
        }
    }
    async releaseReservation(productId, reservationId) {
        return this.inventoryModel.manager.transaction(async (manager) => {
            const inventoryRepo = manager.getRepository(inventory_entity_1.Inventory);
            const reservationRepo = manager.getRepository(inventory_reservation_entity_1.InventoryReservation);
            const reservation = await reservationRepo.findOne({
                where: { reservation_id: reservationId, product_id: productId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!reservation || reservation.status !== 'reserved') {
                throw new Errors.InventoryReservationNotFound();
            }
            const inventory = await inventoryRepo.findOne({
                where: { product_id: productId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!inventory) {
                throw new Errors.InventoryNotFound();
            }
            inventory.reserved_quantity = Math.max(0, inventory.reserved_quantity - reservation.quantity);
            inventory.updateStatus();
            reservation.status = 'released';
            await inventoryRepo.save(inventory);
            await reservationRepo.save(reservation);
            await this.releaseInRedis(productId, reservationId);
            return {
                data: {
                    reservation_id: reservation.reservation_id,
                    product_id: reservation.product_id,
                    status: reservation.status,
                },
            };
        });
    }
    async confirmReservation(productId, reservationId) {
        return this.inventoryModel.manager.transaction(async (manager) => {
            const inventoryRepo = manager.getRepository(inventory_entity_1.Inventory);
            const reservationRepo = manager.getRepository(inventory_reservation_entity_1.InventoryReservation);
            const reservation = await reservationRepo.findOne({
                where: { reservation_id: reservationId, product_id: productId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!reservation || reservation.status !== 'reserved') {
                throw new Errors.InventoryReservationNotFound();
            }
            const inventory = await inventoryRepo.findOne({
                where: { product_id: productId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!inventory) {
                throw new Errors.InventoryNotFound();
            }
            if (inventory.quantity < reservation.quantity && inventory.trackInventory) {
                throw new Errors.InsufficientInventory();
            }
            inventory.reserved_quantity = Math.max(0, inventory.reserved_quantity - reservation.quantity);
            inventory.quantity = Math.max(0, inventory.quantity - reservation.quantity);
            inventory.updateStatus();
            reservation.status = 'confirmed';
            await inventoryRepo.save(inventory);
            await reservationRepo.save(reservation);
            await this.confirmInRedis(productId, reservationId, inventory);
            return {
                data: {
                    reservation_id: reservation.reservation_id,
                    product_id: reservation.product_id,
                    status: reservation.status,
                    remaining_quantity: inventory.quantity,
                },
            };
        });
    }
    shouldUseRedisReservationPath() {
        return this.configService.get('USE_REDIS_RESERVATION_PATH', 'true') === 'true';
    }
    getReservationAvailableKey(productId) {
        return `inventory:available:${productId}`;
    }
    getReservationMarkerKey(productId, reservationId) {
        return `inventory:reservation:${productId}:${reservationId}`;
    }
    async getRedisClient() {
        if (this.redisClient?.isOpen) {
            return this.redisClient;
        }
        const redisUrl = this.configService.get('REDIS_URL') ??
            `redis://${this.configService.get('REDIS_HOST', 'localhost')}:${this.configService.get('REDIS_PORT', 6379)}`;
        this.redisClient = (0, redis_1.createClient)({ url: redisUrl });
        this.redisClient.on('error', (err) => {
            this.logger.warn(`Redis client error: ${String(err)}`);
        });
        await this.redisClient.connect();
        return this.redisClient;
    }
    async ensureRedisAvailableSeed(productId, inventory) {
        const client = await this.getRedisClient();
        const key = this.getReservationAvailableKey(productId);
        const existing = await client.get(key);
        if (existing !== null) {
            return;
        }
        const available = Math.max(0, inventory.quantity - inventory.reserved_quantity);
        await client.set(key, String(available), { EX: 3600 });
    }
    async reserveInRedis(productId, reservationId, quantity) {
        if (!this.shouldUseRedisReservationPath()) {
            return true;
        }
        try {
            const client = await this.getRedisClient();
            const result = await client.eval(`
          local availableKey = KEYS[1]
          local markerKey = KEYS[2]
          local qty = tonumber(ARGV[1])
          local ttl = tonumber(ARGV[2])

          if redis.call('EXISTS', markerKey) == 1 then
            return 2
          end

          local available = tonumber(redis.call('GET', availableKey) or '-1')
          if available < 0 then
            return -2
          end
          if available < qty then
            return 0
          end

          redis.call('DECRBY', availableKey, qty)
          redis.call('SET', markerKey, qty, 'EX', ttl)
          return 1
        `, {
                keys: [
                    this.getReservationAvailableKey(productId),
                    this.getReservationMarkerKey(productId, reservationId),
                ],
                arguments: [String(quantity), '900'],
            });
            if (result === 1 || result === 2) {
                return true;
            }
            if (result === -2) {
                const inventory = await this.inventoryModel.findOne({
                    where: { product_id: productId },
                });
                if (!inventory) {
                    return false;
                }
                await this.syncRedisAvailableForProduct(productId, inventory);
                return this.reserveInRedis(productId, reservationId, quantity);
            }
            return false;
        }
        catch {
            return true;
        }
    }
    async releaseInRedis(productId, reservationId) {
        if (!this.shouldUseRedisReservationPath()) {
            return;
        }
        try {
            const client = await this.getRedisClient();
            await client.eval(`
          local availableKey = KEYS[1]
          local markerKey = KEYS[2]

          local qty = tonumber(redis.call('GET', markerKey) or '0')
          if qty > 0 then
            redis.call('INCRBY', availableKey, qty)
          end
          redis.call('DEL', markerKey)
          return 1
        `, {
                keys: [
                    this.getReservationAvailableKey(productId),
                    this.getReservationMarkerKey(productId, reservationId),
                ],
            });
        }
        catch {
            return;
        }
    }
    async confirmInRedis(productId, reservationId, inventory) {
        if (!this.shouldUseRedisReservationPath()) {
            return;
        }
        try {
            const client = await this.getRedisClient();
            await client.del(this.getReservationMarkerKey(productId, reservationId));
            const available = Math.max(0, inventory.quantity - inventory.reserved_quantity);
            await client.set(this.getReservationAvailableKey(productId), String(available), {
                EX: 3600,
            });
        }
        catch {
            return;
        }
    }
    async syncRedisAvailableForProduct(productId, inventory) {
        if (!this.shouldUseRedisReservationPath()) {
            return;
        }
        try {
            const client = await this.getRedisClient();
            const available = Math.max(0, inventory.quantity - inventory.reserved_quantity);
            await client.set(this.getReservationAvailableKey(productId), String(available), {
                EX: 3600,
            });
        }
        catch {
            return;
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(1, (0, typeorm_1.InjectRepository)(inventory_reservation_entity_1.InventoryReservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map