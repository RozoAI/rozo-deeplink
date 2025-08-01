import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "rozo-deeplink-scan-qr",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@yudiel/react-qr-scanner": "ReactQRScanner",
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: "dist",
    }),
    react(),
  ],
});
