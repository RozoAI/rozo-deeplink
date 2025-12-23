import { describe, expect, it } from "vitest";
import { parseAddress } from "../handlers/address";

describe("parseAddress", () => {
  it("should correctly parse a valid EVM address", () => {
    const input = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
    const result = parseAddress(input);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.type).toBe("ethereum");
    expect("address" in result ? result.address : "").toBe(input);
  });

  it("should correctly parse a valid Solana address", () => {
    const input = "mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2kN";
    const result = parseAddress(input);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.type).toBe("solana");
    expect("address" in result ? result.address : "").toBe(input);
  });

  it("should correctly parse a valid Stellar address", () => {
    const input = "GC65CUPW2IMTJJY6CII7F3OBPVG4YGASEPBBLM4V3LBKX62P6LA24OFV";
    const result = parseAddress(input);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.type).toBe("stellar");
    expect("address" in result ? result.address : "").toBe(input);
  });

  it("should return null for an invalid address", () => {
    const input = "this-is-not-a-valid-address";
    const result = parseAddress(input);
    expect(result).toBeNull();
  });

  it("should return null for a partially valid but incorrect address", () => {
    const input = "0x12345";
    const result = parseAddress(input);
    expect(result).toBeNull();
  });
});
