import { Controller, Get } from '@nestjs/common';
import {
  createHealthPayload,
  createReadinessPayload,
} from '@ecommerce/common-bootstrap';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return createHealthPayload('payment-service');
  }

  @Get('health')
  getDetailedHealth() {
    return createHealthPayload('payment-service');
  }

  @Get('ready')
  getReadiness() {
    return createReadinessPayload('payment-service');
  }
}
