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
    createCustomer(name: string, email: string): Promise<string>;
    createConnectAccount(email: string): Promise<string>;
    retrieveConnectAccount(accountId: string): Promise<Stripe.Response<Stripe.Account>>;
    generateOnboardingLink(accountId: string, vendorId: number): Promise<string>;
}
