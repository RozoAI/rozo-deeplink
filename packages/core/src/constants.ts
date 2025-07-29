import { getAddress } from "viem";

// Middleware Address for Bridge Stellar <> Base
export const ROZO_MIDDLE_STELLAR_ADDRESS =
  "GDQDR7RY2GJW7XBENWAX7F5X42HBTA2YREAD6SYGZLUNDGDQ3DRRYBPK";
export const ROZO_MIDDLE_BASE_ADDRESS =
  "0x5772FBe7a7817ef7F586215CA8b23b8dD22C8897";

export const base = {
  type: "evm",
  chainId: 8453,
  name: "Base",
  cctpDomain: 6,
};

export const baseUSDC = {
  chainId: base.chainId,
  token: getAddress("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
  chainName: "Base",
  name: "USD Coin",
  symbol: "USDC",
  fiatISO: "USD",
  decimals: 6,
};
