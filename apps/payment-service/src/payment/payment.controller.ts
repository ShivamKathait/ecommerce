import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateConnectAccountDto } from './dto/create-connect-account.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateOnboardingLinkDto } from './dto/create-onboarding-link.dto';
import { PaymentService } from './payment.service';

@ApiTags('payment')
@Controller({ path: 'payment', version: '1' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('customers')
  @ApiOperation({ summary: 'Create a Stripe customer' })
  async createCustomer(@Body() dto: CreateCustomerDto) {
    const customerId = await this.paymentService.createCustomer(
      dto.name,
      dto.email,
    );
    return { data: { customerId } };
  }

  @Post('connect/accounts')
  @ApiOperation({ summary: 'Create a Stripe Connect account' })
  async createConnectAccount(@Body() dto: CreateConnectAccountDto) {
    const accountId = await this.paymentService.createConnectAccount(dto.email);
    return { data: { accountId } };
  }

  @Get('connect/accounts/:accountId')
  @ApiOperation({ summary: 'Fetch a Stripe Connect account' })
  async getConnectAccount(@Param('accountId') accountId: string) {
    const account = await this.paymentService.retrieveConnectAccount(accountId);
    return { data: account };
  }

  @Post('connect/accounts/:accountId/onboarding-links')
  @ApiOperation({ summary: 'Create a Stripe Connect onboarding link' })
  async createOnboardingLink(
    @Param('accountId') accountId: string,
    @Body() dto: CreateOnboardingLinkDto,
  ) {
    const url = await this.paymentService.generateOnboardingLink(
      accountId,
      dto.vendorId,
    );
    return { data: { url } };
  }
}
