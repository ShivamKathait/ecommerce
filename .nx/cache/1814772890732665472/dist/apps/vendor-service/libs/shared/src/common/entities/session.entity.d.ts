import { Role } from '../utils';
import { User } from './user.entity';
export declare class Session {
    id: number;
    role: Role;
    user_id: number;
    user: User;
    created_at: Date;
}
