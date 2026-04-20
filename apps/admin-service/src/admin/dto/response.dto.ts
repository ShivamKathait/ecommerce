import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/common/utils';

export class ResponseUserDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  access_token: string;

  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  is_email_verified: boolean;

  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }
}
