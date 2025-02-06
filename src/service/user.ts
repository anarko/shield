import argon2 from "argon2";

import { User } from "../entities";
import { AppDataSource, Errors, logger } from "../utils";
import { UserData } from "./dto";

export class UserService {
  repository = AppDataSource.manager.getRepository(User);

  public async create({ email, password }: UserData) {
    const user = await this.find(email);
    if (user) {
      throw Errors.userAlreadyExists();
    }
    const hash = await argon2.hash(password).catch(() => {
      throw Errors.internalServerError("Hash error");
    });
    try {
      const newUser = this.repository.create({ email, password: hash });
      await newUser.save();
    } catch (error) {
      logger.error(error);
      throw Errors.databaseError();
    }
  }

  public async find(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  public async findByEmailAndPassword({ email, password }: UserData) {
    const user = await this.find(email);
    if (!user) {
      throw Errors.invalidCredentials();
    }
    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      throw Errors.invalidCredentials();
    }
    return user;
  }
}

export const userService = new UserService();
