import 'dotenv/config';
import { DataSource, EntitySchema } from 'typeorm';
type DataSourceEntities = Array<Function | string | EntitySchema>;
export declare function createPostgresDataSource(entities: DataSourceEntities): DataSource;
export {};
