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
const crypto_1 = require("crypto");
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
    async createCustomer(name, email, idempotencyKey) {
        const normalizedEmail = email.toLowerCase();
        const existing = await this.stripe.customers.list({
            email: normalizedEmail,
            limit: 1,
        });
        if (existing.data.length > 0) {
            return existing.data[0].id;
        }
        const customer = await this.stripe.customers.create({
            name,
            email: normalizedEmail,
        }, {
            idempotencyKey: idempotencyKey ?? this.buildDeterministicKey('customer', normalizedEmail),
        });
        return customer.id;
    }
    async createConnectAccount(email, userId, idempotencyKey) {
        const account = await this.stripe.accounts.create({
            type: 'express',
            email: email.toLowerCase(),
            metadata: {
                user_id: String(userId),
            },
        }, {
            idempotencyKey: idempotencyKey ??
                this.buildDeterministicKey('connect-account', `${email}:${userId}`),
        });
        return account.id;
    }
    async retrieveConnectAccount(accountId) {
        return this.stripe.accounts.retrieve(accountId);
    }
    async generateOnboardingLink(accountId, vendorId, userId) {
        const account = await this.stripe.accounts.retrieve(accountId);
        const ownerUserId = account.metadata?.user_id;
        if (ownerUserId && ownerUserId !== String(userId)) {
            throw new common_1.ForbiddenException('Account does not belong to the requested user');
        }
        const apiBaseUrl = this.configService.get('API_BASE_URL', 'http://localhost:3001');
        const link = await this.stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${apiBaseUrl}/v1/vendors/refresh/${vendorId}`,
            return_url: `${apiBaseUrl}/v1/vendors/complete/${vendorId}`,
            type: 'account_onboarding',
        });
        return link.url;
    }
    buildDeterministicKey(namespace, value) {
        const hash = (0, crypto_1.createHash)('sha256').update(`${namespace}:${value}`).digest('hex');
        return `${namespace}:${hash.slice(0, 48)}`;
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