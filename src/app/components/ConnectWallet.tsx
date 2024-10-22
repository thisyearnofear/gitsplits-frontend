// ConnectWallet.tsx

import React from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { Wallet } from "lucide-react";

interface ConnectWalletProps {
  isClient: boolean;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ isClient }) => {
  const { open } = useAppKit();
  const { isConnected } = useAccount();

  if (!isClient || isConnected) {
    return null;
  }

  return (
    <div className="text-center mb-12">
      <p className="mb-4 text-lg">Connect your wallet to get started</p>
      <button
        onClick={() => open()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center mx-auto"
      >
        <Wallet className="mr-2" /> Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWallet;
