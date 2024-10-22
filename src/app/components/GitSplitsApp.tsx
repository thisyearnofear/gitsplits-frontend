"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { formatEther, parseEther } from "viem";
import { CONTRACT_ADDRESS } from "@/utils/contract";
import GitHubSplitsABI from "@/contracts/GitHubSplits.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractOverview from "@/app/components/ContractOverview";
import ShareDistribution from "@/app/components/ShareDistribution";
import ManageShares from "@/app/components/ManageShares";
import { DonationEmbed } from "@/app/components/DonationEmbed";
import CodeAttribution from "@/app/components/CodeAttribution";
import {
  MainContentProps,
  QuickStatCardProps,
  GitSplitsAppProps,
} from "@/types";
import SharesList from "@/app/components/SharesList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, PieChart } from "lucide-react";

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
  isGitHubConnected,
}) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [isDonating, setIsDonating] = useState(false);
  const { writeContract } = useWriteContract();

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }
    setIsDonating(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: GitHubSplitsABI.abi,
        functionName: "donate",
        value: parseEther(donationAmount),
      });
      toast.success("Donation successful!");
      setDonationAmount("");
    } catch (error) {
      console.error("Error donating:", error);
      toast.error("Donation failed. Please try again.");
    } finally {
      setIsDonating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-20 px-6"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl font-bold">
            Fork Code. Credit Contributions. Split Donations.
          </h2>
          <p className="text-gray-600">
            Fairly distribute donations among GitHub contributors
          </p>
          {/* Remove or update this line */}
          {/* <RepoInfo url={""} /> */}
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
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
        </motion.section>

        {/* Main Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
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
        </motion.div>
      </div>
    </motion.div>
  );
};

const GitSplitsApp: React.FC<GitSplitsAppProps> = ({ isGitHubConnected }) => {
  const [isClient, setIsClient] = useState(false);
  const { address } = useAccount();

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

  const allShares = React.useMemo(() => {
    if (!allSharesData) return [];
    const [usernames, amounts] = allSharesData as [string[], bigint[]];
    return usernames.map((username, index) => ({
      username,
      amount: amounts[index],
    }));
  }, [allSharesData]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gentle-blue via-gentle-purple to-gentle-orange">
      <ToastContainer position="top-right" autoClose={5000} />
      <MainContent
        contractBalance={contractBalance as bigint}
        totalShares={totalShares as bigint}
        userShares={userShares as bigint}
        userBalance={userBalance}
        allShares={allShares}
        isGitHubConnected={isGitHubConnected}
      />
      <SharesList shares={allShares} />
    </div>
  );
};

export default GitSplitsApp;
