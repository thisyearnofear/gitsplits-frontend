"use client";

import React, { useState, useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESS } from "@/utils/contract";
import GitHubSplitsABI from "@/contracts/GitHubSplits.json";
import { Wallet, DollarSign, Users, PieChart, Info } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import ContractOverview from "@/app/components/ContractOverview";
import ShareDistribution from "@/app/components/ShareDistribution";
import ManageShares from "@/app/components/ManageShares";
import { DonationEmbed } from "@/app/components/DonationEmbed";
import CodeAttribution from "@/app/components/CodeAttribution";
import { QuickStatCardProps, MainContentProps } from "@/types";

const Header = () => {
  const { open } = useAppKit();
  const { isConnected, address } = useAccount();

  return (
    <div className="flex justify-between items-center w-full px-6 py-4 bg-white/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold">GitSplits</h1>
      </div>
      <div className="flex items-center space-x-4">
        {!isConnected ? (
          <Button onClick={() => open()} variant="outline" size="sm">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickStatCard: React.FC<QuickStatCardProps> = ({
  title,
  value,
  icon,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const MainContent: React.FC<MainContentProps> = ({
  contractBalance,
  totalShares,
  userShares,
  userBalance,
  allShares,
}) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [isDonating, setIsDonating] = useState(false);

  const handleDonate = async () => {
    // Implement donation logic here
    setIsDonating(true);
    // ... donation logic
    setIsDonating(false);
  };

  return (
    <div className="pt-20 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold">
            Fork Code. Credit Contributions. Split Donations.
          </h2>
          <p className="text-gray-600">
            Fairly distribute donations among GitHub contributors
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickStatCard
            title="Total Donations"
            value={`${
              contractBalance ? formatEther(contractBalance) : "0"
            } ETH`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <QuickStatCard
            title="Contributors"
            value={allShares?.length || "0"}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <QuickStatCard
            title="Your Share"
            value={`${userShares ? formatEther(userShares) : "0"} ETH`}
            icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          />
        </section>

        {/* Main Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
            <TabsTrigger value="manage">Manage Shares</TabsTrigger>
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContractOverview
                contractBalance={contractBalance}
                totalShares={totalShares}
                userShares={userShares}
                userBalance={userBalance}
              />
              <ShareDistribution allShares={allShares} />
            </div>
          </TabsContent>

          <TabsContent value="donate">
            <DonationEmbed
              donationAmount={donationAmount}
              setDonationAmount={setDonationAmount}
              isDonating={isDonating}
              handleDonate={handleDonate}
            />
          </TabsContent>

          <TabsContent value="manage">
            <ManageShares />
          </TabsContent>

          <TabsContent value="attribution">
            <CodeAttribution />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default function GitSplitsApp() {
  const [isClient, setIsClient] = useState(false);
  const { isConnected, address } = useAccount();

  const { data: contractBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GitHubSplitsABI.abi,
    functionName: "getContractBalance",
  });

  const { data: totalShares } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GitHubSplitsABI.abi,
    functionName: "totalShares",
  });

  const { data: allSharesData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GitHubSplitsABI.abi,
    functionName: "getAllShares",
  });

  const { data: userShares } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GitHubSplitsABI.abi,
    functionName: "getShare",
    args: address ? [address] : undefined,
  });

  const { data: userBalance } = useBalance({
    address,
  });

  const allShares = allSharesData
    ? (allSharesData as [string[], bigint[]]).reduce((acc, curr, index) => {
        if (index === 0) {
          return (curr as string[]).map((username, i) => ({
            username,
            amount: (allSharesData as [string[], bigint[]])[1][i],
          }));
        }
        return acc;
      }, [] as { username: string; amount: bigint }[])
    : [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gentle-blue via-gentle-purple to-gentle-orange">
        <ToastContainer position="top-right" autoClose={5000} />
        <Header />
        <MainContent
          contractBalance={contractBalance as bigint}
          totalShares={totalShares as bigint}
          userShares={userShares as bigint}
          userBalance={userBalance}
          allShares={allShares}
        />
      </div>
    </TooltipProvider>
  );
}
