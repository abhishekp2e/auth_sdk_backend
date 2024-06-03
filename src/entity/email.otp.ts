import { flowTypeDto } from 'src/modules/auth/dto/auth.dto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class EmailOtp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  hashedKey: string;

  @Column('varchar', { nullable: false })
  otp: string;

  @Column('int', { nullable: false, default: 0 })
  attempts: number;

  @CreateDateColumn({ select: false })
  created_at: Date;
}
