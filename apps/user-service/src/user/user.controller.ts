import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '@ecommerce/auth';
import { Request } from 'express';
import { Role } from 'src/common/utils';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

type AuthenticatedRequest = Request & {
  user: {
    id: number;
    role: string;
  };
};

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN, Role.VENDOR, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get my profile' })
  getMyProfile(@Req() req: AuthenticatedRequest) {
    return this.userService.getMyProfile(req.user.id);
  }

  @Patch('me')
  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN, Role.VENDOR, Role.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update my profile' })
  updateMyProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateMyProfile(req.user.id, dto);
  }
}
