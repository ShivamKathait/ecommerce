import { createPostgresDataSource } from '@ecommerce/db';
import { Session } from 'src/common/entities/session.entity';
import { User } from 'src/common/entities/user.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { InventoryReservation } from './inventory/entities/inventory-reservation.entity';

export const AppDataSource = createPostgresDataSource(
  [User, Session, Inventory, InventoryReservation],
  ['libs/db/migrations/inventory-service/*.ts'],
);
