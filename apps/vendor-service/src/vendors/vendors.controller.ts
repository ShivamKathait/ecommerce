import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '@ecommerce/auth';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/common/utils';
import { LoginDto } from './dto/login.dto';

@ApiTags('vendors')
@Controller({ path: 'vendors', version: '1' })
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post('register')
  @ApiBearerAuth('authorization')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  register(@Body() createVendorDto: CreateVendorDto, @Req() req) {
    return this.vendorsService.register(createVendorDto, req.user);
  }

  /**
   *  Will handle the Vendor login controller logic
   * @param {LoginDto} dto - The Vendor login data
   * @returns
   */
  @Post('login')
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  @ApiOperation({ summary: `Vendor Login Api` })
  login(@Body() dto: LoginDto) {
    return this.vendorsService.login(dto);
  }

  @Get('refresh/:vendor_id')
  refresh(@Req() req, @Res() res) {
    return this.vendorsService.refresh_onboarding(req, res);
  }

  @Get('complete/:vendor_id')
  complete(@Req() req, @Res() res) {
    return this.vendorsService.complete_onboarding(req, res);
  }
}
