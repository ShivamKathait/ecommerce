import { createPostgresDataSource } from '@ecommerce/db';
import { PaymentHistory } from './payment/entities/payment-history.entity';

export const AppDataSource = createPostgresDataSource(
  [PaymentHistory],
  ['libs/db/migrations/payment-service/*.ts'],
);
