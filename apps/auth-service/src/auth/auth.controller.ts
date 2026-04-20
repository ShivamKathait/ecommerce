import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles, RolesGuard, TempRuntimeAuthGuard } from '@ecommerce/auth';
import { Role } from 'src/common/utils';
import { CreateUserDto, LoginDto, OtpDto, UpdateRoleDto } from './dto/auth.dto';
import { AuthApiService } from './auth.service';
import { InternalServiceGuard } from './guards/internal-service.guard';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthApiController {
  constructor(private readonly authApiService: AuthApiService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authApiService.register(dto);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.USER)
  @UseGuards(TempRuntimeAuthGuard, RolesGuard)
  @Patch('verify/otp')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Verify Otp Api' })
  verify_otp(@Body() dto: OtpDto, @Req() req) {
    return this.authApiService.verify_otp(dto, req.user);
  }

  @Post('login')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Login Api' })
  login(@Body() dto: LoginDto) {
    return this.authApiService.login(dto);
  }

  @Post('login/admin')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Admin Login Api' })
  loginAdmin(@Body() dto: LoginDto) {
    return this.authApiService.loginAdmin(dto);
  }

  @Post('login/vendor')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Vendor Login Api' })
  loginVendor(@Body() dto: LoginDto) {
    return this.authApiService.loginVendor(dto);
  }
  
}
