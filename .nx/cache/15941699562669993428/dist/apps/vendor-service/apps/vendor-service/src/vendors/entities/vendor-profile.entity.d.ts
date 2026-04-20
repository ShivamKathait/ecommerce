import { User } from "src/common/entities/user.entity";
export declare class VendorProfile {
    id: number;
    business_name: string;
    gst_number: string;
    stripe_connect_id: string;
    vendor_status: string;
    user_id: number;
    user: User;
    created_at: Date;
}
