import { describe, expect, it } from "vitest";
import { baseUSDC } from "../constants";
import { parseEthereum } from "../protocols/ethereum";
import type { EthereumParseResult } from "../types";

describe("Ethereum Parser", () => {
  const validAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const anotherAddress = "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed";

  describe("EIP-681: Native ETH Transfer", () => {
    it("should parse a native ETH transfer with value", () => {
      const input = `ethereum:${validAddress}?value=1.5e18`;
      const result = parseEthereum(input) as EthereumParseResult;
      expect(result).toHaveProperty("address", validAddress);
      expect(result).toHaveProperty("amount", "1.5e18");
      expect(result).toHaveProperty("type", "ethereum");
    });

    it("should parse a native ETH transfer with chain ID and value", () => {
      const input = `ethereum:${validAddress}@1?value=1e18`;
      const result = parseEthereum(input) as EthereumParseResult;
      expect(result).toMatchObject({
        chain_id: 1,
        amount: "1e18",
      });
    });

    it("should handle a request with no value as a plain address", () => {
      const input = `ethereum:${validAddress}`;
      const result = parseEthereum(input) as EthereumParseResult;
      expect(result).toMatchObject({
        type: "ethereum",
        address: validAddress,
      });
    });
  });

  describe("EIP-681: ERC-20 Token Transfer", () => {
    it("should parse an ERC-20 transfer", () => {
      const input = `ethereum:${baseUSDC.token}/transfer?address=${anotherAddress}&uint256=1e6`;
      const result = parseEthereum(input) as EthereumParseResult;

      expect(result).toHaveProperty("type", "ethereum");
      expect(result).toHaveProperty("address", anotherAddress);
      expect(result).toHaveProperty("operation", "transfer");
      expect(result).toHaveProperty("amount", "1e6");
    });

    it("should handle missing recipient in ERC-20 transfer", () => {
      const input = `ethereum:${baseUSDC.token}/transfer?uint256=1e6`;
      const result = parseEthereum(input) as EthereumParseResult;
      expect(result).toHaveProperty("operation", "transfer");
    });
  });

  describe("EIP-681: General Contract Call", () => {
    it("should parse a general contract call", () => {
      const input = `ethereum:${validAddress}/approve?address=${anotherAddress}&uint256=1e18`;
      const result = parseEthereum(input) as EthereumParseResult;

      expect(result).toHaveProperty("type", "ethereum");
      expect(result).toHaveProperty("operation", "approve");
      expect(result).toHaveProperty("address", anotherAddress);
      expect(result).toHaveProperty("asset.contract", validAddress);
      expect(result).toHaveProperty("amount", "1e18");
    });
  });

  describe("Invalid Input", () => {
    it("should return null for non-ethereum URI", () => {
      const input = "bitcoin:12345";
      const result = parseEthereum(input);
      expect(result).toBeNull();
    });

    it("should return error for invalid target address in URI", () => {
      const input = "ethereum:invalid-address?value=1";
      const result = parseEthereum(input) as EthereumParseResult;
      expect(result).toHaveProperty("message", "Parsed Ethereum URI");
    });
  });
});
