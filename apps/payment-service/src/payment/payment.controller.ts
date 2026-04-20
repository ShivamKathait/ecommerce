import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateConnectAccountDto } from './dto/create-connect-account.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateOnboardingLinkDto } from './dto/create-onboarding-link.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentService } from './payment.service';
import { InternalServiceGuard } from './guards/internal-service.guard';

@ApiTags('payment')
@Controller({ path: 'payment', version: '1' })
@UseGuards(InternalServiceGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('customers')
  @ApiOperation({ summary: 'Create a Stripe customer' })
  async createCustomer(
    @Body() dto: CreateCustomerDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    const customerId = await this.paymentService.createCustomer(
      dto.name,
      dto.email,
      idempotencyKey,
    );
    return { data: { customerId } };
  }

  @Post('connect/accounts')
  @ApiOperation({ summary: 'Create a Stripe Connect account' })
  async createConnectAccount(
    @Body() dto: CreateConnectAccountDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    const accountId = await this.paymentService.createConnectAccount(
      dto.email,
      dto.userId,
      idempotencyKey,
    );
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
      dto.userId,
    );
    return { data: { url } };
  }

  @Post('intents')
  @ApiOperation({ summary: 'Create a Stripe payment intent' })
  async createPaymentIntent(
    @Body() dto: CreatePaymentIntentDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    const paymentIntent = await this.paymentService.createPaymentIntent(
      dto.amount,
      dto.currency,
      dto.orderId,
      dto.userId,
      dto.customerId,
      idempotencyKey,
    );
    return { data: paymentIntent };
  }

  @Get('intents/:paymentIntentId')
  @ApiOperation({ summary: 'Retrieve a Stripe payment intent' })
  async getPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    const paymentIntent = await this.paymentService.retrievePaymentIntent(
      paymentIntentId,
    );
    return { data: paymentIntent };
  }
}
