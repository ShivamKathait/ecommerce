import { Order } from './order.entity';
export declare class OrderItem {
    id: number;
    order_id: number;
    order: Order;
    product_id: number;
    quantity: number;
    reservation_id: string;
    unit_price: number;
    line_total: number;
    created_at: Date;
}
