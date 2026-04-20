import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
