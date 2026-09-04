import { StrKey } from "@stellar/stellar-sdk";
import { getAddress, isAddress } from "viem";
import { parseEthereum } from "../protocols/ethereum";
import { isValidSolanaAddress } from "../protocols/solana";
import type { DeeplinkData } from "../types";

/**
 * Parses an address string and returns the appropriate DeeplinkData.
 * Supports Solana addresses, Stellar addresses, Ethereum URIs, and EVM addresses.
 *
 * @param input - The address string to parse (can be a plain address or URI format)
 * @returns Parsed deeplink data or null if the input is not a valid address
 */
export function parseAddress(input: string): DeeplinkData | null {
  if (isValidSolanaAddress(input)) {
    return {
      type: "solana",
      address: input,
      raw: {
        data: input,
      },
    };
  }

  // G-addresses are accounts (payable); C-addresses are contracts (not payable)
  if (StrKey.isValidEd25519PublicKey(input)) {
    return {
      type: "stellar",
      address: input,
      operation: "pay",
      raw: {
        data: input,
      },
    };
  }

  if (StrKey.isValidContract(input)) {
    return {
      type: "stellar",
      address: input,
      raw: {
        data: input,
      },
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
        raw: {
          data: input,
        },
      };
    }
  } catch {
    // Not a valid EVM address
  }

  return null;
}
