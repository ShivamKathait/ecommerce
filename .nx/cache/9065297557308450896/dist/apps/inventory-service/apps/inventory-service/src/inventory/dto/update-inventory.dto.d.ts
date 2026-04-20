import { InventoryStatus, Action } from 'src/common/utils';
export declare class UpdateInventoryDto {
    lowStockThreshold?: number;
    status?: InventoryStatus;
    trackInventory?: boolean;
}
export declare class AdjustInventoryDto {
    quantity: number;
    action: Action;
}
