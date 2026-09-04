# CLAUDE.md — rozo-deeplink

pnpm monorepo publishing three deeplink packages used across Rozo apps for QR code generation and mobile wallet deep-linking.

## Packages

| Package                 | NPM name                        | Purpose                            |
| ----------------------- | ------------------------------- | ---------------------------------- |
| `packages/core`         | `@rozoai/deeplink-core`         | Core deeplink URL builder, QR spec |
| `packages/react`        | `@rozoai/deeplink-react`        | React hooks + components           |
| `packages/react-native` | `@rozoai/deeplink-react-native` | React Native hooks + components    |
| `apps/`                 | demo apps                       | Integration examples               |

## Development Commands

```bash
pnpm install

# Build all packages (required before demo)
pnpm build

# Dev mode (build packages + run demo)
pnpm dev

# Run tests across all packages
pnpm test

# Type check
pnpm type-check

# Lint
pnpm lint
pnpm lint:fix

# Clean everything
pnpm clean
```

## Release

```bash
# Uses bumpp for version bumping
cd packages/core && pnpm release
```

## Key Notes

- `postinstall` runs `pnpm build` automatically — packages must build before use
- `QRSpec.md` documents the QR code URL format spec
- Used by: `rozo-invoice`, `rozo-privy`, `rozo-wallets-express`, `intent-pay`
- Published as `@rozoai/deeplink-*` to npm
