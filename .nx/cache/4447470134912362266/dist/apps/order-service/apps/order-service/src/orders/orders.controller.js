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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../libs/auth/src");
const utils_1 = require("../../../../libs/shared/src/common/utils");
const checkout_dto_1 = require("./dto/checkout.dto");
const list_orders_dto_1 = require("./dto/list-orders.dto");
const orders_service_1 = require("./orders.service");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    checkout(dto, req) {
        const authHeader = req.headers?.authorization ?? '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;
        return this.ordersService.checkout(req.user, token, dto);
    }
    confirm(orderId, req) {
        const authHeader = req.headers?.authorization ?? '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;
        return this.ordersService.confirmOrder(orderId, req.user.id, token);
    }
    cancel(orderId, req) {
        const authHeader = req.headers?.authorization ?? '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;
        return this.ordersService.cancelOrder(orderId, req.user.id, token);
    }
    getOne(orderId, req) {
        return this.ordersService.getOrder(orderId, req.user.id);
    }
    listMine(req, query) {
        return this.ordersService.listMyOrders(req.user.id, query);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)('checkout'),
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER, utils_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Reserve inventory and create pending order' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkout_dto_1.CheckoutDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "checkout", null);
__decorate([
    (0, common_1.Patch)(':id/confirm'),
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER, utils_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm payment and consume reservations' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "confirm", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER, utils_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel pending order and release reservations' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER, utils_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by id' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('authorization'),
    (0, auth_1.Roles)(utils_1.Role.USER, utils_1.Role.ADMIN),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'List my orders' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_orders_dto_1.ListOrdersDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "listMine", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)({ path: 'orders', version: '1' }),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map