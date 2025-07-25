import { getAddress, isAddress } from "viem";
import { baseUSDC, ROZO_MIDDLE_BASE_ADDRESS } from "../constants";
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
    const ethereumPart = input.slice(9); // Remove "ethereum:" prefix

    // Check if there's a chain specification (@ symbol)
    const [address, chainSpec] = ethereumPart.split("@");

    try {
      if (isAddress(address)) {
        return {
          type: "ethereum",
          address: getAddress(address),
          operation: "transfer",
          chain_id: chainSpec ? parseInt(chainSpec, 16) : baseUSDC.chainId,
          asset: {
            contract: getAddress(baseUSDC.token),
          },
          message: chainSpec
            ? `Detected EVM address with chain ${chainSpec}. Please verify the chain is correct.`
            : "Detected EVM address. Please make sure you are sending to Base.",
        };
      }
    } catch {
      // Not a valid EVM address
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
        message:
          "Detected EVM address. Please make sure you are sending to Base.",
      };
    }
  } catch {
    // Not a valid EVM address
  }

  return null;
}
