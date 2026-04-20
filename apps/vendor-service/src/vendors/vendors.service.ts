import { Injectable, Logger, Req, Res } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorProfile } from './entities/vendor-profile.entity';
import { Repository } from 'typeorm';
import { Role, VenderStatus } from 'src/common/utils';
import * as Errors from '@ecommerce/shared/error-handler/error-service';
import { LoginDto } from './dto/login.dto';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { AuthClientService } from 'src/common/services/auth-client.service';

@Injectable()
export class VendorsService {
  private readonly logger = new Logger(VendorsService.name);

  constructor(
    @InjectRepository(VendorProfile)
    private readonly vendorProfile: Repository<VendorProfile>,
    private readonly paymentClientService: PaymentClientService,
    private readonly authClientService: AuthClientService,
  ) {}

  async register(
    createVendorDto: CreateVendorDto,
    user: { id: number; email: string },
  ) {
    try {
      const { business_name, gst_number } = createVendorDto;
      const query = { where: { user_id: user.id } };
      const is_vendor = await this.vendorProfile.findOne(query);
      if (is_vendor && is_vendor.vendor_status === VenderStatus.APPPROVED) {
        throw new Errors.AlreadyVendor();
      }
      const account_id = await this.paymentClientService.createConnectAccount(
        user.email,
      );
      const save_data = {
        business_name,
        gst_number,
        stripe_connect_id: account_id,
        user_id: user.id,
      };
      const vendor = await this.vendorProfile.save(save_data);
      const link = await this.paymentClientService.generateOnboardingLink(
        account_id,
        vendor.id,
      );
      return { link };
    } catch (error) {
      throw error;
    }
  }

  async refresh_onboarding(@Req() req, @Res() res) {
    try {
      const vendorId = req.params.vendor_id as string;
      const vendor = await this.vendorProfile.findOne({
        where: { id: +vendorId },
      });
      if (!vendor) return;
      const link = await this.paymentClientService.generateOnboardingLink(
        vendor.stripe_connect_id,
        vendor.id,
      );
      return { link };
    } catch (error) {
      throw error;
    }
  }

  async complete_onboarding(@Req() req, @Res() res) {
    try {
      const vendorId = req.params.vendor_id as string;
      if (!vendorId) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/vendor/onboarding-result?success=false`,
        );
      }
      const vendor = await this.vendorProfile.findOne({
        where: { id: +vendorId },
      });

      if (!vendor) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/vendor/onboarding-result?success=false`,
        );
      }
      const account = await this.paymentClientService.retrieveConnectAccount(
        vendor.stripe_connect_id,
      );

      const isComplete =
        account.details_submitted &&
        account.charges_enabled &&
        account.payouts_enabled;

      const update = {
        vendor_status: isComplete
          ? VenderStatus.APPPROVED
          : VenderStatus.PENDING,
      };

      await this.vendorProfile.update({ id: vendor.id }, update);
      if (isComplete) {
        await this.authClientService.updateUserRole(
          vendor.user_id,
          Role.VENDOR,
        );
      }
      return res.redirect(
        `${process.env.FRONTEND_URL}/vendor/onboarding-result?success=${isComplete}`,
      );
    } catch (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/vendor/onboarding-result?success=false`,
      );
    }
  }

  async login(dto: LoginDto) {
    return this.authClientService.loginVendor(dto.email, dto.password);
  }
}
