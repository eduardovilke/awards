import { BaseModel } from 'src/common/models/base.model';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'producers' })
export class Producer extends BaseModel<Producer> {
  @Column({ type: 'varchar', unique: true })
  name: string;
}
