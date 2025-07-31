import js from "@eslint/js";
import tseslint from "typescript-eslint";

import { defineConfig } from "eslint/config";

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      // General rules
      "no-console": "warn",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
    },
  },
  {
    ignores: ["dist/", "node_modules/", "*.config.js", "src/tests/**/*"],
  }
);
