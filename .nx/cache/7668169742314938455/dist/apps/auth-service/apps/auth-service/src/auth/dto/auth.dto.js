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
exports.UserIdParamDto = exports.UpdateRoleDto = exports.LoginDto = exports.OtpDto = exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const utils_1 = require("../../../../../libs/shared/src/common/utils");
class CreateUserDto {
    name;
    email;
    password;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'john doe' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'name is required' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'john@yopmail.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be an valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.Length)(8, 20, {
        message: 'Password must be between 8 and 20 characters long',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'password is required' }),
    (0, class_validator_1.IsStrongPassword)({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
class OtpDto {
    otp;
}
exports.OtpDto = OtpDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'otp is required' }),
    (0, class_validator_1.Length)(6, 6, { message: 'otp must be 6 digits' }),
    (0, class_validator_1.Matches)(/^[0-9]{6}$/, { message: 'otp must contain only digits' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OtpDto.prototype, "otp", void 0);
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 'john@yopmail.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be an valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'password is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'password must be at least 8 characters' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class UpdateRoleDto {
    role;
}
exports.UpdateRoleDto = UpdateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: utils_1.Role, example: utils_1.Role.VENDOR }),
    (0, class_validator_1.IsEnum)(utils_1.Role),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "role", void 0);
class UserIdParamDto {
    id;
}
exports.UserIdParamDto = UserIdParamDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserIdParamDto.prototype, "id", void 0);
//# sourceMappingURL=auth.dto.js.map