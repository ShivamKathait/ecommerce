import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory_reservation')
export class InventoryReservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index('ux_inventory_reservation_id', { unique: true })
  reservation_id: string;

  @Column()
  @Index('idx_inventory_reservation_product_id')
  product_id: number;

  @Column()
  quantity: number;

  @Column({ default: 'reserved' })
  @Index('idx_inventory_reservation_status')
  status: 'reserved' | 'released' | 'confirmed';

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
