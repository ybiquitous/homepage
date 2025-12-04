import process from "node:process";
import tailwindcss from "@tailwindcss/postcss";
import cssnano from "cssnano";

const PRODUCTION = process.env["NODE_ENV"] === "production";

const config = {
  plugins: [
    // The order is important.
    tailwindcss,
    PRODUCTION ? cssnano : undefined,
  ].filter(Boolean),
};

export default config;
