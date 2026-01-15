import type { EthereumParseResult } from "../types";

/**
 * Parses an Ethereum URI according to EIP-681 specification.
 *
 * @see https://eips.ethereum.org/EIPS/eip-681
 * @param input - The Ethereum URI to parse (e.g., "ethereum:0x1234...@1?value=1000")
 * @returns Parsed Ethereum data or null if the URI is invalid
 */
export function parseEthereum(input: string): EthereumParseResult | null {
  if (!input.startsWith("ethereum:")) {
    return null;
  }

  const withoutScheme = input.slice("ethereum:".length);
  const [targetAndChain, queryString] = withoutScheme.split("?");
  const [targetPart, maybeChainId] = targetAndChain.split("@");

  let tokenAddress: string | undefined = undefined;
  let functionName: string | undefined = undefined;
  let recipient: string | undefined = undefined;
  let chainId: string | number | undefined = undefined;

  if (targetPart.includes("/")) {
    const [contract, func] = targetPart.split("/");
    tokenAddress = contract;
    functionName = func;
  } else if (/^0x[a-fA-F0-9]{40}$/.test(targetPart)) {
    recipient = targetPart;
  }

  if (maybeChainId) {
    chainId = maybeChainId.startsWith("0x")
      ? parseInt(maybeChainId, 16)
      : parseInt(maybeChainId, 10);
  }

  const parameters: Record<string, string> = {};
  if (queryString) {
    const pairs = queryString.split("&");
    for (const pair of pairs) {
      const [key, value] = pair.split("=");
      if (key && value) {
        parameters[key] = decodeURIComponent(value);
      }
    }
  }

  const result: EthereumParseResult = {
    type: "ethereum",
    address: recipient,
    chain_id: chainId,
  };

  if (tokenAddress) {
    result.token_address = tokenAddress;
  }

  if (parameters.value) {
    result.amount = parameters.value;
  }

  if (!result.amount && parameters.uint256) {
    result.amount = parameters.uint256;
  }

  if (functionName) {
    result.operation = functionName.toLowerCase();
  }

  if (parameters.address && /^0x[a-fA-F0-9]{40}$/.test(parameters.address)) {
    // The `address` parameter is typically the recipient/spender.
    result.address = parameters.address;

    // Only derive `token_address` from the URI target when it wasn't already
    // set from a contract-style target (e.g. `ethereum:<token>/transfer`).
    // This avoids overwriting a correct contract `token_address` with an
    // undefined `recipient` for calls like `approve`.
    if (!result.token_address && recipient) {
      result.token_address = recipient;
    }
  }

  result.fee = {
    gasLimit: parameters.gas || parameters.gasLimit,
    gasPrice: parameters.gasPrice,
    maxFeePerGas: parameters.maxFeePerGas,
    maxPriorityFeePerGas: parameters.maxPriorityFeePerGas,
  };

  // Move all unused parameters to extra_params
  result.extra_params = {};
  for (const [key, value] of Object.entries(parameters)) {
    if (
      ![
        "value",
        "gas",
        "gasLimit",
        "gasPrice",
        "maxFeePerGas",
        "maxPriorityFeePerGas",
        "address",
      ].includes(key)
    ) {
      result.extra_params![key] = value;
    }
  }

  result.raw = {
    data: input,
  };

  return result;
}
