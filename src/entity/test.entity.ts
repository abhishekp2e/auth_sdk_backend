import { flowTypeDto } from 'src/modules/auth/dto/auth.dto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class AuthSdk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  userKey: string;

  @Column('varchar', { nullable: false })
  shard2: string;

  @Column('varchar', { nullable: false })
  shard3: string;

  @Column('enum', {
    enum: flowTypeDto,
  })
  type: flowTypeDto;

  @CreateDateColumn({ select: false })
  created_at: Date;
}
