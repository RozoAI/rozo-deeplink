import { BlockchainParseResult } from "./types";

// Helper function to format amount with asset
export function formatAmount(
  amount?: string,
  asset?: {
    code?: string;
    issuer?: string;
    contract?: string;
    decimals?: number;
    name?: string;
  }
): string {
  if (!amount) return "";

  if (asset?.code) {
    return `${amount} ${asset.code}`;
  }

  return `${amount}`;
}

// Helper function to create human-readable message
export function createTransactionMessage(
  type: "stellar" | "ethereum" | "solana",
  operation?: string,
  amount?: string,
  asset?: BlockchainParseResult["asset"],
  customMessage?: string
): string {
  const blockchain = type.charAt(0).toUpperCase() + type.slice(1);

  let message = `${blockchain}`;

  if (operation) {
    message += ` ${operation}`;
  } else {
    message += " request";
  }

  if (amount) {
    message += ` for ${formatAmount(amount, asset)}`;
  }

  if (customMessage) {
    message += ` - ${customMessage}`;
  }

  return message;
}
