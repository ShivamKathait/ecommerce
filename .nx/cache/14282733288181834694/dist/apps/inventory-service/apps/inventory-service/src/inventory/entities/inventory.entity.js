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
exports.Inventory = void 0;
const typeorm_1 = require("typeorm");
const utils_1 = require("../../../../../libs/shared/src/common/utils");
let Inventory = class Inventory {
    id;
    product_id;
    quantity;
    reserved_quantity;
    lowStockThreshold;
    status;
    trackInventory;
    created_at;
    updated_at;
    updateStatus() {
        const available = this.quantity - this.reserved_quantity;
        if (!this.trackInventory) {
            this.status = utils_1.InventoryStatus.IN_STOCK;
            return;
        }
        if (available <= 0) {
            this.status = utils_1.InventoryStatus.OUT_OF_STOCK;
        }
        else if (available <= this.lowStockThreshold) {
            this.status = utils_1.InventoryStatus.LOW_STOCK;
        }
        else {
            this.status = utils_1.InventoryStatus.IN_STOCK;
        }
    }
};
exports.Inventory = Inventory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Inventory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)('ux_inventory_product_id', { unique: true }),
    __metadata("design:type", Number)
], Inventory.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "reserved_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'low_stock_threshold', default: 5 }),
    __metadata("design:type", Number)
], Inventory.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: utils_1.InventoryStatus,
        default: utils_1.InventoryStatus.OUT_OF_STOCK,
    }),
    __metadata("design:type", String)
], Inventory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Inventory.prototype, "trackInventory", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Inventory.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Inventory.prototype, "updated_at", void 0);
exports.Inventory = Inventory = __decorate([
    (0, typeorm_1.Entity)('inventory')
], Inventory);
//# sourceMappingURL=inventory.entity.js.map