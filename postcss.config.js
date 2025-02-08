/* eslint-disable import/no-extraneous-dependencies */
import process from "node:process";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import tailwindcss from "tailwindcss";
/* eslint-enable import/no-extraneous-dependencies */

const PRODUCTION = process.env["NODE_ENV"] === "production";

const config = {
  plugins: [
    // The order is important.
    tailwindcss,
    autoprefixer,
    PRODUCTION ? cssnano : undefined,
  ].filter(Boolean),
};

export default config;
