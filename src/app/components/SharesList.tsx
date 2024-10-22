// SharesList.tsx
import React from "react";
import { formatEther } from "viem";

interface SharesListProps {
  shares: Array<{
    username: string;
    amount: bigint;
  }>;
}

const SharesList: React.FC<SharesListProps> = ({ shares }) => {
  if (!shares || shares.length === 0) {
    return <p className="text-gray-500">No shares available</p>;
  }

  return (
    <ul className="space-y-2">
      {shares.map((share, index) => (
        <li
          key={index}
          className="flex justify-between items-center border-b py-2"
        >
          <span className="font-medium">{share.username}</span>
          <span className="text-gray-600">{formatEther(share.amount)} ETH</span>
        </li>
      ))}
    </ul>
  );
};

export default SharesList;
