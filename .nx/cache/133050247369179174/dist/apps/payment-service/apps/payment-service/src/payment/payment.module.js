"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_stripe_1 = require("@golevelup/nestjs-stripe");
const path_1 = require("path");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
const internal_service_guard_1 = require("./guards/internal-service.guard");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [(0, path_1.join)(process.cwd(), 'apps/payment-service/.env'), '.env'],
            }),
            nestjs_stripe_1.StripeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const apiKey = configService.get('STRIPE_SECRET_API_KEY');
                    if (!apiKey) {
                        throw new Error('STRIPE_SECRET_API_KEY is not defined in the configuration');
                    }
                    return {
                        apiKey,
                        apiVersion: '2025-12-15.clover',
                        webhookConfig: {
                            stripeSecrets: {
                                account: configService.get('STRIPE_WEBHOOK_SECRET_ACCOUNT', ''),
                                accountTest: configService.get('STRIPE_WEBHOOK_SECRET_ACCOUNT', ''),
                                connect: configService.get('STRIPE_WEBHOOK_SECRET_CONNECT', ''),
                                connectTest: configService.get('STRIPE_WEBHOOK_SECRET_CONNECT', ''),
                            },
                            requestBodyProperty: 'rawBody',
                        },
                    };
                },
            }),
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService, internal_service_guard_1.InternalServiceGuard],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map