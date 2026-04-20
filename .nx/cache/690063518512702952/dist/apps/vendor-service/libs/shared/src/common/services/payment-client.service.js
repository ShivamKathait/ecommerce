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
let PaymentClientService = class PaymentClientService {
    httpService;
    configService;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async createCustomer(name, email) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.getBaseUrl()}/v1/payment/customers`, {
            name,
            email,
        }));
        return response.data.data.customerId;
    }
    async createConnectAccount(email) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.getBaseUrl()}/v1/payment/connect/accounts`, {
            email,
        }));
        return response.data.data.accountId;
    }
    async retrieveConnectAccount(accountId) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.getBaseUrl()}/v1/payment/connect/accounts/${accountId}`));
        return response.data.data;
    }
    async generateOnboardingLink(accountId, vendorId) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.getBaseUrl()}/v1/payment/connect/accounts/${accountId}/onboarding-links`, { vendorId }));
        return response.data.data.url;
    }
    getBaseUrl() {
        return this.configService.get('PAYMENT_SERVICE_URL', 'http://localhost:3006');
    }
};
exports.PaymentClientService = PaymentClientService;
exports.PaymentClientService = PaymentClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], PaymentClientService);
//# sourceMappingURL=payment-client.service.js.map