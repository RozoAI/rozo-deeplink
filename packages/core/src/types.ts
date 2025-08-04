type AssetInfo = {
  code?: string;
  issuer?: string;
  contract?: string;
  decimals?: number;
  name?: string;
};

type Operation =
  | "pay"
  | "transfer"
  | "approve"
  | "swap"
  | "tx"
  | "delegate"
  | "sign"
  | string;

// Base interface for all blockchain parsing results
export interface BlockchainParseResult {
  type: "stellar" | "ethereum" | "solana" | "address";
  operation?: Operation;
  address?: string;
  amount?: string;
  message: string;

  asset?: AssetInfo;

  memo?: string;
  memo_type?: string;

  network_name?: string;
  network_passphrase?: string;
  chain_id?: string | number;
  cluster?: string;

  callback?: string;
  user_message?: string;
  origin_domain?: string;
  signature?: string;

  raw?: {
    xdr?: string;
    data?: string;
    serialized_tx?: string;
  };

  fee?: {
    gasLimit?: string;
    gasPrice?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    computeUnitLimit?: string;
    computeUnitPrice?: string;
  };

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
  | AddressParseResult
  | BlockchainParseResult;
