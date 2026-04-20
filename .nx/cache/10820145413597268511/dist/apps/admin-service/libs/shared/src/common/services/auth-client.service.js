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
exports.AuthClientService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let AuthClientService = class AuthClientService {
    httpService;
    configService;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async loginAdmin(email, password) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.getBaseUrl()}/v1/auth/login/admin`, {
            email,
            password,
        }));
        return response.data;
    }
    async loginVendor(email, password) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.getBaseUrl()}/v1/auth/login/vendor`, {
            email,
            password,
        }));
        return response.data;
    }
    async updateUserRole(userId, role) {
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(`${this.getBaseUrl()}/v1/auth/users/${userId}/role`, { role }, { headers: this.getInternalHeaders() }));
        return response.data;
    }
    getBaseUrl() {
        return this.configService.get('AUTH_SERVICE_URL', 'http://localhost:3008');
    }
    getInternalHeaders() {
        const token = this.configService.get('INTERNAL_SERVICE_TOKEN');
        if (!token) {
            throw new Error('INTERNAL_SERVICE_TOKEN is not configured');
        }
        return { 'x-internal-token': token };
    }
};
exports.AuthClientService = AuthClientService;
exports.AuthClientService = AuthClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], AuthClientService);
//# sourceMappingURL=auth-client.service.js.map