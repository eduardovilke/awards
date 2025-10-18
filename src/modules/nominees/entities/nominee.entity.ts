import { BaseModel } from 'src/common/models/base.model';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Studio } from './studio.entity';
import { Producer } from './producer.entity';

@Entity({ name: 'nominees' })
export class Nominee extends BaseModel<Nominee> {
  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'boolean' })
  isWinner: boolean;

  @ManyToMany(() => Studio, { cascade: true })
  @JoinTable()
  studios: Studio[];

  @ManyToMany(() => Producer, { cascade: true })
  @JoinTable()
  producers: Producer[];
}
