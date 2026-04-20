import { Controller, Get } from '@nestjs/common';
import {
  createHealthPayload,
  createReadinessPayload,
} from '@ecommerce/common-bootstrap';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return createHealthPayload('user-service');
  }

  @Get('health')
  getDetailedHealth() {
    return createHealthPayload('user-service');
  }

  @Get('ready')
  getReadiness() {
    return createReadinessPayload('user-service');
  }
}
