import { CheckoutDto } from './dto/checkout.dto';
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
            items: import("./entities/order-item.entity").OrderItem[];
        };
    }>;
    confirm(orderId: number, req: any): Promise<{
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
