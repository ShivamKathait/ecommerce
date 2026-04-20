import { LoginDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Role } from 'src/common/utils';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@ecommerce/auth';
import { User } from 'src/common/entities/user.entity';
import { Session } from 'src/common/entities/session.entity';
export declare class AdminService {
    private jwtService;
    private configService;
    private readonly adminModel;
    private readonly sessionModel;
    private authService;
    constructor(jwtService: JwtService, configService: ConfigService, adminModel: Repository<User>, sessionModel: Repository<Session>, authService: AuthService);
    login(dto: LoginDto): Promise<{
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
