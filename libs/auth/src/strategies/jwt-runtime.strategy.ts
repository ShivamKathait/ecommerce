import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { User } from '@ecommerce/shared/common/entities/user.entity';
import { Session } from '@ecommerce/shared/common/entities/session.entity';

@Injectable()
export class JwtRuntimeStrategy extends PassportStrategy(
  Strategy,
  'jwt-runtime',
) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionModel: Repository<Session>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
    });
  }

  async validate(payload: any) {
    const userId = payload?.id;
    const sessionId = payload?.session_id;

    if (!userId || !sessionId) {
      return null;
    }

    const cacheKey = `auth:runtime:user:${userId}:session:${sessionId}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const user = await this.userModel.findOne({
      where: { id: userId, is_deleted: false },
      select: { id: true, email: true, role: true, is_email_verified: true },
    });
    if (!user) {
      return null;
    }

    const session = await this.sessionModel.findOne({
      where: { id: sessionId, user_id: userId },
    });
    if (!session) {
      return null;
    }

    const response = { ...user, session_id: session.id };
    await this.cacheManager.set(
      cacheKey,
      response,
      this.configService.get<number>('REDIS_TTL', 3600) * 1000,
    );

    return response;
  }
}
