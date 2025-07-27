import { FabActions } from "@demo/components/fab-actions";
import IntercomInitializer from "@demo/components/intercom";
import { Toaster } from "@demo/components/ui/sonner";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rozo Deeplink | One Tap to Pay",
  description: "Increase the GDP of Crypto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-card`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <IntercomInitializer appId={process.env.INTERCOM_APP_ID as string} />

          {children}
          <FabActions />
        </ThemeProvider>
      </body>
    </html>
  );
}
