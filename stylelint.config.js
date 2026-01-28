/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ["dist/**/*", "node_modules/**/*", "src/slides-build/**/*"],
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-high-performance-animation"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["apply", "config", "custom-variant"],
      },
    ],
    "declaration-block-no-duplicate-properties": true,
    "declaration-property-value-disallowed-list": {
      "font-family": [
        "var(--font-family-serif)",
        "var(--font-family-sans-serif)",
        "var(--font-family-monospace)",
      ],
      "font-size": [
        "inherit",
        "/^calc\\(.+\\)$/",
        "var(--font-size-base)",
        "var(--font-size-l)",
        "var(--font-size-s)",
        "var(--font-size-h1)",
        "var(--font-size-h2)",
        "var(--font-size-h3)",
        "var(--font-size-h4)",
        "var(--font-size-h5)",
        "var(--font-size-h6)",
        "var(--font-size-code)",
      ],
    },
    "media-feature-name-value-allowed-list": {
      "max-width": ["575px", "1199px"],
      "min-width": ["576px", "1200px"],
    },
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    "plugin/no-low-performance-animation-properties": true,
  },
};
