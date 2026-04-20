import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard, Roles, RolesGuard } from '@ecommerce/auth';
import { Role } from 'src/common/utils';
import { CheckoutDto } from './dto/checkout.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { ListOrdersDto } from './dto/list-orders.dto';
import { OrdersService } from './orders.service';

type AuthenticatedRequest = Request & {
  user: {
    id: number;
    role: string;
  };
};

@ApiTags('orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private extractToken(req: Request): string {
    const authHeader = req.get('authorization') ?? '';
    return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  }

  @Post('checkout')
  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Reserve inventory and create pending order' })
  checkout(@Body() dto: CheckoutDto, @Req() req: AuthenticatedRequest) {
    const token = this.extractToken(req);
    return this.ordersService.checkout(req.user, token, dto);
  }

  @Patch(':id/confirm')
  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Confirm payment and consume reservations' })
  confirm(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: ConfirmOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const token = this.extractToken(req);
    return this.ordersService.confirmOrder(
      orderId,
      req.user.id,
      token,
      dto.paymentIntentId,
    );
  }

  @Patch(':id/cancel')
  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Cancel pending order and release reservations' })
  cancel(
    @Param('id', ParseIntPipe) orderId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const token = this.extractToken(req);
    return this.ordersService.cancelOrder(orderId, req.user.id, token);
  }

  @Get(':id')
  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get order by id' })
  getOne(
    @Param('id', ParseIntPipe) orderId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.getOrder(orderId, req.user.id);
  }

  @Get()
  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'List my orders' })
  listMine(@Req() req: AuthenticatedRequest, @Query() query: ListOrdersDto) {
    return this.ordersService.listMyOrders(req.user.id, query);
  }
}
