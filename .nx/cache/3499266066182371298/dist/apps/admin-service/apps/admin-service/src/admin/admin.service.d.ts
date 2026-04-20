import { LoginDto } from './dto/create-admin.dto';
import { AuthClientService } from 'src/common/services/auth-client.service';
export declare class AdminService {
    private readonly authClientService;
    constructor(authClientService: AuthClientService);
    login(dto: LoginDto): Promise<any>;
}
