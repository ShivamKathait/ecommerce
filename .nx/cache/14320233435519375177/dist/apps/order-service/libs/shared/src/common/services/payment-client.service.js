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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentClientService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const crypto_1 = require("crypto");
let PaymentClientService = class PaymentClientService {
    httpService;
    configService;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async createCustomer(name, email) {
        const idempotencyKey = this.buildDeterministicKey('payment-customer', email.toLowerCase());
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.getBaseUrl()}/v1/payment/customers`, {
            name,
            email,
        }, {
            headers: this.getInternalHeaders(idempotencyKey),
        }));
        return response.data.data.customerId;
    }
    async createConnectAccount(email, userId) {
        const idempotencyKey = this.buildDeterministicKey('payment-connect-account', `${email.toLowerCase()}:${userId}`);
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.getBaseUrl()}/v1/payment/connect/accounts`, {
            email,
            userId,
        }, { headers: this.getInternalHeaders(idempotencyKey) }));
        return response.data.data.accountId;
    }
    async retrieveConnectAccount(accountId) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.getBaseUrl()}/v1/payment/connect/accounts/${accountId}`));
        return response.data.data;
    }
    async generateOnboardingLink(accountId, vendorId, userId) {
        const idempotencyKey = this.buildDeterministicKey('payment-onboarding-link', `${accountId}:${vendorId}:${userId}`);
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.getBaseUrl()}/v1/payment/connect/accounts/${accountId}/onboarding-links`, { vendorId, userId }, { headers: this.getInternalHeaders(idempotencyKey) }));
        return response.data.data.url;
    }
    async createPaymentIntent(amount, currency, orderId, userId, customerId) {
        const idempotencyKey = this.buildDeterministicKey('payment-intent', `${orderId}:${userId}:${amount}:${currency.toLowerCase()}`);
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.getBaseUrl()}/v1/payment/intents`, { amount, currency, orderId, userId, customerId }, { headers: this.getInternalHeaders(idempotencyKey) }));
        return response.data.data;
    }
    async retrievePaymentIntent(paymentIntentId) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.getBaseUrl()}/v1/payment/intents/${paymentIntentId}`, { headers: this.getInternalHeaders() }));
        return response.data.data;
    }
    getBaseUrl() {
        return this.configService.get('PAYMENT_SERVICE_URL', 'http://localhost:3006');
    }
    getInternalHeaders(idempotencyKey) {
        const token = this.configService.get('INTERNAL_SERVICE_TOKEN');
        if (!token) {
            throw new Error('INTERNAL_SERVICE_TOKEN is not configured');
        }
        const headers = {
            'x-internal-token': token,
        };
        if (idempotencyKey) {
            headers['idempotency-key'] = idempotencyKey;
        }
        return headers;
    }
    buildDeterministicKey(namespace, value) {
        const hash = (0, crypto_1.createHash)('sha256').update(`${namespace}:${value}`).digest('hex');
        return `${namespace}:${hash.slice(0, 48)}`;
    }
};
exports.PaymentClientService = PaymentClientService;
exports.PaymentClientService = PaymentClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], PaymentClientService);
//# sourceMappingURL=payment-client.service.js.map