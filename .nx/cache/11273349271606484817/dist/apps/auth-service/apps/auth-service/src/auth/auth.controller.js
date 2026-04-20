"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthApiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../libs/auth/src");
const utils_1 = require("../../../../libs/shared/src/common/utils");
const auth_dto_1 = require("./dto/auth.dto");
const auth_service_1 = require("./auth.service");
let AuthApiController = class AuthApiController {
    authApiService;
    constructor(authApiService) {
        this.authApiService = authApiService;
    }
    register(dto) {
        return this.authApiService.register(dto);
    }
    verify_otp(dto, req) {
        return this.authApiService.verify_otp(dto, req.user);
    }
    login(dto) {
        return this.authApiService.login(dto);
    }
    loginAdmin(dto) {
        return this.authApiService.loginAdmin(dto);
    }
    loginVendor(dto) {
        return this.authApiService.loginVendor(dto);
    }
    updateUserRole(req, dto) {
        const userId = Number(req.params.id);
        return this.authApiService.updateUserRole(userId, dto.role);
    }
};
exports.AuthApiController = AuthApiController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], AuthApiController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER),
    (0, common_1.UseGuards)(auth_1.TempRuntimeAuthGuard, auth_1.RolesGuard),
    (0, common_1.Patch)('verify/otp'),
    (0, swagger_1.ApiConsumes)('application/json', 'application/x-www-form-urlencoded'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Otp Api' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.OtpDto, Object]),
    __metadata("design:returntype", void 0)
], AuthApiController.prototype, "verify_otp", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiConsumes)('application/json', 'application/x-www-form-urlencoded'),
    (0, swagger_1.ApiOperation)({ summary: 'Login Api' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthApiController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('login/admin'),
    (0, swagger_1.ApiConsumes)('application/json', 'application/x-www-form-urlencoded'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin Login Api' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthApiController.prototype, "loginAdmin", null);
__decorate([
    (0, common_1.Post)('login/vendor'),
    (0, swagger_1.ApiConsumes)('application/json', 'application/x-www-form-urlencoded'),
    (0, swagger_1.ApiOperation)({ summary: 'Vendor Login Api' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthApiController.prototype, "loginVendor", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Update User Role Api' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", void 0)
], AuthApiController.prototype, "updateUserRole", null);
exports.AuthApiController = AuthApiController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)({ path: 'auth', version: '1' }),
    __metadata("design:paramtypes", [auth_service_1.AuthApiService])
], AuthApiController);
//# sourceMappingURL=auth.controller.js.map