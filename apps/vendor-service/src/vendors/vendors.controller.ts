import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '@ecommerce/auth';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { Role } from 'src/common/utils';
import { LoginDto } from './dto/login.dto';
import { ListVendorsDto } from './dto/list-vendors.dto';

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

  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user vendor profile' })
  getMyVendorProfile(@Req() req) {
    return this.vendorsService.getMyVendorProfile(req.user.id);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiOperation({ summary: 'List vendors (admin)' })
  listVendors(@Query() query: ListVendorsDto) {
    return this.vendorsService.listVendors(query);
  }

  @Get('refresh/:vendor_id')
  refresh(@Param('vendor_id', ParseIntPipe) vendorId: number) {
    return this.vendorsService.refresh_onboarding(vendorId);
  }

  @Get('complete/:vendor_id')
  @ApiResponse({ status: 302, description: 'Redirects to frontend' })
  async complete(
    @Param('vendor_id', ParseIntPipe) vendorId: number,
    @Res() res,
  ) {
    const redirectUrl = await this.vendorsService.complete_onboarding(vendorId);
    return res.redirect(redirectUrl);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by id (admin)' })
  getVendorById(@Param('id', ParseIntPipe) vendorId: number) {
    return this.vendorsService.getVendorById(vendorId);
  }
}
