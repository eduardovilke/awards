import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Nominee {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
}