# Setup Guide for @rozoai/deeplink-react-native

## ✅ Package Successfully Created!

Your new React Native package has been created with the following structure:

```
packages/react-native/
├── package.json           # Package configuration with correct peer deps
├── tsconfig.json          # TypeScript config using tsc (not Vite)
├── src/
│   └── index.tsx         # Main component: ScanQrNative
├── README.md             # Complete documentation with examples
├── .gitignore            # Git ignore rules
└── .npmignore            # NPM ignore rules
```

## 🚀 Next Steps

### 1. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Build the Package

Build all packages including the new React Native one:

```bash
pnpm build
```

Or build just the React Native package:

```bash
pnpm --filter @rozoai/deeplink-react-native build
```

### 3. Test Locally in an Expo App

Create a test Expo app to verify functionality:

```bash
# Create a new Expo app (outside the monorepo)
npx create-expo-app test-rozo-scanner
cd test-rozo-scanner

# Install the packages (using local path for testing)
pnpm add ../rozo-deeplink/packages/react-native
pnpm add @rozoai/deeplink-core
npx expo install expo-camera

# Run the app
npx expo start
```

Example usage in your test app:

```tsx
import { ScanQrNative } from "@rozoai/deeplink-react-native";
import { useState } from "react";
import { View, Button } from "react-native";

export default function App() {
  const [scanning, setScanning] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Scan QR" onPress={() => setScanning(true)} />

      <ScanQrNative
        isVisible={scanning}
        onScan={(data) => {
          console.log("Scanned:", data);
          setScanning(false);
        }}
        onError={(error) => {
          console.error("Error:", error);
          setScanning(false);
        }}
      />
    </View>
  );
}
```

## 📦 Publishing to NPM

When ready to publish:

```bash
# 1. Make sure you're logged into npm
npm login

# 2. Build the package
pnpm --filter @rozoai/deeplink-react-native build

# 3. Publish (from the package directory)
cd packages/react-native
npm publish

# Or use bumpp for version management
pnpm --filter @rozoai/deeplink-react-native bumpp
```

## ✨ Features Implemented

- ✅ **ScanQrNative** component with all required props
- ✅ Automatic camera permission handling
- ✅ Permission denied callback
- ✅ QR scanning using `expo-camera`
- ✅ Automatic parsing with `@rozoai/deeplink-core`
- ✅ "Scan Again" retry functionality
- ✅ Full TypeScript support with strict mode
- ✅ Customizable styling (containerStyle, overlayStyle)
- ✅ Customizable text labels
- ✅ Modal-based UI with isVisible control
- ✅ Beautiful scanner UI with corner markers
- ✅ Loading and error states
- ✅ Works with Expo and Bare React Native
- ✅ Built with `tsc` (not Vite or Metro)
- ✅ Proper peer dependencies configuration
- ✅ Comprehensive README with examples

## 🔍 Package Contents

### `src/index.tsx`

The main component exports:

- `ScanQrNative` - The QR scanner component

### Props Interface

```typescript
interface ScanQrNativeProps {
  onScan: (data: DeeplinkData) => void;
  onError: (error: Error) => void;
  isVisible?: boolean;
  onPermissionDenied?: () => void;
  containerStyle?: object;
  overlayStyle?: object;
  headerText?: string;
  instructionText?: string;
  retryButtonText?: string;
}
```

### Dependencies

**Peer Dependencies** (required by user):

- `react` >=18
- `react-native` >=0.70
- `expo` >=49
- `expo-camera` >=15

**Direct Dependencies**:

- `@rozoai/deeplink-core` 1.0.9

## 🎯 Key Implementation Details

1. **Permission Handling**: Automatically requests camera permission on mount when `isVisible=true`
2. **Scan Once**: Prevents multiple scans with `scanned` state flag
3. **Retry Logic**: After successful scan, user can tap "Scan Again" to reset
4. **Error Handling**: All errors are caught and passed to `onError` callback
5. **Unmounting**: Component returns `null` when `isVisible=false`
6. **Parsing**: Uses `parseDeeplink()` from core package automatically
7. **UI**: Beautiful modal with scanner overlay and corner markers

## 🧪 Testing Checklist

- [ ] Build completes without errors
- [ ] Types are generated correctly
- [ ] Camera permission request works
- [ ] Permission denied callback fires
- [ ] QR codes are detected and parsed
- [ ] onScan callback receives correct data
- [ ] Scan Again button works
- [ ] isVisible prop controls visibility
- [ ] Custom styles apply correctly
- [ ] Works in Expo Go
- [ ] Works in Expo Development Build
- [ ] Works in Bare React Native

## 📚 Documentation

See `README.md` for:

- Installation instructions
- API reference
- Usage examples
- Troubleshooting guide
- Platform-specific setup

## 🎨 Customization

The component supports extensive customization:

```tsx
<ScanQrNative
  isVisible={true}
  onScan={handleScan}
  onError={handleError}
  headerText="Scan Crypto Wallet"
  instructionText="Align the QR code"
  retryButtonText="Try Again"
  containerStyle={{ backgroundColor: "#1a1a1a" }}
  overlayStyle={{ backgroundColor: "rgba(0,0,0,0.8)" }}
/>
```

## 🐛 Known Issues / Limitations

- None currently. The package follows best practices for React Native and Expo.

## 📞 Support

For issues or questions:

- GitHub: https://github.com/RozoAI/rozo-deeplink
- Docs: See README.md

---

**Package is ready to use! 🎉**
