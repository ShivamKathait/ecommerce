import { Controller, Get } from '@nestjs/common';
import {
  createHealthPayload,
  createReadinessPayload,
} from '@ecommerce/common-bootstrap';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return createHealthPayload('inventory-service');
  }

  @Get('health')
  getDetailedHealth() {
    return createHealthPayload('inventory-service');
  }

  @Get('ready')
  getReadiness() {
    return createReadinessPayload('inventory-service');
  }
}
