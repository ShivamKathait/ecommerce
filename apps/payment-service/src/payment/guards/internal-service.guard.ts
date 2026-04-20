import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalServiceGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-internal-token'] as string | undefined;
    const expected = this.configService.get<string>('INTERNAL_SERVICE_TOKEN');

    if (!expected) {
      throw new UnauthorizedException({
        message: 'INTERNAL_SERVICE_TOKEN is not configured',
        errorCode: 'INTERNAL_TOKEN_MISSING',
      });
    }

    if (!token || token !== expected) {
      throw new UnauthorizedException({
        message: 'Invalid internal service token',
        errorCode: 'INVALID_INTERNAL_TOKEN',
      });
    }

    return true;
  }
}

