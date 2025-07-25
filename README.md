# Rozo Deeplink

A universal deeplink and QR code parser for web3 applications.

This monorepo contains the core logic for parsing deeplinks, a React component for scanning QR codes, and a demo application to showcase the functionality.

## Packages

- **[@rozoai/deeplink-core](./packages/core)**: The core library for parsing deeplinks from various blockchain and payment protocols. It supports Ethereum (EIP-681), Solana (Solana Pay), Stellar (SEP-7), and more.

- **[@rozoai/deeplink-react](./packages/scan-qr)**: A React component for scanning QR codes. It uses `@rozoai/deeplink-core` to parse the scanned data and provides a simple interface for developers to integrate QR code scanning into their applications.

## Demo

- **[Demo Application](./apps/demo)**: A Next.js application that demonstrates how to use `@rozoai/deeplink-core` and `@rozoai/deeplink-react`. It includes a simple UI for parsing deeplinks from a text input and a QR code scanner.

## Getting Started

To get started with the demo application, follow these steps:

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build the packages:**
   ```bash
   pnpm --filter @rozoai/deeplink-core --filter @rozoai/deeplink-react build
   ```

3. **Run the development server:**
   ```bash
   pnpm --filter demo dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any suggestions or improvements. 