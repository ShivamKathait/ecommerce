import { HttpException } from '@nestjs/common';
export declare class EmailExist extends HttpException {
    constructor();
}
export declare class UnauthorizedCountry extends HttpException {
    constructor();
}
export declare class OtpExipred extends HttpException {
    constructor();
}
export declare class InvalidOtp extends HttpException {
    constructor();
}
export declare class UserNotFound extends HttpException {
    constructor();
}
export declare class UserNotExist extends HttpException {
    constructor();
}
export declare class VendorNotExist extends HttpException {
    constructor();
}
export declare class AdminNotExist extends HttpException {
    constructor();
}
export declare class IncorrectCreds extends HttpException {
    constructor();
}
export declare class ProductNotFound extends HttpException {
    constructor();
}
export declare class InventoryNotFound extends HttpException {
    constructor();
}
export declare class InsufficientInventory extends HttpException {
    constructor();
}
export declare class AlreadyVendor extends HttpException {
    constructor();
}
export declare class ForbiddenProductAccess extends HttpException {
    constructor();
}
export declare class InventoryReservationNotFound extends HttpException {
    constructor();
}
export declare class OrderNotFound extends HttpException {
    constructor();
}
export declare class InvalidOrderState extends HttpException {
    constructor(message?: string);
}
