// ShareDistribution.tsx

import React from "react";
import { formatEther } from "viem";
import { PieChart } from "react-minimal-pie-chart";
import { Github, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ShareDistributionProps } from "@/types";

const ShareDistribution: React.FC<ShareDistributionProps> = ({ allShares }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <Github className="mr-2" /> Share Distribution
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="ml-2 h-4 w-4 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              This chart shows how the shares are distributed among GitHub
              users.
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allShares && allShares.length > 0 ? (
          <PieChart
            data={allShares.map((share, index) => ({
              title: share.username,
              value: Number(formatEther(share.amount)),
              color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
            }))}
            label={({ dataEntry }) => dataEntry.title}
            labelStyle={{ fontSize: "5px", fill: "white" }}
          />
        ) : (
          <p className="text-center text-gray-500">No shares available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ShareDistribution;
