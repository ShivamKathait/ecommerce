import { InventoryService } from './inventory.service';
import { AdjustInventoryDto, UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getInventoryForProduct(productId: string): Promise<{
        data: import("./entities/inventory.entity").Inventory;
    }>;
    updateInventory(productId: string, updateInventoryDto: UpdateInventoryDto): Promise<{
        message: string;
        data: import("./entities/inventory.entity").Inventory;
    }>;
    adjustInventory(productId: string, dto: AdjustInventoryDto): Promise<{
        data: import("./entities/inventory.entity").Inventory;
    }>;
}
