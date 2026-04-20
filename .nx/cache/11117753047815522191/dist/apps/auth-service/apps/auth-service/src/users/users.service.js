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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_validator_1 = require("class-validator");
const auth_1 = require("../../../../libs/auth/src");
const payment_client_service_1 = require("../../../../libs/shared/src/common/services/payment-client.service");
const user_entity_1 = require("../../../../libs/shared/src/common/entities/user.entity");
const utils_1 = require("../../../../libs/shared/src/common/utils");
const Errors = require("../../../../libs/shared/src/error-handler/error-service");
const response_dto_1 = require("./dto/response.dto");
let UsersService = UsersService_1 = class UsersService {
    userModel;
    authService;
    paymentClientService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(userModel, authService, paymentClientService) {
        this.userModel = userModel;
        this.authService = authService;
        this.paymentClientService = paymentClientService;
    }
    async register(createUserDto) {
        try {
            const { name, email, password } = createUserDto;
            const normalizedEmail = email.toLowerCase();
            const existingUser = await this.userModel.findOne({
                where: { email: normalizedEmail, is_deleted: false },
                select: { email: true, name: true },
            });
            if (existingUser) {
                throw new Errors.EmailExist();
            }
            const hashPassword = await this.authService.hashPassword(password);
            const user = await this.userModel.save({
                name,
                email: normalizedEmail,
                password: hashPassword,
                role: utils_1.Role.USER,
                created_at: new Date(),
            });
            await this.authService.generateOtpForUser(user.id);
            const access_token = await this.authService.generateTempToken(user.id, user.email, user.role);
            return { access_token };
        }
        catch (error) {
            this.logger.error('register failed', error?.stack ?? String(error));
            throw error;
        }
    }
    async verify_otp(dto, user) {
        try {
            const { otp } = dto;
            const fetch_user = await this.userModel.findOne({
                where: { id: user.id },
                select: { id: true, name: true, email: true, otp: true, otp_expire_at: true },
            });
            if (!fetch_user) {
                throw new Errors.UserNotFound();
            }
            if (fetch_user.otp_expire_at && new Date(fetch_user.otp_expire_at) < new Date()) {
                throw new Errors.OtpExipred();
            }
            if (Number(fetch_user.otp) !== Number(otp)) {
                throw new Errors.InvalidOtp();
            }
            const cus_id = await this.paymentClientService.createCustomer(fetch_user.name, fetch_user.email);
            await this.userModel.update(user.id, {
                otp_expire_at: null,
                otp: null,
                is_email_verified: true,
                stripe_customer_id: cus_id,
            });
            await this.authService.clearUserCache(user.id);
            return { data: { message: 'Otp verified successfully.' } };
        }
        catch (error) {
            this.logger.error('verify_otp failed', error?.stack ?? String(error));
            throw error;
        }
    }
    async login(dto) {
        try {
            const { email, password } = dto;
            const normalizedEmail = email.toLowerCase();
            let isUser = await this.userModel.findOne({
                where: { email: normalizedEmail, is_deleted: false, role: utils_1.Role.USER },
            });
            if (!isUser) {
                throw new Errors.UserNotExist();
            }
            isUser = { ...isUser };
            if (isUser.is_email_verified === false) {
                const access_token = await this.authService.generateTempToken(isUser.id, isUser.email, isUser.role);
                await this.authService.generateOtpForUser(isUser.id);
                return { data: { is_email_verified: isUser.is_email_verified, access_token } };
            }
            const isPassword = await this.authService.compareHash(password, isUser.password);
            if (!isPassword) {
                throw new Errors.IncorrectCreds();
            }
            const session = await this.authService.createSession(isUser.id, isUser.role);
            const access_token = await this.authService.generateToken(isUser.id, session.id, isUser.email, isUser.role);
            await this.authService.clearUserCache(isUser.id);
            await this.authService.cacheUserSession(isUser, session.id.toString());
            const response = new response_dto_1.ResponseUserDto({ ...isUser, access_token });
            await (0, class_validator_1.validate)(response, { whitelist: true });
            return { data: { message: 'Login successfully.', ...response } };
        }
        catch (error) {
            this.logger.error('login failed', error?.stack ?? String(error));
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_1.AuthService,
        payment_client_service_1.PaymentClientService])
], UsersService);
//# sourceMappingURL=users.service.js.map