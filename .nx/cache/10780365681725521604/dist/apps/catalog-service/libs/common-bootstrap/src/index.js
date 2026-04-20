"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapHttpService = bootstrapHttpService;
exports.createHealthPayload = createHealthPayload;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_config_1 = require("../../common-config/src");
async function bootstrapHttpService(module, serviceName, options = {}) {
    const app = await core_1.NestFactory.create(module, {
        rawBody: options.rawBody,
    });
    const config = (0, common_config_1.getServiceConfig)(serviceName);
    app.enableCors();
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle(`${serviceName} API`)
        .setDescription(`${serviceName} service in the ecommerce monorepo`)
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(config.port);
}
function createHealthPayload(serviceName) {
    return {
        service: serviceName,
        status: 'ok',
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=index.js.map