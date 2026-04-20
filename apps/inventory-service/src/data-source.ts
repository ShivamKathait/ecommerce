import { createPostgresDataSource } from '@ecommerce/db';
import { Session } from 'src/common/entities/session.entity';
import { User } from 'src/common/entities/user.entity';
import { Inventory } from './inventory/entities/inventory.entity';

export const AppDataSource = createPostgresDataSource(
  [User, Session, Inventory],
  ['libs/db/migrations/inventory-service/*.ts'],
);
