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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../../../../libs/auth/src");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const update_inventory_dto_1 = require("./dto/update-inventory.dto");
const utils_1 = require("../../../../libs/shared/src/common/utils");
const create_inventory_dto_1 = require("./dto/create-inventory.dto");
const reservation_dto_1 = require("./dto/reservation.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    getInventoryForProduct(productId) {
        return this.inventoryService.getInventoryForProduct(productId);
    }
    createInventory(productId, dto) {
        return this.inventoryService.createInventoryForProduct(productId, dto);
    }
    listLowStock(limit, page) {
        return this.inventoryService.listLowStock(limit ? parseInt(limit, 10) : 20, page ? parseInt(page, 10) : 1);
    }
    updateInventory(productId, updateInventoryDto) {
        return this.inventoryService.updateProductInventory(productId, updateInventoryDto);
    }
    adjustInventory(productId, dto) {
        return this.inventoryService.updateInventory(productId, dto);
    }
    reserveInventory(productId, idempotencyKey, dto) {
        return this.inventoryService.reserveInventory(productId, {
            ...dto,
            reservationId: dto.reservationId ?? idempotencyKey,
        });
    }
    releaseReservation(productId, reservationId) {
        return this.inventoryService.releaseReservation(productId, reservationId);
    }
    confirmReservation(productId, reservationId) {
        return this.inventoryService.confirmReservation(productId, reservationId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory for a product' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the inventory for the specified product',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getInventoryForProduct", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.VENDOR, utils_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Post)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Create inventory for a product' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Inventory created successfully' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_inventory_dto_1.CreateInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createInventory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.VENDOR, utils_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Get)('low-stock'),
    (0, swagger_1.ApiOperation)({ summary: 'List low stock inventory' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Low stock inventory list' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listLowStock", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Patch)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update inventory for a product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_inventory_dto_1.UpdateInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateInventory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Post)('product/:productId/adjust'),
    (0, swagger_1.ApiOperation)({ summary: 'Adjust inventory quantity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory adjusted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_inventory_dto_1.AdjustInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjustInventory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER, utils_1.Role.ADMIN, utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Post)('product/:productId/reservations'),
    (0, swagger_1.ApiOperation)({ summary: 'Reserve inventory for checkout' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Headers)('idempotency-key')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, reservation_dto_1.ReserveInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "reserveInventory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER, utils_1.Role.ADMIN, utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Post)('product/:productId/reservations/:reservationId/release'),
    (0, swagger_1.ApiOperation)({ summary: 'Release reserved inventory' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('reservationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "releaseReservation", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER, utils_1.Role.ADMIN, utils_1.Role.VENDOR),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Post)('product/:productId/reservations/:reservationId/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm reserved inventory and deduct stock' }),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('reservationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "confirmReservation", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, common_1.Controller)({ path: 'inventory', version: '1' }),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map