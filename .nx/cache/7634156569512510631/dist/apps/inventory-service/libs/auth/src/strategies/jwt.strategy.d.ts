import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { User } from '@ecommerce/shared/common/entities/user.entity';
import { Session } from '@ecommerce/shared/common/entities/session.entity';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private readonly adminModel;
    private readonly sessionModel;
    private cacheManager;
    constructor(configService: ConfigService, adminModel: Repository<User>, sessionModel: Repository<Session>, cacheManager: Cache);
    validate(payload: any): Promise<{} | null>;
}
export {};
