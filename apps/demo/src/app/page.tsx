"use client";

import Footer from "@demo/components/footer";
import { Button } from "@demo/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@demo/components/ui/card";
import { Input } from "@demo/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@demo/components/ui/sheet";
import { parseDeeplink, type DeeplinkData } from "@rozoai/deeplink-core";
import { ScanQr } from "@rozoai/deeplink-react";
import { FileCode, Globe, QrCode, SquareCode } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeeplinkParserPage() {
  const [inputValue, setInputValue] = useState("");
  const [parsedData, setParsedData] = useState<DeeplinkData | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleParse = () => {
    if (!inputValue) {
      toast.error("Input value cannot be empty.");
      setParsedData(null);
      return;
    }
    try {
      const data = parseDeeplink(inputValue);
      setParsedData(data);
      toast.success("Deeplink parsed successfully!");
    } catch (err) {
      toast.error((err as Error).message);
      setParsedData(null);
    }
  };

  const handleScanSuccess = (data: DeeplinkData) => {
    setParsedData(data);
    setInputValue("");
    setSheetOpen(false);
    toast.success("QR code scanned successfully!");
  };

  const handleScanError = (error: Error) => {
    toast.error(error.message);
    setSheetOpen(false);
  };

  const getIcon = (type: DeeplinkData["type"]) => {
    switch (type) {
      case "ethereum":
        return <FileCode className="w-6 h-6" />;
      case "solana":
        return <SquareCode className="w-6 h-6" />;
      case "stellar":
        return <Globe className="w-6 h-6" />;
      default:
        return <FileCode className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl flex-1 flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-200">
          Deeplink Parser
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Paste a deeplink below or scan a QR code to parse it.
        </p>
        <div className="flex space-x-2 mb-4 w-full">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter deeplink or scan QR"
            className="w-full"
          />
          <Button onClick={handleParse}>Parse</Button>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary">
                <QrCode className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Scan QR Code</SheetTitle>
              </SheetHeader>
              <div className="flex items-center justify-center my-3">
                <ScanQr
                  onScan={handleScanSuccess}
                  onError={handleScanError}
                  components={{
                    finder: false,
                  }}
                  styles={{
                    container: {
                      width: "300px",
                      height: "300px",
                      borderRadius: "10px",
                    },
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {parsedData && (
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center space-x-2">
                {getIcon(parsedData.type)}
                <CardTitle className="capitalize">{parsedData.type}</CardTitle>
              </div>
              <CardDescription>Parsed data from the deeplink</CardDescription>
            </CardHeader>
            <CardContent>
              <ParsedDataViewer data={parsedData} />
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}

function ParsedDataViewer({ data }: { data: Record<string, any> }) {
  return (
    <div className="font-mono text-sm space-y-1">
      {Object.entries(data).map(([key, value]) => {
        const isObject = typeof value === "object" && value !== null;
        return (
          <div key={key}>
            <span className="text-gray-500 dark:text-gray-400 capitalize">
              {key.replace(/_/g, " ")}:
            </span>
            {isObject ? (
              <div className="pl-4 border-l border-gray-200 dark:border-gray-600 ml-2">
                <ParsedDataViewer data={value} />
              </div>
            ) : (
              <span className="ml-2 text-gray-800 dark:text-gray-200 break-all">
                {String(value)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
