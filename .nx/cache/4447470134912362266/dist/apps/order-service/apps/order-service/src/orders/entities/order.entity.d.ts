import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING_PAYMENT = "pending_payment",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    FAILED = "failed"
}
export declare class Order {
    id: number;
    user_id: number;
    status: OrderStatus;
    total_amount: number;
    currency: string;
    items: OrderItem[];
    created_at: Date;
    updated_at: Date;
}
