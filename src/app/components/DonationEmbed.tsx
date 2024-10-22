import React from "react";
import { DonationEmbedProps } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function DonationEmbed({
  donationAmount,
  setDonationAmount,
  isDonating,
  handleDonate,
}: DonationEmbedProps) {
  return (
    <Card className="bg-gentle-orange">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          Donate to this project
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="ml-2 h-4 w-4 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              Your donation will be distributed among contributors based on
              their shares.
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="number"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          placeholder="Amount in ETH"
          className="text-center"
        />
        <Button
          onClick={handleDonate}
          disabled={isDonating}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isDonating ? "Processing..." : "Donate"}
        </Button>
      </CardContent>
    </Card>
  );
}
