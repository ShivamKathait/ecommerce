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

@Injectable()
export class TempRuntimeStrategy extends PassportStrategy(
  Strategy,
  'temp-jwt-runtime',
) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TEMP_SECRET')!,
    });
  }

  async validate(payload: any) {
    const userId = payload?.id;
    if (!userId) {
      return null;
    }

    const cacheKey = `auth:runtime:temp-user:${userId}`;
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

    await this.cacheManager.set(
      cacheKey,
      user,
      this.configService.get<number>('REDIS_TTL', 3600) * 1000,
    );

    return user;
  }
}
