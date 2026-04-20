import { VenderStatus } from 'src/common/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('vendor_profile')
export class VendorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  business_name: string;

  @Column()
  gst_number: string;

  @Column()
  stripe_connect_id: string;

  @Column({ type: 'enum', enum: VenderStatus, default: VenderStatus.PENDING })
  vendor_status: string;

  @Column()
  user_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
