import { CheckoutDto } from './dto/checkout.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { ListOrdersDto } from './dto/list-orders.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(dto: CheckoutDto, req: any): Promise<{
        data: {
            order_id: number;
            status: import("./entities/order.entity").OrderStatus;
            total_amount: number;
            currency: string;
            payment_intent: {
                id: string;
                client_secret: string | null;
                status: string;
            };
            items: import("./entities/order-item.entity").OrderItem[];
        };
    }>;
    confirm(orderId: number, dto: ConfirmOrderDto, req: any): Promise<{
        data: {
            order_id: number;
            status: import("./entities/order.entity").OrderStatus.CONFIRMED;
        };
    }>;
    cancel(orderId: number, req: any): Promise<{
        data: {
            order_id: number;
            status: import("./entities/order.entity").OrderStatus.CANCELLED;
        };
    }>;
    getOne(orderId: number, req: any): Promise<{
        data: import("./entities/order.entity").Order;
    }>;
    listMine(req: any, query: ListOrdersDto): Promise<{
        data: import("./entities/order.entity").Order[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
