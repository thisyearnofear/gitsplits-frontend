import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia, defineChain, AppKitNetwork } from "@reown/appkit/networks";

// Define Scroll Sepolia testnet
const scrollSepolia: AppKitNetwork = defineChain({
  id: 534351,
  caipNetworkId: "eip155:534351",
  chainNamespace: "eip155",
  name: "Scroll Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia-rpc.scroll.io/"],
      webSocket: [], // Add WebSocket URL if available
    },
  },
  blockExplorers: {
    default: { name: "ScrollScan", url: "https://sepolia.scrollscan.com" },
  },
  contracts: {
    // Add any specific contracts for Scroll Sepolia if needed
  },
  testnet: true,
});

// Get projectId from environment variable
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  sepolia,
  scrollSepolia,
];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
