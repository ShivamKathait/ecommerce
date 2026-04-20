import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response, json, urlencoded } from 'express';
import {
  ServiceHealthResponse,
  ServiceReadinessResponse,
} from '@ecommerce/contracts';
import { getServiceConfig } from '@ecommerce/common-config';
interface BootstrapHttpOptions {
  rawBody?: boolean;
}

const APP_VERSION = process.env.npm_package_version ?? '0.0.1';

export async function bootstrapHttpService(
  module: unknown,
  serviceName: string,
  options: BootstrapHttpOptions = {},
): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(
    module as never,
    {
      rawBody: options.rawBody,
    },
  );
  const config = getServiceConfig(serviceName);
  const logger = new Logger(serviceName);

  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  });
  app.disable('x-powered-by');
  app.use(json({ limit: process.env.REQUEST_BODY_LIMIT ?? '1mb' }));
  app.use(
    urlencoded({
      extended: true,
      limit: process.env.REQUEST_BODY_LIMIT ?? '1mb',
    }),
  );
  app.use((_: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()',
    );
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload',
      );
    }
    next();
  });
  if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
  }
  app.enableVersioning({ type: VersioningType.URI });
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const isProduction = process.env.NODE_ENV === 'production';
  const enableSwagger = process.env.ENABLE_SWAGGER === 'true' || !isProduction;
  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(`${serviceName} API`)
      .setDescription(`${serviceName} service in the ecommerce monorepo`)
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(config.port);

  logger.log(`${serviceName} listening on http://localhost:${config.port}`);
  if (enableSwagger) {
    logger.log(
      `${serviceName} docs available at http://localhost:${config.port}/api/docs`,
    );
  }
}

export function createHealthPayload(
  serviceName: string,
): ServiceHealthResponse {
  return {
    service: serviceName,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: APP_VERSION,
  };
}

export function createReadinessPayload(
  serviceName: string,
): ServiceReadinessResponse {
  return {
    service: serviceName,
    status: 'ready',
    timestamp: new Date().toISOString(),
  };
}
