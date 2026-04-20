import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { AdjustInventoryDto, UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryService {
    private readonly inventoryModel;
    private readonly logger;
    constructor(inventoryModel: Repository<Inventory>);
    getInventoryForProduct(productId: number): Promise<{
        data: Inventory;
    }>;
    updateProductInventory(productId: number, updateInventoryDto: UpdateInventoryDto): Promise<{
        message: string;
        data: Inventory;
    }>;
    updateInventory(productId: number, dto: AdjustInventoryDto): Promise<{
        data: Inventory;
    }>;
}
