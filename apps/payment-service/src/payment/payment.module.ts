import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { InternalServiceGuard } from './guards/internal-service.guard';
import { PaymentHistory } from './entities/payment-history.entity';
import { RabbitMqClientService } from 'src/common/services/rabbitmq-client.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PaymentHistory]),
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
          webhookConfig: {
            stripeSecrets: {
              account: configService.get<string>(
                'STRIPE_WEBHOOK_SECRET_ACCOUNT',
                '',
              ),
              accountTest: configService.get<string>(
                'STRIPE_WEBHOOK_SECRET_ACCOUNT',
                '',
              ),
              connect: configService.get<string>(
                'STRIPE_WEBHOOK_SECRET_CONNECT',
                '',
              ),
              connectTest: configService.get<string>(
                'STRIPE_WEBHOOK_SECRET_CONNECT',
                '',
              ),
            },
            requestBodyProperty: 'rawBody',
          },
        };
      },
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, InternalServiceGuard, RabbitMqClientService],
  exports: [PaymentService],
})
export class PaymentModule {}
