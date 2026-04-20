import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { VenderStatus } from 'src/common/utils';

export class ListVendorsDto {
  @ApiPropertyOptional({ enum: VenderStatus })
  @IsOptional()
  @IsEnum(VenderStatus)
  status?: VenderStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

