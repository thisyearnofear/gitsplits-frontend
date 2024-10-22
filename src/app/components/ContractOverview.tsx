import React from "react";
import { formatEther } from "viem";
import { PieChart as PieChartIcon, Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ContractOverviewProps } from "@/types";

const ContractOverview: React.FC<ContractOverviewProps> = ({
  contractBalance,
  totalShares,
  userShares,
  userBalance,
}) => {
  return (
    <Card className="bg-gentle-blue shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-primary">
          <PieChartIcon className="mr-2" /> Contract Overview
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="ml-2 h-4 w-4 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              This section shows the current state of the contract and your
              account.
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <InfoItem
          label="Contract Balance"
          value={`${
            contractBalance ? formatEther(contractBalance as bigint) : "0"
          } ETH`}
          tooltip="Total amount of ETH currently held by the contract."
        />
        <InfoItem
          label="Your Balance"
          value={`${userBalance ? formatEther(userBalance.value) : "0"} ETH`}
          tooltip="Your current ETH balance in your connected wallet."
        />
        <InfoItem
          label="Total Shares"
          value={totalShares ? formatEther(totalShares as bigint) : "0"}
          tooltip="Total number of shares distributed among all contributors."
        />
        <InfoItem
          label="Your Shares"
          value={userShares ? formatEther(userShares as bigint) : "0"}
          tooltip="Number of shares you currently hold in the contract."
        />
      </CardContent>
    </Card>
  );
};

const InfoItem: React.FC<{ label: string; value: string; tooltip: string }> = ({
  label,
  value,
  tooltip,
}) => (
  <div className="flex justify-between items-center">
    <span className="font-medium">{label}:</span>
    <span className="font-bold">
      {value}
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="ml-2 h-4 w-4 inline cursor-help" />
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </span>
  </div>
);

export default ContractOverview;
