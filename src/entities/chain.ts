import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chain extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false, unique: true })
  name!: string;

  @Column({ type: "jsonb", nullable: true })
  metadata!: Record<string, any>;
}
