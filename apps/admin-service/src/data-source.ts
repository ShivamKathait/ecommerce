import { createPostgresDataSource } from '@ecommerce/db';

export const AppDataSource = createPostgresDataSource(
  [],
  ['libs/db/migrations/admin-service/*.ts'],
);
