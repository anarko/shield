import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from "typeorm";
import { User } from "./user";
import { Chain } from "./chain";

@Entity()
@Index(["chain", "address"], { unique: true })
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.id)
  user!: User;

  @Column({ nullable: true })
  tag!: string;

  @ManyToOne(() => Chain, (chain) => chain.id)
  chain!: Chain;

  @Column()
  address!: string;
}
