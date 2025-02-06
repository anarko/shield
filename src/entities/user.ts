import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Wallet } from "./wallet";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets!: Wallet[];
}
