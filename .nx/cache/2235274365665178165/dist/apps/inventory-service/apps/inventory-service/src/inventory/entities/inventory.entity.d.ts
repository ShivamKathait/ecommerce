import { InventoryStatus } from 'src/common/utils';
export declare class Inventory {
    id: number;
    product_id: number;
    quantity: number;
    lowStockThreshold: number;
    status: InventoryStatus;
    trackInventory: boolean;
    created_at: Date;
    updated_at: Date;
    updateStatus(): void;
}
