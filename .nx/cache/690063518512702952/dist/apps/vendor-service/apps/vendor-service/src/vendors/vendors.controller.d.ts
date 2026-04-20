import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { LoginDto } from './dto/login.dto';
import { ListVendorsDto } from './dto/list-vendors.dto';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    register(createVendorDto: CreateVendorDto, req: any): Promise<{
        link: string;
    }>;
    login(dto: LoginDto): Promise<any>;
    getMyVendorProfile(req: any): Promise<{
        data: import("./entities/vendor-profile.entity").VendorProfile;
    }>;
    listVendors(query: ListVendorsDto): Promise<{
        data: import("./entities/vendor-profile.entity").VendorProfile[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    refresh(vendorId: number): Promise<{
        link: string;
    }>;
    complete(vendorId: number, res: any): Promise<any>;
    getVendorById(vendorId: number): Promise<{
        data: import("./entities/vendor-profile.entity").VendorProfile;
    }>;
}
