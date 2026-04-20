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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const nestjs_stripe_1 = require("@golevelup/nestjs-stripe");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
let PaymentService = PaymentService_1 = class PaymentService {
    stripe;
    configService;
    logger = new common_1.Logger(PaymentService_1.name);
    constructor(stripe, configService) {
        this.stripe = stripe;
        this.configService = configService;
    }
    handlePaymentIntentCompleted(event) {
        const paymentIntent = event.data.object;
        this.logger.log(`payment_intent.succeeded: ${paymentIntent.id}`);
    }
    handlePaymentIntentCancel(event) {
        const paymentIntent = event.data.object;
        this.logger.warn(`payment_intent.canceled: ${paymentIntent.id}`);
    }
    handlePaymentIntentFailed(event) {
        const paymentIntent = event.data.object;
        this.logger.error(`payment_intent.payment_failed: ${paymentIntent.id}`);
    }
    async createCustomer(name, email) {
        const customer = await this.stripe.customers.create({
            name,
            email,
        });
        return customer.id;
    }
    async createConnectAccount(email) {
        const account = await this.stripe.accounts.create({
            type: 'express',
            email,
        });
        return account.id;
    }
    async retrieveConnectAccount(accountId) {
        return this.stripe.accounts.retrieve(accountId);
    }
    async generateOnboardingLink(accountId, vendorId) {
        const apiBaseUrl = this.configService.get('API_BASE_URL', 'http://localhost:3001');
        const link = await this.stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${apiBaseUrl}/v1/vendors/refresh/${vendorId}`,
            return_url: `${apiBaseUrl}/v1/vendors/complete/${vendorId}`,
            type: 'account_onboarding',
        });
        return link.url;
    }
};
exports.PaymentService = PaymentService;
__decorate([
    (0, nestjs_stripe_1.StripeWebhookHandler)('payment_intent.succeeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentService.prototype, "handlePaymentIntentCompleted", null);
__decorate([
    (0, nestjs_stripe_1.StripeWebhookHandler)('payment_intent.canceled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentService.prototype, "handlePaymentIntentCancel", null);
__decorate([
    (0, nestjs_stripe_1.StripeWebhookHandler)('payment_intent.payment_failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentService.prototype, "handlePaymentIntentFailed", null);
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_stripe_1.InjectStripeClient)()),
    __metadata("design:paramtypes", [stripe_1.default,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map