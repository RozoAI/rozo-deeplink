// Base interface for all blockchain parsing results
export interface BlockchainParseResult {
  type: "stellar" | "ethereum" | "solana" | "address";
  operation?: string; // e.g., "pay", "tx", "transfer", "swap", etc.
  address?: string; // Primary address (destination, recipient, etc.)
  amount?: string; // Transaction amount
  message: string; // Human-readable description

  // Asset information
  asset?: {
    code?: string; // Asset code/symbol (USD, USDC, etc.)
    issuer?: string; // Asset issuer address
    contract?: string; // Token contract address
    decimals?: number; // Token decimals
    name?: string; // Full asset name
  };

  // Transaction metadata
  memo?: string; // Transaction memo/note
  memo_type?: string; // Type of memo

  // Network information
  network?: string; // Network identifier
  network_passphrase?: string; // Network passphrase (Stellar)
  chain_id?: string | number; // Chain ID (Ethereum)
  cluster?: string; // Cluster (Solana: mainnet-beta, testnet, devnet)

  // Callback and interaction
  callback?: string; // Callback URL
  msg?: string; // User message

  // Security and verification
  origin_domain?: string; // Origin domain for verification
  signature?: string; // Request signature

  // Raw transaction data
  xdr?: string; // Stellar XDR
  data?: string; // Ethereum transaction data
  serialized_tx?: string; // Solana serialized transaction

  // Operation-specific parameters
  replace?: string; // Stellar tx operation
  gas_limit?: string; // Ethereum gas limit
  gas_price?: string; // Ethereum gas price
  max_fee_per_gas?: string; // Ethereum EIP-1559
  max_priority_fee_per_gas?: string; // Ethereum EIP-1559
  compute_unit_limit?: string; // Solana compute units
  compute_unit_price?: string; // Solana compute unit price

  // Multi-asset/multi-recipient support
  recipients?: Array<{
    address: string;
    amount?: string;
    asset?: {
      code?: string;
      issuer?: string;
      contract?: string;
      decimals?: number;
      name?: string;
    };
  }>;

  // Additional parameters (for extensibility)
  extra_params?: Record<string, string>;
}

export interface WebsiteParseResult {
  type: "website";
  url: string;
}

export interface AddressParseResult extends BlockchainParseResult {
  type: "address";
}

export interface StellarParseResult extends BlockchainParseResult {
  type: "stellar";
  operation?: "pay" | "tx";
  toStellarAddress?: string;
}

export interface EthereumParseResult extends BlockchainParseResult {
  type: "ethereum";
  operation?: "transfer" | "transaction" | "contract_call" | string;
}

export interface SolanaParseResult extends BlockchainParseResult {
  type: "solana";
  operation?: "transfer" | "transaction" | "program_call";
}

// Union type for all possible results
export type DeeplinkData =
  | StellarParseResult
  | EthereumParseResult
  | SolanaParseResult
  | WebsiteParseResult
  | AddressParseResult;
