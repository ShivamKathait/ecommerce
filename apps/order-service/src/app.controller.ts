import { Controller, Get } from '@nestjs/common';
import {
  createHealthPayload,
  createReadinessPayload,
} from '@ecommerce/common-bootstrap';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return createHealthPayload('order-service');
  }

  @Get('health')
  getDetailedHealth() {
    return createHealthPayload('order-service');
  }

  @Get('ready')
  getReadiness() {
    return createReadinessPayload('order-service');
  }
}

