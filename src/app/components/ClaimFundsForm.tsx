// components/shares/ClaimFundsForm.tsx
import React from "react";
import { Download, Info } from "lucide-react";
import Tooltip from "./ui/tooltip";

interface ClaimFundsFormProps {
  githubUsername: string;
  setGithubUsername: React.Dispatch<React.SetStateAction<string>>;
  isClaimingFunds: boolean;
  handleClaimFunds: (e: React.FormEvent) => Promise<void>;
}

export const ClaimFundsForm: React.FC<ClaimFundsFormProps> = ({
  githubUsername,
  setGithubUsername,
  isClaimingFunds,
  handleClaimFunds,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-2xl font-semibold flex items-center">
          <Download className="mr-2" /> Claim Funds
          <Tooltip content="Claim your share of the funds if you're a registered GitHub user.">
            <Info className="ml-2 cursor-help" size={16} />
          </Tooltip>
        </h2>
      </div>
      <div className="card-content">
        <form onSubmit={handleClaimFunds} className="space-y-4">
          <input
            type="text"
            placeholder="GitHub Username"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            className="input"
            maxLength={32}
          />
          <button
            type="submit"
            disabled={isClaimingFunds}
            className="btn btn-primary w-full"
          >
            {isClaimingFunds ? "Claiming Funds..." : "Claim Funds"}
          </button>
        </form>
      </div>
    </div>
  );
};
