import { Wallet } from "../entities";
import { AppDataSource, Errors, logger } from "../utils";
import { chainService } from "./chain";
import { WalletCreateData, WalletResponseData } from "./dto";

export class WalletService {
  repository = AppDataSource.manager.getRepository(Wallet);

  public async find(userId: string): Promise<WalletResponseData[] | []> {
    return this.repository.find({
      where: { user: { id: userId } },
      relations: ["chain"],
    });
  }

  public async findById(
    userId: string,
    walletId: string
  ): Promise<Wallet | null> {
    const wallet = await this.repository.findOne({
      where: { id: walletId, user: { id: userId } },
      relations: ["chain"],
    });
    if (!wallet) {
      throw Errors.walletNotFound();
    }
    return wallet;
  }

  public async create(
    walletData: WalletCreateData
  ): Promise<WalletResponseData> {
    const chain = await chainService.findOrCreate(walletData.chain);

    const existentWallet = await this.repository.findOne({
      where: { address: walletData.address, chain },
    });
    if (existentWallet) {
      throw Errors.walletAlreadyExists();
    }

    const wallet = this.repository.create({
      user: { id: walletData.userId },
      tag: walletData.tag,
      chain,
      address: walletData.address,
    });
    try {
      await wallet.save();
      return {
        id: wallet.id,
        tag: walletData.tag,
        address: walletData.address,
        chain,
      };
    } catch (error: any) {
      throw Errors.databaseError(error.message);
    }
  }

  public async update(
    walletData: WalletCreateData
  ): Promise<WalletResponseData> {
    const wallet = await this.repository.findOne({
      where: { id: walletData.id, user: { id: walletData.userId } },
    });
    if (!wallet) {
      throw Errors.walletNotFound();
    }

    const chain = await chainService.findOrCreate(walletData.chain);

    /* Check for existing address-chain combination */
    const existentWallet = await this.repository.findOne({
      where: { address: walletData.address, chain },
    });
    if (existentWallet && existentWallet.id !== walletData.id) {
      throw Errors.walletAlreadyExists(walletData.address);
    }

    wallet.tag = walletData.tag;
    wallet.chain = chain;
    wallet.address = walletData.address;
    try {
      await wallet.save();
      return {
        id: wallet.id,
        tag: walletData.tag,
        address: walletData.address,
        chain,
      };
    } catch (error: any) {
      throw Errors.databaseError(error.message);
    }
  }

  public async delete(userId: string, walletId: string): Promise<void> {
    const wallet = await this.repository.findOne({
      where: { id: walletId, user: { id: userId } },
    });
    if (!wallet) {
      throw Errors.walletNotFound();
    }

    try {
      await wallet.remove();
    } catch (error: any) {
      throw Errors.databaseError(error.message);
    }
  }
}

export const walletService = new WalletService();
