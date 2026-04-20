import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AuthModule } from '@ecommerce/auth';
import { AppController } from './app.controller';
import { AppDataSource } from './data-source';
import { Session } from 'src/common/entities/session.entity';
import { User } from 'src/common/entities/user.entity';
import { AuthApiModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), 'apps/auth-service/.env'), '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        ...AppDataSource.options,
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('RATE_LIMIT_TTL', 60),
            limit: config.get<number>('RATE_LIMIT', 100),
          },
        ],
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5 * 60 * 1000,
      max: 100,
    }),
    AuthModule,
    AuthApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
