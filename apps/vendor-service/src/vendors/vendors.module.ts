import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorProfile } from './entities/vendor-profile.entity';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { AuthClientService } from 'src/common/services/auth-client.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([VendorProfile])],
  controllers: [VendorsController],
  providers: [VendorsService, PaymentClientService, AuthClientService],
})
export class VendorsModule {}
