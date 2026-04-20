import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '@ecommerce/shared/common/entities/user.entity';
declare const TempRuntimeStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class TempRuntimeStrategy extends TempRuntimeStrategy_base {
    private readonly configService;
    private readonly userModel;
    constructor(configService: ConfigService, userModel: Repository<User>);
    validate(payload: any): Promise<User | null>;
}
export {};
