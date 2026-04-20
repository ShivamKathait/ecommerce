import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InventoryStatus } from 'src/common/utils';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', name: 'low_stock_threshold', default: 5 })
  lowStockThreshold: number;

  @Column({
    type: 'enum',
    enum: InventoryStatus,
    default: InventoryStatus.OUT_OF_STOCK,
  })
  status: InventoryStatus;

  @Column({ type: 'boolean', default: true })
  trackInventory: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Helper method to update status based on quantity
  updateStatus() {
    if (!this.trackInventory) {
      this.status = InventoryStatus.IN_STOCK;
      return;
    }

    if (this.quantity <= 0) {
      this.status = InventoryStatus.OUT_OF_STOCK;
    } else if (this.quantity <= this.lowStockThreshold) {
      this.status = InventoryStatus.LOW_STOCK;
    } else {
      this.status = InventoryStatus.IN_STOCK;
    }
  }
}
