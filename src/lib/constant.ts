import { address, SolanaClusterMoniker } from "gill";

export const baseMint = address("BXMHhBrP7RkTrS8v9UDdPZNq7PiMQCcn6i7TYREELHuQ")
export const helius_url = `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`
export const DEFAULT_SWAP_SLIPPAGE = 1