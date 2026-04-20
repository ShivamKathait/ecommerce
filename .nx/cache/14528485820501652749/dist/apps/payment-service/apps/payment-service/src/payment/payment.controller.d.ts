import { CreateConnectAccountDto } from './dto/create-connect-account.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateOnboardingLinkDto } from './dto/create-onboarding-link.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createCustomer(dto: CreateCustomerDto, idempotencyKey?: string): Promise<{
        data: {
            customerId: string;
        };
    }>;
    createConnectAccount(dto: CreateConnectAccountDto, idempotencyKey?: string): Promise<{
        data: {
            accountId: string;
        };
    }>;
    getConnectAccount(accountId: string): Promise<{
        data: import("stripe").Stripe.Response<import("stripe").Stripe.Account>;
    }>;
    createOnboardingLink(accountId: string, dto: CreateOnboardingLinkDto): Promise<{
        data: {
            url: string;
        };
    }>;
    createPaymentIntent(dto: CreatePaymentIntentDto, idempotencyKey?: string): Promise<{
        data: {
            id: string;
            client_secret: string | null;
            status: import("stripe").Stripe.PaymentIntent.Status;
            amount: number;
            currency: string;
        };
    }>;
    getPaymentIntent(paymentIntentId: string): Promise<{
        data: {
            id: string;
            status: import("stripe").Stripe.PaymentIntent.Status;
            amount: number;
            currency: string;
            metadata: import("stripe").Stripe.Metadata;
        };
    }>;
}
