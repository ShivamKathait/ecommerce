"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRuntimeAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let JwtRuntimeAuthGuard = class JwtRuntimeAuthGuard extends (0, passport_1.AuthGuard)('jwt-runtime') {
    handleRequest(err, user, info, context) {
        if (info?.name === 'TokenExpiredError') {
            throw new common_1.UnauthorizedException({ message: 'Token expired', errorCode: 'TOKEN_EXPIRED' });
        }
        if (info?.name === 'JsonWebTokenError') {
            throw new common_1.UnauthorizedException({ message: 'Invalid token', errorCode: 'INVALID_TOKEN' });
        }
        if (!user) {
            throw new common_1.UnauthorizedException({ message: 'Invalid session or user', errorCode: 'INVALID_SESSION' });
        }
        return user;
    }
};
exports.JwtRuntimeAuthGuard = JwtRuntimeAuthGuard;
exports.JwtRuntimeAuthGuard = JwtRuntimeAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtRuntimeAuthGuard);
//# sourceMappingURL=jwt-runtime-auth.guard.js.map