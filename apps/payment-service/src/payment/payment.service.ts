import {
  InjectStripeClient,
  StripeWebhookHandler,
} from '@golevelup/nestjs-stripe';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectStripeClient() private readonly stripe: Stripe,
    private readonly configService: ConfigService,
  ) {}

  @StripeWebhookHandler('payment_intent.succeeded')
  handlePaymentIntentCompleted(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.log(`payment_intent.succeeded: ${paymentIntent.id}`);
  }

  @StripeWebhookHandler('payment_intent.canceled')
  handlePaymentIntentCancel(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.warn(`payment_intent.canceled: ${paymentIntent.id}`);
  }

  @StripeWebhookHandler('payment_intent.payment_failed')
  handlePaymentIntentFailed(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.error(`payment_intent.payment_failed: ${paymentIntent.id}`);
  }

  async createCustomer(name: string, email: string) {
    const customer = await this.stripe.customers.create({
      name,
      email,
    });

    return customer.id;
  }

  async createConnectAccount(email: string) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      email,
    });

    return account.id;
  }

  async retrieveConnectAccount(accountId: string) {
    return this.stripe.accounts.retrieve(accountId);
  }

  async generateOnboardingLink(accountId: string, vendorId: number) {
    const apiBaseUrl = this.configService.get<string>(
      'API_BASE_URL',
      'http://localhost:3001',
    );

    const link = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${apiBaseUrl}/v1/vendors/refresh/${vendorId}`,
      return_url: `${apiBaseUrl}/v1/vendors/complete/${vendorId}`,
      type: 'account_onboarding',
    });

    return link.url;
  }
}
