import { Role } from 'src/common/utils';
import { Session } from './session.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    is_deleted: boolean;
    is_email_verified: boolean;
    password: string;
    role: Role;
    otp: string | null;
    otp_expire_at: Date | null;
    sessions: Session[];
    stripe_customer_id: string;
    created_at: Date;
}
