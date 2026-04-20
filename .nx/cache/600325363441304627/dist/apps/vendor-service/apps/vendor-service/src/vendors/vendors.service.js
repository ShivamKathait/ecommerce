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
var VendorsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vendor_profile_entity_1 = require("./entities/vendor-profile.entity");
const typeorm_2 = require("typeorm");
const utils_1 = require("../../../../libs/shared/src/common/utils");
const Errors = require("../../../../libs/shared/src/error-handler/error-service");
const payment_client_service_1 = require("../../../../libs/shared/src/common/services/payment-client.service");
const auth_client_service_1 = require("../../../../libs/shared/src/common/services/auth-client.service");
let VendorsService = VendorsService_1 = class VendorsService {
    vendorProfile;
    paymentClientService;
    authClientService;
    logger = new common_1.Logger(VendorsService_1.name);
    constructor(vendorProfile, paymentClientService, authClientService) {
        this.vendorProfile = vendorProfile;
        this.paymentClientService = paymentClientService;
        this.authClientService = authClientService;
    }
    async register(createVendorDto, user) {
        const { business_name, gst_number } = createVendorDto;
        const query = { where: { user_id: user.id } };
        const isVendor = await this.vendorProfile.findOne(query);
        if (isVendor && isVendor.vendor_status === utils_1.VenderStatus.APPPROVED) {
            throw new Errors.AlreadyVendor();
        }
        const accountId = await this.paymentClientService.createConnectAccount(user.email, user.id);
        const saveData = {
            business_name,
            gst_number,
            stripe_connect_id: accountId,
            user_id: user.id,
        };
        const vendor = await this.vendorProfile.save(saveData);
        const link = await this.paymentClientService.generateOnboardingLink(accountId, vendor.id, vendor.user_id);
        return { link };
    }
    async refresh_onboarding(vendorId) {
        const vendor = await this.vendorProfile.findOne({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new Errors.VendorNotExist();
        }
        const link = await this.paymentClientService.generateOnboardingLink(vendor.stripe_connect_id, vendor.id, vendor.user_id);
        return { link };
    }
    async complete_onboarding(vendorId) {
        const vendor = await this.vendorProfile.findOne({
            where: { id: vendorId },
        });
        const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
        if (!vendor) {
            return `${frontendUrl}/vendor/onboarding-result?success=false`;
        }
        const account = await this.paymentClientService.retrieveConnectAccount(vendor.stripe_connect_id);
        const isComplete = !!account.details_submitted &&
            !!account.charges_enabled &&
            !!account.payouts_enabled;
        const update = {
            vendor_status: isComplete ? utils_1.VenderStatus.APPPROVED : utils_1.VenderStatus.PENDING,
        };
        await this.vendorProfile.update({ id: vendor.id }, update);
        if (isComplete) {
            await this.authClientService.updateUserRole(vendor.user_id, utils_1.Role.VENDOR);
        }
        return `${frontendUrl}/vendor/onboarding-result?success=${isComplete}`;
    }
    async login(dto) {
        return this.authClientService.loginVendor(dto.email, dto.password);
    }
    async getMyVendorProfile(userId) {
        const vendor = await this.vendorProfile.findOne({ where: { user_id: userId } });
        if (!vendor) {
            throw new Errors.VendorNotExist();
        }
        return { data: vendor };
    }
    async getVendorById(vendorId) {
        const vendor = await this.vendorProfile.findOne({ where: { id: vendorId } });
        if (!vendor) {
            throw new Errors.VendorNotExist();
        }
        return { data: vendor };
    }
    async listVendors(dto) {
        const page = Math.max(dto.page ?? 1, 1);
        const limit = Math.max(Math.min(dto.limit ?? 20, 100), 1);
        const skip = (page - 1) * limit;
        const where = dto.status ? { vendor_status: dto.status } : {};
        const [items, total] = await this.vendorProfile.findAndCount({
            where,
            order: { created_at: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = VendorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_profile_entity_1.VendorProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        payment_client_service_1.PaymentClientService,
        auth_client_service_1.AuthClientService])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map