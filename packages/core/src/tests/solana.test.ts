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

      expect(result).toEqual({
        ...baseExpect,
        amount: "1",
        message: "Solana payment for 1",
      });
    });

    it("should parse SPL Token transfer", () => {
      const input = `solana:${validRecipient}?amount=0.01&spl-token=${usdcMint}`;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toEqual({
        ...baseExpect,
        amount: "0.01",
        asset: {
          contract: usdcMint,
        },
        message: "Solana payment for 0.01",
      });
    });

    it("should parse request with label, message, and memo", () => {
      const input = `solana:${validRecipient}?amount=1&label=Michael&message=Thanks%20for%20all%20the%20fish&memo=OrderId12345`;
      const result = parseSolana(input) as SolanaParseResult;

      expect(result).toEqual(
        expect.objectContaining({
          ...baseExpect,
          amount: "1",
          origin_domain: "Michael",
          msg: "Thanks for all the fish",
          memo: "OrderId12345",
          message: "Solana payment for 1 - Thanks for all the fish",
        })
      );
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

      expect(result).toEqual({
        ...baseExpect,
        origin_domain: "Michael",
        message: "Solana payment - Michael",
      });
    });

    it("should return error for transfer with invalid recipient", () => {
      const input = "solana:INVALID_ADDRESS?amount=1";
      const result = parseSolana(input) as SolanaParseResult;
      expect(result).toEqual({
        type: "solana",
        operation: "transfer",
        message:
          "Error: Invalid Solana payment URI - invalid recipient address",
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
        message: "Transaction request from example.com",
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
        message: "Transaction request from example.com",
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
        message: "Solana address",
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

    it("should return null for malformed solana URI", () => {
      const input = "solana:?amount=1";
      const result = parseSolana(input);
      expect(result?.message).toContain("invalid recipient address");
    });
  });
});
