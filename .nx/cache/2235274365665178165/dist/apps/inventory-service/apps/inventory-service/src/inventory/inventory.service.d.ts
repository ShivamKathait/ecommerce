import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { AdjustInventoryDto, UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
export declare class InventoryService {
    private readonly inventoryModel;
    private readonly logger;
    constructor(inventoryModel: Repository<Inventory>);
    getInventoryForProduct(productId: number): Promise<{
        data: Inventory;
    }>;
    createInventoryForProduct(productId: number, dto: CreateInventoryDto): Promise<{
        data: Inventory;
    }>;
    listLowStock(limit?: number, page?: number): Promise<{
        data: Inventory[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateProductInventory(productId: number, updateInventoryDto: UpdateInventoryDto): Promise<{
        message: string;
        data: Inventory;
    }>;
    updateInventory(productId: number, dto: AdjustInventoryDto): Promise<{
        data: Inventory;
    }>;
}
