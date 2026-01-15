import { parseAddress } from "./handlers/address";
import { parseWebsite } from "./handlers/website";
import { parseEthereum } from "./protocols/ethereum";
import { parseSolana } from "./protocols/solana";
import { parseStellar } from "./protocols/stellar";
import { type DeeplinkData } from "./types";

export * from "./types";

interface DeeplinkParser {
  name: string;
  parse: (input: string) => DeeplinkData | null;
}

const parsers: DeeplinkParser[] = [
  { name: "website", parse: parseWebsite },
  { name: "address", parse: parseAddress },
  { name: "ethereum", parse: parseEthereum },
  { name: "solana", parse: parseSolana },
  { name: "stellar", parse: parseStellar },
  { name: "unknown", parse: (input) => ({ type: "unknown", raw: input }) },
];

export function parseDeeplink(input: string): DeeplinkData {
  for (const parser of parsers) {
    const result = parser.parse(input);
    if (result) return result;
  }

  // Fallback to address parsing if no other protocol matches
  const addressResult = parseAddress(input);
  if (addressResult) return addressResult;

  return { type: "unknown", raw: input };
}
