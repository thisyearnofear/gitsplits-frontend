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
  isGitHubConnected: boolean;
}

// Add these new types
export interface RepoInfo {
  name: string;
  owner: string;
  isFork: boolean;
  originalRepo: {
    name: string;
    owner: string;
  } | null;
  contributors: Contributor[];
}

export interface Contributor {
  username: string;
  contributions: number;
}

export interface LandingPageProps {
  isConnected: boolean;
  onDashboardClick: () => void;
  onLoginPrompt: () => void;
}

// Add this new interface
export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Add this new interface
export interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

// Add this new interface
export interface RepoInfoProps {
  url: string;
}

export interface AttributionWidgetProps {
  repoInfo: RepoInfo;
  contractAddress: string;
  displayStyle: "minimal" | "expanded";
  onSupportClick?: () => void;
}

export interface EnhancedAttributionWidgetProps {
  repoInfo: RepoInfo;
  contractAddress: string;
  displayStyle: "minimal" | "expanded";
}

export interface EmbedCodeGeneratorProps {
  repoInfo: RepoInfo;
  contractAddress: string;
  displayStyle: "minimal" | "expanded";
}

// Update HomeProps if needed
export interface HomeProps {
  // Add any props if needed for the Home component
}

// Add this new interface for the props that Home will pass to LandingPage
export interface HomeLandingPageProps {
  isConnected: boolean;
  onDashboardClick: () => void;
  onLoginPrompt: () => void;
}

// Add GitSplitsAppProps if needed
export interface GitSplitsAppProps {
  isGitHubConnected: boolean;
}
