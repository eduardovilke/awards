import { BaseModel } from 'src/common/models/base.model';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Nominee } from './nominee.entity';

@Entity({ name: 'producers' })
export class Producer extends BaseModel<Producer> {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @ManyToMany(() => Nominee, (nominee) => nominee.producers)
  nominees: Nominee[];
}
