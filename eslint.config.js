import globals from "globals";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

import tsPlugin from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default defineConfig([
  {
    ignores: [
      "coverage/**",
      "dist/**",
      "tmp/**",
      "src/slides-build",
      "src/blog/metadata.*",
      "**/*.cjs",
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: [
      js.configs.recommended,
      tsPlugin.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
      reactHooksPlugin.configs.flat.recommended,
    ],
  },
]);
