import { describe, expect, it } from "vitest";
import { parseSolana } from "../protocols/solana";
import type { SolanaParseResult } from "../types";

describe("Solana Parser", () => {
  const validRecipient = "mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2kN";
  const usdcMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  describe("Transfer Request", () => {
    const baseExpect = {
      type: "solana",
      operation: "transfer",
      address: validRecipient,
    };

    it("should parse simple SOL transfer", () => {
      const input = `solana:${validRecipient}?amount=1`;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toHaveProperty("type", "solana");
      expect(result).toHaveProperty("operation", "transfer");
      expect(result).toHaveProperty("address", validRecipient);
      expect(result).toHaveProperty("amount", "1");
    });

    it("should parse SPL Token transfer", () => {
      const input = `solana:${validRecipient}?amount=0.01&spl-token=${usdcMint}`;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toHaveProperty("type", "solana");
      expect(result).toHaveProperty("operation", "transfer");
      expect(result).toHaveProperty("address", validRecipient);
      expect(result).toHaveProperty("amount", "0.01");
      expect(result).toHaveProperty("asset.contract", usdcMint);
    });

    it("should parse request with label, message, and memo", () => {
      const input = `solana:${validRecipient}?amount=1&label=Michael&message=Thanks%20for%20all%20the%20fish&memo=OrderId12345`;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toHaveProperty("type", "solana");
      expect(result).toHaveProperty("operation", "transfer");
      expect(result).toHaveProperty("address", validRecipient);
      expect(result).toHaveProperty("amount", "1");
      expect(result).toHaveProperty("origin_domain", "Michael");
      expect(result).toHaveProperty("memo", "OrderId12345");
    });

    it("should parse request with reference keys", () => {
      const input = `solana:${validRecipient}?reference=86yvgdGbfJe2hK4ePqt3D123&reference=86yvgdGbfJe2hK4ePqt3D456`;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toEqual(
        expect.objectContaining({
          ...baseExpect,
          extra_params: {
            reference: "86yvgdGbfJe2hK4ePqt3D123,86yvgdGbfJe2hK4ePqt3D456",
          },
        })
      );
    });

    it("should parse request without an amount", () => {
      const input = `solana:${validRecipient}?label=Michael`;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toHaveProperty("type", "solana");
      expect(result).toHaveProperty("operation", "transfer");
      expect(result).toHaveProperty("address", validRecipient);
      expect(result).toHaveProperty("origin_domain", "Michael");
    });

    it("should return error for transfer with invalid recipient", () => {
      const input = "solana:INVALID_ADDRESS?amount=1";
      const result = parseSolana(input) as SolanaParseResult;
      expect(result).toEqual({
        type: "solana",
        operation: "transfer",
        raw: {
          data: input,
        },
      });
    });
  });

  describe("Transaction Request", () => {
    it("should parse simple transaction request", () => {
      const link = "https://example.com/solana-pay";
      const input = `solana:${link}`;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toEqual({
        type: "solana",
        operation: "transaction",
        callback: link,
        raw: {
          data: input,
        },
      });
    });

    it("should parse transaction request with query params", () => {
      const link = "https://example.com/solana-pay?order=12345";
      const encodedLink = encodeURIComponent(link);
      const input = `solana:${encodedLink}`;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toEqual({
        type: "solana",
        operation: "transaction",
        callback: link,
        raw: {
          data: input,
        },
      });
    });
  });

  describe("Plain Address", () => {
    it("should parse plain Solana address", () => {
      const input = validRecipient;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toEqual({
        type: "solana",
        address: validRecipient,
        raw: {
          data: validRecipient,
        },
      });
    });

    it("should reject invalid address format", () => {
      const input = "INVALID_SOLANA_ADDRESS";
      const result = parseSolana(input);

      expect(result).toBeNull();
    });

    it("should reject address with wrong length", () => {
      const input = "mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2k"; // 43 chars
      const result = parseSolana(input);
      expect(result).toBeNull();
    });
  });

  describe("Invalid Input", () => {
    it("should return null for completely invalid input", () => {
      const input = "not-a-solana-uri";
      const result = parseSolana(input);

      expect(result).toBeNull();
    });

    it("should return null for empty string", () => {
      const input = "";
      const result = parseSolana(input);

      expect(result).toBeNull();
    });

    it("should return null for other blockchain URIs", () => {
      const input = "bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
      const result = parseSolana(input);

      expect(result).toBeNull();
    });
  });
});
