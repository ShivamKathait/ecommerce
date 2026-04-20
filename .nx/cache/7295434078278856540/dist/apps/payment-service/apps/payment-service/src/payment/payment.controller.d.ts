import { CreateConnectAccountDto } from './dto/create-connect-account.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateOnboardingLinkDto } from './dto/create-onboarding-link.dto';
import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createCustomer(dto: CreateCustomerDto): Promise<{
        data: {
            customerId: string;
        };
    }>;
    createConnectAccount(dto: CreateConnectAccountDto): Promise<{
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
}
