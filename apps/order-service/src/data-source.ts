import { createPostgresDataSource } from '@ecommerce/db';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { ProcessedEvent } from './orders/entities/processed-event.entity';

export const AppDataSource = createPostgresDataSource(
  [Order, OrderItem, ProcessedEvent],
  ['libs/db/migrations/order-service/*.ts'],
);
