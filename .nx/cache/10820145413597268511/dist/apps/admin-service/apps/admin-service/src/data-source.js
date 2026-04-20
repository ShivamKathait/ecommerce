"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const db_1 = require("../../../libs/db/src");
exports.AppDataSource = (0, db_1.createPostgresDataSource)([], ['libs/db/migrations/admin-service/*.ts']);
//# sourceMappingURL=data-source.js.map