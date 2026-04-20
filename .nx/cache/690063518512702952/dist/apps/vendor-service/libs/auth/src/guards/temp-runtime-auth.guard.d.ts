import { ExecutionContext } from '@nestjs/common';
declare const TempRuntimeAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class TempRuntimeAuthGuard extends TempRuntimeAuthGuard_base {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
}
export {};
