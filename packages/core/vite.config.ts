import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "rozo-deeplink-core",
      fileName: "index",
    },
  },
  plugins: [dts({ tsconfigPath: "./tsconfig.json", rollupTypes: true, outDir: "dist", insertTypesEntry: true })],
  define: {
    "self": "globalThis",
  }
}); 