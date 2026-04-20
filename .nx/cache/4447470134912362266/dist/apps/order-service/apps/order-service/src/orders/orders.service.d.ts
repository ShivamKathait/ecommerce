import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CatalogClientService } from 'src/common/services/catalog-client.service';
import { InventoryClientService } from 'src/common/services/inventory-client.service';
import { CheckoutDto } from './dto/checkout.dto';
import { ListOrdersDto } from './dto/list-orders.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly orderItemRepo;
    private readonly inventoryClientService;
    private readonly catalogClientService;
    private readonly configService;
    constructor(orderRepo: Repository<Order>, orderItemRepo: Repository<OrderItem>, inventoryClientService: InventoryClientService, catalogClientService: CatalogClientService, configService: ConfigService);
    checkout(user: {
        id: number;
        role: string;
    }, authToken: string, dto: CheckoutDto): Promise<{
        data: {
            order_id: number;
            status: OrderStatus;
            total_amount: number;
            currency: string;
            items: OrderItem[];
        };
    }>;
    confirmOrder(orderId: number, userId: number, authToken: string): Promise<{
        data: {
            order_id: number;
            status: OrderStatus.CONFIRMED;
        };
    }>;
    cancelOrder(orderId: number, userId: number, authToken: string): Promise<{
        data: {
            order_id: number;
            status: OrderStatus.CANCELLED;
        };
    }>;
    getOrder(orderId: number, userId: number): Promise<{
        data: Order;
    }>;
    listMyOrders(userId: number, dto: ListOrdersDto): Promise<{
        data: Order[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
