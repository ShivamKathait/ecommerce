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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryReservation = void 0;
const typeorm_1 = require("typeorm");
let InventoryReservation = class InventoryReservation {
    id;
    reservation_id;
    product_id;
    quantity;
    status;
    expires_at;
    created_at;
    updated_at;
};
exports.InventoryReservation = InventoryReservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InventoryReservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], InventoryReservation.prototype, "reservation_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], InventoryReservation.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], InventoryReservation.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'reserved' }),
    __metadata("design:type", String)
], InventoryReservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], InventoryReservation.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], InventoryReservation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], InventoryReservation.prototype, "updated_at", void 0);
exports.InventoryReservation = InventoryReservation = __decorate([
    (0, typeorm_1.Entity)('inventory_reservation')
], InventoryReservation);
//# sourceMappingURL=inventory-reservation.entity.js.map