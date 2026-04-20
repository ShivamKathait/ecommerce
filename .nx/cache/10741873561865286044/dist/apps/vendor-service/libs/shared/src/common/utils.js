"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenderStatus = exports.Action = exports.InventoryStatus = exports.Device_TYPE = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["STAFF"] = "STAFF";
    Role["USER"] = "USER";
    Role["VENDOR"] = "VENDOR";
})(Role || (exports.Role = Role = {}));
var Device_TYPE;
(function (Device_TYPE) {
    Device_TYPE["WEB"] = "WEB";
    Device_TYPE["IOS"] = "IOS";
    Device_TYPE["ANDROID"] = "ANDROID";
})(Device_TYPE || (exports.Device_TYPE = Device_TYPE = {}));
var InventoryStatus;
(function (InventoryStatus) {
    InventoryStatus["IN_STOCK"] = "in_stock";
    InventoryStatus["LOW_STOCK"] = "low_stock";
    InventoryStatus["OUT_OF_STOCK"] = "out_of_stock";
    InventoryStatus["BACKORDER"] = "backorder";
})(InventoryStatus || (exports.InventoryStatus = InventoryStatus = {}));
var Action;
(function (Action) {
    Action["ADD"] = "add";
    Action["SUBTRACT"] = "subtract";
    Action["SET"] = "set";
})(Action || (exports.Action = Action = {}));
var VenderStatus;
(function (VenderStatus) {
    VenderStatus["PENDING"] = "pending";
    VenderStatus["APPPROVED"] = "approved";
    VenderStatus["REJECTED"] = "rejected";
})(VenderStatus || (exports.VenderStatus = VenderStatus = {}));
//# sourceMappingURL=utils.js.map