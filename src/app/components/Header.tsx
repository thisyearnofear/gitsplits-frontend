import React from "react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitState,
} from "@reown/appkit/react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Header: React.FC = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { selectedNetworkId } = useAppKitState();

  // Scroll Sepolia can be identified by chain ID 534351 or "eip155:534351"
  const scrollSepoliaId = ["534351", "eip155:534351"];
  const isWrongNetwork = !scrollSepoliaId.includes(selectedNetworkId ?? "");

  return (
    <>
      <div className="flex justify-between items-center w-full px-6 py-4 bg-white/80 backdrop-blur-sm fixed top-0 z-50">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            GitSplits
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {!isConnected ? (
            <w3m-connect-button
              size="sm"
              label="Connect Wallet"
              loadingLabel="Connecting..."
            />
          ) : (
            <div className="flex items-center space-x-2">
              {isWrongNetwork && <w3m-network-button disabled={false} />}
              <w3m-account-button balance="show" />
            </div>
          )}
        </div>
      </div>
      {/* Spacer div to prevent content from being hidden under the fixed header */}
      <div className="h-16" /> {/* Adjust height to match header height */}
    </>
  );
};

export default Header;
