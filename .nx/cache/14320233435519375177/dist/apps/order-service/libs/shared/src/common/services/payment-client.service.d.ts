import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class PaymentClientService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    createCustomer(name: string, email: string): Promise<string>;
    createConnectAccount(email: string, userId: number): Promise<string>;
    retrieveConnectAccount(accountId: string): Promise<any>;
    generateOnboardingLink(accountId: string, vendorId: number, userId: number): Promise<string>;
    createPaymentIntent(amount: number, currency: string, orderId: number, userId: number, customerId?: string): Promise<{
        id: string;
        client_secret: string | null;
        status: string;
        amount: number;
        currency: string;
    }>;
    retrievePaymentIntent(paymentIntentId: string): Promise<{
        id: string;
        status: string;
        amount: number;
        currency: string;
        metadata?: Record<string, string>;
    }>;
    private getBaseUrl;
    private getInternalHeaders;
    private buildDeterministicKey;
}
