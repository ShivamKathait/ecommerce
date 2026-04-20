"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempRuntimeStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_2 = require("@nestjs/common");
const user_entity_1 = require("../../../shared/src/common/entities/user.entity");
let TempRuntimeStrategy = class TempRuntimeStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'temp-jwt-runtime') {
    configService;
    userModel;
    cacheManager;
    constructor(configService, userModel, cacheManager) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_ACCESS_TEMP_SECRET'),
        });
        this.configService = configService;
        this.userModel = userModel;
        this.cacheManager = cacheManager;
    }
    async validate(payload) {
        const userId = payload?.id;
        if (!userId) {
            return null;
        }
        const cacheKey = `auth:runtime:temp-user:${userId}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const user = await this.userModel.findOne({
            where: { id: userId, is_deleted: false },
            select: { id: true, email: true, role: true, is_email_verified: true },
        });
        if (!user) {
            return null;
        }
        await this.cacheManager.set(cacheKey, user, this.configService.get('REDIS_TTL', 3600) * 1000);
        return user;
    }
};
exports.TempRuntimeStrategy = TempRuntimeStrategy;
exports.TempRuntimeStrategy = TempRuntimeStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, common_2.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository, Object])
], TempRuntimeStrategy);
//# sourceMappingURL=temp-runtime.strategy.js.map