import { UsersService } from './users.service';
import { CreateUserDto, LoginDto, OtpDto } from './dto/create-user.dto';
import { Role } from 'src/common/utils';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(req: any, dto: CreateUserDto): Promise<{
        access_token: string;
    }>;
    verify_otp(dto: OtpDto, req: any): Promise<{
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
