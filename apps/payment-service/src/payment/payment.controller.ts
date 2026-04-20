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
    return this.paymentService.createCustomer(dto, idempotencyKey);
  }

  @Post('connect/accounts')
  @ApiOperation({ summary: 'Create a Stripe Connect account' })
  async createConnectAccount(
    @Body() dto: CreateConnectAccountDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentService.createConnectAccount(dto, idempotencyKey);
  }

  @Get('connect/accounts/:accountId')
  @ApiOperation({ summary: 'Fetch a Stripe Connect account' })
  async getConnectAccount(@Param('accountId') accountId: string) {
    return this.paymentService.retrieveConnectAccount(accountId);
  }

  @Post('connect/accounts/:accountId/onboarding-links')
  @ApiOperation({ summary: 'Create a Stripe Connect onboarding link' })
  async createOnboardingLink(
    @Param('accountId') accountId: string,
    @Body() dto: CreateOnboardingLinkDto,
  ) {
    return this.paymentService.generateOnboardingLink(accountId, dto);
  }

  @Post('intents')
  @ApiOperation({ summary: 'Create a Stripe payment intent' })
  async createPaymentIntent(
    @Body() dto: CreatePaymentIntentDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentService.createPaymentIntent(dto, idempotencyKey);
  }

  @Get('intents/:paymentIntentId')
  @ApiOperation({ summary: 'Retrieve a Stripe payment intent' })
  async getPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    return this.paymentService.retrievePaymentIntent(paymentIntentId);
  }
}
