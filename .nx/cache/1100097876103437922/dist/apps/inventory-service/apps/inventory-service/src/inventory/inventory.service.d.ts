import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryReservation } from './entities/inventory-reservation.entity';
import { AdjustInventoryDto, UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ReserveInventoryDto } from './dto/reservation.dto';
export declare class InventoryService {
    private readonly inventoryModel;
    private readonly reservationModel;
    private readonly logger;
    constructor(inventoryModel: Repository<Inventory>, reservationModel: Repository<InventoryReservation>);
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
    reserveInventory(productId: number, dto: ReserveInventoryDto): Promise<{
        data: InventoryReservation;
        idempotent: boolean;
    } | {
        data: {
            reservation_id: string;
            product_id: number;
            quantity: number;
            status: "reserved" | "released" | "confirmed";
        };
        idempotent?: undefined;
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
