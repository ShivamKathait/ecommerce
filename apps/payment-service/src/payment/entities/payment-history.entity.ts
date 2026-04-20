import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_history')
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  stripe_event_id: string;

  @Index()
  @Column()
  payment_intent_id: string;

  @Column({ nullable: true })
  order_id?: string;

  @Column({ nullable: true })
  user_id?: string;

  @Column({ nullable: true })
  customer_id?: string;

  @Column({ nullable: true })
  event_type?: string;

  @Column({ nullable: true })
  payment_status?: string;

  @Column({ type: 'bigint', nullable: true })
  amount?: number;

  @Column({ default: 'inr' })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: object;

  @Column({ type: 'jsonb', nullable: true })
  payload?: object;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
