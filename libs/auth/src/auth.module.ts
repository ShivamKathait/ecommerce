import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { TempAuthGuard } from './guards/temp-auth.guard';
import { TempStrategy } from './strategies/temp-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRY', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtStrategy,
    TempStrategy,
    JwtAuthGuard,
    TempAuthGuard,
    RolesGuard,
  ],
  exports: [JwtModule, PassportModule, JwtAuthGuard, TempAuthGuard, RolesGuard],
})
export class AuthModule {}
