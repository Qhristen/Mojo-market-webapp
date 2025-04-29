export interface TokenPair {
    pairedToken: string;       // Address of the first token
    baseToken: string;       // Address of the second token
    baseSymbol: string;      // Symbol of the first token (e.g., "ETH")
    pairedSymbol: string;      // Symbol of the second token (e.g., "USDC")
    baaaseDecimals: number;    // Decimal places of the first token
    pairedDecimals: number;    // Decimal places of the second token
    baseReserve: string;     // Current reserve of the first token (as a string to handle large numbers)
    pairedReserve: string;     // Current reserve of the second token (as a string to handle large numbers)
    pairAddress: string;  // Address of the pair contract
    price: string;        // Current price ratio between tokens (as a string to handle precision)
    fee?: number;         // Optional fee percentage (e.g., 0.3% for Uniswap V2)
  }