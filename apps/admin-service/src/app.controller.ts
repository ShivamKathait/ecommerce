import { Controller, Get } from '@nestjs/common';
import {
  createHealthPayload,
  createReadinessPayload,
} from '@ecommerce/common-bootstrap';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return createHealthPayload('admin-service');
  }

  @Get('health')
  getDetailedHealth() {
    return createHealthPayload('admin-service');
  }

  @Get('ready')
  getReadiness() {
    return createReadinessPayload('admin-service');
  }
}
