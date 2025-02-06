import { Chain } from "../../entities";

export interface WalletCreateData {
  id?: string;
  userId: string;
  tag: string;
  chain: string;
  address: string;
}

export interface WalletResponseData {
  id: string;
  tag: string;
  chain: Chain;
  address: string;
}
