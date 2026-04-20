"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const typeorm_1 = require("@nestjs/typeorm");
const auth_1 = require("../../../../libs/auth/src");
const user_entity_1 = require("../../../../libs/shared/src/common/entities/user.entity");
const session_entity_1 = require("../../../../libs/shared/src/common/entities/session.entity");
const payment_client_service_1 = require("../../../../libs/shared/src/common/services/payment-client.service");
const jwt_1 = require("@nestjs/jwt");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, session_entity_1.Session]),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, auth_1.AuthService, jwt_1.JwtService, payment_client_service_1.PaymentClientService],
        exports: [users_service_1.UsersService]
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map