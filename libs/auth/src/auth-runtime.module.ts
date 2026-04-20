import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@ecommerce/shared/common/entities/user.entity';
import { Session } from '@ecommerce/shared/common/entities/session.entity';
import { AuthService } from './auth.service';
import { JwtRuntimeStrategy } from './strategies/jwt-runtime.strategy';
import { TempRuntimeStrategy } from './strategies/temp-runtime.strategy';
import { JwtRuntimeAuthGuard } from './guards/jwt-runtime-auth.guard';
import { TempRuntimeAuthGuard } from './guards/temp-runtime-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
  providers: [
    AuthService,
    JwtRuntimeStrategy,
    TempRuntimeStrategy,
    JwtRuntimeAuthGuard,
    TempRuntimeAuthGuard,
  ],
  exports: [AuthService, JwtRuntimeAuthGuard, TempRuntimeAuthGuard],
})
export class AuthRuntimeModule {}
