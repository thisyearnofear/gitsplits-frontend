"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESS } from "@/utils/contract";
import GitHubSplitsABI from "@/contracts/GitHubSplits.json";

export function DonationEmbed() {
  const [amount, setAmount] = useState("");
  const { writeContract } = useWriteContract();

  const handleDonate = async () => {
    if (amount) {
      try {
        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: GitHubSplitsABI.abi,
          functionName: "donate",
          value: parseEther(amount),
        });
        alert("Donation successful!");
        setAmount("");
      } catch (error) {
        console.error("Error donating:", error);
        alert("Donation failed. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Donate to this project</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in ETH"
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        onClick={handleDonate}
        className="w-full p-2 bg-green-500 text-white rounded"
      >
        Donate
      </button>
    </div>
  );
}
