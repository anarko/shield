import "reflect-metadata";
import { DataSource } from "typeorm";
import { environment } from "./env";
import { User, Wallet, Chain } from "../entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: environment.DATABASE_HOST,
  port: parseInt(environment.DATABASE_PORT ?? "5432"),
  username: environment.DATABASE_USER,
  password: environment.DATABASE_PASSWORD,
  database: environment.DATABASE_NAME,
  entities: [User, Wallet, Chain],
  synchronize: true,
  logging: false,
});

export const initializeDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
      .then(() => {})
      .catch((error) => console.log(error));
  }
};

export const stopDataSource = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
      .then(() => {})
      .catch((error) => console.log(error));
  }
};
