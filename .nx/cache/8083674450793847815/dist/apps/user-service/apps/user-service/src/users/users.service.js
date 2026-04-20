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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../../../../libs/shared/src/common/entities/user.entity");
const utils_1 = require("../../../../libs/shared/src/common/utils");
const Errors = require("../../../../libs/shared/src/error-handler/error-service");
const session_entity_1 = require("../../../../libs/shared/src/common/entities/session.entity");
const class_validator_1 = require("class-validator");
const response_dto_1 = require("./dto/response.dto");
const auth_1 = require("../../../../libs/auth/src");
const payment_client_service_1 = require("../../../../libs/shared/src/common/services/payment-client.service");
let UsersService = UsersService_1 = class UsersService {
    jwtService;
    configService;
    userModel;
    sessionModel;
    cacheManager;
    authService;
    paymentClientService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(jwtService, configService, userModel, sessionModel, cacheManager, authService, paymentClientService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userModel = userModel;
        this.sessionModel = sessionModel;
        this.cacheManager = cacheManager;
        this.authService = authService;
        this.paymentClientService = paymentClientService;
    }
    async register(createUserDto) {
        try {
            let { name, email, password } = createUserDto;
            const query = {
                where: { email: email.toLowerCase(), is_deleted: false },
                select: { email: true, name: true }
            };
            let isUser = await this.userModel.findOne(query);
            if (isUser)
                throw new Errors.EmailExist();
            let hashPassword = await this.authService.hashPassword(password);
            let data = {
                name,
                email: email.toLowerCase(),
                password: hashPassword,
                role: utils_1.Role.USER,
                created_at: new Date()
            };
            let user = await this.userModel.save(data);
            await this.authService.generateOtpForUser(user.id);
            let access_token = await this.authService.generateTempToken(user.id, user.email, user.role);
            return { access_token };
        }
        catch (error) {
            throw error;
        }
    }
    async verify_otp(dto, user) {
        try {
            const { otp } = dto;
            const query = {
                where: { id: user.id },
                select: { otp: true, otp_expire_at: true }
            };
            let fetch_user = await this.userModel.findOne(query);
            if (!fetch_user)
                throw new Errors.UserNotFound();
            if (fetch_user.otp_expire_at && new Date(fetch_user.otp_expire_at) < new Date()) {
                throw new Errors.OtpExipred();
            }
            if (Number(fetch_user.otp) !== Number(otp)) {
                throw new Errors.InvalidOtp();
            }
            let cus_id = await this.paymentClientService.createCustomer(fetch_user.name, fetch_user.email);
            let update = { otp_expire_at: null, otp: null, is_email_verified: true, stripe_customer_id: cus_id };
            await this.userModel.update(user.id, update);
            await this.authService.clearUserCache(user.id);
            let data = { message: "Otp verified successfully." };
            return { data };
        }
        catch (error) {
            throw error;
        }
    }
    async login(dto) {
        try {
            let { email, password } = dto;
            let query = { where: { email: email.toLowerCase(), is_deleted: false, role: utils_1.Role.USER }, };
            let isUser = await this.userModel.findOne(query);
            if (!isUser)
                throw new Errors.UserNotExist();
            isUser = { ...isUser };
            if (isUser.is_email_verified === false) {
                let access_token = await this.authService.generateTempToken(isUser.id, isUser.email, isUser.role);
                await this.authService.generateOtpForUser(isUser.id);
                let data = { is_email_verified: isUser.is_email_verified, access_token };
                return { data };
            }
            let isPassword = await this.authService.compareHash(password, isUser.password);
            if (!isPassword)
                throw new Errors.IncorrectCreds();
            let session = await this.authService.createSession(isUser.id, isUser.role);
            let access_token = await this.authService.generateToken(isUser.id, session.id, isUser.email, isUser.role);
            await this.authService.clearUserCache(isUser.id);
            await this.authService.cacheUserSession(isUser, session.id.toString());
            const userData = { ...isUser, access_token };
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
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_2.InjectRepository)(session_entity_1.Session)),
    __param(4, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_1.Repository,
        typeorm_1.Repository, Object, auth_1.AuthService,
        payment_client_service_1.PaymentClientService])
], UsersService);
//# sourceMappingURL=users.service.js.map