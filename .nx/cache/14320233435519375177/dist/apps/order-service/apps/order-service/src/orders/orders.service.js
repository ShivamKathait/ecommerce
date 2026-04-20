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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const typeorm_2 = require("typeorm");
const catalog_client_service_1 = require("../../../../libs/shared/src/common/services/catalog-client.service");
const inventory_client_service_1 = require("../../../../libs/shared/src/common/services/inventory-client.service");
const payment_client_service_1 = require("../../../../libs/shared/src/common/services/payment-client.service");
const Errors = require("../../../../libs/shared/src/error-handler/error-service");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
let OrdersService = class OrdersService {
    orderRepo;
    orderItemRepo;
    inventoryClientService;
    catalogClientService;
    paymentClientService;
    configService;
    constructor(orderRepo, orderItemRepo, inventoryClientService, catalogClientService, paymentClientService, configService) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.inventoryClientService = inventoryClientService;
        this.catalogClientService = catalogClientService;
        this.paymentClientService = paymentClientService;
        this.configService = configService;
    }
    async checkout(user, authToken, dto) {
        const inventoryBaseUrl = this.configService.get('INVENTORY_SERVICE_URL', 'http://localhost:3004');
        const catalogBaseUrl = this.configService.get('CATALOG_SERVICE_URL', 'http://localhost:3003');
        const reservations = [];
        try {
            for (let idx = 0; idx < dto.items.length; idx += 1) {
                const item = dto.items[idx];
                const reservationId = `ord:${user.id}:${item.productId}:${idx}:${(0, crypto_1.randomUUID)()}`;
                await this.inventoryClientService.reserveInventory(inventoryBaseUrl, authToken, item.productId, item.quantity, reservationId);
                const product = await this.catalogClientService.getProduct(catalogBaseUrl, item.productId);
                if (!product) {
                    throw new Errors.ProductNotFound();
                }
                const unitPrice = Number(product.price ?? 0);
                reservations.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    reservationId,
                    unitPrice,
                });
            }
        }
        catch (error) {
            await Promise.allSettled(reservations.map((entry) => this.inventoryClientService.releaseReservation(inventoryBaseUrl, authToken, entry.productId, entry.reservationId)));
            throw error;
        }
        const totalAmount = reservations.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        let order = this.orderRepo.create({
            user_id: user.id,
            status: order_entity_1.OrderStatus.PENDING_PAYMENT,
            total_amount: totalAmount,
            currency: 'INR',
            items: reservations.map((item) => this.orderItemRepo.create({
                product_id: item.productId,
                quantity: item.quantity,
                reservation_id: item.reservationId,
                unit_price: item.unitPrice,
                line_total: item.unitPrice * item.quantity,
            })),
        });
        order = await this.orderRepo.save(order);
        const paymentIntent = await this.paymentClientService.createPaymentIntent(Math.round(totalAmount * 100), order.currency, order.id, user.id);
        order.payment_intent_id = paymentIntent.id;
        const saved = await this.orderRepo.save(order);
        return {
            data: {
                order_id: saved.id,
                status: saved.status,
                total_amount: Number(saved.total_amount),
                currency: saved.currency,
                payment_intent: {
                    id: paymentIntent.id,
                    client_secret: paymentIntent.client_secret,
                    status: paymentIntent.status,
                },
                items: saved.items,
            },
        };
    }
    async confirmOrder(orderId, userId, authToken, paymentIntentId) {
        const inventoryBaseUrl = this.configService.get('INVENTORY_SERVICE_URL', 'http://localhost:3004');
        const order = await this.orderRepo.findOne({
            where: { id: orderId, user_id: userId },
            relations: ['items'],
        });
        if (!order) {
            throw new Errors.OrderNotFound();
        }
        if (order.status !== order_entity_1.OrderStatus.PENDING_PAYMENT) {
            throw new Errors.InvalidOrderState('Order is not pending payment.');
        }
        if (!order.payment_intent_id) {
            throw new Errors.InvalidOrderState('Order has no payment intent.');
        }
        if (order.payment_intent_id !== paymentIntentId) {
            throw new Errors.InvalidOrderState('Payment intent does not belong to this order.');
        }
        const paymentIntent = await this.paymentClientService.retrievePaymentIntent(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            throw new Errors.InvalidOrderState('Payment is not completed yet.');
        }
        const metadataOrderId = Number(paymentIntent.metadata?.order_id ?? 0);
        if (metadataOrderId !== order.id) {
            throw new Errors.InvalidOrderState('Payment intent order metadata mismatch.');
        }
        try {
            for (const item of order.items) {
                await this.inventoryClientService.confirmReservation(inventoryBaseUrl, authToken, item.product_id, item.reservation_id);
            }
            order.status = order_entity_1.OrderStatus.CONFIRMED;
            await this.orderRepo.save(order);
            return { data: { order_id: order.id, status: order.status } };
        }
        catch (error) {
            await Promise.allSettled(order.items.map((item) => this.inventoryClientService.releaseReservation(inventoryBaseUrl, authToken, item.product_id, item.reservation_id)));
            order.status = order_entity_1.OrderStatus.FAILED;
            await this.orderRepo.save(order);
            throw error;
        }
    }
    async cancelOrder(orderId, userId, authToken) {
        const inventoryBaseUrl = this.configService.get('INVENTORY_SERVICE_URL', 'http://localhost:3004');
        const order = await this.orderRepo.findOne({
            where: { id: orderId, user_id: userId },
            relations: ['items'],
        });
        if (!order) {
            throw new Errors.OrderNotFound();
        }
        if (order.status !== order_entity_1.OrderStatus.PENDING_PAYMENT) {
            throw new Errors.InvalidOrderState('Only pending orders can be cancelled.');
        }
        await Promise.allSettled(order.items.map((item) => this.inventoryClientService.releaseReservation(inventoryBaseUrl, authToken, item.product_id, item.reservation_id)));
        order.status = order_entity_1.OrderStatus.CANCELLED;
        await this.orderRepo.save(order);
        return { data: { order_id: order.id, status: order.status } };
    }
    async getOrder(orderId, userId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, user_id: userId },
            relations: ['items'],
        });
        if (!order) {
            throw new Errors.OrderNotFound();
        }
        return { data: order };
    }
    async listMyOrders(userId, dto) {
        const page = Math.max(dto.page ?? 1, 1);
        const limit = Math.max(Math.min(dto.limit ?? 20, 100), 1);
        const skip = (page - 1) * limit;
        const [items, total] = await this.orderRepo.findAndCount({
            where: { user_id: userId },
            relations: ['items'],
            order: { created_at: 'DESC' },
            take: limit,
            skip,
        });
        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        inventory_client_service_1.InventoryClientService,
        catalog_client_service_1.CatalogClientService,
        payment_client_service_1.PaymentClientService,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map