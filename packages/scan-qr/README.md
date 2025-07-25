# @rozoai/deeplink-react

A React component for scanning QR codes and parsing them with `@rozoai/deeplink-core`.

## Installation

```bash
pnpm add @rozoai/deeplink-react @rozoai/deeplink-core
```

## Usage

```tsx
import { useState } from "react";
import { ScanQr } from "@rozoai/deeplink-react";
import { type DeeplinkData } from "@rozoai/deeplink-core";

function MyComponent() {
  const [isScannerOpen, setScannerOpen] = useState(false);

  const handleScanSuccess = (data: DeeplinkData) => {
    console.log("Scanned data:", data);
    setScannerOpen(false);
  };

  const handleScanError = (error: Error) => {
    console.error("Scan error:", error);
    setScannerOpen(false);
  };

  return (
    <div>
      <button onClick={() => setScannerOpen(true)}>Scan QR Code</button>
      <ScanQr
        isOpen={isScannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScanSuccess}
        onError={handleScanError}
      />
    </div>
  );
}
```

## Props

- `isOpen` (boolean): Controls the visibility of the scanner modal.
- `onClose` (() => void): Callback function invoked when the scanner modal is requested to be closed.
- `onScan` ((data: DeeplinkData) => void): Callback function invoked when a QR code is successfully scanned and parsed.
- `onError` ((error: Error) => void): Callback function invoked when an error occurs during scanning or parsing.

---

## Related Packages

- **[@rozoai/deeplink-core](../core)**: The core library for parsing deeplinks from various blockchain and payment protocols.
- **[Demo Application](../../apps/demo)**: A Next.js application demonstrating the usage of `@rozoai/deeplink-core` and `@rozoai/deeplink-react`. 