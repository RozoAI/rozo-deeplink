import { getAddress, isAddress } from "viem";
import { baseUSDC } from "../constants";
import type { EthereumParseResult } from "../types";
import { createTransactionMessage } from "../utils";

export function parseEthereum(input: string): EthereumParseResult | null {
  if (!input.startsWith("ethereum:")) {
    return null;
  }

  const uri = input.substring(9);
  const [path, queryString] = uri.split("?");
  const params = new URLSearchParams(queryString || "");

  const [pathWithoutFunction, functionName] = path.split("/");
  const [targetAddress, chainIdStr] = pathWithoutFunction.split("@");

  if (!isAddress(targetAddress)) {
    return {
      type: "ethereum",
      message: "Error: Invalid Ethereum URI - invalid target address",
    };
  }

  const result: EthereumParseResult = {
    type: "ethereum",
    address: getAddress(targetAddress),
    chain_id: chainIdStr ? Number.parseInt(chainIdStr, 10) : baseUSDC.chainId,
    message: "Ethereum request",
    asset: {
      contract: getAddress(baseUSDC.token),
    },
  };

  if (functionName) {
    return parseContractCall(result, functionName, params);
  }

  return parseNativeTransfer(result, params);
}

function parseContractCall(
  baseResult: EthereumParseResult,
  functionName: string,
  params: URLSearchParams
): EthereumParseResult {
  const result: EthereumParseResult = {
    ...baseResult,
    operation: functionName.toLowerCase(),
  };

  if (result.operation === "transfer") {
    const recipient = params.get("address")?.trim();
    const amount = params.get("uint256")?.trim();

    if (recipient && isAddress(recipient)) {
      result.asset = { contract: result.address };
      result.address = getAddress(recipient);
      result.amount = amount;
      result.message = createTransactionMessage(
        "ethereum",
        "transfer",
        amount,
        { code: "TOKEN" },
        undefined
      );
    } else {
      result.message =
        "Error: Invalid ERC20 transfer - missing or invalid recipient";
    }
  } else {
    result.message = `Contract call to ${functionName}`;
    const extra_params: Record<string, string> = {};
    for (const [key, value] of Array.from(params.entries())) {
      extra_params[key] = value;
    }
    if (Object.keys(extra_params).length > 0) {
      result.extra_params = extra_params;
    }
  }

  return result;
}

function parseNativeTransfer(
  baseResult: EthereumParseResult,
  params: URLSearchParams
): EthereumParseResult {
  const result = { ...baseResult };
  const amount = params.get("value")?.trim();

  if (amount) {
    result.operation = "transfer";
    result.amount = amount;
    result.message = createTransactionMessage(
      "ethereum",
      "transfer",
      amount,
      { code: "ETH" },
      undefined
    );
  } else {
    result.message = "Ethereum address";
  }

  return result;
}
