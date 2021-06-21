const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const remarkHTML = require("remark-html");
const remarkHighlight = require("remark-highlight.js");
const remarkGFM = require("remark-gfm");
const remarkSlug = require("remark-slug");
const remarkAutolinkHeadings = require("remark-autolink-headings");

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
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          DEV ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.md$/,
        use: [
          "html-loader",
          {
            loader: "remark-loader",
            options: {
              remarkOptions: {
                plugins: [
                  remarkGFM,
                  remarkSlug,
                  remarkAutolinkHeadings,
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
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ].filter(Boolean),
  resolve: {
    extensions: [".jsx", "..."],
  },
  devtool: DEV ? "inline-source-map" : "source-map",
  devServer: {
    contentBase: path.join(__dirname, "src"),
    historyApiFallback: { index: "/" },
  },
};
