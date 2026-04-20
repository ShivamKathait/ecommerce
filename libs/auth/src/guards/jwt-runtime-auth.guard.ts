import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRuntimeAuthGuard extends AuthGuard('jwt-runtime') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        message: 'Token expired',
        errorCode: 'TOKEN_EXPIRED',
      });
    }

    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException({
        message: 'Invalid token',
        errorCode: 'INVALID_TOKEN',
      });
    }

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid session or user',
        errorCode: 'INVALID_SESSION',
      });
    }

    return user;
  }
}
