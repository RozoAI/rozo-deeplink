import { ROZO_MIDDLE_BASE_ADDRESS } from "../constants";
import { baseUSDC } from "@rozoai/intent-common";
import { StrKey } from "@stellar/stellar-sdk";
import { type StellarParseResult } from "../types";
import { createTransactionMessage } from "../utils";

export function parseStellar(input: string): StellarParseResult | null {
  // Handle SEP-0007 payment URI format - both pay and tx operations
  const stellarUriRegex = /^web\+stellar:(pay|tx)\?(.+)$/;
  const uriMatch = input.match(stellarUriRegex);

  if (uriMatch) {
    const operation = uriMatch[1] as "pay" | "tx";
    const queryString = uriMatch[2];
    const params = new URLSearchParams(queryString);

    if (operation === "pay") {
      return parsePayOperation(params);
    } else if (operation === "tx") {
      return parseTxOperation(params);
    }
  }

  // Handle plain Stellar address format
  if (!StrKey.isValidEd25519PublicKey(input)) {
    return null;
  }

  return {
    type: "stellar",
    address: input,
    message: "Stellar address",
  };
}

export function isValidStellarAddress(address: string): boolean {
  return StrKey.isValidEd25519PublicKey(address);
}

function parsePayOperation(params: URLSearchParams): StellarParseResult {
  // Extract destination (required for pay operation)
  const destination = params.get("destination")?.trim();
  if (!destination) {
    return {
      type: "stellar",
      operation: "pay",
      message: "Error: Invalid Stellar payment URI - missing destination",
    };
  }

  if (!StrKey.isValidEd25519PublicKey(destination)) {
    return {
      type: "stellar",
      operation: "pay",
      message:
        "Error: Invalid Stellar payment URI - invalid destination address",
    };
  }

  // Parse all supported parameters
  const result: StellarParseResult = {
    type: "stellar",
    operation: "pay",
    address: ROZO_MIDDLE_BASE_ADDRESS,
    toStellarAddress: destination,
    message: "Stellar payment request",
    chain_id: baseUSDC.chainId,
    asset: {
      contract: baseUSDC.token,
    },
  };

  // Optional amount
  const amount = params.get("amount")?.trim();
  if (amount) {
    result.amount = amount;
  }

  // Optional asset (asset_code and asset_issuer)
  const assetCode = params.get("asset_code")?.trim();
  const assetIssuer = params.get("asset_issuer")?.trim();
  if (assetCode && assetIssuer) {
    result.asset = {
      ...result.asset,
      code: assetCode,
      issuer: assetIssuer,
    };
  }

  // Add common parameters
  addCommonParameters(result, params);

  // Create a more descriptive message
  result.message = createTransactionMessage(
    "stellar",
    "payment",
    result.amount,
    result.asset,
    result.msg
  );

  return result;
}

function parseTxOperation(params: URLSearchParams): StellarParseResult {
  // Extract xdr (required for tx operation)
  const xdr = params.get("xdr")?.trim();
  if (!xdr) {
    return {
      type: "stellar",
      operation: "tx",
      message: "Error: Invalid Stellar transaction URI - missing XDR",
    };
  }

  // Parse all supported parameters
  const result: StellarParseResult = {
    type: "stellar",
    operation: "tx",
    xdr: xdr,
    message: "Stellar transaction request",
  };

  // Optional replace parameter (specific to tx operation)
  const replace = params.get("replace")?.trim();
  if (replace) {
    result.replace = replace;
  }

  // Add common parameters
  addCommonParameters(result, params);

  // Create a more descriptive message
  result.message = createTransactionMessage(
    "stellar",
    "transaction",
    undefined,
    undefined,
    result.msg
  );

  return result;
}

function addCommonParameters(
  result: StellarParseResult,
  params: URLSearchParams
): void {
  // Optional memo
  const memo = params.get("memo")?.trim();
  if (memo) {
    result.memo = memo;
  }

  // Optional memo_type
  const memoType = params.get("memo_type")?.trim();
  if (memoType) {
    result.memo_type = memoType;
  }

  // Optional callback URL
  const callback = params.get("callback")?.trim();
  if (callback) {
    result.callback = callback;
  }

  // Optional message
  const msg = params.get("msg")?.trim();
  if (msg) {
    result.msg = msg;
  }

  // Optional network passphrase
  const networkPassphrase = params.get("network_passphrase")?.trim();
  if (networkPassphrase) {
    result.network_passphrase = networkPassphrase;
  }

  // Optional origin domain
  const originDomain = params.get("origin_domain")?.trim();
  if (originDomain) {
    result.origin_domain = originDomain;
  }

  // Optional signature
  const signature = params.get("signature")?.trim();
  if (signature) {
    result.signature = signature;
  }

  // Collect any additional parameters not explicitly handled
  const knownParams = new Set([
    "destination",
    "amount",
    "asset_code",
    "asset_issuer",
    "memo",
    "memo_type",
    "callback",
    "msg",
    "network_passphrase",
    "origin_domain",
    "signature",
    "xdr",
    "replace",
  ]);

  const extraParams: Record<string, string> = {};
  for (const [key, value] of Array.from(params.entries())) {
    if (!knownParams.has(key)) {
      extraParams[key] = value;
    }
  }

  if (Object.keys(extraParams).length > 0) {
    result.extra_params = extraParams;
  }
}
