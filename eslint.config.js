import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import parser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. Base JS + TypeScript + React setup
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      js,
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      prettier: prettierPlugin,
    },
    rules: {
      // TypeScript recommended
      ...tseslint.configs.recommended.rules,

      // React recommended
      ...reactPlugin.configs.recommended.rules,

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Prettier
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
    },
  },

  // 2. Add additional file-specific overrides (optional)
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Example: turn off prop-types for TSX
      "react/prop-types": "off",
    },
  },

  // 3. Ignore config (replace with .eslintignore if needed)
  {
    ignores: ["node_modules", "dist", "build", ".next", ".turbo", "coverage"],
  },
]);
