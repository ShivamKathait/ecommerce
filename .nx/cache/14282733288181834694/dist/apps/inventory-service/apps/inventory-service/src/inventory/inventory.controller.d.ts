import { InventoryService } from './inventory.service';
import { AdjustInventoryDto, UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ReserveInventoryDto } from './dto/reservation.dto';
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
    reserveInventory(productId: number, idempotencyKey: string | undefined, dto: ReserveInventoryDto): Promise<{
        data: {
            reservation_id: string;
            product_id: number;
            quantity: number;
            status: "reserved" | "released" | "confirmed";
        };
        idempotent?: undefined;
    } | {
        data: {
            reservation_id: string;
            product_id: number;
            quantity: number;
            status: "reserved";
        };
        idempotent: boolean;
    }>;
    releaseReservation(productId: number, reservationId: string): Promise<{
        data: {
            reservation_id: string;
            product_id: number;
            status: "released";
        };
    }>;
    confirmReservation(productId: number, reservationId: string): Promise<{
        data: {
            reservation_id: string;
            product_id: number;
            status: "confirmed";
            remaining_quantity: number;
        };
    }>;
}
