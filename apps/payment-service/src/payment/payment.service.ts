import {
  InjectStripeClient,
  StripeWebhookHandler,
} from '@golevelup/nestjs-stripe';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { PaymentHistory } from './entities/payment-history.entity';
import { RabbitMqClientService } from 'src/common/services/rabbitmq-client.service';
import { CreateConnectAccountDto } from './dto/create-connect-account.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateOnboardingLinkDto } from './dto/create-onboarding-link.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectStripeClient() private readonly stripe: Stripe,
    private readonly configService: ConfigService,
    @InjectRepository(PaymentHistory)
    private readonly paymentHistoryRepo: Repository<PaymentHistory>,
    private readonly rabbitMqClientService: RabbitMqClientService,
  ) {}

  @StripeWebhookHandler('payment_intent.succeeded')
  async handlePaymentIntentCompleted(event: Stripe.Event) {
    await this.persistPaymentEvent(event);
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.log(`payment_intent.succeeded: ${paymentIntent.id}`);
  }

  @StripeWebhookHandler('payment_intent.canceled')
  async handlePaymentIntentCancel(event: Stripe.Event) {
    await this.persistPaymentEvent(event);
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.warn(`payment_intent.canceled: ${paymentIntent.id}`);
  }

  @StripeWebhookHandler('payment_intent.payment_failed')
  async handlePaymentIntentFailed(event: Stripe.Event) {
    await this.persistPaymentEvent(event);
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.error(`payment_intent.payment_failed: ${paymentIntent.id}`);
  }

  async createCustomer(dto: CreateCustomerDto, idempotencyKey?: string) {
    const normalizedEmail = dto.email.toLowerCase();
    const existing = await this.stripe.customers.list({
      email: normalizedEmail,
      limit: 1,
    });
    if (existing.data.length > 0) {
      return { data: { customerId: existing.data[0].id } };
    }

    const customer = await this.stripe.customers.create(
      {
        name: dto.name,
        email: normalizedEmail,
      },
      {
        idempotencyKey:
          idempotencyKey ??
          this.buildDeterministicKey('customer', normalizedEmail),
      },
    );

    return { data: { customerId: customer.id } };
  }

  async createConnectAccount(
    dto: CreateConnectAccountDto,
    idempotencyKey?: string,
  ) {
    const account = await this.stripe.accounts.create(
      {
        type: 'express',
        email: dto.email.toLowerCase(),
        metadata: {
          user_id: String(dto.userId),
        },
      },
      {
        idempotencyKey:
          idempotencyKey ??
          this.buildDeterministicKey(
            'connect-account',
            `${dto.email}:${dto.userId}`,
          ),
      },
    );

    return { data: { accountId: account.id } };
  }

  async retrieveConnectAccount(accountId: string) {
    const account = await this.stripe.accounts.retrieve(accountId);
    return { data: account };
  }

  async generateOnboardingLink(
    accountId: string,
    dto: CreateOnboardingLinkDto,
  ) {
    const account = await this.stripe.accounts.retrieve(accountId);
    const ownerUserId = account.metadata?.user_id;
    if (ownerUserId && ownerUserId !== String(dto.userId)) {
      throw new ForbiddenException(
        'Account does not belong to the requested user',
      );
    }

    const apiBaseUrl = this.configService.get<string>(
      'API_BASE_URL',
      'http://localhost:3001',
    );

    const link = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${apiBaseUrl}/v1/vendors/refresh/${dto.vendorId}`,
      return_url: `${apiBaseUrl}/v1/vendors/complete/${dto.vendorId}`,
      type: 'account_onboarding',
    });

    return { data: { url: link.url } };
  }

  async createPaymentIntent(
    dto: CreatePaymentIntentDto,
    idempotencyKey?: string,
  ) {
    const normalizedCurrency = dto.currency.toLowerCase();
    const intent = await this.stripe.paymentIntents.create(
      {
        amount: dto.amount,
        currency: normalizedCurrency,
        customer: dto.customerId,
        metadata: {
          order_id: String(dto.orderId),
          user_id: String(dto.userId),
        },
        automatic_payment_methods: { enabled: true },
      },
      {
        idempotencyKey:
          idempotencyKey ??
          this.buildDeterministicKey(
            'payment-intent',
            `${dto.orderId}:${dto.userId}:${dto.amount}:${normalizedCurrency}`,
          ),
      },
    );

    return {
      data: {
        id: intent.id,
        client_secret: intent.client_secret,
        status: intent.status,
        amount: intent.amount,
        currency: intent.currency,
      },
    };
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      data: {
        id: intent.id,
        status: intent.status,
        amount: intent.amount,
        currency: intent.currency,
        metadata: intent.metadata ?? {},
      },
    };
  }

  private buildDeterministicKey(namespace: string, value: string): string {
    const hash = createHash('sha256')
      .update(`${namespace}:${value}`)
      .digest('hex');
    return `${namespace}:${hash.slice(0, 48)}`;
  }

  private async persistPaymentEvent(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata ?? {};
    const currency = (paymentIntent.currency ?? 'inr').toLowerCase();
    const existing = await this.paymentHistoryRepo.findOne({
      where: { stripe_event_id: event.id },
    });
    if (existing) {
      return;
    }
    const internalType = this.toInternalPaymentType(event.type);

    const history = this.paymentHistoryRepo.create({
      stripe_event_id: event.id,
      payment_intent_id: paymentIntent.id,
      order_id: metadata.order_id,
      user_id: metadata.user_id,
      customer_id:
        typeof paymentIntent.customer === 'string'
          ? paymentIntent.customer
          : paymentIntent.customer?.id,
      event_type: event.type,
      payment_status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency,
      metadata,
      payload: event as unknown as object,
    });

    await this.paymentHistoryRepo.insert(history);
    await this.rabbitMqClientService.publish(
      internalType,
      {
        eventId: event.id,
        type: internalType,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        orderId: metadata.order_id,
        userId: metadata.user_id,
        amount: paymentIntent.amount,
        currency,
        occurredAt: new Date(event.created * 1000).toISOString(),
      },
      {
        headers: {
          'x-event-source': 'payment-service',
        },
      },
    );
  }

  private toInternalPaymentType(stripeType: string): string {
    if (stripeType === 'payment_intent.succeeded') {
      return 'payment.intent.succeeded';
    }
    if (stripeType === 'payment_intent.canceled') {
      return 'payment.intent.canceled';
    }
    if (stripeType === 'payment_intent.payment_failed') {
      return 'payment.intent.failed';
    }
    return stripeType.replace(/_/g, '.');
  }
}
