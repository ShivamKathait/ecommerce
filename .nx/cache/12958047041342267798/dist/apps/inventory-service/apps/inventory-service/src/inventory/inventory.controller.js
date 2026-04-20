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
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    getInventoryForProduct(productId) {
        return this.inventoryService.getInventoryForProduct(parseInt(productId));
    }
    updateInventory(productId, updateInventoryDto) {
        return this.inventoryService.updateProductInventory(parseInt(productId), updateInventoryDto);
    }
    adjustInventory(productId, dto) {
        return this.inventoryService.updateInventory(parseInt(productId), dto);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory for a product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the inventory for the specified product' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getInventoryForProduct", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)("authorization"),
    (0, auth_1.Roles)(utils_1.Role.VENDOR),
    (0, common_1.Patch)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update inventory for a product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_dto_1.UpdateInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateInventory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)("authorization"),
    (0, auth_1.Roles)(utils_1.Role.VENDOR),
    (0, common_1.Post)('product/:productId/adjust'),
    (0, swagger_1.ApiOperation)({ summary: 'Adjust inventory quantity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory adjusted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_dto_1.AdjustInventoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjustInventory", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, common_1.Controller)({ path: 'inventory', version: '1' }),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map