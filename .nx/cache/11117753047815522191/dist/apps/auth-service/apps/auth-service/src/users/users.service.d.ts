import { Repository } from 'typeorm';
import { AuthService } from '@ecommerce/auth';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { User } from 'src/common/entities/user.entity';
import { Role } from 'src/common/utils';
import { CreateUserDto, LoginDto, OtpDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userModel;
    private readonly authService;
    private readonly paymentClientService;
    private readonly logger;
    constructor(userModel: Repository<User>, authService: AuthService, paymentClientService: PaymentClientService);
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
    }>;
    verify_otp(dto: OtpDto, user: {
        id: number;
    }): Promise<{
        data: {
            message: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        data: {
            is_email_verified: false;
            access_token: string;
        };
    } | {
        data: {
            id: number;
            name?: string;
            email: string;
            access_token: string;
            role: Role;
            is_email_verified: boolean;
            message: string;
        };
    }>;
}
