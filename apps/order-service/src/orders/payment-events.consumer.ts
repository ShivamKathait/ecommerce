import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageFields } from 'amqplib';
import { Repository } from 'typeorm';
import { RabbitMqClientService } from 'src/common/services/rabbitmq-client.service';
import { ProcessedEvent } from './entities/processed-event.entity';
import { OrdersService } from './orders.service';

type PaymentIntentEvent = {
  eventId: string;
  type: string;
  paymentIntentId: string;
  status: string;
  orderId?: string;
  userId?: string;
  amount?: number;
  currency?: string;
  occurredAt: string;
};

@Injectable()
export class PaymentEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(PaymentEventsConsumer.name);

  constructor(
    private readonly rabbitMqClientService: RabbitMqClientService,
    @InjectRepository(ProcessedEvent)
    private readonly processedEventRepo: Repository<ProcessedEvent>,
    private readonly ordersService: OrdersService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMqClientService.consume(
      'order.payment.events',
      ['payment.intent.*'],
      async (payload, message) => {
        await this.handleMessage(payload, message.fields);
      },
      {
        maxRetries: 5,
      },
    );
    this.logger.log('Subscribed to order.payment.events');
  }

  private async handleMessage(
    payload: Record<string, unknown>,
    fields: MessageFields,
  ): Promise<void> {
    const event = this.parseEvent(payload);
    if (!event) {
      this.logger.warn(`Ignored malformed event on ${fields.routingKey}`);
      return;
    }

    const existing = await this.processedEventRepo.findOne({
      where: { event_id: event.eventId },
    });
    if (existing) {
      return;
    }

    if (event.type === 'payment.intent.succeeded') {
      await this.ordersService.confirmOrderByPaymentIntent(
        event.paymentIntentId,
      );
    } else if (
      event.type === 'payment.intent.failed' ||
      event.type === 'payment.intent.canceled'
    ) {
      await this.ordersService.failOrderByPaymentIntent(
        event.paymentIntentId,
        event.type,
      );
    } else {
      return;
    }

    await this.processedEventRepo.upsert(
      {
        event_id: event.eventId,
        event_type: event.type,
        source: 'payment-service',
      },
      ['event_id'],
    );
  }

  private parseEvent(
    payload: Record<string, unknown>,
  ): PaymentIntentEvent | null {
    const eventId = payload.eventId;
    const type = payload.type;
    const paymentIntentId = payload.paymentIntentId;
    const status = payload.status;
    const occurredAt = payload.occurredAt;

    if (
      typeof eventId !== 'string' ||
      typeof type !== 'string' ||
      typeof paymentIntentId !== 'string' ||
      typeof status !== 'string' ||
      typeof occurredAt !== 'string'
    ) {
      return null;
    }

    return {
      eventId,
      type,
      paymentIntentId,
      status,
      orderId:
        typeof payload.orderId === 'string' ? payload.orderId : undefined,
      userId: typeof payload.userId === 'string' ? payload.userId : undefined,
      amount: typeof payload.amount === 'number' ? payload.amount : undefined,
      currency:
        typeof payload.currency === 'string' ? payload.currency : undefined,
      occurredAt,
    };
  }
}
