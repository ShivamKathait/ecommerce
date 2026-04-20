import { Controller, Get } from '@nestjs/common';
import {
  createHealthPayload,
  createReadinessPayload,
} from '@ecommerce/common-bootstrap';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return createHealthPayload('auth-service');
  }

  @Get('health')
  getDetailedHealth() {
    return createHealthPayload('auth-service');
  }

  @Get('ready')
  getReadiness() {
    return createReadinessPayload('auth-service');
  }
}
