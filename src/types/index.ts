// types.ts

import { Dispatch, SetStateAction } from "react";
import { ReactNode } from "react";

// Basic types
export interface Contributor {
  username: string;
  contributions: number;
}

export interface Share {
  username: string;
  amount: bigint;
}

export interface Contract {
  address: `0x${string}`;
  name: string;
  description: string;
}

// Repository related types
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

// Component props
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

export interface DashboardProps {
  isGitHubConnected: boolean;
  setIsGitHubConnected: (connected: boolean) => void;
}

export interface RepoCardProps {
  name: string;
  owner: string;
  stats: {
    tips: string;
    contributors: number;
    forks: number;
  };
  onSelect: () => void;
}

export interface PreviewCardProps {
  type: "minimal" | "enhanced";
  title: string;
  description: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export interface SplitsTableProps {
  splits: Array<{
    avatar_url: string | undefined;
    login: string | undefined;
    contributions: ReactNode;
    percentage: ReactNode;
    username: string;
    share: string;
  }>;
}

export interface QuickStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

// Page props
export interface HomeProps {
  // Add any props if needed for the Home component
}

export interface LandingPageProps {
  isConnected: boolean;
  onDashboardClick: () => void;
  onLoginPrompt: () => void;
}

export interface GitSplitsAppProps {
  isGitHubConnected: boolean;
  setIsGitHubConnected: Dispatch<SetStateAction<boolean>>;
}

// Other component props
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

export interface ShareDistributionProps {
  allShares: Share[];
}

export interface SharesListProps {
  shares: Share[];
}

export interface ManageSharesProps {
  contractAddress: `0x${string}`;
}

export interface DonationEmbedProps {
  contractAddress: string;
}

// State interfaces
export interface ContractState {
  contractBalance: bigint;
  totalShares: bigint;
  userShares: bigint;
  allShares: Share[];
}

// Utility interfaces
export interface TooltipProps {
  content: string;
  children: ReactNode;
}
