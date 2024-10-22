import React from "react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitState,
} from "@reown/appkit/react";

const Header: React.FC = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { selectedNetworkId } = useAppKitState();

  const scrollSepoliaId = "eip155:534351"; // Scroll Sepolia chain ID as a string
  const isWrongNetwork = selectedNetworkId !== scrollSepoliaId;

  return (
    <div className="flex justify-between items-center w-full px-6 py-4 bg-white/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold">GitSplits</h1>
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
  );
};

export default Header;
