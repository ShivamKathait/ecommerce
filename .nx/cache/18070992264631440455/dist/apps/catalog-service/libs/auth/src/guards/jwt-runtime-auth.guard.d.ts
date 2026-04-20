import { ExecutionContext } from '@nestjs/common';
declare const JwtRuntimeAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtRuntimeAuthGuard extends JwtRuntimeAuthGuard_base {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
}
export {};
