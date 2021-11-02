/* eslint-env node */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as path from "path";
import { fileURLToPath } from "url";
// @ts-expect-error -- TS7016
import CopyPlugin from "copy-webpack-plugin";
// @ts-expect-error -- TS7016
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
// @ts-expect-error -- TS7016
import MiniCssExtractPlugin from "mini-css-extract-plugin";
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEV = process.env.NODE_ENV === "development";

export default {
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
        use: [
          DEV ? "style-loader" : MiniCssExtractPlugin.loader, // eslint-disable-line @typescript-eslint/no-unsafe-member-access
          "css-loader",
          "postcss-loader",
        ],
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    new CopyPlugin({
      patterns: [{ from: "src/robots.txt", to: "robots.txt" }],
    }),
  ],
  optimization: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    minimizer: ["...", new CssMinimizerPlugin()],
  },
  resolve: {
    extensions: [".jsx", "..."],
  },
  devtool: DEV ? "inline-source-map" : "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
      watch: true,
    },
    historyApiFallback: { index: "/" },
  },
};
