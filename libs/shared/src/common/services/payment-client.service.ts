import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createCustomer(name: string, email: string): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post(`${this.getBaseUrl()}/v1/payment/customers`, {
        name,
        email,
      }),
    );

    return response.data.data.customerId;
  }

  async createConnectAccount(email: string): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.getBaseUrl()}/v1/payment/connect/accounts`,
        {
          email,
        },
      ),
    );

    return response.data.data.accountId;
  }

  async retrieveConnectAccount(accountId: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.getBaseUrl()}/v1/payment/connect/accounts/${accountId}`,
      ),
    );

    return response.data.data;
  }

  async generateOnboardingLink(
    accountId: string,
    vendorId: number,
  ): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.getBaseUrl()}/v1/payment/connect/accounts/${accountId}/onboarding-links`,
        { vendorId },
      ),
    );

    return response.data.data.url;
  }

  private getBaseUrl(): string {
    return this.configService.get<string>(
      'PAYMENT_SERVICE_URL',
      'http://localhost:3006',
    );
  }
}
