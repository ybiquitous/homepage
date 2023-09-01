/* eslint-env node */
import { fileURLToPath } from "node:url";
import CopyPlugin from "copy-webpack-plugin"; // eslint-disable-line import/default -- TODO: Avoid error.
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const DEV = process.env["NODE_ENV"] === "development";

/** @type {import("webpack").Configuration} */
const webpackConfig = {
  entry: {
    main: "./src/index.jsx",
    "service-worker": "./src/service-worker.js",
    "theme-light": "./src/styles/light.css",
    "theme-dark": "./src/styles/dark.css",
  },
  output: {
    filename: (pathData) => {
      if (pathData.runtime === "service-worker") {
        return "service-worker.js";
      }
      return DEV ? "[name].js" : "[name].[contenthash].js";
    },
    path: fileURLToPath(new URL("./dist", import.meta.url)),
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/u,
        exclude: /node_modules/u,
        use: "babel-loader",
      },
      {
        test: /\.css$/u,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.md$/u,
        use: [fileURLToPath(new URL("./src/remark/remark-loader.cjs", import.meta.url))],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      favicon: "src/favicon.png",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/robots.txt", to: "robots.txt" },
        { from: "src/images", to: "images" },
        { from: "src/manifest.json", to: "manifest.json" },
        { from: "src/favicon-512.png", to: "favicon-512.png" },
      ],
    }),
  ],
  resolve: {
    extensions: [".jsx", "..."],
  },
  devtool: DEV ? "inline-source-map" : "source-map",

  // @ts-expect-error -- TS2322. See https://github.com/webpack/webpack/pull/12196
  devServer: {
    static: {
      directory: fileURLToPath(new URL("./src", import.meta.url)),
      watch: true,
    },
    historyApiFallback: { index: "/" },
  },
};

export default webpackConfig;
