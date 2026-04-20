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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Errors = require("../../../../libs/shared/src/error-handler/error-service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const class_validator_1 = require("class-validator");
const response_dto_1 = require("./dto/response.dto");
const auth_1 = require("../../../../libs/auth/src");
const user_entity_1 = require("../../../../libs/shared/src/common/entities/user.entity");
const session_entity_1 = require("../../../../libs/shared/src/common/entities/session.entity");
let AdminService = class AdminService {
    jwtService;
    configService;
    adminModel;
    sessionModel;
    authService;
    constructor(jwtService, configService, adminModel, sessionModel, authService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.adminModel = adminModel;
        this.sessionModel = sessionModel;
        this.authService = authService;
    }
    async login(dto) {
        try {
            let { email, password } = dto;
            let query = { where: { email: email.toLowerCase(), is_deleted: false }, };
            let isAdmin = await this.adminModel.findOne(query);
            if (!isAdmin)
                throw new Errors.AdminNotExist();
            isAdmin = { ...isAdmin };
            let isPassword = await this.authService.compareHash(password, isAdmin.password);
            if (!isPassword)
                throw new Errors.IncorrectCreds();
            let session = await this.authService.createSession(isAdmin.id, isAdmin.role);
            let access_token = await this.authService.generateToken(isAdmin.id, session.id, isAdmin.email, isAdmin.role);
            await this.authService.clearUserCache(isAdmin.id);
            await this.authService.cacheUserSession(isAdmin, session.id.toString());
            const userData = { ...isAdmin, access_token };
            const response = new response_dto_1.ResponseUserDto(userData);
            await (0, class_validator_1.validate)(response, { whitelist: true });
            let data = { message: "Login successfully.", ...response };
            return { data };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_1.AuthService])
], AdminService);
//# sourceMappingURL=admin.service.js.map