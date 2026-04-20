import { Controller, Get } from '@nestjs/common';
import {
  createHealthPayload,
  createReadinessPayload,
} from '@ecommerce/common-bootstrap';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return createHealthPayload('vendor-service');
  }

  @Get('health')
  getDetailedHealth() {
    return createHealthPayload('vendor-service');
  }

  @Get('ready')
  getReadiness() {
    return createReadinessPayload('vendor-service');
  }
}
