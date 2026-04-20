import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../utils';
import { User } from './user.entity';

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
