import { parseDeeplink, type DeeplinkData } from "@rozoai/deeplink-core";
import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ScanQrNativeProps {
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
   * Controls the visibility of the scanner modal.
   * @type {boolean}
   * @default true
   */
  isVisible?: boolean;

  /**
   * Callback function invoked when camera permission is denied.
   * @type {() => void}
   */
  onPermissionDenied?: () => void;

  /**
   * Optional custom styles for the container.
   * @type {object}
   */
  containerStyle?: object;

  /**
   * Optional custom styles for the scanner overlay.
   * @type {object}
   */
  overlayStyle?: object;

  /**
   * Optional text to display at the top of the scanner.
   * @type {string}
   * @default "Scan QR Code"
   */
  headerText?: string;

  /**
   * Optional text to display when waiting for scan.
   * @type {string}
   * @default "Position QR code within the frame"
   */
  instructionText?: string;

  /**
   * Optional text for the retry button.
   * @type {string}
   * @default "Scan Again"
   */
  retryButtonText?: string;
}

export const ScanQrNative: React.FC<ScanQrNativeProps> = ({
  onScan,
  onError,
  isVisible = true,
  onPermissionDenied,
  containerStyle,
  overlayStyle,
  headerText = "Scan QR Code",
  instructionText = "Position QR code within the frame",
  retryButtonText = "Scan Again",
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible) {
      requestCameraPermission();
    }
  }, [isVisible]);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);

      if (!granted && onPermissionDenied) {
        onPermissionDenied();
      }
    } catch (error) {
      setHasPermission(false);
      if (onPermissionDenied) {
        onPermissionDenied();
      }
      onError(
        error instanceof Error
          ? error
          : new Error("Failed to request camera permission")
      );
    }
  };

  const handleBarcodeScanned = async ({
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    const qrData = data;

    if (!qrData || qrData.trim() === "") {
      setIsProcessing(false);
      onError(new Error("QR code is empty"));
      return;
    }

    try {
      const parsed = parseDeeplink(qrData);
      onScan(parsed);
    } catch (error) {
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error("Unknown error during QR code parsing"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setIsProcessing(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, containerStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{headerText}</Text>
        </View>

        {/* Camera Permission Handling */}
        {hasPermission === null && (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.messageText}>
              Requesting camera permission...
            </Text>
          </View>
        )}

        {hasPermission === false && (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>Camera permission denied</Text>
            <Text style={styles.messageText}>
              Please enable camera access in your device settings to scan QR
              codes.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={requestCameraPermission}
            >
              <Text style={styles.buttonText}>Request Permission</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Scanner View */}
        {hasPermission === true && !scanned && (
          <View style={styles.scannerContainer}>
            <CameraView
              onBarcodeScanned={handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.overlay, overlayStyle]}>
              <View style={styles.scanArea}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>
            </View>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>{instructionText}</Text>
            </View>
          </View>
        )}

        {/* Processing State */}
        {isProcessing && (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.messageText}>Processing QR code...</Text>
          </View>
        )}

        {/* Scanned State - Retry Button */}
        {scanned && !isProcessing && (
          <View style={styles.centerContent}>
            <Text style={styles.successText}>✓ QR code scanned</Text>
            <TouchableOpacity
              style={[styles.button, styles.retryButton]}
              onPress={handleScanAgain}
            >
              <Text style={styles.buttonText}>{retryButtonText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  scannerContainer: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#007AFF",
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instructionContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#FF3B30",
    fontWeight: "600",
    marginBottom: 10,
  },
  successText: {
    fontSize: 20,
    color: "#34C759",
    fontWeight: "600",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 150,
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
