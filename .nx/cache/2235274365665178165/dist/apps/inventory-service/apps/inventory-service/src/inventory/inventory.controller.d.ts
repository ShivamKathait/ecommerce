import { InventoryService } from './inventory.service';
import { AdjustInventoryDto, UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getInventoryForProduct(productId: number): Promise<{
        data: import("./entities/inventory.entity").Inventory;
    }>;
    createInventory(productId: number, dto: CreateInventoryDto): Promise<{
        data: import("./entities/inventory.entity").Inventory;
    }>;
    listLowStock(limit?: string, page?: string): Promise<{
        data: import("./entities/inventory.entity").Inventory[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateInventory(productId: number, updateInventoryDto: UpdateInventoryDto): Promise<{
        message: string;
        data: import("./entities/inventory.entity").Inventory;
    }>;
    adjustInventory(productId: number, dto: AdjustInventoryDto): Promise<{
        data: import("./entities/inventory.entity").Inventory;
    }>;
}
