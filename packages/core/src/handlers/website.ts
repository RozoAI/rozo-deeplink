import type { DeeplinkData } from "../types";

export function parseWebsite(input: string): DeeplinkData | null {
  try {
    if (input.startsWith("http://") || input.startsWith("https://")) {
      return {
        type: "website",
        url: input,
      };
    }
  } catch {
    return null;
  }

  return null;
}
