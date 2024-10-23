"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { formatEther, parseEther } from "viem";
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
import StatusMessage from "@/app/components/StatusMessage";
import SharesList from "@/app/components/SharesList";
import { GitSplitsAppProps, Contract, QuickStatCardProps } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, PieChart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const GitSplitsApp: React.FC<GitSplitsAppProps> = () => {
  const [isClient, setIsClient] = useState(false);
  const { address } = useAccount();
  const [contracts, _setContracts] = useState<Contract[]>([
    {
      address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
      name: "Main Contract",
      description: "The primary GitSplits contract",
    },
    {
      address: "0x0987654321098765432109876543210987654321" as `0x${string}`,
      name: "Example Contract",
      description: "An example contract to showcase functionality",
    },
  ]);
  const [selectedContract, setSelectedContract] = useState(contracts[0]);
  const [_status, _setStatus] = useState<string>("");
  const [donationAmount, setDonationAmount] = useState("");
  const [_isDonating, setIsDonating] = useState(false);

  const { data: contractBalance } = useReadContract({
    address: selectedContract.address,
    abi: GitHubSplitsABI.abi,
    functionName: "getContractBalance",
  });

  const { data: totalShares } = useReadContract({
    address: selectedContract.address,
    abi: GitHubSplitsABI.abi,
    functionName: "totalShares",
  });

  const { data: allSharesData } = useReadContract({
    address: selectedContract.address,
    abi: GitHubSplitsABI.abi,
    functionName: "getAllShares",
  });

  const { data: userShares } = useReadContract({
    address: selectedContract.address,
    abi: GitHubSplitsABI.abi,
    functionName: "getShare",
    args: address ? [address] : undefined,
  });

  const { data: userBalance } = useBalance({
    address,
  });

  const { writeContract } = useWriteContract();

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

  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }
    setIsDonating(true);
    try {
      await writeContract({
        address: selectedContract.address,
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

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gentle-blue via-gentle-purple to-gentle-orange">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="container mx-auto px-4 py-8">
        <StatusMessage status={_status} />

        {/* Contract Selection */}
        <div className="flex justify-between items-center mb-6">
          <select
            value={selectedContract.address}
            onChange={(e) =>
              setSelectedContract(
                contracts.find((c) => c.address === e.target.value)!
              )
            }
            className="select select-bordered w-full max-w-xs"
          >
            {contracts.map((contract) => (
              <option key={contract.address} value={contract.address}>
                {contract.name}
              </option>
            ))}
          </select>
          <Button>
            <Plus className="mr-2" /> Create New Contract
          </Button>
        </div>

        {/* Quick Stats */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        >
          <QuickStatCard
            title="Total Donations"
            value={`${
              contractBalance ? formatEther(contractBalance as bigint) : "0"
            } ETH`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <QuickStatCard
            title="Contributors"
            value={allShares.length}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <QuickStatCard
            title="Your Share"
            value={`${
              userShares ? formatEther(userShares as bigint) : "0"
            } ETH`}
            icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          />
        </motion.section>

        {/* Main Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manage">Manage Shares</TabsTrigger>
            <TabsTrigger value="donation">Donation Settings</TabsTrigger>
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContractOverview
                contractBalance={contractBalance as bigint}
                totalShares={totalShares as bigint}
                userShares={userShares as bigint}
                userBalance={userBalance}
              />
              <ShareDistribution allShares={allShares} />
            </div>
            <SharesList shares={allShares} />
          </TabsContent>

          <TabsContent value="manage">
            <ManageShares contractAddress={selectedContract.address} />
          </TabsContent>

          <TabsContent value="donation">
            <DonationEmbed contractAddress={selectedContract.address} />
          </TabsContent>

          <TabsContent value="attribution">
            <CodeAttribution />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GitSplitsApp;
