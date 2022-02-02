/* eslint-env node */
import * as path from "path";
import { fileURLToPath } from "url";
import CopyPlugin from "copy-webpack-plugin"; // eslint-disable-line import/default -- TODO: Avoid error.
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEV = process.env.NODE_ENV === "development";

/** @type {import("webpack").Configuration} */
const webpackConfig = {
  entry: "./src/index.jsx",
  output: {
    filename: DEV ? "[name].js" : "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
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
        use: [DEV ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.md$/u,
        use: [path.resolve(__dirname, "./src/remark/remark-loader.cjs")],
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
      ],
    }),
  ],
  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],
  },
  resolve: {
    extensions: [".jsx", "..."],
  },
  devtool: DEV ? "inline-source-map" : "source-map",

  // @ts-expect-error -- TS2322. See https://github.com/webpack/webpack/pull/12196
  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
      watch: true,
    },
    historyApiFallback: { index: "/" },
  },
};

export default webpackConfig;
