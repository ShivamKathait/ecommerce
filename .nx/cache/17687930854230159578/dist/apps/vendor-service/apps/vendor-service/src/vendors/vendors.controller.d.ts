import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { LoginDto } from './dto/login.dto';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    register(createVendorDto: CreateVendorDto, req: any): Promise<{
        link: string;
    }>;
    login(dto: LoginDto): Promise<any>;
    refresh(req: any, res: any): Promise<{
        link: string;
    } | undefined>;
    complete(req: any, res: any): Promise<any>;
}
