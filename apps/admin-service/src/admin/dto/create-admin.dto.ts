import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MinLength,
  Matches,
} from 'class-validator';
import { Device_TYPE } from 'src/common/utils';

export class CreateAdminto {
  @ApiProperty({ default: 'john@yopmail.com' })
  @IsEmail({}, { message: 'Email must be an valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  @IsNotEmpty({ message: 'password is required' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsString()
  password: string;
}

export class OtpDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'otp is required' })
  @Length(6, 6, { message: 'otp must be 6 digits' })
  @Matches(/^[0-9]{6}$/, { message: 'otp must contain only digits' })
  @IsString()
  otp: string;
}

export class LoginDto {
  @ApiProperty({ default: 'john@yopmail.com' })
  @IsEmail({}, { message: 'Email must be an valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password: string;
}
