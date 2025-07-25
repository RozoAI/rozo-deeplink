# DeepLink QR Code Parser

A universal QR code parser that supports multiple blockchain protocols and payment standards.

## Overview

The DeepLink parser automatically detects and parses QR codes for:

- **Ethereum/EVM** addresses and EIP-681 payment requests
- **Solana** addresses and Solana Pay requests
- **Stellar** addresses and SEP-7 payment requests
- **Website URLs**

## Quick Start

```typescript
import { parseDeeplink } from "@/lib/deeplink";

// Parse any QR code string
const result = parseDeeplink(qrCodeString);
if (result) {
  console.log(result.type); // "ethereum" | "address" | "solana" | "stellar" | "website"
}
```

## Supported Formats

### Ethereum/EVM

- **EIP-681 Payment Requests**: `ethereum:<contract_address>@<chain_id>/<function_name>?<params>`
- **EVM Addresses**: `0x...` (defaults to Base network for USDC payments)

### Solana

- **Solana Pay**: `solana:<address>?<params>`
- **Solana Addresses**: Base58 encoded addresses

### Stellar

- **SEP-7 Payment URI**: `web+stellar:(pay|tx)?<params>`
- **Stellar Addresses**: G-prefixed public keys

### Websites

- **HTTP/HTTPS URLs**: Any valid web URL

## Return Types

The `parseDeeplink` function returns a `DeeplinkData` object, which is a union of the following types:

```typescript
// The main union type for all parsing results
export type DeeplinkData =
  | StellarParseResult
  | EthereumParseResult
  | SolanaParseResult
  | WebsiteParseResult
  | AddressParseResult;

// Base interface for all blockchain-related results
export interface BlockchainParseResult {
  type: "stellar" | "ethereum" | "solana" | "address";
  operation?: string;
  address?: string;
  amount?: string;
  message: string;
  asset?: {
    code?: string;
    issuer?: string;
    contract?: string;
    decimals?: number;
    name?: string;
  };
  // ... and many other optional fields for different protocols
}

export interface WebsiteParseResult {
  type: "website";
  url: string;
}
```

For the full details of all fields, please refer to `lib/deeplink/types.ts`.

## Examples

```typescript
// EIP-681 Payment Request for USDC on Base
parseDeeplink(
  "ethereum:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913@8453/transfer?address=0xRecipient&uint256=1000000"
);
// Returns:
// {
//   type: "ethereum",
//   operation: "transfer",
//   asset: { contract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
//   chain_id: 8453,
//   recipients: [ { address: "0xRecipient", amount: "1000000" } ],
//   message: "Ethereum transfer"
// }

// EVM Address
parseDeeplink("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6");
// Returns:
// {
//   type: "address",
//   address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
//   operation: "transfer",
//   chain_id: 8453,
//   asset: { contract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
//   message: "Detected EVM address. Please make sure you are sending to Base."
// }

// Website
parseDeeplink("https://rozo.ai");
// Returns: { type: "website", url: "https://rozo.ai" }

// Solana Address
parseDeeplink("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");
// Returns: { type: "solana", address: "...", message: "Solana payment coming soon." }

// Stellar Payment Request
parseDeeplink(
  "web+stellar:pay?destination=GC...&amount=100&asset_code=USDC&asset_issuer=GA..."
);
// Returns: { type: "stellar", operation: "pay", ... }
```

## Architecture

The parser uses a **chain of responsibility** pattern, trying each parser in a specific order:

1.  **Website Parser**: Checks for `http://` or `https://` prefixes.
2.  **Address Parser**: Checks for standalone EVM addresses (`0x...`).
3.  **Ethereum Parser**: Handles EIP-681 URIs (`ethereum:...`).
4.  **Solana Parser**: Detects Solana Pay URIs (`solana:...`) and standalone addresses.
5.  **Stellar Parser**: Handles SEP-7 URIs (`web+stellar:...`) and standalone addresses.

If no parser can handle the input, it returns `null`.

## Adding New Protocols

To add support for a new blockchain:

1. Create a new parser file (e.g., `bitcoin.ts`).
2. Implement and export a `parseBitcoin(input: string): DeeplinkData | null` function.
3. Add your new parser to the `parsers` array in `lib/deeplink/index.ts`.
4. Add your new result type to the `DeeplinkData` union in `lib/deeplink/types.ts`.

```typescript
// Example: Adding Bitcoin support
export function parseBitcoin(input: string): DeeplinkData | null {
  const bitcoinRegex = /^bitcoin:([13][a-km-zA-HJ-NP-Z1-9]{25,34})/;
  const match = input.match(bitcoinRegex);
  if (match) {
    return {
      type: "bitcoin",
      address: match[1],
      message: "Bitcoin payment coming soon.",
    };
  }
  return null;
}
```

## Error Handling

- Invalid formats return `null` from individual parsers.
- The top-level `parseDeeplink` function will throw an error if no parser matches. This behavior might be updated to return `null` in the future for consistency.
- All parsers are designed to be safe and avoid throwing exceptions themselves.

## Usage in Components

```typescript
import { parseDeeplink } from "@/lib/deeplink";

function QRScanner() {
  const handleQRCode = (qrData: string) => {
    try {
      const parsed = parseDeeplink(qrData);

      switch (parsed.type) {
        case "ethereum":
          // Handle Ethereum payment
          break;
        case "website":
          // Open website
          window.open(parsed.url);
          break;
        // ... handle other cases
      }
    } catch (error) {
      console.error("Failed to parse QR code:", error);
      // Show an error message to the user
    }
  };
}
```

---

## Related Packages

- **[@rozo-deeplink/scan-qr](../scan-qr)**: A React component for scanning QR codes and parsing them with this library.
- **[Demo Application](../../apps/demo)**: A Next.js application demonstrating the usage of `@rozo-deeplink/core` and `@rozo-deeplink/scan-qr`.
