import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryReservation } from './entities/inventory-reservation.entity';
import * as Errors from '@ecommerce/shared/error-handler/error-service';
import {
  AdjustInventoryDto,
  UpdateInventoryDto,
} from './dto/update-inventory.dto';
import { Action, InventoryStatus } from 'src/common/utils';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ReserveInventoryDto } from './dto/reservation.dto';
import * as crypto from 'crypto';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  private redisClient?: RedisClientType;

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryModel: Repository<Inventory>,
    @InjectRepository(InventoryReservation)
    private readonly reservationModel: Repository<InventoryReservation>,
    private readonly configService: ConfigService,
  ) {}

  async getInventoryForProduct(productId: number) {
    const inventory = await this.inventoryModel.findOne({
      where: { product_id: productId },
    });

    if (!inventory) {
      throw new Errors.InventoryNotFound();
    }

    return { data: inventory };
  }

  async createInventoryForProduct(productId: number, dto: CreateInventoryDto) {
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
      status: InventoryStatus.OUT_OF_STOCK,
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
      where: { status: InventoryStatus.LOW_STOCK },
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

  async updateProductInventory(
    productId: number,
    updateInventoryDto: UpdateInventoryDto,
  ) {
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

  async updateInventory(
    productId: number,
    dto: AdjustInventoryDto,
  ): Promise<{ data: Inventory }> {
    const { quantity, action } = dto;
    const { data: inventory } = await this.getInventoryForProduct(productId);

    switch (action) {
      case Action.ADD:
        inventory.quantity += quantity;
        break;
      case Action.SUBTRACT:
        if (inventory.quantity < quantity && inventory.trackInventory) {
          throw new Errors.InsufficientInventory();
        }
        inventory.quantity = Math.max(0, inventory.quantity - quantity);
        break;
      case Action.SET:
      default:
        inventory.quantity = quantity;
    }

    inventory.updateStatus();
    const data = await this.inventoryModel.save(inventory);
    await this.syncRedisAvailableForProduct(productId, data);
    return { data };
  }

  async reserveInventory(productId: number, dto: ReserveInventoryDto) {
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
      const reserved = await this.reserveInRedis(
        productId,
        reservationId,
        dto.quantity,
      );
      if (!reserved) {
        throw new Errors.InsufficientInventory();
      }
      redisReserved = true;
    }

    try {
      const result = await this.inventoryModel.manager.transaction(
        async (manager) => {
          const inventoryRepo = manager.getRepository(Inventory);
          const reservationRepo = manager.getRepository(InventoryReservation);

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
        },
      );

      return result;
    } catch (error) {
      if (redisReserved) {
        await this.releaseInRedis(productId, reservationId);
      }
      throw error;
    }
  }

  async releaseReservation(productId: number, reservationId: string) {
    return this.inventoryModel.manager.transaction(async (manager) => {
      const inventoryRepo = manager.getRepository(Inventory);
      const reservationRepo = manager.getRepository(InventoryReservation);

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

      inventory.reserved_quantity = Math.max(
        0,
        inventory.reserved_quantity - reservation.quantity,
      );
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

  async confirmReservation(productId: number, reservationId: string) {
    return this.inventoryModel.manager.transaction(async (manager) => {
      const inventoryRepo = manager.getRepository(Inventory);
      const reservationRepo = manager.getRepository(InventoryReservation);

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

      inventory.reserved_quantity = Math.max(
        0,
        inventory.reserved_quantity - reservation.quantity,
      );
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

  private shouldUseRedisReservationPath(): boolean {
    return this.configService.get<string>('USE_REDIS_RESERVATION_PATH', 'true') === 'true';
  }

  private getReservationAvailableKey(productId: number): string {
    return `inventory:available:${productId}`;
  }

  private getReservationMarkerKey(productId: number, reservationId: string): string {
    return `inventory:reservation:${productId}:${reservationId}`;
  }

  private async getRedisClient(): Promise<RedisClientType> {
    if (this.redisClient?.isOpen) {
      return this.redisClient;
    }

    const redisUrl =
      this.configService.get<string>('REDIS_URL') ??
      `redis://${this.configService.get<string>('REDIS_HOST', 'localhost')}:${this.configService.get<number>('REDIS_PORT', 6379)}`;

    this.redisClient = createClient({ url: redisUrl });
    this.redisClient.on('error', (err) => {
      this.logger.warn(`Redis client error: ${String(err)}`);
    });
    await this.redisClient.connect();
    return this.redisClient;
  }

  private async ensureRedisAvailableSeed(
    productId: number,
    inventory: Inventory,
  ): Promise<void> {
    const client = await this.getRedisClient();
    const key = this.getReservationAvailableKey(productId);
    const existing = await client.get(key);
    if (existing !== null) {
      return;
    }

    const available = Math.max(0, inventory.quantity - inventory.reserved_quantity);
    await client.set(key, String(available), { EX: 3600 });
  }

  private async reserveInRedis(
    productId: number,
    reservationId: string,
    quantity: number,
  ): Promise<boolean> {
    if (!this.shouldUseRedisReservationPath()) {
      return true;
    }

    try {
      const client = await this.getRedisClient();
      const result = await client.eval(
        `
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
        `,
        {
          keys: [
            this.getReservationAvailableKey(productId),
            this.getReservationMarkerKey(productId, reservationId),
          ],
          arguments: [String(quantity), '900'],
        },
      );

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
    } catch {
      return true;
    }
  }

  private async releaseInRedis(productId: number, reservationId: string): Promise<void> {
    if (!this.shouldUseRedisReservationPath()) {
      return;
    }

    try {
      const client = await this.getRedisClient();
      await client.eval(
        `
          local availableKey = KEYS[1]
          local markerKey = KEYS[2]

          local qty = tonumber(redis.call('GET', markerKey) or '0')
          if qty > 0 then
            redis.call('INCRBY', availableKey, qty)
          end
          redis.call('DEL', markerKey)
          return 1
        `,
        {
          keys: [
            this.getReservationAvailableKey(productId),
            this.getReservationMarkerKey(productId, reservationId),
          ],
        },
      );
    } catch {
      return;
    }
  }

  private async confirmInRedis(
    productId: number,
    reservationId: string,
    inventory: Inventory,
  ): Promise<void> {
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
    } catch {
      return;
    }
  }

  private async syncRedisAvailableForProduct(
    productId: number,
    inventory: Inventory,
  ): Promise<void> {
    if (!this.shouldUseRedisReservationPath()) {
      return;
    }

    try {
      const client = await this.getRedisClient();
      const available = Math.max(0, inventory.quantity - inventory.reserved_quantity);
      await client.set(this.getReservationAvailableKey(productId), String(available), {
        EX: 3600,
      });
    } catch {
      return;
    }
  }
}
