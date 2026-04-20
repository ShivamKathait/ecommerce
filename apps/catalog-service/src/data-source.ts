import { createPostgresDataSource } from '@ecommerce/db';
import { Product } from './product/entities/product.entity';

export const AppDataSource = createPostgresDataSource(
  [Product],
  ['libs/db/migrations/catalog-service/*.ts'],
);
