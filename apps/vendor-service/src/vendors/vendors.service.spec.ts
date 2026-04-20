import { Test, TestingModule } from '@nestjs/testing';
import { VendorsService } from './vendors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendorProfile } from './entities/vendor-profile.entity';
import { PaymentClientService } from 'src/common/services/payment-client.service';
import { AuthClientService } from 'src/common/services/auth-client.service';

describe('VendorsService', () => {
  let service: VendorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorsService,
        { provide: getRepositoryToken(VendorProfile), useValue: {} },
        { provide: PaymentClientService, useValue: {} },
        { provide: AuthClientService, useValue: {} },
      ],
    }).compile();

    service = module.get<VendorsService>(VendorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
