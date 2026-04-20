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
exports.TempStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const user_entity_1 = require("../../../shared/src/common/entities/user.entity");
const session_entity_1 = require("../../../shared/src/common/entities/session.entity");
let TempStrategy = class TempStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'temp-jwt') {
    configService;
    adminModel;
    sessionModel;
    cacheManager;
    constructor(configService, adminModel, sessionModel, cacheManager) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_ACCESS_TEMP_SECRET")
        });
        this.configService = configService;
        this.adminModel = adminModel;
        this.sessionModel = sessionModel;
        this.cacheManager = cacheManager;
    }
    async validate(payload) {
        const userId = payload.id;
        const cacheKey = `auth:temp-user:${userId}`;
        const cachedUser = await this.cacheManager.get(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }
        const query = {
            where: { id: userId, is_deleted: false },
            select: { password: false }
        };
        const user = await this.adminModel.findOne(query);
        if (!user)
            return null;
        await this.cacheManager.set(cacheKey, user, 300000);
        return user;
    }
};
exports.TempStrategy = TempStrategy;
exports.TempStrategy = TempStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], TempStrategy);
//# sourceMappingURL=temp-jwt.strategy.js.map