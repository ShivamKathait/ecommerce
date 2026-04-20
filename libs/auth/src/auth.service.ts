import { Injectable, Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '@ecommerce/shared/common/entities/user.entity';
import { Session } from '@ecommerce/shared/common/entities/session.entity';
import { Role } from '@ecommerce/shared/common/utils';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private JWT_ACCESS_SECRET: string;
  private JWT_ACCESS_EXPIRY: string;
  private JWT_ACCESS_TEMP_SECRET: string;
  private JWT_ACCESS_TEMP_EXPIRY: string;
  private BCRYPT_SALT_ROUNDS: number;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionModel: Repository<Session>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.JWT_ACCESS_SECRET =
      this.configService.get<string>('JWT_ACCESS_SECRET')!;
    this.JWT_ACCESS_EXPIRY =
      this.configService.get<string>('JWT_ACCESS_EXPIRY')!;
    this.JWT_ACCESS_TEMP_SECRET = this.configService.get<string>(
      'JWT_ACCESS_TEMP_SECRET',
    )!;
    this.JWT_ACCESS_TEMP_EXPIRY = this.configService.get<string>(
      'JWT_ACCESS_TEMP_EXPIRY',
    )!;
    this.BCRYPT_SALT_ROUNDS =
      this.configService.get<number>('BCRYPT_SALT_ROUNDS')!;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, +this.BCRYPT_SALT_ROUNDS);
  }

  async compareHash(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateToken(
    id: number,
    session_id: number,
    email: string,
    role: string,
  ) {
    return this.jwtService.sign(
      { id, email, role, session_id },
      { secret: this.JWT_ACCESS_SECRET, expiresIn: this.JWT_ACCESS_EXPIRY },
    );
  }

  async generateTempToken(id: number, email: string, role: string) {
    return this.jwtService.sign(
      { id, email, role },
      {
        secret: this.JWT_ACCESS_TEMP_SECRET,
        expiresIn: this.JWT_ACCESS_TEMP_EXPIRY,
      },
    );
  }

  async createSession(user_id: number, role: string) {
    return await this.sessionModel.save({
      user: { id: user_id },
      role: role as Role,
    });
  }

  async clearUserCache(userId: number) {
    const tempCacheKey = `auth:temp-user:${userId}`;
    await this.cacheManager.del(tempCacheKey);

    // Pattern deletion for sessions
    const sessionPattern = `auth:user:${userId}:session:*`;
    const store: any = (this.cacheManager as any).store;

    // Check if the store supports getting keys by pattern
    if (store && typeof store.keys === 'function') {
      const keys = await store.keys(sessionPattern);
      if (keys && keys.length > 0) {
        await Promise.all(keys.map((key) => this.cacheManager.del(key)));
      }
    }
  }

  async generateOtpForUser(user_id: number) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpDetails = {
      otp,
      otp_expire_at: new Date(new Date().getTime() + 5 * 60000),
    };
    await this.userModel.update({ id: user_id }, otpDetails);
    await this.clearUserCache(user_id);
    return otp;
  }

  async cacheUserSession(user: User, sessionId: string): Promise<void> {
    const cacheKey = `auth:user:${user.id}:session:${sessionId}`;
    const sessionData = {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    };

    await this.cacheManager.set(
      cacheKey,
      sessionData,
      this.configService.get<number>('REDIS_TTL', 3600) * 1000,
    );
  }
}
