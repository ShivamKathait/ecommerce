import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class PaymentClientService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    createCustomer(name: string, email: string): Promise<string>;
    createConnectAccount(email: string): Promise<string>;
    retrieveConnectAccount(accountId: string): Promise<any>;
    generateOnboardingLink(accountId: string, vendorId: number): Promise<string>;
    private getBaseUrl;
}
