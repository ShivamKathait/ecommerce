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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../../../../libs/auth/src");
const product_service_1 = require("./product.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const swagger_1 = require("@nestjs/swagger");
const utils_1 = require("../../../../libs/shared/src/common/utils");
const listing_dto_1 = require("./dto/listing.dto");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    create(dto, req) {
        return this.productService.create(dto, req.user.id);
    }
    update(ID, dto, req) {
        return this.productService.update(parseInt(ID.id), dto, req.user);
    }
    updateById(productId, dto, req) {
        return this.productService.update(productId, dto, req.user);
    }
    async component_list(dto) {
        return this.productService.listing(dto);
    }
    async list(dto) {
        return this.productService.listing(dto);
    }
    async listMyProducts(req, dto) {
        return this.productService.listVendorProducts(req.user.id, dto);
    }
    detail(ID) {
        return this.productService.detail(parseInt(ID.id));
    }
    detailById(productId) {
        return this.productService.detail(productId);
    }
    delete(ID, req) {
        return this.productService.delete(parseInt(ID.id), req.user);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: `Vendor create Product Api` }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: `Vendor update Product Api` }),
    (0, common_1.Patch)('/:id/update'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.IDDto, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: `Vendor update Product Api` }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateById", null);
__decorate([
    (0, swagger_1.ApiConsumes)('application/json', 'application/x-www-form-urlencoded'),
    (0, swagger_1.ApiOperation)({ summary: `Product listing Api` }),
    (0, common_1.Get)('listing'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listing_dto_1.Listing]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "component_list", null);
__decorate([
    (0, swagger_1.ApiConsumes)('application/json', 'application/x-www-form-urlencoded'),
    (0, swagger_1.ApiOperation)({ summary: `Product listing Api` }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listing_dto_1.Listing]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: `Vendor own products Api` }),
    (0, common_1.Get)('vendor/me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, listing_dto_1.Listing]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "listMyProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Product detail Api` }),
    (0, common_1.Get)('/:id/detail'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.IDDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "detail", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Product detail Api` }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "detailById", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: `Vendor delete Product Api` }),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.IDDto, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "delete", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('product'),
    (0, common_1.Controller)({ path: 'product', version: '1' }),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map