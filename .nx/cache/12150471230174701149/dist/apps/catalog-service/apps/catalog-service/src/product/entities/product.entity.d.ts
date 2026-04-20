import { Inventory } from '../../inventory/entities/inventory.entity';
export declare class Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    is_active: boolean;
    title?: string;
    inventory: Inventory;
    created_at: Date;
    updated_at: Date;
}
