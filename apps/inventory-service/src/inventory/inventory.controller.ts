import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { Roles } from '@ecommerce/auth';
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

@ApiTags('inventory')
@Controller({ path: 'inventory', version: '1' })
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // @ApiBearerAuth("authorization")
  // @Roles(Role.VENDOR)
  @Get('product/:productId')
  @ApiOperation({ summary: 'Get inventory for a product' })
  @ApiResponse({
    status: 200,
    description: 'Returns the inventory for the specified product',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getInventoryForProduct(@Param('productId') productId: string) {
    return this.inventoryService.getInventoryForProduct(parseInt(productId));
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR)
  @Patch('product/:productId')
  @ApiOperation({ summary: 'Update inventory for a product' })
  @ApiResponse({ status: 200, description: 'Inventory updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateInventory(
    @Param('productId') productId: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateProductInventory(
      parseInt(productId),
      updateInventoryDto,
    );
  }

  @ApiBearerAuth('authorization')
  @Roles(Role.VENDOR)
  @Post('product/:productId/adjust')
  @ApiOperation({ summary: 'Adjust inventory quantity' })
  @ApiResponse({ status: 200, description: 'Inventory adjusted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  adjustInventory(
    @Param('productId') productId: string,
    @Body() dto: AdjustInventoryDto,
  ) {
    return this.inventoryService.updateInventory(parseInt(productId), dto);
  }
}
