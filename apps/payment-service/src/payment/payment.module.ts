import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { join } from 'path';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), 'apps/payment-service/.env'), '.env'],
    }),
    StripeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('STRIPE_SECRET_API_KEY');
        if (!apiKey) {
          throw new Error(
            'STRIPE_SECRET_API_KEY is not defined in the configuration',
          );
        }

        return {
          apiKey,
          apiVersion: '2025-12-15.clover' as const,
        };
      },
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
