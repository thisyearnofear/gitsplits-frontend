// components/AddShareForm.tsx
import React from "react";
import { UserPlus, Info } from "lucide-react";
import Tooltip from "./ui/tooltip";

interface AddShareFormProps {
  githubUsername: string;
  setGithubUsername: React.Dispatch<React.SetStateAction<string>>;
  shareAmount: string;
  setShareAmount: React.Dispatch<React.SetStateAction<string>>;
  isAddingShare: boolean;
  handleAddShare: (e: React.FormEvent) => Promise<void>;
}

export const AddShareForm: React.FC<AddShareFormProps> = ({
  githubUsername,
  setGithubUsername,
  shareAmount,
  setShareAmount,
  isAddingShare,
  handleAddShare,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-2xl font-semibold flex items-center">
          <UserPlus className="mr-2" /> Add Share
          <Tooltip content="Add a GitHub user's share to the contract. Only the contract owner can do this.">
            <Info className="ml-2 cursor-help" size={16} />
          </Tooltip>
        </h2>
      </div>
      <div className="card-content">
        <form onSubmit={handleAddShare} className="space-y-4">
          <input
            type="text"
            placeholder="GitHub Username (max 32 characters)"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            className="input"
            maxLength={32}
          />
          <input
            type="number"
            placeholder="Share Amount (ETH)"
            value={shareAmount}
            onChange={(e) => setShareAmount(e.target.value)}
            className="input"
          />
          <button
            type="submit"
            disabled={isAddingShare}
            className="btn btn-primary w-full"
          >
            {isAddingShare ? "Adding Share..." : "Add Share"}
          </button>
        </form>
      </div>
    </div>
  );
};
