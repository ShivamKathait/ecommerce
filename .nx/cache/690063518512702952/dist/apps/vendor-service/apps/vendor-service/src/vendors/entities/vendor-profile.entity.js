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
exports.VendorProfile = void 0;
const utils_1 = require("../../../../../libs/shared/src/common/utils");
const typeorm_1 = require("typeorm");
let VendorProfile = class VendorProfile {
    id;
    business_name;
    gst_number;
    stripe_connect_id;
    vendor_status;
    user_id;
    created_at;
};
exports.VendorProfile = VendorProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VendorProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VendorProfile.prototype, "business_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VendorProfile.prototype, "gst_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VendorProfile.prototype, "stripe_connect_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: utils_1.VenderStatus, default: utils_1.VenderStatus.PENDING }),
    __metadata("design:type", String)
], VendorProfile.prototype, "vendor_status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VendorProfile.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], VendorProfile.prototype, "created_at", void 0);
exports.VendorProfile = VendorProfile = __decorate([
    (0, typeorm_1.Entity)('vendor_profile')
], VendorProfile);
//# sourceMappingURL=vendor-profile.entity.js.map