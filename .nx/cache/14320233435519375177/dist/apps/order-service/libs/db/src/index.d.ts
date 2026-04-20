import 'dotenv/config';
import { DataSource, EntitySchema } from 'typeorm';
type DataSourceEntities = Array<Function | string | EntitySchema>;
type DataSourceMigrations = Array<string | Function>;
export declare function createPostgresDataSource(entities: DataSourceEntities, migrations?: DataSourceMigrations): DataSource;
export {};
