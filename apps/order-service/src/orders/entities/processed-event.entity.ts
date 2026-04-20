import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('processed_events')
export class ProcessedEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  event_id: string;

  @Column()
  event_type: string;

  @Column({ default: 'payment-service' })
  source: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
