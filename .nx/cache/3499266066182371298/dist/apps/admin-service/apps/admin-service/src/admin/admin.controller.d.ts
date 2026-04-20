import { AdminService } from './admin.service';
import { LoginDto } from './dto/create-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    login(dto: LoginDto): Promise<any>;
}
