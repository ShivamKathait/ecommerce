"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const db_1 = require("../../../libs/db/src");
const session_entity_1 = require("../../../libs/shared/src/common/entities/session.entity");
const user_entity_1 = require("../../../libs/shared/src/common/entities/user.entity");
const vendor_profile_entity_1 = require("./vendors/entities/vendor-profile.entity");
exports.AppDataSource = (0, db_1.createPostgresDataSource)([user_entity_1.User, session_entity_1.Session, vendor_profile_entity_1.VendorProfile], ['apps/vendor-service/src/db/migrations/*.ts']);
//# sourceMappingURL=data-source.js.map