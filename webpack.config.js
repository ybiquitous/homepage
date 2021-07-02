/* eslint-env node */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// @ts-expect-error -- TS7016
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// @ts-expect-error -- TS7016
const CopyPlugin = require("copy-webpack-plugin");
// @ts-expect-error -- TS7016
const remarkAutolinkHeadings = require("remark-autolink-headings");
const remarkFootnotes = require("remark-footnotes");
const remarkGFM = require("remark-gfm");
// @ts-expect-error -- TS7016
const remarkHighlight = require("remark-highlight.js");
const remarkHTML = require("remark-html");
// @ts-expect-error -- TS7016
const remarkSlug = require("remark-slug");
const remarkRelativeLink = require("./src/remark/remark-relative-link");
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

const DEV = process.env.NODE_ENV === "development";

module.exports = {
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
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: DEV ? "[path][name]__[local]" : "[hash:base64]",
              },
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.md$/u,
        use: [
          "html-loader",
          {
            loader: "remark-loader",
            options: {
              remarkOptions: {
                plugins: [
                  remarkRelativeLink,
                  remarkGFM,
                  remarkSlug,
                  [remarkAutolinkHeadings, { behavior: "append" }],
                  remarkFootnotes,
                  remarkHighlight,
                  remarkHTML,
                ],
              },
            },
          },
        ],
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
    new CopyPlugin({
      patterns: [{ from: "src/robots.txt", to: "robots.txt" }],
    }),
  ],
  resolve: {
    extensions: [".jsx", "..."],
  },
  devtool: DEV ? "inline-source-map" : "source-map",
  devServer: {
    contentBase: path.join(__dirname, "src"),
    historyApiFallback: { index: "/" },
  },
};
