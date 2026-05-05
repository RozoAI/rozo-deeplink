# @rozoai/deeplink-core

A universal QR code / deeplink parser that supports multiple blockchain protocols and payment standards.

**Version**: 1.1.4

## Overview

`parseDeeplink` automatically detects and parses QR codes or deeplink strings for:

- **Ethereum/EVM** — EIP-681 payment requests and plain EVM addresses
- **Solana** — Solana Pay transfer/transaction requests and plain addresses
- **Stellar** — SEP-7 `pay` and `tx` URIs and plain Stellar addresses
- **Website URLs** — any `http://` or `https://` URL
- **Unknown** — unrecognized input is returned with `type: "unknown"` instead of throwing

## Installation

```bash
npm install @rozoai/deeplink-core
# or
pnpm add @rozoai/deeplink-core
```

## Quick Start

```typescript
import { parseDeeplink } from "@rozoai/deeplink-core";

const result = parseDeeplink(qrCodeString);

switch (result.type) {
  case "ethereum":
    console.log(result.address, result.chain_id, result.amount);
    break;
  case "solana":
    console.log(result.address, result.amount);
    break;
  case "stellar":
    console.log(result.address, result.operation);
    break;
  case "website":
    console.log(result.url);
    break;
  case "unknown":
    console.log("Unrecognized input:", result.raw);
    break;
}
```

> `parseDeeplink` **never throws** — unrecognized input returns `{ type: "unknown", raw: input }`.

---

## API

### `parseDeeplink(input: string): DeeplinkData`

The single entry point. Tries each parser in order and returns the first match. Always returns a `DeeplinkData` object.

### `isValidSolanaAddress(address: string): boolean`

Returns `true` if the string is a valid Solana public key.

### `isValidStellarAddress(address: string): boolean`

Returns `true` if the string is a valid Stellar Ed25519 public key.

### `formatAmount(amount?: string, asset?: AssetInfo): string`

Formats an amount with an optional asset code (e.g., `"100 USDC"`).

### `createTransactionMessage(type, operation?, amount?, asset?, customMessage?): string`

Builds a human-readable transaction summary string.

---

## Supported Formats

### Ethereum / EVM

| Format                  | Example                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| EIP-681 native transfer | `ethereum:0xRecipient@1?value=1000000000000000000`                   |
| EIP-681 token transfer  | `ethereum:0xToken@8453/transfer?address=0xRecipient&uint256=1000000` |
| EIP-681 token approve   | `ethereum:0xToken@1/approve?address=0xSpender&uint256=1000000`       |
| Plain EVM address       | `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`                         |

Supported query parameters: `value`, `uint256`, `address`, `gas` / `gasLimit`, `gasPrice`, `maxFeePerGas`, `maxPriorityFeePerGas`. All other parameters are collected into `extra_params`.

### Solana

| Format                         | Example                                           |
| ------------------------------ | ------------------------------------------------- |
| Solana Pay transfer            | `solana:7xKXtg...?amount=1&spl-token=EPjFWdd5...` |
| Solana Pay transaction request | `solana:https://api.example.com/pay`              |
| Plain Solana address           | `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`    |

Supported query parameters: `amount`, `spl-token`, `label`, `message`, `memo`, `reference`.

### Stellar

| Format                | Example                                                                         |
| --------------------- | ------------------------------------------------------------------------------- |
| SEP-7 pay             | `web+stellar:pay?destination=G...&amount=100&asset_code=USDC&asset_issuer=G...` |
| SEP-7 tx              | `web+stellar:tx?xdr=AAAA...`                                                    |
| Plain Stellar address | `GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGZWM9CQJURIKHEO4KW7SC`                       |

Supported query parameters for `pay`: `destination`, `amount`, `asset_code`, `asset_issuer`, `memo`, `memo_type`, `callback`, `msg`, `network_passphrase`, `origin_domain`, `signature`.

Supported query parameters for `tx`: `xdr`, `replace`, `memo`, `memo_type`, `callback`, `msg`, `network_passphrase`, `origin_domain`, `signature`.

### Website

Any string starting with `http://` or `https://` is returned as `{ type: "website", url: string }`.

---

## Return Types

```typescript
export type DeeplinkData =
  | EthereumParseResult
  | SolanaParseResult
  | StellarParseResult
  | WebsiteParseResult
  | AddressParseResult
  | UnknownParseResult;
```

### `EthereumParseResult`

```typescript
interface EthereumParseResult {
  type: "ethereum";
  operation?: "transfer" | "transaction" | "contract_call" | string;
  address?: string;           // recipient or spender
  token_address?: string;     // ERC-20 contract address
  chain_id?: string | number;
  amount?: string;
  fee?: {
    gasLimit?: string;
    gasPrice?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
  };
  extra_params?: Record<string, string>;
  raw?: { data?: string };
}
```

### `SolanaParseResult`

```typescript
interface SolanaParseResult {
  type: "solana";
  operation?: "transfer" | "transaction" | "program_call";
  address?: string;
  amount?: string;
  asset?: { contract?: string };  // SPL token mint address
  memo?: string;
  origin_domain?: string;         // mapped from `label` param
  user_message?: string;          // mapped from `message` param
  callback?: string;              // HTTPS link for transaction requests
  extra_params?: Record<string, string>;  // includes `reference` keys
  raw?: { data?: string };
}
```

