import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ default: 'Shivam Store' })
  @IsNotEmpty({ message: 'Business name is required' })
  business_name: string;

  @ApiProperty({ default: '123456789097643' })
  @IsNotEmpty({ message: 'gst number is required' })
  gst_number: string;
}
