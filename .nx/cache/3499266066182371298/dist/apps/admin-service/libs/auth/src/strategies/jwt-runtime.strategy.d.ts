import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '@ecommerce/shared/common/entities/user.entity';
import { Session } from '@ecommerce/shared/common/entities/session.entity';
declare const JwtRuntimeStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRuntimeStrategy extends JwtRuntimeStrategy_base {
    private readonly configService;
    private readonly userModel;
    private readonly sessionModel;
    constructor(configService: ConfigService, userModel: Repository<User>, sessionModel: Repository<Session>);
    validate(payload: any): Promise<{
        session_id: number;
        id: number;
        name: string;
        email: string;
        is_deleted: boolean;
        is_email_verified: boolean;
        password: string;
        role: import("src/common/utils").Role;
        otp: string | null;
        otp_expire_at: Date | null;
        sessions: Session[];
        stripe_customer_id: string;
        created_at: Date;
    } | null>;
}
export {};
