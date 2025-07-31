import { getAddress, isAddress } from "viem";
import { baseUSDC, ROZO_MIDDLE_BASE_ADDRESS } from "../constants";
import { parseEthereum } from "../protocols/ethereum";
import { isValidSolanaAddress } from "../protocols/solana";
import { isValidStellarAddress } from "../protocols/stellar";
import type { DeeplinkData } from "../types";

export function parseAddress(input: string): DeeplinkData | null {
  if (isValidSolanaAddress(input)) {
    return {
      type: "solana",
      address: input,
      message: "Detected Solana address.",
    };
  }

  if (isValidStellarAddress(input)) {
    return {
      type: "stellar",
      toStellarAddress: input,
      address: ROZO_MIDDLE_BASE_ADDRESS,
      operation: "pay",
      chain_id: baseUSDC.chainId,
      asset: {
        contract: getAddress(baseUSDC.token),
      },
      message: "Detected Stellar address. RozoPay will bridge to it.",
    };
  }

  // Handle ethereum: prefix with optional chain specification
  if (input.startsWith("ethereum:")) {
    try {
      return parseEthereum(input);
    } catch {
      // Invalid address or format, fall through to allow generic address parsing
    }
  }

  try {
    if (isAddress(input)) {
      return {
        type: "ethereum",
        address: getAddress(input),
        operation: "transfer",
        chain_id: baseUSDC.chainId,
        asset: {
          contract: getAddress(baseUSDC.token),
        },
        message: `Detected EVM address with chain ${baseUSDC.chainName}. Please verify the chain is correct.`,
      };
    }
  } catch {
    // Not a valid EVM address
  }

  return null;
}
