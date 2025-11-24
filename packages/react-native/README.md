# @rozoai/deeplink-react-native

React Native QR code scanner component for Expo and Bare React Native apps. Automatically parses blockchain deeplinks using `@rozoai/deeplink-core`.

## Features

- 📱 **Expo + Bare React Native** support
- 📷 **Automatic camera permission** handling
- 🔍 **QR code scanning** using `expo-camera`
- ⛓️ **Multi-chain support**: Ethereum, Solana, Stellar, and more
- 🎨 **Customizable UI** with overlay and styling options
- ♻️ **Retry functionality** with "Scan Again" button
- 🔒 **Type-safe** with full TypeScript support

## Installation

### For Expo Projects

```bash
# Install the package
pnpm add @rozoai/deeplink-react-native @rozoai/deeplink-core

# Install Expo camera
npx expo install expo-camera
```

### For Bare React Native Projects

```bash
# Install the package
pnpm add @rozoai/deeplink-react-native @rozoai/deeplink-core

# Install Expo camera
npx expo install expo-camera

# iOS only - install pods
cd ios && pod install && cd ..
```

## Setup

### Expo

No additional setup required for managed workflow. For bare workflow or custom development builds, see the [expo-camera documentation](https://docs.expo.dev/versions/latest/sdk/camera/).

### Bare React Native

#### iOS (ios/Podfile)

```ruby
# Already included if you ran pod install after expo install
```

Add to `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan QR codes</string>
```

#### Android (android/app/src/main/AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

## Usage

### Basic Example

```tsx
import React, { useState } from "react";
import { View, Button, Alert } from "react-native";
import { ScanQrNative } from "@rozoai/deeplink-react-native";
import { DeeplinkData } from "@rozoai/deeplink-core";

export default function App() {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (data: DeeplinkData) => {
    console.log("Scanned data:", data);
    setIsScanning(false);

    // Handle different types
    switch (data.type) {
      case "ethereum":
        Alert.alert("Ethereum", `Address: ${data.address}`);
        break;
      case "solana":
        Alert.alert("Solana", `Address: ${data.address}`);
        break;
      case "stellar":
        Alert.alert("Stellar", `Address: ${data.address}`);
        break;
      case "website":
        Alert.alert("Website", `URL: ${data.url}`);
        break;
      default:
        Alert.alert("Scanned", JSON.stringify(data));
    }
  };

  const handleError = (error: Error) => {
    console.error("Scan error:", error);
    Alert.alert("Error", error.message);
    setIsScanning(false);
  };

  const handlePermissionDenied = () => {
    Alert.alert(
      "Permission Denied",
      "Please enable camera access in settings to scan QR codes."
    );
    setIsScanning(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Scan QR Code" onPress={() => setIsScanning(true)} />

      <ScanQrNative
        isVisible={isScanning}
        onScan={handleScan}
        onError={handleError}
        onPermissionDenied={handlePermissionDenied}
      />
    </View>
  );
}
```

### Advanced Example with Custom Styling

```tsx
import { ScanQrNative } from "@rozoai/deeplink-react-native";

<ScanQrNative
  isVisible={isScanning}
  onScan={handleScan}
  onError={handleError}
  onPermissionDenied={handlePermissionDenied}
  headerText="Scan Crypto QR"
  instructionText="Align QR code within the frame"
  retryButtonText="Try Again"
  containerStyle={{
    backgroundColor: "#1a1a1a",
  }}
  overlayStyle={{
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  }}
/>;
```

### Full Example with Transaction Handling

```tsx
import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { ScanQrNative } from "@rozoai/deeplink-react-native";
import { DeeplinkData } from "@rozoai/deeplink-core";

export default function PaymentScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<DeeplinkData | null>(null);

  const handleScan = (data: DeeplinkData) => {
    setScannedData(data);
    setIsScanning(false);

    // Process payment based on blockchain type
    if (data.type === "ethereum") {
      processEthereumPayment(data);
    } else if (data.type === "solana") {
      processSolanaPayment(data);
    } else if (data.type === "stellar") {
      processStellarPayment(data);
    }
  };

  const processEthereumPayment = (data: DeeplinkData) => {
    console.log("Processing Ethereum payment:", {
      to: data.address,
      amount: data.amount,
      chainId: data.chain_id,
      token: data.asset?.contract,
    });
    // Your Ethereum transaction logic here
  };

  const processSolanaPayment = (data: DeeplinkData) => {
    console.log("Processing Solana payment:", {
      to: data.address,
      amount: data.amount,
      splToken: data.asset?.contract,
    });
    // Your Solana transaction logic here
  };

  const processStellarPayment = (data: DeeplinkData) => {
    console.log("Processing Stellar payment:", {
      destination: data.address,
      amount: data.amount,
      asset: data.asset,
    });
    // Your Stellar transaction logic here
  };

  return (
    <View style={styles.container}>
      <Button title="Scan Payment QR" onPress={() => setIsScanning(true)} />

      {scannedData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Type: {scannedData.type}</Text>
          <Text style={styles.resultText}>Address: {scannedData.address}</Text>
          {scannedData.amount && (
            <Text style={styles.resultText}>Amount: {scannedData.amount}</Text>
          )}
        </View>
      )}

      <ScanQrNative
        isVisible={isScanning}
        onScan={handleScan}
        onError={(error) => console.error(error)}
        onPermissionDenied={() => setIsScanning(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
```

## API Reference

### Props

| Prop                 | Type                           | Required | Default                               | Description                                         |
| -------------------- | ------------------------------ | -------- | ------------------------------------- | --------------------------------------------------- |
| `onScan`             | `(data: DeeplinkData) => void` | ✅       | -                                     | Callback when QR is successfully scanned and parsed |
| `onError`            | `(error: Error) => void`       | ✅       | -                                     | Callback when an error occurs                       |
| `isVisible`          | `boolean`                      | ❌       | `true`                                | Controls scanner modal visibility                   |
| `onPermissionDenied` | `() => void`                   | ❌       | -                                     | Callback when camera permission is denied           |
| `containerStyle`     | `object`                       | ❌       | -                                     | Custom style for the main container                 |
| `overlayStyle`       | `object`                       | ❌       | -                                     | Custom style for the scanner overlay                |
| `headerText`         | `string`                       | ❌       | `"Scan QR Code"`                      | Header text displayed at the top                    |
| `instructionText`    | `string`                       | ❌       | `"Position QR code within the frame"` | Instruction text below scanner                      |
| `retryButtonText`    | `string`                       | ❌       | `"Scan Again"`                        | Text for the retry button                           |

### DeeplinkData Type

The `onScan` callback receives a `DeeplinkData` object from `@rozoai/deeplink-core`:

```typescript
type DeeplinkData =
  | EthereumParseResult
  | SolanaParseResult
  | StellarParseResult
  | WebsiteParseResult
  | AddressParseResult;

// Common fields across blockchain types
interface BlockchainParseResult {
  type: "ethereum" | "solana" | "stellar" | "address";
  address?: string;
  amount?: string;
  operation?: string;
  message: string;
  asset?: {
    contract?: string;
    code?: string;
    issuer?: string;
  };
  chain_id?: string | number;
  // ... and more fields
}
```

For full type definitions, see [`@rozoai/deeplink-core` documentation](https://github.com/RozoAI/rozo-deeplink/tree/master/packages/core).

## Supported QR Code Formats

This library supports scanning and parsing:

- ✅ **Ethereum/EVM**: EIP-681 payment requests, addresses
- ✅ **Solana**: Solana Pay URIs, addresses
- ✅ **Stellar**: SEP-7 payment URIs, addresses
- ✅ **Websites**: HTTP/HTTPS URLs

For detailed format specifications, see [QRSpec.md](https://github.com/RozoAI/rozo-deeplink/blob/master/QRSpec.md).

## Troubleshooting

### Camera Permission Issues

**Problem**: Camera permission is denied

**Solution**:

1. Check that you've added camera usage descriptions to your app config
2. Ensure the user hasn't permanently denied permission in device settings
3. Use the `onPermissionDenied` callback to guide users to settings

### Scanner Not Working in Expo Go

**Problem**: Scanner doesn't work in Expo Go app

**Solution**:

- Expo Go supports `expo-camera` out of the box
- Make sure you're using the latest version of Expo Go (SDK 51+)
- If issues persist, create a development build: `npx expo run:ios` or `npx expo run:android`

### QR Code Not Detected

**Problem**: QR code is not being detected

**Solution**:

1. Ensure good lighting conditions
2. Hold the device steady and at the right distance
3. Make sure the QR code is not too small or too large in the frame
4. Check that the QR code is valid and not damaged

## Related Packages

- **[@rozoai/deeplink-core](../core)**: Core parsing library
- **[@rozoai/deeplink-react](../scan-qr)**: Web version (React)
- **[Demo App](../../apps/demo)**: Next.js demo application

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT © Rozo AI
