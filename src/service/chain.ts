import { Chain } from "../entities";
import { AppDataSource, Errors, logger } from "../utils";

export class ChainService {
  repository = AppDataSource.manager.getRepository(Chain);

  public async findOrCreate(chainName: string) {
    const upperCaseChain = chainName.toUpperCase();
    const chain = await this.repository.findOneBy({ name: upperCaseChain });
    if (chain) {
      return chain;
    }

    const newChain = this.repository.create({ name: upperCaseChain });
    await newChain.save();
    return newChain;
  }
}

export const chainService = new ChainService();
