import { PublicKey } from "@solana/web3.js";
import type { SolanaParseResult } from "../types";
import { createTransactionMessage } from "../utils";

export function parseSolana(input: string): SolanaParseResult | null {
  if (input.startsWith("solana:")) {
    const urlPart = input.substring(7);
    try {
      // Check if it's an interactive transaction request (HTTPS link)
      const decodedUrl = decodeURIComponent(urlPart);
      if (decodedUrl.startsWith("https://")) {
        return parseTransactionRequest(decodedUrl);
      }
    } catch (e) {
      // Not a valid URI component, proceed as a transfer request
    }

    // Assume it's a non-interactive transfer request
    return parseTransferRequest(urlPart);
  }

  // Handle plain Solana address format
  if (isValidSolanaAddress(input)) {
    return {
      type: "solana",
      address: input,
      message: "Solana address",
    };
  }

  return null;
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    const publicKey = new PublicKey(address);
    // While isOnCurve is a good check, some valid accounts are not on the curve.
    // For the purpose of a recipient address, a valid public key format is sufficient.
    return !!publicKey;
  } catch (error) {
    return false;
  }
}

function parseTransferRequest(urlPart: string): SolanaParseResult | null {
  const [recipient, queryString] = urlPart.split("?");

  if (!isValidSolanaAddress(recipient)) {
    return {
      type: "solana",
      operation: "transfer",
      message: "Error: Invalid Solana payment URI - invalid recipient address",
    };
  }

  const params = new URLSearchParams(queryString || "");
  const result: SolanaParseResult = {
    type: "solana",
    operation: "transfer",
    address: recipient,
    message: "Solana payment request",
  };

  const amount = params.get("amount")?.trim();
  if (amount) {
    result.amount = amount;
  }

  const splToken = params.get("spl-token")?.trim();
  if (splToken) {
    result.asset = {
      contract: splToken,
    };
  }

  const label = params.get("label")?.trim();
  if (label) {
    result.origin_domain = label;
  }

  const message = params.get("message")?.trim();
  if (message) {
    result.msg = message;
  }

  const memo = params.get("memo")?.trim();
  if (memo) {
    result.memo = memo;
  }

  const referenceKeys: string[] = [];
  for (const [key, value] of Array.from(params.entries())) {
    if (key === "reference") {
      referenceKeys.push(value);
    }
  }
  if (referenceKeys.length > 0) {
    // Storing multiple references in a single, comma-separated string for now.
    // The type definition may need to be updated for better support.
    result.extra_params = {
      ...result.extra_params,
      reference: referenceKeys.join(","),
    };
  }

  result.message = createTransactionMessage(
    "solana",
    "payment",
    result.amount,
    result.asset,
    result.msg || result.origin_domain
  );

  return result;
}

function parseTransactionRequest(link: string): SolanaParseResult {
  const result: SolanaParseResult = {
    type: "solana",
    operation: "transaction",
    callback: link,
    message: "Solana transaction request",
  };

  try {
    const url = new URL(link);
    result.message = `Transaction request from ${url.hostname}`;
  } catch (error) {
    // Keep generic message if URL is somehow invalid despite checks
  }

  return result;
}
