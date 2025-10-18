import {
  CreateDateColumn,
  DeepPartial,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Index()
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  @Index()
  deletedAt?: Date;

  constructor(data?: DeepPartial<T>) {
    Object.assign(this, data);
  }
}
