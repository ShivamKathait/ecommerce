import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  protected errorMessage =
    'Too many requests from this IP, please try again later';

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
