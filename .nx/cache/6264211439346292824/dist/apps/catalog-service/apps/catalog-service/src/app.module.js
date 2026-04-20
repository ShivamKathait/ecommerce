"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_1 = require("../../../libs/auth/src");
const app_controller_1 = require("./app.controller");
const session_entity_1 = require("../../../libs/shared/src/common/entities/session.entity");
const user_entity_1 = require("../../../libs/shared/src/common/entities/user.entity");
const rate_limit_guard_1 = require("../../../libs/shared/src/common/rate-limit.guard");
const handler_services_1 = require("../../../libs/shared/src/error-handler/handler.services");
const data_source_1 = require("./data-source");
const inventory_entity_1 = require("./inventory/entities/inventory.entity");
const product_entity_1 = require("./product/entities/product.entity");
const product_module_1 = require("./product/product.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, session_entity_1.Session, product_entity_1.Product, inventory_entity_1.Inventory]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: async (config) => ({
                    ...data_source_1.AppDataSource.options,
                    autoLoadEntities: true,
                    synchronize: config.get('NODE_ENV') !== 'production',
                    logging: config.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    throttlers: [
                        {
                            ttl: config.get('RATE_LIMIT_TTL', 60),
                            limit: config.get('RATE_LIMIT', 100),
                        },
                    ],
                }),
            }),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 5 * 60 * 1000,
                max: 100,
            }),
            auth_1.AuthModule,
            product_module_1.ProductModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            auth_1.JwtAuthGuard,
            auth_1.RolesGuard,
            auth_1.TempAuthGuard,
            auth_1.JwtStrategy,
            auth_1.TempStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: rate_limit_guard_1.RateLimitGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: handler_services_1.ErrorHandler,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map