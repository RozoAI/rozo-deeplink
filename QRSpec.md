# QRSpec.md

This document provides practical QR code string examples for supported deeplink types. These example QR contents cover all currently supported protocols and edge-cases.

#### More info can refer to [@rozoai/deeplink-core](https://github.com/RozoAI/rozo-deeplink/tree/master/packages/core)

### Table of Contents

- [Ethereum/EVM](#ethereumevm)
  - [1. EVM Address (simple)](#1-evm-address-simple)
  - [2. EIP-681 Payment Request – native ETH transfer](#2-eip-681-payment-request--native-eth-transfer)
  - [3. EIP-681 with chain ID](#3-eip-681-with-chain-id)
  - [4. EIP-681 ERC-20 token transfer (Base USDC, recipient specified)](#4-eip-681-erc-20-token-transfer-base-usdc-recipient-specified)
  - [5. EIP-681 ERC-20, non-decimal amount, non-standard chain](#5-eip-681-erc-20-non-decimal-amount-non-standard-chain)
  - [6. EIP-681 generic contract call (approve)](#6-eip-681-generic-contract-call-approve)
  - [7. EIP-681 minimal (just contract and chain id)](#7-eip-681-minimal-just-contract-and-chain-id)
- [Solana](#solana)
  - [1. Solana Address (plain)](#1-solana-address-plain)
  - [2. Solana Pay – SOL transfer with amount](#2-solana-pay--sol-transfer-with-amount)
  - [3. Solana Pay – SPL token transfer](#3-solana-pay--spl-token-transfer)
  - [4. Solana Pay – with label, message, memo](#4-solana-pay--with-label-message-memo)
  - [5. Solana Pay – multiple references](#5-solana-pay--multiple-references)
  - [6. Solana Pay – interactive transaction link (Base64-encoded URL)](#6-solana-pay--interactive-transaction-link-base64-encoded-url)
  - [7. Solana Pay – minimal (plain address, no params)](#7-solana-pay--minimal-plain-address-no-params)
- [Stellar](#stellar)
  - [1. Stellar Address (plain)](#1-stellar-address-plain)
  - [2. SEP-7 Pay Request (XLM)](#2-sep-7-pay-request-xlm)
  - [3. SEP-7 Pay Request (with asset)](#3-sep-7-pay-request-with-asset)
  - [4. SEP-7 Pay with memo and callback](#4-sep-7-pay-with-memo-and-callback)
  - [5. SEP-7 Pay with message and origin domain](#5-sep-7-pay-with-message-and-origin-domain)
  - [6. SEP-7 Transaction (XDR)](#6-sep-7-transaction-xdr)
  - [7. SEP-7 Pay with extra custom params](#7-sep-7-pay-with-extra-custom-params)
- [Websites](#websites)
  - [1. HTTP](#1-http)
  - [2. HTTPS (root)](#2-https-root)
  - [3. HTTPS (deep link)](#3-https-deep-link)
  - [4. HTTPS with path and param](#4-https-with-path-and-param)
  - [5. HTTPS with anchor/hash](#5-https-with-anchorhash)
  - [6. HTTPS with port](#6-https-with-port)
  - [7. Minimal domain](#7-minimal-domain)

## Ethereum/EVM

### 1. EVM Address (simple)

```
0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
```

### 2. EIP-681 Payment Request – native ETH transfer

```
ethereum:0x71C7656EC7ab88b098defB751B7401B5f6d8976F?value=1e18
```

### 3. EIP-681 with chain ID

```
ethereum:0x71C7656EC7ab88b098defB751B7401B5f6d8976F@1?value=1.5e18
```

### 4. EIP-681 ERC-20 token transfer (Base USDC, recipient specified)

```
ethereum:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913/transfer?address=0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed&uint256=1000000
```

### 5. EIP-681 ERC-20, non-decimal amount, non-standard chain

```
ethereum:0x6B175474E89094C44Da98b954EedeAC495271d0F@10/transfer?address=0xab5801a7d398351b8be11c439e05c5b3259aec9b&uint256=42
```

### 6. EIP-681 generic contract call (approve)

```
ethereum:0x6B175474E89094C44Da98b954EedeAC495271d0F/approve?address=0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed&uint256=20000
```

### 7. EIP-681 minimal (just contract and chain id)

```
ethereum:0x6B175474E89094C44Da98b954EedeAC495271d0F@1
```

## Solana

### 1. Solana Address (plain)

```
7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

### 2. Solana Pay – SOL transfer with amount

```
solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU?amount=2.5
```

### 3. Solana Pay – SPL token transfer

```
solana:9wFFmGphb7ys1gxkZUJ3pDQDkF1iVjU8D6S6A9VySbT9?amount=10.25&spl-token=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

### 4. Solana Pay – with label, message, memo

```
solana:F7euY9zagcCTMLQxak4DipJ7NzpKGnNsRVkSh8Brq5Kz?amount=5&label=Charity&message=Donation&memo=ThankYou
```

### 5. Solana Pay – multiple references

```
solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU?reference=abcd1234&reference=efgh5678
```

### 6. Solana Pay – interactive transaction link (Base64-encoded URL)

```
solana:https%3A%2F%2Fmerchant.example.com%2Fsolana-pay%3Forder%3D888
```

### 7. Solana Pay – minimal (plain address, no params)

```
solana:3n7eT2xzUrWGWwYWnAqymPJrhRuQ9wKziZjqybjEK9ZT
```

## Stellar

### 1. Stellar Address (plain)

```
GC65CUPW2IMTJJY6CII7F3OBPVG4YGASEPBBLM4V3LBKX62P6LA24OFV
```

### 2. SEP-7 Pay Request (XLM)

```
web+stellar:pay?destination=GC65CUPW2IMTJJY6CII7F3OBPVG4YGASEPBBLM4V3LBKX62P6LA24OFV&amount=120.5
```

### 3. SEP-7 Pay Request (with asset)

```
web+stellar:pay?destination=GC65CUPW2IMTJJY6CII7F3OBPVG4YGASEPBBLM4V3LBKX62P6LA24OFV&asset_code=USDC&asset_issuer=GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7&amount=100
```

### 4. SEP-7 Pay with memo and callback

```
web+stellar:pay?destination=GC65CUPW2IMTJJY6CII7F3OBPVG4YGASEPBBLM4V3LBKX62P6LA24OFV&amount=55.55&memo=Invoice123&memo_type=text&callback=https%3A%2F%2Fshop.com%2Fcb
```

### 5. SEP-7 Pay with message and origin domain

```
web+stellar:pay?destination=GC65CUPW2IMTJJY6CII7F3OBPVG4YGASEPBBLM4V3LBKX62P6LA24OFV&msg=For payment&origin_domain=merchant.com
```

### 6. SEP-7 Transaction (XDR)

```
web+stellar:tx?xdr=AAAAAgAAAAAFrgdcAAAAAgAAAAAAAAAAAAAAAwAAAAAAAAAAUQAAAAAAABMtAAAAAAEAAQAAAAEAAAAAAAAAAQAAAABU2lkHD5fTYNbAABehcVQAAAAAA==&replace=0,1
```

### 7. SEP-7 Pay with extra custom params

```
web+stellar:pay?destination=GC65CUPW2IMTJJY6CII7F3OBPVG4YGASEPBBLM4V3LBKX62P6LA24OFV&amount=46.1&custom_param=rozo&another_param=test
```

## Websites

### 1. HTTP

```
http://example.com/page?param=rozo
```

### 2. HTTPS (root)

```
https://rozo.ai
```

### 3. HTTPS (deep link)

```
https://pay.example.com/checkout?orderId=ABCD1234
```

### 4. HTTPS with path and param

```
https://blog.example.org/articles/2023/web3-wallet?ref=deeplink
```

### 5. HTTPS with anchor/hash

```
https://rozo.ai#about
```

### 6. HTTPS with port

```
https://localhost:3000/test
```

### 7. Minimal domain

```
https://a.co
```
