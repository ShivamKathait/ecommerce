import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Query,
  ParseIntPipe,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '@ecommerce/auth';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import {
  AdjustInventoryDto,
  UpdateInventoryDto,
} from './dto/update-inventory.dto';
import { Role } from 'src/common/utils';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ReserveInventoryDto } from './dto/reservation.dto';
import { InternalServiceGuard } from './guards/internal-service.guard';

@ApiTags('inventory')
@Controller({ path: 'inventory', version: '1' })
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get inventory for a product' })
  @ApiResponse({
    status: 200,
    description: 'Returns the inventory for the specified product',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getInventoryForProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventoryService.getInventoryForProduct(productId);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('product/:productId')
  @ApiOperation({ summary: 'Create inventory for a product' })
  @ApiResponse({ status: 201, description: 'Inventory created successfully' })
  createInventory(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateInventoryDto,
  ) {
    return this.inventoryService.createInventoryForProduct(productId, dto);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('low-stock')
  @ApiOperation({ summary: 'List low stock inventory' })
  @ApiResponse({ status: 200, description: 'Low stock inventory list' })
  listLowStock(@Query('limit') limit?: string, @Query('page') page?: string) {
    return this.inventoryService.listLowStock(
      limit ? parseInt(limit, 10) : 20,
      page ? parseInt(page, 10) : 1,
    );
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('product/:productId')
  @ApiOperation({ summary: 'Update inventory for a product' })
  @ApiResponse({ status: 200, description: 'Inventory updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateInventory(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateProductInventory(
      productId,
      updateInventoryDto,
    );
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('product/:productId/adjust')
  @ApiOperation({ summary: 'Adjust inventory quantity' })
  @ApiResponse({ status: 200, description: 'Inventory adjusted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  adjustInventory(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: AdjustInventoryDto,
  ) {
    return this.inventoryService.updateInventory(productId, dto);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN, Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('product/:productId/reservations')
  @ApiOperation({ summary: 'Reserve inventory for checkout' })
  reserveInventory(
    @Param('productId', ParseIntPipe) productId: number,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() dto: ReserveInventoryDto,
  ) {
    return this.inventoryService.reserveInventory(productId, {
      ...dto,
      reservationId: dto.reservationId ?? idempotencyKey,
    });
  }

  @UseGuards(InternalServiceGuard)
  @Post('internal/product/:productId/reservations')
  @ApiOperation({ summary: 'Internal: reserve inventory for order workflow' })
  reserveInventoryInternal(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: ReserveInventoryDto,
  ) {
    return this.inventoryService.reserveInventory(productId, dto);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN, Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('product/:productId/reservations/:reservationId/release')
  @ApiOperation({ summary: 'Release reserved inventory' })
  releaseReservation(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('reservationId') reservationId: string,
  ) {
    return this.inventoryService.releaseReservation(productId, reservationId);
  }

  @UseGuards(InternalServiceGuard)
  @Post('internal/product/:productId/reservations/:reservationId/release')
  @ApiOperation({ summary: 'Internal: release reservation' })
  releaseReservationInternal(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('reservationId') reservationId: string,
  ) {
    return this.inventoryService.releaseReservation(productId, reservationId);
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.USER, Role.ADMIN, Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('product/:productId/reservations/:reservationId/confirm')
  @ApiOperation({ summary: 'Confirm reserved inventory and deduct stock' })
  confirmReservation(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('reservationId') reservationId: string,
  ) {
    return this.inventoryService.confirmReservation(productId, reservationId);
  }

  @UseGuards(InternalServiceGuard)
  @Post('internal/product/:productId/reservations/:reservationId/confirm')
  @ApiOperation({ summary: 'Internal: confirm reservation and deduct stock' })
  confirmReservationInternal(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('reservationId') reservationId: string,
  ) {
    return this.inventoryService.confirmReservation(productId, reservationId);
  }
}
