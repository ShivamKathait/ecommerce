"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRuntimeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../shared/src/common/entities/user.entity");
const session_entity_1 = require("../../shared/src/common/entities/session.entity");
const auth_service_1 = require("./auth.service");
const jwt_runtime_strategy_1 = require("./strategies/jwt-runtime.strategy");
const temp_runtime_strategy_1 = require("./strategies/temp-runtime.strategy");
const jwt_runtime_auth_guard_1 = require("./guards/jwt-runtime-auth.guard");
const temp_runtime_auth_guard_1 = require("./guards/temp-runtime-auth.guard");
let AuthRuntimeModule = class AuthRuntimeModule {
};
exports.AuthRuntimeModule = AuthRuntimeModule;
exports.AuthRuntimeModule = AuthRuntimeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, session_entity_1.Session])],
        providers: [
            auth_service_1.AuthService,
            jwt_runtime_strategy_1.JwtRuntimeStrategy,
            temp_runtime_strategy_1.TempRuntimeStrategy,
            jwt_runtime_auth_guard_1.JwtRuntimeAuthGuard,
            temp_runtime_auth_guard_1.TempRuntimeAuthGuard,
        ],
        exports: [auth_service_1.AuthService, jwt_runtime_auth_guard_1.JwtRuntimeAuthGuard, temp_runtime_auth_guard_1.TempRuntimeAuthGuard],
    })
], AuthRuntimeModule);
//# sourceMappingURL=auth-runtime.module.js.map