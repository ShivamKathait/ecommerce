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
exports.VendorsController = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../../../../libs/auth/src");
const vendors_service_1 = require("./vendors.service");
const create_vendor_dto_1 = require("./dto/create-vendor.dto");
const swagger_1 = require("@nestjs/swagger");
const utils_1 = require("../../../../libs/shared/src/common/utils");
const login_dto_1 = require("./dto/login.dto");
const list_vendors_dto_1 = require("./dto/list-vendors.dto");
let VendorsController = class VendorsController {
    vendorsService;
    constructor(vendorsService) {
        this.vendorsService = vendorsService;
    }
    register(createVendorDto, req) {
        return this.vendorsService.register(createVendorDto, req.user);
    }
    login(dto) {
        return this.vendorsService.login(dto);
    }
    getMyVendorProfile(req) {
        return this.vendorsService.getMyVendorProfile(req.user.id);
    }
    listVendors(query) {
        return this.vendorsService.listVendors(query);
    }
    refresh(vendorId) {
        return this.vendorsService.refresh_onboarding(vendorId);
    }
    async complete(vendorId, res) {
        const redirectUrl = await this.vendorsService.complete_onboarding(vendorId);
        return res.redirect(redirectUrl);
    }
    getVendorById(vendorId) {
        return this.vendorsService.getVendorById(vendorId);
    }
};
exports.VendorsController = VendorsController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vendor_dto_1.CreateVendorDto, Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiConsumes)('application/json', 'application/x-www-form-urlencoded'),
    (0, swagger_1.ApiOperation)({ summary: `Vendor Login Api` }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER, utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user vendor profile' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getMyVendorProfile", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List vendors (admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_vendors_dto_1.ListVendorsDto]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "listVendors", null);
__decorate([
    (0, common_1.Get)('refresh/:vendor_id'),
    __param(0, (0, common_1.Param)('vendor_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('complete/:vendor_id'),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirects to frontend' }),
    __param(0, (0, common_1.Param)('vendor_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], VendorsController.prototype, "complete", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vendor by id (admin)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getVendorById", null);
exports.VendorsController = VendorsController = __decorate([
    (0, swagger_1.ApiTags)('vendors'),
    (0, common_1.Controller)({ path: 'vendors', version: '1' }),
    __metadata("design:paramtypes", [vendors_service_1.VendorsService])
], VendorsController);
//# sourceMappingURL=vendors.controller.js.map