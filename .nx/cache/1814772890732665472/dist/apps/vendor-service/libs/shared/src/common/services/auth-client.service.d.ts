import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Role } from '../utils';
export declare class AuthClientService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    loginAdmin(email: string, password: string): Promise<any>;
    loginVendor(email: string, password: string): Promise<any>;
    updateUserRole(userId: number, role: Role): Promise<any>;
    private getBaseUrl;
}
