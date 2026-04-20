"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const db_1 = require("../../../libs/db/src");
const order_entity_1 = require("./orders/entities/order.entity");
const order_item_entity_1 = require("./orders/entities/order-item.entity");
exports.AppDataSource = (0, db_1.createPostgresDataSource)([order_entity_1.Order, order_item_entity_1.OrderItem], ['libs/db/migrations/order-service/*.ts']);
//# sourceMappingURL=data-source.js.map