### `StellarParseResult`

```typescript
interface StellarParseResult {
  type: "stellar";
  operation?: "pay" | "tx";
  address?: string;           // destination (pay) or undefined (tx)
  amount?: string;
  asset?: { code?: string; issuer?: string };
  memo?: string;
  memo_type?: string;
  callback?: string;
  message?: string;           // mapped from `msg` param
  network_passphrase?: string;
  origin_domain?: string;
  signature?: string;
  chain_id?: number;          // 1500 for Stellar mainnet (pay only)
  extra_params?: Record<string, string>;
  raw?: { xdr?: string; data?: string };
}
```

### `WebsiteParseResult`

```typescript
interface WebsiteParseResult {
  type: "website";
  url: string;
}
```

### `AddressParseResult`

Returned when a plain address is detected but cannot be attributed to a specific protocol context. Extends `BlockchainParseResult` with `type: "address"`.

### `UnknownParseResult`

```typescript
interface UnknownParseResult {
  type: "unknown";
  raw: string;
}
```

---

## Examples

```typescript
import { parseDeeplink } from "@rozoai/deeplink-core";

// EIP-681 token transfer (USDC on Base)
parseDeeplink(
  "ethereum:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913@8453/transfer?address=0xRecipient&uint256=1000000"
);
// {
//   type: "ethereum",
//   operation: "transfer",
//   address: "0xRecipient",
//   token_address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
//   chain_id: 8453,
//   amount: "1000000",
//   raw: { data: "ethereum:0x833589..." }
// }

// Plain EVM address
parseDeeplink("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6");
// {
//   type: "ethereum",
//   address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
//   operation: "transfer",
//   raw: { data: "0x742d35..." }
// }

// Solana Pay transfer with SPL token
parseDeeplink(
  "solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU?amount=1&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);
// {
//   type: "solana",
//   operation: "transfer",
//   address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
//   amount: "1",
//   asset: { contract: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
//   raw: { data: "solana:7xKXtg..." }
// }

// Solana Pay interactive transaction request
parseDeeplink("solana:https://api.example.com/pay");
// {
//   type: "solana",
//   operation: "transaction",
//   callback: "https://api.example.com/pay",
//   raw: { data: "solana:https://api.example.com/pay" }
// }

// Plain Solana address
parseDeeplink("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");
// {
//   type: "solana",
//   address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
//   raw: { data: "7xKXtg..." }
// }

// Stellar SEP-7 pay
parseDeeplink(
  "web+stellar:pay?destination=GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGZWM9CQJURIKHEO4KW7SC&amount=100&asset_code=USDC&asset_issuer=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
);
// {
//   type: "stellar",
//   operation: "pay",
//   address: "GCEZWKCA5...",
//   amount: "100",
//   asset: { code: "USDC", issuer: "GA5ZSEJYB..." },
//   chain_id: 1500,
//   raw: { data: "web+stellar:pay?..." }
// }

// Stellar SEP-7 tx
parseDeeplink("web+stellar:tx?xdr=AAAA...&network_passphrase=Public%20Global%20Stellar%20Network%20%3B%20September%202015");
// {
//   type: "stellar",
//   operation: "tx",
//   network_passphrase: "Public Global Stellar Network ; September 2015",
//   raw: { xdr: "AAAA...", data: "web+stellar:tx?..." }
// }

// Website
parseDeeplink("https://rozo.ai");
// { type: "website", url: "https://rozo.ai" }

// Unrecognized input
parseDeeplink("not-a-valid-deeplink");
// { type: "unknown", raw: "not-a-valid-deeplink" }
```

---

## Parser Order (Chain of Responsibility)

`parseDeeplink` tries parsers in this order and returns the first match:

1. **Website** — `http://` or `https://` prefix
2. **Address** — plain EVM, Solana, or Stellar address (also handles `ethereum:` URIs)
3. **Ethereum** — `ethereum:` URI (EIP-681)
4. **Solana** — `solana:` URI or standalone Solana address
5. **Stellar** — `web+stellar:` URI or standalone Stellar address
6. **Unknown** — fallback, always matches

---

## Adding New Protocols

1. Create `src/protocols/bitcoin.ts` and export a `parseBitcoin(input: string): DeeplinkData | null` function.
2. Add the new result type to the `DeeplinkData` union in `src/types.ts`.
3. Register the parser in the `parsers` array in `src/index.ts` before the `unknown` fallback.

```typescript
// src/protocols/bitcoin.ts
import type { DeeplinkData } from "../types";

export function parseBitcoin(input: string): DeeplinkData | null {
  const match = input.match(/^bitcoin:([13][a-km-zA-HJ-NP-Z1-9]{25,34})/);
  if (!match) return null;
  return {
    type: "bitcoin" as any,
    address: match[1],
    raw: { data: input },
  };
}
```

---

## Related Packages

- **[@rozoai/deeplink-react](../scan-qr)** — React component for scanning and parsing QR codes
- **[@rozoai/deeplink-react-native](../react-native)** — React Native / Expo QR scanner component
- **[Demo App](../../apps/demo)** — Next.js demo showing end-to-end usage
