import { Role } from "src/common/utils";
export declare class ResponseUserDto {
    id: number;
    name?: string;
    email: string;
    access_token: string;
    role: Role;
    constructor(partial: Partial<ResponseUserDto>);
}
