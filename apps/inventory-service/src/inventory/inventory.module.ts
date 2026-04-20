import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryReservation } from './entities/inventory-reservation.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InternalServiceGuard } from './guards/internal-service.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, InventoryReservation])],
  controllers: [InventoryController],
  providers: [InventoryService, InternalServiceGuard],
  exports: [InventoryService],
})
export class InventoryModule {}
