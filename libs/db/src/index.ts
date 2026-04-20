import 'dotenv/config';
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm';

type DataSourceEntities = Array<Function | string | EntitySchema>;
type DataSourceMigrations = Array<string | Function>;

export function createPostgresDataSource(
  entities: DataSourceEntities,
  migrations: DataSourceMigrations = [],
): DataSource {
  const options: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'strongpassword123',
    database: process.env.DB_NAME || 'learningPostgres',
    entities,
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
    migrations,
  };

  return new DataSource(options);
}
