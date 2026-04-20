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
        try {
            let { business_name, gst_number } = createVendorDto;
            const query = { where: { user_id: user.id } };
            const is_vendor = await this.vendorProfile.findOne(query);
            if (is_vendor && is_vendor.vendor_status === utils_1.VenderStatus.APPPROVED) {
                throw new Errors.AlreadyVendor();
            }
            const account_id = await this.paymentClientService.createConnectAccount(user.email);
            let save_data = { business_name, gst_number, stripe_connect_id: account_id, user_id: user.id };
            let vendor = await this.vendorProfile.save(save_data);
            let link = await this.paymentClientService.generateOnboardingLink(account_id, vendor.id);
            return { link };
        }
        catch (error) {
            throw error;
        }
    }
    async refresh_onboarding(req, res) {
        try {
            const vendorId = req.params.vendor_id;
            const vendor = await this.vendorProfile.findOne({ where: { id: +vendorId } });
            if (!vendor)
                return;
            let link = await this.paymentClientService.generateOnboardingLink(vendor.stripe_connect_id, vendor.id);
            return { link };
        }
        catch (error) {
            throw error;
        }
    }
    async complete_onboarding(req, res) {
        try {
            const vendorId = req.params.vendor_id;
            if (!vendorId) {
                return res.redirect(`${process.env.FRONTEND_URL}/vendor/onboarding-result?success=false`);
            }
            const vendor = await this.vendorProfile.findOne({ where: { id: +vendorId } });
            if (!vendor) {
                return res.redirect(`${process.env.FRONTEND_URL}/vendor/onboarding-result?success=false`);
            }
            const account = await this.paymentClientService.retrieveConnectAccount(vendor.stripe_connect_id);
            const isComplete = account.details_submitted && account.charges_enabled && account.payouts_enabled;
            let update = { vendor_status: isComplete ? utils_1.VenderStatus.APPPROVED : utils_1.VenderStatus.PENDING };
            await this.vendorProfile.update({ id: vendor.id }, update);
            if (isComplete) {
                await this.authClientService.updateUserRole(vendor.user_id, utils_1.Role.VENDOR);
            }
            return res.redirect(`${process.env.FRONTEND_URL}/vendor/onboarding-result?success=${isComplete}`);
        }
        catch (error) {
            return res.redirect(`${process.env.FRONTEND_URL}/vendor/onboarding-result?success=false`);
        }
    }
    async login(dto) {
        return this.authClientService.loginVendor(dto.email, dto.password);
    }
};
exports.VendorsService = VendorsService;
__decorate([
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VendorsService.prototype, "refresh_onboarding", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VendorsService.prototype, "complete_onboarding", null);
exports.VendorsService = VendorsService = VendorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_profile_entity_1.VendorProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        payment_client_service_1.PaymentClientService,
        auth_client_service_1.AuthClientService])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map