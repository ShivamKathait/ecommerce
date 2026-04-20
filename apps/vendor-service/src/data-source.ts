import { createPostgresDataSource } from '@ecommerce/db';
import { VendorProfile } from './vendors/entities/vendor-profile.entity';

export const AppDataSource = createPostgresDataSource(
  [VendorProfile],
  ['libs/db/migrations/vendor-service/*.ts'],
);
