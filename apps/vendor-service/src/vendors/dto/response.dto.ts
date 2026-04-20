import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
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

  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }
}
