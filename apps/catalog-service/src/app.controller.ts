import { Controller, Get } from '@nestjs/common';
import {
  createHealthPayload,
  createReadinessPayload,
} from '@ecommerce/common-bootstrap';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return createHealthPayload('catalog-service');
  }

  @Get('health')
  getDetailedHealth() {
    return createHealthPayload('catalog-service');
  }

  @Get('ready')
  getReadiness() {
    return createReadinessPayload('catalog-service');
  }
}
