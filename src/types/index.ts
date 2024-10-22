// types.ts

import { Dispatch, SetStateAction } from "react";
import { ReactNode } from "react";

export interface Share {
  username: string;
  amount: bigint;
}

export interface ContractState {
  contractBalance: bigint;
  totalShares: bigint;
  userShares: bigint;
  allShares: Share[];
}

export interface StatusMessageProps {
  status: string;
}

export interface ContractOverviewProps {
  contractBalance: bigint | unknown;
  totalShares: bigint | unknown;
  userShares: bigint | unknown;
  userBalance:
    | {
        decimals: number;
        formatted: string;
        symbol: string;
        value: bigint;
      }
    | undefined;
}

export interface ManageSharesProps {}

export interface SharesListProps {
  shares: Share[];
}

export interface ConnectWalletProps {
  isClient: boolean;
}

export interface ShareDistributionProps {
  allShares: Share[];
}

export interface CodeAttributionProps {}

export interface DonationEmbedProps {
  donationAmount: string;
  setDonationAmount: Dispatch<SetStateAction<string>>;
  isDonating: boolean;
  handleDonate: () => Promise<void>;
}

export interface TooltipProps {
  content: string;
  children: ReactNode;
}

export interface QuickStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export interface MainContentProps {
  contractBalance: bigint;
  totalShares: bigint;
  userShares: bigint;
  userBalance:
    | {
        decimals: number;
        formatted: string;
        symbol: string;
        value: bigint;
      }
    | undefined;
  allShares: Share[];
}
