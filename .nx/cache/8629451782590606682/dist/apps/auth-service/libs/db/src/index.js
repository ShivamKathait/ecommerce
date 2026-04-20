"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostgresDataSource = createPostgresDataSource;
require("dotenv/config");
const typeorm_1 = require("typeorm");
function createPostgresDataSource(entities) {
    const options = {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: +(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'strongpassword123',
        database: process.env.DB_NAME || 'learningPostgres',
        entities,
        synchronize: false,
        logging: true,
        migrations: [],
    };
    return new typeorm_1.DataSource(options);
}
//# sourceMappingURL=index.js.map