import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorProfile } from './entities/vendor-profile.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { AuthClientService } from 'src/common/services/auth-client.service';
import { ListVendorsDto } from './dto/list-vendors.dto';
export declare class VendorsService {
    private readonly vendorProfile;
    private readonly paymentClientService;
    private readonly authClientService;
    private readonly logger;
    constructor(vendorProfile: Repository<VendorProfile>, paymentClientService: PaymentClientService, authClientService: AuthClientService);
    register(createVendorDto: CreateVendorDto, user: {
        id: number;
        email: string;
    }): Promise<{
        link: string;
    }>;
    refresh_onboarding(vendorId: number): Promise<{
        link: string;
    }>;
    complete_onboarding(vendorId: number): Promise<string>;
    login(dto: LoginDto): Promise<any>;
    getMyVendorProfile(userId: number): Promise<{
        data: VendorProfile;
    }>;
    getVendorById(vendorId: number): Promise<{
        data: VendorProfile;
    }>;
    listVendors(dto: ListVendorsDto): Promise<{
        data: VendorProfile[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
