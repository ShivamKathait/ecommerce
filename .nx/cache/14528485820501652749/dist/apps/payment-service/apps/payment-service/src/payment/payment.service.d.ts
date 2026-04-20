import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class PaymentService {
    private readonly stripe;
    private readonly configService;
    private readonly logger;
    constructor(stripe: Stripe, configService: ConfigService);
    handlePaymentIntentCompleted(event: Stripe.Event): void;
    handlePaymentIntentCancel(event: Stripe.Event): void;
    handlePaymentIntentFailed(event: Stripe.Event): void;
    createCustomer(name: string, email: string, idempotencyKey?: string): Promise<string>;
    createConnectAccount(email: string, userId: number, idempotencyKey?: string): Promise<string>;
    retrieveConnectAccount(accountId: string): Promise<Stripe.Response<Stripe.Account>>;
    generateOnboardingLink(accountId: string, vendorId: number, userId: number): Promise<string>;
    createPaymentIntent(amount: number, currency: string, orderId: number, userId: number, customerId?: string, idempotencyKey?: string): Promise<{
        id: string;
        client_secret: string | null;
        status: Stripe.PaymentIntent.Status;
        amount: number;
        currency: string;
    }>;
    retrievePaymentIntent(paymentIntentId: string): Promise<{
        id: string;
        status: Stripe.PaymentIntent.Status;
        amount: number;
        currency: string;
        metadata: Stripe.Metadata;
    }>;
    private buildDeterministicKey;
}
