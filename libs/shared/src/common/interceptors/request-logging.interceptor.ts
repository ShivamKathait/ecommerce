import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const requestId =
      (request.headers?.['x-request-id'] as string | undefined) ?? randomUUID();
    response.setHeader('x-request-id', requestId);

    const method = request.method;
    const url = request.originalUrl;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const latencyMs = Date.now() - startedAt;
          this.logger.log(
            `[${requestId}] ${method} ${url} ${response.statusCode} ${latencyMs}ms`,
          );
        },
        error: (error: unknown) => {
          const latencyMs = Date.now() - startedAt;
          const message =
            error instanceof Error ? error.message : 'Unhandled error';
          this.logger.error(
            `[${requestId}] ${method} ${url} ${response.statusCode} ${latencyMs}ms ${message}`,
          );
        },
      }),
    );
  }
}
