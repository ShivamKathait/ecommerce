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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const cache_manager_1 = require("@nestjs/cache-manager");
const user_entity_1 = require("../../shared/src/common/entities/user.entity");
const session_entity_1 = require("../../shared/src/common/entities/session.entity");
const crypto = require("crypto");
let AuthService = AuthService_1 = class AuthService {
    jwtService;
    configService;
    userModel;
    sessionModel;
    cacheManager;
    logger = new common_1.Logger(AuthService_1.name);
    JWT_ACCESS_SECRET;
    JWT_ACCESS_EXPIRY;
    JWT_ACCESS_TEMP_SECRET;
    JWT_ACCESS_TEMP_EXPIRY;
    BCRYPT_SALT_ROUNDS;
    constructor(jwtService, configService, userModel, sessionModel, cacheManager) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userModel = userModel;
        this.sessionModel = sessionModel;
        this.cacheManager = cacheManager;
        this.JWT_ACCESS_SECRET =
            this.configService.get('JWT_ACCESS_SECRET');
        this.JWT_ACCESS_EXPIRY =
            this.configService.get('JWT_ACCESS_EXPIRY');
        this.JWT_ACCESS_TEMP_SECRET = this.configService.get('JWT_ACCESS_TEMP_SECRET');
        this.JWT_ACCESS_TEMP_EXPIRY = this.configService.get('JWT_ACCESS_TEMP_EXPIRY');
        this.BCRYPT_SALT_ROUNDS =
            this.configService.get('BCRYPT_SALT_ROUNDS');
    }
    async hashPassword(password) {
        return await bcrypt.hash(password, +this.BCRYPT_SALT_ROUNDS);
    }
    async compareHash(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    async generateToken(id, session_id, email, role) {
        return this.jwtService.sign({ id, email, role, session_id }, { secret: this.JWT_ACCESS_SECRET, expiresIn: this.JWT_ACCESS_EXPIRY });
    }
    async generateTempToken(id, email, role) {
        return this.jwtService.sign({ id, email, role }, {
            secret: this.JWT_ACCESS_TEMP_SECRET,
            expiresIn: this.JWT_ACCESS_TEMP_EXPIRY,
        });
    }
    async createSession(user_id, role) {
        return await this.sessionModel.save({
            user: { id: user_id },
            role: role,
        });
    }
    async clearUserCache(userId) {
        const tempCacheKey = `auth:temp-user:${userId}`;
        await this.cacheManager.del(tempCacheKey);
        const sessionPattern = `auth:user:${userId}:session:*`;
        const store = this.cacheManager.store;
        if (store && typeof store.keys === 'function') {
            const keys = await store.keys(sessionPattern);
            if (keys && keys.length > 0) {
                await Promise.all(keys.map((key) => this.cacheManager.del(key)));
            }
        }
    }
    async generateOtpForUser(user_id) {
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpDetails = {
            otp,
            otp_expire_at: new Date(new Date().getTime() + 5 * 60000),
        };
        await this.userModel.update({ id: user_id }, otpDetails);
        await this.clearUserCache(user_id);
        return otp;
    }
    async cacheUserSession(user, sessionId) {
        const cacheKey = `auth:user:${user.id}:session:${sessionId}`;
        const sessionData = {
            id: user.id,
            email: user.email,
            role: user.role,
            sessionId,
        };
        await this.cacheManager.set(cacheKey, sessionData, this.configService.get('REDIS_TTL', 3600) * 1000);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(4, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map