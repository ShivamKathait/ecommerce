"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapHttpService = bootstrapHttpService;
exports.createHealthPayload = createHealthPayload;
exports.createReadinessPayload = createReadinessPayload;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_config_1 = require("../../common-config/src");
const APP_VERSION = process.env.npm_package_version ?? '0.0.1';
async function bootstrapHttpService(module, serviceName, options = {}) {
    const app = await core_1.NestFactory.create(module, {
        rawBody: options.rawBody,
    });
    const config = (0, common_config_1.getServiceConfig)(serviceName);
    const logger = new common_1.Logger(serviceName);
    const corsOrigins = (process.env.CORS_ORIGINS ?? '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.enableCors({
        origin: corsOrigins.length > 0 ? corsOrigins : true,
        credentials: true,
    });
    if (process.env.TRUST_PROXY === 'true') {
        app.set('trust proxy', 1);
    }
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.enableShutdownHooks();
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const isProduction = process.env.NODE_ENV === 'production';
    const enableSwagger = process.env.ENABLE_SWAGGER === 'true' || !isProduction;
    if (enableSwagger) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle(`${serviceName} API`)
            .setDescription(`${serviceName} service in the ecommerce monorepo`)
            .setVersion('1.0')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    await app.listen(config.port);
    logger.log(`${serviceName} listening on http://localhost:${config.port}`);
    if (enableSwagger) {
        logger.log(`${serviceName} docs available at http://localhost:${config.port}/api/docs`);
    }
}
function createHealthPayload(serviceName) {
    return {
        service: serviceName,
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        version: APP_VERSION,
    };
}
function createReadinessPayload(serviceName) {
    return {
        service: serviceName,
        status: 'ready',
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=index.js.map