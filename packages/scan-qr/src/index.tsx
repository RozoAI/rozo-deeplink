"use client";

import { parseDeeplink, type DeeplinkData } from "@rozo-deeplink/core";
import {
  type IDetectedBarcode,
  IScannerProps,
  Scanner,
} from "@yudiel/react-qr-scanner";

interface ScanQRProps extends Omit<IScannerProps, "onScan" | "onError"> {
  /**
   * Callback function invoked when a QR code is successfully scanned and parsed.
   * @param {DeeplinkData} data - The parsed data from the QR code.
   */
  onScan: (data: DeeplinkData) => void;

  /**
   * Callback function invoked when an error occurs during scanning or parsing.
   * @param {Error} error - The error object.
   */
  onError: (error: Error) => void;

  /**
   * Optional custom CSS class for the modal container.
   * @type {string}
   */
  className?: string;
}

export const ScanQr = ({
  onScan,
  onError,
  ...props
}: ScanQRProps) => {
  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length === 0) return;

    const result = detectedCodes[0].rawValue;
    if (!result) return;

    try {
      const parsed = parseDeeplink(result);
      onScan(parsed);
    } catch (error) {
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error("Unknown error during QR code parsing."));
      }
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      onError(error);
    } else {
      onError(new Error("Scanner failed"));
    }
  };

  return (
    <Scanner
      onScan={handleScan}
      onError={handleError}
      {...props}
    />
  );
};
