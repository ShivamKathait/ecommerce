import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Roles } from '@ecommerce/auth';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/create-admin.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/common/utils';

@ApiTags('admin')
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   *  Will handle the admin login controller logic
   * @param {LoginDto} dto - The admin login data
   * @returns
   */
  @Post('login')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: `Admin Login Api` })
  login(@Body() dto: LoginDto) {
    return this.adminService.login(dto);
  }
}
