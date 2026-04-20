import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CatalogClientService } from 'src/common/services/catalog-client.service';
import { InventoryClientService } from 'src/common/services/inventory-client.service';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import * as Errors from '@ecommerce/shared/error-handler/error-service';
import { CheckoutDto } from './dto/checkout.dto';
import { ListOrdersDto } from './dto/list-orders.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

type ReservationContext = {
  productId: number;
  quantity: number;
  reservationId: string;
  unitPrice: number;
};

type CatalogProduct = {
  price?: number | string | null;
};

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly inventoryClientService: InventoryClientService,
    private readonly catalogClientService: CatalogClientService,
    private readonly paymentClientService: PaymentClientService,
    private readonly configService: ConfigService,
  ) {}

  async checkout(
    user: { id: number; role: string },
    authToken: string,
    dto: CheckoutDto,
  ) {
    const inventoryBaseUrl = this.configService.get<string>(
      'INVENTORY_SERVICE_URL',
      'http://localhost:3004',
    );
    const catalogBaseUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
      'http://localhost:3003',
    );

    const reservations: ReservationContext[] = [];
    try {
      for (let idx = 0; idx < dto.items.length; idx += 1) {
        const item = dto.items[idx];
        const reservationId = `ord:${user.id}:${item.productId}:${idx}:${randomUUID()}`;

        await this.inventoryClientService.reserveInventory(
          inventoryBaseUrl,
          authToken,
          item.productId,
          item.quantity,
          reservationId,
        );

        const product = (await this.catalogClientService.getProduct(
          catalogBaseUrl,
          item.productId,
        )) as CatalogProduct | null;
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
    } catch (error) {
      await Promise.allSettled(
        reservations.map((entry) =>
          this.inventoryClientService.releaseReservation(
            inventoryBaseUrl,
            authToken,
            entry.productId,
            entry.reservationId,
          ),
        ),
      );
      throw error;
    }

    const totalAmount = reservations.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    let order = this.orderRepo.create({
      user_id: user.id,
      status: OrderStatus.PENDING_PAYMENT,
      total_amount: totalAmount,
      currency: 'INR',
      items: reservations.map((item) =>
        this.orderItemRepo.create({
          product_id: item.productId,
          quantity: item.quantity,
          reservation_id: item.reservationId,
          unit_price: item.unitPrice,
          line_total: item.unitPrice * item.quantity,
        }),
      ),
    });

    order = await this.orderRepo.save(order);

    const paymentIntent = await this.paymentClientService.createPaymentIntent(
      Math.round(totalAmount * 100),
      order.currency,
      order.id,
      user.id,
    );

    order.paymentIntentId = paymentIntent.id;
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

  async confirmOrder(
    orderId: number,
    userId: number,
    authToken: string,
    paymentIntentId: string,
  ) {
    const inventoryBaseUrl = this.configService.get<string>(
      'INVENTORY_SERVICE_URL',
      'http://localhost:3004',
    );
    const order = await this.orderRepo.findOne({
      where: { id: orderId, user_id: userId },
      relations: ['items'],
    });
    if (!order) {
      throw new Errors.OrderNotFound();
    }
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new Errors.InvalidOrderState('Order is not pending payment.');
    }
    if (!order.paymentIntentId) {
      throw new Errors.InvalidOrderState('Order has no payment intent.');
    }
    if (order.paymentIntentId !== paymentIntentId) {
      throw new Errors.InvalidOrderState(
        'Payment intent does not belong to this order.',
      );
    }

    const paymentIntent =
      await this.paymentClientService.retrievePaymentIntent(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      throw new Errors.InvalidOrderState('Payment is not completed yet.');
    }
    const metadataOrderId = Number(paymentIntent.metadata?.order_id ?? 0);
    if (metadataOrderId !== order.id) {
      throw new Errors.InvalidOrderState(
        'Payment intent order metadata mismatch.',
      );
    }

    try {
      for (const item of order.items) {
        await this.inventoryClientService.confirmReservation(
          inventoryBaseUrl,
          authToken,
          item.product_id,
          item.reservation_id,
        );
      }

      order.status = OrderStatus.CONFIRMED;
      await this.orderRepo.save(order);
      return { data: { order_id: order.id, status: order.status } };
    } catch (error) {
      await Promise.allSettled(
        order.items.map((item) =>
          this.inventoryClientService.releaseReservation(
            inventoryBaseUrl,
            authToken,
            item.product_id,
            item.reservation_id,
          ),
        ),
      );
      order.status = OrderStatus.FAILED;
      await this.orderRepo.save(order);
      throw error;
    }
  }

  async cancelOrder(orderId: number, userId: number, authToken: string) {
    const inventoryBaseUrl = this.configService.get<string>(
      'INVENTORY_SERVICE_URL',
      'http://localhost:3004',
    );
    const order = await this.orderRepo.findOne({
      where: { id: orderId, user_id: userId },
      relations: ['items'],
    });
    if (!order) {
      throw new Errors.OrderNotFound();
    }
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new Errors.InvalidOrderState(
        'Only pending orders can be cancelled.',
      );
    }

    await Promise.allSettled(
      order.items.map((item) =>
        this.inventoryClientService.releaseReservation(
          inventoryBaseUrl,
          authToken,
          item.product_id,
          item.reservation_id,
        ),
      ),
    );

    order.status = OrderStatus.CANCELLED;
    await this.orderRepo.save(order);
    return { data: { order_id: order.id, status: order.status } };
  }

  async getOrder(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, user_id: userId },
      relations: ['items'],
    });
    if (!order) {
      throw new Errors.OrderNotFound();
    }

    return { data: order };
  }

  async listMyOrders(userId: number, dto: ListOrdersDto) {
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

  async confirmOrderByPaymentIntent(paymentIntentId: string): Promise<void> {
    const inventoryBaseUrl = this.configService.get<string>(
      'INVENTORY_SERVICE_URL',
      'http://localhost:3004',
    );
    const order = await this.orderRepo.findOne({
      where: { paymentIntentId },
      relations: ['items'],
    });
    if (!order) {
      this.logger.warn(
        `Order not found for payment intent ${paymentIntentId} during async confirmation`,
      );
      return;
    }
    if (order.status === OrderStatus.CONFIRMED) {
      return;
    }
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      this.logger.warn(
        `Ignored async confirmation for order ${order.id} in status ${order.status}`,
      );
      return;
    }

    for (const item of order.items) {
      await this.inventoryClientService.confirmReservationInternal(
        inventoryBaseUrl,
        item.product_id,
        item.reservation_id,
      );
    }

    order.status = OrderStatus.CONFIRMED;
    await this.orderRepo.save(order);
  }

  async failOrderByPaymentIntent(
    paymentIntentId: string,
    reason: string,
  ): Promise<void> {
    const inventoryBaseUrl = this.configService.get<string>(
      'INVENTORY_SERVICE_URL',
      'http://localhost:3004',
    );
    const order = await this.orderRepo.findOne({
      where: { paymentIntentId },
      relations: ['items'],
    });
    if (!order) {
      this.logger.warn(
        `Order not found for payment intent ${paymentIntentId} during async failure handling`,
      );
      return;
    }
    if (
      order.status === OrderStatus.FAILED ||
      order.status === OrderStatus.CANCELLED
    ) {
      return;
    }
    if (order.status === OrderStatus.CONFIRMED) {
      this.logger.warn(
        `Ignored async failure (${reason}) for already confirmed order ${order.id}`,
      );
      return;
    }

    await Promise.allSettled(
      order.items.map((item) =>
        this.inventoryClientService.releaseReservationInternal(
          inventoryBaseUrl,
          item.product_id,
          item.reservation_id,
        ),
      ),
    );

    order.status =
      reason === 'payment.intent.canceled'
        ? OrderStatus.CANCELLED
        : OrderStatus.FAILED;
    await this.orderRepo.save(order);
  }
}
