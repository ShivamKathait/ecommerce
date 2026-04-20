import { Role } from 'src/common/utils';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
}
export declare class OtpDto {
    otp: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class UpdateRoleDto {
    role: Role;
}
export declare class UserIdParamDto {
    id: number;
}
