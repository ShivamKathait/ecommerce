import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { createHash } from 'crypto';
import { getInternalServiceHeaders } from './internal-service-headers.util';

type ApiEnvelope<T> = {
  data: T;
};

type CreateCustomerResponse = {
  customerId: string;
};

type CreateConnectAccountResponse = {
  accountId: string;
};

type CreateOnboardingLinkResponse = {
  url: string;
};

type PaymentIntentResponse = {
  id: string;
  client_secret: string | null;
  status: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
};

@Injectable()
export class PaymentClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createCustomer(name: string, email: string): Promise<string> {
    const idempotencyKey = this.buildDeterministicKey(
      'payment-customer',
      email.toLowerCase(),
    );
    const response = await firstValueFrom(
      this.httpService.post<ApiEnvelope<CreateCustomerResponse>>(
        `${this.getBaseUrl()}/v1/payment/customers`,
        {
          name,
          email,
        },
        {
          headers: this.getInternalHeaders(idempotencyKey),
        },
      ),
    );

    return response.data.data.customerId;
  }

  async createConnectAccount(email: string, userId: number): Promise<string> {
    const idempotencyKey = this.buildDeterministicKey(
      'payment-connect-account',
      `${email.toLowerCase()}:${userId}`,
    );
    const response = await firstValueFrom(
      this.httpService.post<ApiEnvelope<CreateConnectAccountResponse>>(
        `${this.getBaseUrl()}/v1/payment/connect/accounts`,
        {
          email,
          userId,
        },
        { headers: this.getInternalHeaders(idempotencyKey) },
      ),
    );

    return response.data.data.accountId;
  }

  async retrieveConnectAccount(accountId: string) {
    const response = await firstValueFrom(
      this.httpService.get<ApiEnvelope<Record<string, unknown>>>(
        `${this.getBaseUrl()}/v1/payment/connect/accounts/${accountId}`,
      ),
    );

    return response.data.data;
  }

  async generateOnboardingLink(
    accountId: string,
    vendorId: number,
    userId: number,
  ): Promise<string> {
    const idempotencyKey = this.buildDeterministicKey(
      'payment-onboarding-link',
      `${accountId}:${vendorId}:${userId}`,
    );
    const response = await firstValueFrom(
      this.httpService.post<ApiEnvelope<CreateOnboardingLinkResponse>>(
        `${this.getBaseUrl()}/v1/payment/connect/accounts/${accountId}/onboarding-links`,
        { vendorId, userId },
        { headers: this.getInternalHeaders(idempotencyKey) },
      ),
    );

    return response.data.data.url;
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    orderId: number,
    userId: number,
    customerId?: string,
  ) {
    const idempotencyKey = this.buildDeterministicKey(
      'payment-intent',
      `${orderId}:${userId}:${amount}:${currency.toLowerCase()}`,
    );
    const response = await firstValueFrom(
      this.httpService.post<ApiEnvelope<PaymentIntentResponse>>(
        `${this.getBaseUrl()}/v1/payment/intents`,
        { amount, currency, orderId, userId, customerId },
        { headers: this.getInternalHeaders(idempotencyKey) },
      ),
    );

    return response.data.data;
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    const response = await firstValueFrom(
      this.httpService.get<ApiEnvelope<PaymentIntentResponse>>(
        `${this.getBaseUrl()}/v1/payment/intents/${paymentIntentId}`,
        { headers: this.getInternalHeaders() },
      ),
    );

    return response.data.data;
  }

  private getBaseUrl(): string {
    return this.configService.get<string>(
      'PAYMENT_SERVICE_URL',
      'http://localhost:3006',
    );
  }

  private getInternalHeaders(idempotencyKey?: string) {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['idempotency-key'] = idempotencyKey;
    }
    return getInternalServiceHeaders(this.configService, headers);
  }

  private buildDeterministicKey(namespace: string, value: string): string {
    const hash = createHash('sha256')
      .update(`${namespace}:${value}`)
      .digest('hex');
    return `${namespace}:${hash.slice(0, 48)}`;
  }
}
