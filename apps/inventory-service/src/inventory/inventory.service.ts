import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import * as Errors from '@ecommerce/shared/error-handler/error-service';
import {
  AdjustInventoryDto,
  UpdateInventoryDto,
} from './dto/update-inventory.dto';
import { Action } from 'src/common/utils';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryModel: Repository<Inventory>,
  ) {}

  async getInventoryForProduct(productId: number) {
    try {
      const inventory = await this.inventoryModel.findOne({
        where: { product_id: productId },
      });

      if (!inventory) {
        throw new Errors.InventoryNotFound();
      }

      return { data: inventory };
    } catch (error) {
      throw error;
    }
  }

  async updateProductInventory(
    productId: number,
    updateInventoryDto: UpdateInventoryDto,
  ) {
    try {
      const { lowStockThreshold, trackInventory } = updateInventoryDto;
      const { data: inventory } = await this.getInventoryForProduct(productId);

      if (lowStockThreshold) {
        inventory.lowStockThreshold = lowStockThreshold;
      }

      if (trackInventory) {
        inventory.trackInventory = trackInventory;
      }
      inventory.updateStatus();
      const updatedInventory = await this.inventoryModel.save(inventory);
      return {
        message: 'Inventory updated successfully',
        data: updatedInventory,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateInventory(
    productId: number,
    dto: AdjustInventoryDto,
  ): Promise<{ data: Inventory }> {
    try {
      const { quantity, action } = dto;
      const { data: inventory } = await this.getInventoryForProduct(productId);

      switch (action) {
        case Action.ADD:
          inventory.quantity += quantity;
          break;
        case Action.SUBTRACT:
          if (inventory.quantity < quantity && inventory.trackInventory) {
            throw new Errors.InsufficientInventory();
          }
          inventory.quantity = Math.max(0, inventory.quantity - quantity);
          break;
        case Action.SET:
        default:
          inventory.quantity = quantity;
      }

      inventory.updateStatus();
      const data = await this.inventoryModel.save(inventory);
      return { data: data };
    } catch (error) {
      throw error;
    }
  }
}
