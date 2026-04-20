import { Role } from 'src/common/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './session.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({ type: Boolean, default: false })
  is_deleted: boolean;

  @Column({ type: Boolean, default: false })
  is_email_verified: boolean;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otp_expire_at: Date | null;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @Column({ nullable: true, unique: true })
  stripe_customer_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
