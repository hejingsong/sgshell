const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// @renderer/index.ts
// @renderer/preload.ts
const packConfig = {
  // 入口起点 https://www.webpackjs.com/concepts/entry-points/
  entry: {
    /*
     * 可以有多个入口 比如多页面应用程序时
     */
    preload: path.resolve(__dirname, "../src/preload.ts"),
    index: path.resolve(__dirname, "../src/index.ts"),
    // https://www.webpackjs.com/configuration/target/
  },

  mode: "development",

  module: {
    // loader 将非JavaScript转换为webpack能处理的模块
    rules: [
      /*
       * {test: "应该被loader转换的文件", use: "所使用的loader"}
       * example:
       * { test: /\.txt$/, use: "raw-loader" }
       */
      { test: /\.ts$/, use: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.node$/, use: "node-loader" },
    ],
  },

  output: {
    // 保留源文件名
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist"),

  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, "../src/css"),
        to: path.resolve(__dirname, "../dist/css"),
      },
      {
        from: path.resolve(__dirname, "../src/img"),
        to: path.resolve(__dirname, "../dist/img"),
      },
      {
        from: path.resolve(__dirname, "../src/proto"),
        to: path.resolve(__dirname, "../dist/proto"),
      },
      {
        from: path.resolve(__dirname, "../package.json"),
        to: path.resolve(__dirname, "../dist/package.json"),
      },
    ]),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    extensions: [".ts"],
  },

  target: "node-webkit",
};

module.exports = packConfig;
