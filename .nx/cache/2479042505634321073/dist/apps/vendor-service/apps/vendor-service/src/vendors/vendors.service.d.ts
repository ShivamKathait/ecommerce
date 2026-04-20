import { CreateVendorDto } from './dto/create-vendor.dto';
import { User } from 'src/common/entities/user.entity';
import { VendorProfile } from './entities/vendor-profile.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/common/utils';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '@ecommerce/auth';
import { PaymentClientService } from 'src/common/services/payment-client.service';
export declare class VendorsService {
    private readonly vendorProfile;
    private readonly userModel;
    private paymentClientService;
    private authService;
    private readonly logger;
    constructor(vendorProfile: Repository<VendorProfile>, userModel: Repository<User>, paymentClientService: PaymentClientService, authService: AuthService);
    register(createVendorDto: CreateVendorDto, user: User): Promise<{
        link: string;
    }>;
    refresh_onboarding(req: any, res: any): Promise<{
        link: string;
    } | undefined>;
    complete_onboarding(req: any, res: any): Promise<any>;
    login(dto: LoginDto): Promise<{
        data: {
            id: number;
            name?: string;
            email: string;
            access_token: string;
            role: Role;
            message: string;
        };
    }>;
}
