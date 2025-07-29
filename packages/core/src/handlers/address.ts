import queryString from "query-string";
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
    try {
      const data = input.slice(9);

      const queryIndex = data.indexOf("?");
      const path = queryIndex === -1 ? data : data.slice(0, queryIndex);
      const query = queryIndex === -1 ? "" : data.slice(queryIndex + 1);

      const parsedQuery = queryString.parse(query);

      const [target, ...pathSegments] = path.split("/");
      const functionName =
        pathSegments.length > 0 ? pathSegments[0] : undefined;

      const [addressPart, chainSpec] = target.split("@");

      const chainId = chainSpec
        ? chainSpec.startsWith("0x")
          ? parseInt(chainSpec, 16)
          : parseInt(chainSpec, 10)
        : baseUSDC.chainId;

      // EIP-681 for token transfer, e.g. "ethereum:0xcontract@1/transfer?address=0xrecipient&uint256=1"
      if (
        functionName === "transfer" &&
        typeof parsedQuery.address === "string" &&
        isAddress(parsedQuery.address) &&
        isAddress(addressPart)
      ) {
        return {
          type: "ethereum",
          address: getAddress(parsedQuery.address),
          operation: "transfer",
          chain_id: chainId,
          asset: {
            contract: getAddress(addressPart),
          },
          message: `Detected EVM address with chain ${baseUSDC.chainName}. Please verify the chain is correct.`,
        };
      }

      // Simple address in URI, e.g., "ethereum:0x123..." or "ethereum:0x123@1" or "ethereum:0x123@0x2105"
      if (!functionName && isAddress(addressPart)) {
        return {
          type: "ethereum",
          address: getAddress(addressPart),
          operation: "transfer",
          chain_id: chainSpec
            ? chainSpec.startsWith("0x")
              ? parseInt(chainSpec, 16)
              : parseInt(chainSpec, 10)
            : baseUSDC.chainId,
          asset: {
            contract: getAddress(baseUSDC.token),
          },
          message: `Detected EVM address with chain ${baseUSDC.chainName}. Please verify the chain is correct.`,
        };
      }
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
