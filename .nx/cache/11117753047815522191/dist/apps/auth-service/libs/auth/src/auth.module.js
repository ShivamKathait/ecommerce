"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const temp_auth_guard_1 = require("./guards/temp-auth.guard");
const temp_jwt_strategy_1 = require("./strategies/temp-jwt.strategy");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../shared/src/common/entities/user.entity");
const session_entity_1 = require("../../shared/src/common/entities/session.entity");
const auth_service_1 = require("./auth.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_ACCESS_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_ACCESS_EXPIRY', '15m'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, session_entity_1.Session])
        ],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, temp_jwt_strategy_1.TempStrategy, jwt_auth_guard_1.JwtAuthGuard, temp_auth_guard_1.TempAuthGuard, roles_guard_1.RolesGuard],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule, passport_1.PassportModule, jwt_auth_guard_1.JwtAuthGuard, temp_auth_guard_1.TempAuthGuard, roles_guard_1.RolesGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map