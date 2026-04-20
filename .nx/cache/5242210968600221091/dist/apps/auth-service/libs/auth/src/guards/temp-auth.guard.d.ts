import { ExecutionContext } from "@nestjs/common";
declare const TempAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class TempAuthGuard extends TempAuthGuard_base {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
}
export {};
