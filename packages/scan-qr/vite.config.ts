import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

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
  resolve: {
    alias: {
      "@rozoai/deeplink-core": resolve(__dirname, "../core/dist"),
    },
  },
}); 