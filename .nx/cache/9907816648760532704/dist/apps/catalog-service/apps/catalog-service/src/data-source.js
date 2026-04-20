"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const db_1 = require("../../../libs/db/src");
const product_entity_1 = require("./product/entities/product.entity");
exports.AppDataSource = (0, db_1.createPostgresDataSource)([product_entity_1.Product], ['libs/db/migrations/catalog-service/*.ts']);
//# sourceMappingURL=data-source.js.map