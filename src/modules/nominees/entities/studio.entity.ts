import { BaseModel } from 'src/common/models/base.model';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'studios' })
export class Studio extends BaseModel<Studio> {
  @Column({ type: 'varchar', unique: true })
  name: string;
}
