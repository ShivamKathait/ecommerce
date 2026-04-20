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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_connect_account_dto_1 = require("./dto/create-connect-account.dto");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const create_onboarding_link_dto_1 = require("./dto/create-onboarding-link.dto");
const payment_service_1 = require("./payment.service");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createCustomer(dto) {
        const customerId = await this.paymentService.createCustomer(dto.name, dto.email);
        return { data: { customerId } };
    }
    async createConnectAccount(dto) {
        const accountId = await this.paymentService.createConnectAccount(dto.email);
        return { data: { accountId } };
    }
    async getConnectAccount(accountId) {
        const account = await this.paymentService.retrieveConnectAccount(accountId);
        return { data: account };
    }
    async createOnboardingLink(accountId, dto) {
        const url = await this.paymentService.generateOnboardingLink(accountId, dto.vendorId);
        return { data: { url } };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('customers'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a Stripe customer' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Post)('connect/accounts'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a Stripe Connect account' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_connect_account_dto_1.CreateConnectAccountDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createConnectAccount", null);
__decorate([
    (0, common_1.Get)('connect/accounts/:accountId'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch a Stripe Connect account' }),
    __param(0, (0, common_1.Param)('accountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getConnectAccount", null);
__decorate([
    (0, common_1.Post)('connect/accounts/:accountId/onboarding-links'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a Stripe Connect onboarding link' }),
    __param(0, (0, common_1.Param)('accountId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_onboarding_link_dto_1.CreateOnboardingLinkDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createOnboardingLink", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payment'),
    (0, common_1.Controller)({ path: 'payment', version: '1' }),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map