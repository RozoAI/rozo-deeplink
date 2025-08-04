import type { DeeplinkData } from "../types";

/**
 * Parses a website URL and returns the appropriate DeeplinkData.
 *
 * @param input - The website URL to parse (e.g., "https://www.rozo.ai")
 * @returns Parsed deeplink data or null if the input is not a valid website URL
 */
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
