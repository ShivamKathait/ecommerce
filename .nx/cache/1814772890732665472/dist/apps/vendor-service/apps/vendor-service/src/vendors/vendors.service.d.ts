import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorProfile } from './entities/vendor-profile.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { AuthClientService } from 'src/common/services/auth-client.service';
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
    refresh_onboarding(req: any, res: any): Promise<{
        link: string;
    } | undefined>;
    complete_onboarding(req: any, res: any): Promise<any>;
    login(dto: LoginDto): Promise<any>;
}
