import { CreateUserDto, LoginDto, OtpDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { Role } from 'src/common/utils';
import { Cache } from 'cache-manager';
import { Session } from 'src/common/entities/session.entity';
import { AuthService } from '@ecommerce/auth';
import { PaymentClientService } from 'src/common/services/payment-client.service';
export declare class UsersService {
    private jwtService;
    private configService;
    private readonly userModel;
    private readonly sessionModel;
    private cacheManager;
    private authService;
    private paymentClientService;
    private readonly logger;
    constructor(jwtService: JwtService, configService: ConfigService, userModel: Repository<User>, sessionModel: Repository<Session>, cacheManager: Cache, authService: AuthService, paymentClientService: PaymentClientService);
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
    }>;
    verify_otp(dto: OtpDto, user: any): Promise<{
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
