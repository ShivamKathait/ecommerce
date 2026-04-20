import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { User } from '@ecommerce/shared/common/entities/user.entity';
import { Session } from '@ecommerce/shared/common/entities/session.entity';
declare const JwtRuntimeStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRuntimeStrategy extends JwtRuntimeStrategy_base {
    private readonly configService;
    private readonly userModel;
    private readonly sessionModel;
    private readonly cacheManager;
    constructor(configService: ConfigService, userModel: Repository<User>, sessionModel: Repository<Session>, cacheManager: Cache);
    validate(payload: any): Promise<{} | null>;
}
export {};
