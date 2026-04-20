"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOrderState = exports.OrderNotFound = exports.InventoryReservationNotFound = exports.ForbiddenProductAccess = exports.AlreadyVendor = exports.InsufficientInventory = exports.InventoryNotFound = exports.ProductNotFound = exports.IncorrectCreds = exports.AdminNotExist = exports.VendorNotExist = exports.UserNotExist = exports.UserNotFound = exports.InvalidOtp = exports.OtpExipred = exports.UnauthorizedCountry = exports.EmailExist = void 0;
const common_1 = require("@nestjs/common");
class EmailExist extends common_1.HttpException {
    constructor() {
        super('This email is already register. Please log in or use a different email address.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.EmailExist = EmailExist;
class UnauthorizedCountry extends common_1.HttpException {
    constructor() {
        super('Signup is not allowed from your country.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.UnauthorizedCountry = UnauthorizedCountry;
class OtpExipred extends common_1.HttpException {
    constructor() {
        super('Otp exipred.Resend your otp.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.OtpExipred = OtpExipred;
class InvalidOtp extends common_1.HttpException {
    constructor() {
        super('Otp Is Invalid.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidOtp = InvalidOtp;
class UserNotFound extends common_1.HttpException {
    constructor() {
        super('User Not Found.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.UserNotFound = UserNotFound;
class UserNotExist extends common_1.HttpException {
    constructor() {
        super("User doesn't exist. Please sign-up.", common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.UserNotExist = UserNotExist;
class VendorNotExist extends common_1.HttpException {
    constructor() {
        super('Vendor account not found. Please register to continue.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.VendorNotExist = VendorNotExist;
class AdminNotExist extends common_1.HttpException {
    constructor() {
        super("Admin doesn't exist..", common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.AdminNotExist = AdminNotExist;
class IncorrectCreds extends common_1.HttpException {
    constructor() {
        super('Incorrect email or password!.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.IncorrectCreds = IncorrectCreds;
class ProductNotFound extends common_1.HttpException {
    constructor() {
        super('Product Not found.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ProductNotFound = ProductNotFound;
class InventoryNotFound extends common_1.HttpException {
    constructor() {
        super('Inventory Not found.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InventoryNotFound = InventoryNotFound;
class InsufficientInventory extends common_1.HttpException {
    constructor() {
        super('Insufficient stock.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InsufficientInventory = InsufficientInventory;
class AlreadyVendor extends common_1.HttpException {
    constructor() {
        super('User is already a registered vendor.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.AlreadyVendor = AlreadyVendor;
class ForbiddenProductAccess extends common_1.HttpException {
    constructor() {
        super('You are not allowed to access this product.', common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ForbiddenProductAccess = ForbiddenProductAccess;
class InventoryReservationNotFound extends common_1.HttpException {
    constructor() {
        super('Inventory reservation not found.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InventoryReservationNotFound = InventoryReservationNotFound;
class OrderNotFound extends common_1.HttpException {
    constructor() {
        super('Order not found.', common_1.HttpStatus.NOT_FOUND);
    }
}
exports.OrderNotFound = OrderNotFound;
class InvalidOrderState extends common_1.HttpException {
    constructor(message = 'Invalid order state.') {
        super(message, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidOrderState = InvalidOrderState;
//# sourceMappingURL=error-service.js.map