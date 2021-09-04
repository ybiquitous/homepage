/* eslint-env node */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import path from "node:path";
// @ts-expect-error -- TS7016
import CopyPlugin from "copy-webpack-plugin";
// @ts-expect-error -- TS7016
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
// @ts-expect-error -- TS7016
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import remarkAutolinkHeadings from "remark-autolink-headings";
import remarkExternalLinks from "remark-external-links";
import remarkFootnotes from "remark-footnotes";
import remarkGFM from "remark-gfm";
import remarkHighlight from "remark-highlight.js";
import remarkHTML from "remark-html";
import remarkSlug from "remark-slug";
import remarkRelativeLink from "./src/remark/remark-relative-link.js";
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

const DEV = process.env.NODE_ENV === "development";

export default {
  entry: "./src/index.jsx",
  output: {
    filename: DEV ? "[name].js" : "[name].[contenthash].js",
    path: path.resolve(process.cwd(), "dist"),
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
                  remarkExternalLinks,
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
      directory: path.join(process.cwd(), "src"),
      watch: true,
    },
    historyApiFallback: { index: "/" },
  },
};
