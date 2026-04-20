import { Injectable, Logger } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorProfile } from './entities/vendor-profile.entity';
import { Repository } from 'typeorm';
import { Role, VenderStatus } from 'src/common/utils';
import * as Errors from '@ecommerce/shared/error-handler/error-service';
import { LoginDto } from './dto/login.dto';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { AuthClientService } from 'src/common/services/auth-client.service';
import { ListVendorsDto } from './dto/list-vendors.dto';

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
    const { business_name, gst_number } = createVendorDto;
    const query = { where: { user_id: user.id } };
    const isVendor = await this.vendorProfile.findOne(query);
    if (isVendor && isVendor.vendor_status === VenderStatus.APPPROVED) {
      throw new Errors.AlreadyVendor();
    }

    const accountId = await this.paymentClientService.createConnectAccount(
      user.email,
      user.id,
    );
    const saveData = {
      business_name,
      gst_number,
      stripe_connect_id: accountId,
      user_id: user.id,
    };
    const vendor = await this.vendorProfile.save(saveData);
    const link = await this.paymentClientService.generateOnboardingLink(
      accountId,
      vendor.id,
      vendor.user_id,
    );
    return { link };
  }

  async refresh_onboarding(vendorId: number) {
    const vendor = await this.vendorProfile.findOne({
      where: { id: vendorId },
    });
    if (!vendor) {
      throw new Errors.VendorNotExist();
    }

    const link = await this.paymentClientService.generateOnboardingLink(
      vendor.stripe_connect_id,
      vendor.id,
      vendor.user_id,
    );
    return { link };
  }

  async complete_onboarding(vendorId: number): Promise<string> {
    const vendor = await this.vendorProfile.findOne({
      where: { id: vendorId },
    });

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    if (!vendor) {
      return `${frontendUrl}/vendor/onboarding-result?success=false`;
    }

    const account = await this.paymentClientService.retrieveConnectAccount(
      vendor.stripe_connect_id,
    );

    const isComplete =
      !!account.details_submitted &&
      !!account.charges_enabled &&
      !!account.payouts_enabled;

    const update = {
      vendor_status: isComplete ? VenderStatus.APPPROVED : VenderStatus.PENDING,
    };

    await this.vendorProfile.update({ id: vendor.id }, update);
    if (isComplete) {
      await this.authClientService.updateUserRole(vendor.user_id, Role.VENDOR);
    }

    return `${frontendUrl}/vendor/onboarding-result?success=${isComplete}`;
  }

  async login(dto: LoginDto) {
    return this.authClientService.loginVendor(dto.email, dto.password);
  }

  async getMyVendorProfile(userId: number) {
    const vendor = await this.vendorProfile.findOne({ where: { user_id: userId } });
    if (!vendor) {
      throw new Errors.VendorNotExist();
    }

    return { data: vendor };
  }

  async getVendorById(vendorId: number) {
    const vendor = await this.vendorProfile.findOne({ where: { id: vendorId } });
    if (!vendor) {
      throw new Errors.VendorNotExist();
    }

    return { data: vendor };
  }

  async listVendors(dto: ListVendorsDto) {
    const page = Math.max(dto.page ?? 1, 1);
    const limit = Math.max(Math.min(dto.limit ?? 20, 100), 1);
    const skip = (page - 1) * limit;

    const where = dto.status ? { vendor_status: dto.status } : {};
    const [items, total] = await this.vendorProfile.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
