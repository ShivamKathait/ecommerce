import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { User } from '@ecommerce/shared/common/entities/user.entity';
import { Session } from '@ecommerce/shared/common/entities/session.entity';
import { Role } from '@ecommerce/shared/common/utils';
export declare class AuthService {
    private jwtService;
    private configService;
    private readonly userModel;
    private readonly sessionModel;
    private cacheManager;
    private readonly logger;
    private JWT_ACCESS_SECRET;
    private JWT_ACCESS_EXPIRY;
    private JWT_ACCESS_TEMP_SECRET;
    private JWT_ACCESS_TEMP_EXPIRY;
    private BCRYPT_SALT_ROUNDS;
    constructor(jwtService: JwtService, configService: ConfigService, userModel: Repository<User>, sessionModel: Repository<Session>, cacheManager: Cache);
    hashPassword(password: string): Promise<string>;
    compareHash(password: string, hashedPassword: string): Promise<boolean>;
    generateToken(id: number, session_id: number, email: string, role: string): Promise<string>;
    generateTempToken(id: number, email: string, role: string): Promise<string>;
    createSession(user_id: number, role: string): Promise<{
        user: {
            id: number;
        };
        role: Role;
    } & Session>;
    clearUserCache(userId: number): Promise<void>;
    generateOtpForUser(user_id: number): Promise<string>;
    cacheUserSession(user: User, sessionId: string): Promise<void>;
}
