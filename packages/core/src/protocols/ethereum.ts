import type { EthereumParseResult } from "../types";

export function parseEthereum(uri: string): EthereumParseResult | null {
  if (!uri.startsWith("ethereum:")) {
    return null;
  }

  const withoutScheme = uri.slice("ethereum:".length);
  const [targetAndChain, queryString] = withoutScheme.split("?");
  const [targetPart, maybeChainId] = targetAndChain.split("@");

  let contractAddress: string | undefined = undefined;
  let functionName: string | undefined = undefined;
  let recipient: string | undefined = undefined;
  let chainId: string | number | undefined = undefined;

  if (targetPart.includes("/")) {
    const [contract, func] = targetPart.split("/");
    contractAddress = contract;
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
    message: "Parsed Ethereum URI",
    address: recipient,
    chain_id: chainId,
    extra_params: {},
  };

  if (contractAddress) {
    result.asset = { contract: contractAddress };
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
    result.address = parameters.address;
  }

  result.fee = {
    gasLimit: parameters.gas || parameters.gasLimit,
    gasPrice: parameters.gasPrice,
    maxFeePerGas: parameters.maxFeePerGas,
    maxPriorityFeePerGas: parameters.maxPriorityFeePerGas,
  };

  result.raw = {
    data: parameters.data,
  };

  // Move all unused parameters to extra_params
  for (const [key, value] of Object.entries(parameters)) {
    if (
      ![
        "value",
        "gas",
        "gasLimit",
        "gasPrice",
        "maxFeePerGas",
        "maxPriorityFeePerGas",
        "data",
        "address",
      ].includes(key)
    ) {
      result.extra_params![key] = value;
    }
  }

  return result;
}
