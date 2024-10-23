import React, { useState } from "react";
import { useAccount, useWriteContract, useSignMessage } from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-toastify";
import GitHubSplitsABI from "@/contracts/GitHubSplits.json";
import { AddShareForm } from "./AddShareForm";
import { ClaimFundsForm } from "./ClaimFundsForm";
import { ManageSharesProps } from "@/types";

const ManageShares: React.FC<ManageSharesProps> = ({ contractAddress }) => {
  const [githubUsername, setGithubUsername] = useState("");
  const [shareAmount, setShareAmount] = useState("");
  const [isAddingShare, setIsAddingShare] = useState(false);
  const [isClaimingFunds, setIsClaimingFunds] = useState(false);

  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { signMessageAsync } = useSignMessage();

  const handleAddShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername || !shareAmount) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsAddingShare(true);
    try {
      await writeContract({
        address: contractAddress,
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
    } finally {
      setIsAddingShare(false);
    }
  };

  const handleClaimFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername) {
      toast.error("Please enter a GitHub username.");
      return;
    }
    setIsClaimingFunds(true);
    try {
      const message = `I am ${githubUsername} on GitHub`;
      const signature = await signMessageAsync({ message });
      await writeContract({
        address: contractAddress,
        abi: GitHubSplitsABI.abi,
        functionName: "claim",
        args: [githubUsername, signature],
      });
      toast.success("Funds claimed successfully!");
      setGithubUsername("");
    } catch (error) {
      console.error("Error claiming funds:", error);
      toast.error("Failed to claim funds. Please try again.");
    } finally {
      setIsClaimingFunds(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AddShareForm
        githubUsername={githubUsername}
        setGithubUsername={setGithubUsername}
        shareAmount={shareAmount}
        setShareAmount={setShareAmount}
        isAddingShare={isAddingShare}
        handleAddShare={handleAddShare}
      />
      <ClaimFundsForm
        githubUsername={githubUsername}
        setGithubUsername={setGithubUsername}
        isClaimingFunds={isClaimingFunds}
        handleClaimFunds={handleClaimFunds}
      />
    </div>
  );
};

export default ManageShares;
