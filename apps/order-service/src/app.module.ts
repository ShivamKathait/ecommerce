import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import {
  AuthModule,
  JwtAuthGuard,
  RolesGuard,
  TempAuthGuard,
} from '@ecommerce/auth';
import { AppController } from './app.controller';
import { RateLimitGuard } from 'src/common/rate-limit.guard';
import { RequestLoggingInterceptor } from 'src/common/interceptors/request-logging.interceptor';
import { ErrorHandler } from '@ecommerce/shared/error-handler/handler.services';
import { AppDataSource } from './data-source';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), 'apps/order-service/.env'), '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
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
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    JwtAuthGuard,
    RolesGuard,
    TempAuthGuard,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorHandler,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
})
export class AppModule {}
