import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, AuthRuntimeModule } from '@ecommerce/auth';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { Session } from 'src/common/entities/session.entity';
import { User } from 'src/common/entities/user.entity';
import { AuthApiController } from './auth.controller';
import { AuthApiService } from './auth.service';
import { InternalServiceGuard } from './guards/internal-service.guard';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Session]),
    AuthModule,
    AuthRuntimeModule,
  ],
  controllers: [AuthApiController],
  providers: [AuthApiService, PaymentClientService, InternalServiceGuard],
  exports: [AuthApiService],
})
export class AuthApiModule {}
