"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const express = require("express");
const app_module_1 = require("./app.module");
const proxy_1 = require("./proxy");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.use(express.json());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.use('/v1/users', (0, proxy_1.proxyToService)('user-service'));
    app.use('/v1/admin', (0, proxy_1.proxyToService)('admin-service'));
    app.use('/v1/vendors', (0, proxy_1.proxyToService)('vendor-service'));
    app.use('/v1/product', (0, proxy_1.proxyToService)('catalog-service'));
    app.use('/v1/inventory', (0, proxy_1.proxyToService)('inventory-service'));
    app.use('/v1/payment', (0, proxy_1.proxyToService)('payment-service'));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Ecommerce API Gateway')
        .setDescription('Gateway entrypoint for the ecommerce microservices monorepo')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map