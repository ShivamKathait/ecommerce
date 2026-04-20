"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const db_1 = require("../../../libs/db/src");
const vendor_profile_entity_1 = require("./vendors/entities/vendor-profile.entity");
exports.AppDataSource = (0, db_1.createPostgresDataSource)([vendor_profile_entity_1.VendorProfile], ['libs/db/migrations/vendor-service/*.ts']);
//# sourceMappingURL=data-source.js.map