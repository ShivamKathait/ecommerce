import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class InternalServiceGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const rawToken = request.headers['x-internal-token'];
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
    const expected = this.configService.get<string>('INTERNAL_SERVICE_TOKEN');

    if (!expected) {
      throw new BadRequestException({
        message: 'INTERNAL_SERVICE_TOKEN is not configured',
      });
    }
    if (!token || token !== expected) {
      throw new UnauthorizedException({
        message: 'Invalid internal service token',
      });
    }

    return true;
  }
}
