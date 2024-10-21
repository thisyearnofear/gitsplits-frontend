"use client";

import React, { useState, useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useSignMessage,
} from "wagmi";
import { formatEther, parseEther } from "viem";
import { CONTRACT_ADDRESS } from "@/utils/contract";
import GitHubSplitsABI from "@/contracts/GitHubSplits.json";
import { PieChart } from "react-minimal-pie-chart";
import {
  Github,
  Wallet,
  PieChart as PieChartIcon,
  DollarSign,
  UserPlus,
  Download,
  Code,
} from "lucide-react";
import { DonationEmbed } from "@/app/components/DonationEmbed";
import { toast } from "react-toastify";

export default function GitSplitsApp() {
  const { open } = useAppKit();
  const { isConnected, address } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [shareAmount, setShareAmount] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: contractBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GitHubSplitsABI.abi,
    functionName: "getContractBalance",
  });

  const { data: totalShares, refetch: refetchTotalShares } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GitHubSplitsABI.abi,
    functionName: "totalShares",
  });

  const { data: allSharesData, refetch: refetchAllShares } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GitHubSplitsABI.abi,
    functionName: "getAllShares",
  });

  const { data: userShares, refetch: refetchUserShares } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GitHubSplitsABI.abi,
    functionName: "getShare",
    args: githubUsername ? [githubUsername] : undefined,
  });

  const { writeContract } = useWriteContract();
  const { signMessageAsync } = useSignMessage();

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
    : undefined;

  const handleAddShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (githubUsername && shareAmount) {
      setIsLoading(true);
      try {
        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: GitHubSplitsABI.abi,
          functionName: "addShare",
          args: [githubUsername, parseEther(shareAmount)],
        });
        toast.success("Share added successfully!");
        refetchTotalShares();
        refetchUserShares();
        refetchAllShares();
        setGithubUsername("");
        setShareAmount("");
      } catch (error) {
        console.error("Error adding share:", error);
        toast.error("Failed to add share. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClaimFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (githubUsername) {
      try {
        const message = `I am ${githubUsername} on GitHub`;
        const signature = await signMessageAsync({ message });

        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: GitHubSplitsABI.abi,
          functionName: "claim",
          args: [githubUsername, signature],
        });
        refetchBalance();
        refetchUserShares();
        refetchAllShares();
      } catch (error) {
        console.error("Error claiming funds:", error);
      }
    }
  };

  const handleDonate = async () => {
    if (donationAmount) {
      setIsLoading(true);
      try {
        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: GitHubSplitsABI.abi,
          functionName: "donate",
          value: parseEther(donationAmount),
        });
        toast.success("Donation successful!");
        setDonationAmount("");
        refetchBalance();
      } catch (error) {
        console.error("Error donating:", error);
        toast.error("Donation failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const embedCode = `
<div id="gitsplits-donate"></div>
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/ethers@5.0.0/dist/ethers.umd.min.js"></script>
<script src="https://example.com/path-to-your-embed-script.js"></script>
<script>
  GitSplitsDonate.render({
    contractAddress: '${CONTRACT_ADDRESS}',
    containerElementId: 'gitsplits-donate'
  });
</script>
  `;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to GitSplits
          </h1>
          <p className="text-xl text-gray-600">
            Forked code? Easy attribution & kickback for your contributors
          </p>
        </div>

        {isClient && !isConnected ? (
          <div className="text-center mb-12">
            <p className="mb-4 text-lg">Connect your wallet to get started</p>
            <button
              onClick={() => open()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center mx-auto"
            >
              <Wallet className="mr-2" /> Connect Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <PieChartIcon className="mr-2" /> Contract Overview
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Contract Balance:</strong>{" "}
                  {contractBalance
                    ? formatEther(contractBalance as bigint)
                    : "0"}{" "}
                  ETH
                </p>
                <p>
                  <strong>Your Balance:</strong>{" "}
                  {userBalance ? formatEther(userBalance.value) : "0"} ETH
                </p>
                <p>
                  <strong>Total Shares:</strong>{" "}
                  {totalShares ? formatEther(totalShares as bigint) : "0"}
                </p>
                <p>
                  <strong>Your Shares:</strong>{" "}
                  {userShares ? formatEther(userShares as bigint) : "0"} ETH
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Github className="mr-2" /> Share Distribution
              </h2>
              {allShares && allShares.length > 0 ? (
                <PieChart
                  data={allShares.map((share, index) => ({
                    title: share.username,
                    value: Number(formatEther(share.amount)),
                    color: `hsl(${index * 50}, 70%, 50%)`,
                  }))}
                  label={({ dataEntry }) => dataEntry.title}
                  labelStyle={{ fontSize: "5px", fill: "white" }}
                />
              ) : (
                <p>No shares available</p>
              )}
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <UserPlus className="mr-2" /> Add Share
              </h2>
              <form onSubmit={handleAddShare} className="space-y-4">
                <input
                  type="text"
                  placeholder="GitHub Username (max 32 characters)"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  maxLength={32}
                />
                <input
                  type="number"
                  placeholder="Share Amount (ETH)"
                  value={shareAmount}
                  onChange={(e) => setShareAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Add Share
                </button>
              </form>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Download className="mr-2" /> Claim Funds
              </h2>
              <form onSubmit={handleClaimFunds} className="space-y-4">
                <input
                  type="text"
                  placeholder="GitHub Username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  maxLength={32}
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300"
                >
                  Claim Funds
                </button>
              </form>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <DollarSign className="mr-2" /> Donate
              </h2>
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Donation Amount (ETH)"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  onClick={handleDonate}
                  disabled={isLoading}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  {isLoading ? "Processing..." : "Donate"}
                </button>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Code className="mr-2" /> Embed Donation Widget
              </h2>
              <button
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                className="w-full p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 mb-4"
              >
                {showEmbedCode ? "Hide Embed Code" : "Show Embed Code"}
              </button>
              {showEmbedCode && (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{embedCode}</code>
                </pre>
              )}
            </div>
          </div>
        )}

        <div className="mt-12 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <DollarSign className="mr-2" /> Current Shares
          </h2>
          {allShares && allShares.length > 0 ? (
            <ul className="space-y-2">
              {allShares.map((share, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>{share.username}</span>
                  <span>{formatEther(share.amount)} ETH</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No shares available</p>
          )}
        </div>
      </div>
    </div>
  );
}
