import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailExist extends HttpException {
  constructor() {
    super(
      'This email is already register. Please log in or use a different email address.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UnauthorizedCountry extends HttpException {
  constructor() {
    super('Signup is not allowed from your country.', HttpStatus.BAD_REQUEST);
  }
}

export class OtpExipred extends HttpException {
  constructor() {
    super('Otp exipred.Resend your otp.', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidOtp extends HttpException {
  constructor() {
    super('Otp Is Invalid.', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFound extends HttpException {
  constructor() {
    super('User Not Found.', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotExist extends HttpException {
  constructor() {
    super("User doesn't exist. Please sign-up.", HttpStatus.BAD_REQUEST);
  }
}

export class VendorNotExist extends HttpException {
  constructor() {
    super(
      'Vendor account not found. Please register to continue.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class AdminNotExist extends HttpException {
  constructor() {
    super("Admin doesn't exist..", HttpStatus.BAD_REQUEST);
  }
}

export class IncorrectCreds extends HttpException {
  constructor() {
    super('Incorrect email or password!.', HttpStatus.BAD_REQUEST);
  }
}

export class ProductNotFound extends HttpException {
  constructor() {
    super('Product Not found.', HttpStatus.BAD_REQUEST);
  }
}

export class InventoryNotFound extends HttpException {
  constructor() {
    super('Inventory Not found.', HttpStatus.BAD_REQUEST);
  }
}

export class InsufficientInventory extends HttpException {
  constructor() {
    super('Insufficient stock.', HttpStatus.BAD_REQUEST);
  }
}

export class AlreadyVendor extends HttpException {
  constructor() {
    super('User is already a registered vendor.', HttpStatus.BAD_REQUEST);
  }
}
