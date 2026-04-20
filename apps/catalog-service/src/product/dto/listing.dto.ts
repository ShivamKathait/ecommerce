import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class Listing {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  pagination: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  limit: string;
}
