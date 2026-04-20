import { createPostgresDataSource } from '@ecommerce/db';
import { Session } from 'src/common/entities/session.entity';
import { User } from 'src/common/entities/user.entity';

export const AppDataSource = createPostgresDataSource(
  [User, Session],
  ['libs/db/migrations/user-service/*.ts'],
);
