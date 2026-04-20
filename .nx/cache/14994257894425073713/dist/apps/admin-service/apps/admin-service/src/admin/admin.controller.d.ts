import { AdminService } from './admin.service';
import { LoginDto } from './dto/create-admin.dto';
import { Role } from 'src/common/utils';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
