// components/ManageShares.tsx
import React, { useState } from "react";
import { useWriteContract, useSignMessage } from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-toastify";
import { CONTRACT_ADDRESS } from "@/utils/contract";
import GitHubSplitsABI from "@/contracts/GitHubSplits.json";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ManageShares: React.FC = () => {
  const [githubUsername, setGithubUsername] = useState("");
  const [shareAmount, setShareAmount] = useState("");
  const [isAddingShare, setIsAddingShare] = useState(false);
  const [isClaimingFunds, setIsClaimingFunds] = useState(false);

  const { writeContract } = useWriteContract();
  const { signMessageAsync } = useSignMessage();

  const handleAddShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (githubUsername && shareAmount) {
      if (githubUsername.length > 32) {
        toast.error("GitHub username must be 32 characters or less.");
        return;
      }
      if (parseFloat(shareAmount) <= 0) {
        toast.error("Share amount must be greater than zero.");
        return;
      }

      try {
        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: GitHubSplitsABI.abi,
          functionName: "addShare",
          args: [githubUsername, parseEther(shareAmount)],
        });
        toast.success("Share added successfully!");
        setGithubUsername("");
        setShareAmount("");
      } catch (error) {
        console.error("Error adding share:", error);
        toast.error("Failed to add share. Please try again.");
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
        toast.success("Funds claimed successfully!");
        setGithubUsername("");
      } catch (error) {
        console.error("Error claiming funds:", error);
        toast.error("Failed to claim funds. Please try again.");
      }
    } else {
      toast.error("Please enter a GitHub username.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Manage Shares</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddShare} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github-username" className="text-center block">
              GitHub Username
            </Label>
            <Input
              id="github-username"
              placeholder="Enter GitHub username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="text-center"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="share-amount" className="text-center block">
              Share Amount
            </Label>
            <Input
              id="share-amount"
              type="number"
              placeholder="Enter share amount"
              value={shareAmount}
              onChange={(e) => setShareAmount(e.target.value)}
              className="text-center"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button type="submit" disabled={isAddingShare} className="w-full">
              {isAddingShare ? "Adding..." : "Add Share"}
            </Button>
            <Button
              onClick={handleClaimFunds}
              disabled={isClaimingFunds}
              className="w-full"
            >
              {isClaimingFunds ? "Claiming..." : "Claim Funds"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManageShares;
