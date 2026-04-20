import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { InventoryStatus, Action } from 'src/common/utils';

export class UpdateInventoryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  lowStockThreshold?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;
}

export class AdjustInventoryDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsEnum(Action)
  action: Action;
}
