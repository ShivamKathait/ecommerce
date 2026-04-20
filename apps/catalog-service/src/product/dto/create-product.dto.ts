import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'product name is required' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'product price is required' })
  @Type(() => Number)
  @IsNumber()
  price: number;
}
