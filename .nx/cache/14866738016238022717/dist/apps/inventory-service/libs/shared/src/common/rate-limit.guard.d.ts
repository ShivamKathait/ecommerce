import { ThrottlerGuard } from '@nestjs/throttler';
export declare class RateLimitGuard extends ThrottlerGuard {
    protected errorMessage: string;
    protected getTracker(req: Record<string, any>): Promise<string>;
}
