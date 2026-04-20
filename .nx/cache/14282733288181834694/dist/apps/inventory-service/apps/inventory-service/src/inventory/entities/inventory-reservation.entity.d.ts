export declare class InventoryReservation {
    id: number;
    reservation_id: string;
    product_id: number;
    quantity: number;
    status: 'reserved' | 'released' | 'confirmed';
    expires_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
