import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [PaymentModule],
  controllers: [AppController],
})
export class AppModule {}
