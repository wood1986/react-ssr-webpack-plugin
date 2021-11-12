/* eslint-disable prefer-named-capture-group, require-unicode-regexp, max-lines-per-function */
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const {ReactSSRWebpackPlugin, ReactSSRMiddleware} = require("../../../index");
const url = require("url");
const {DefinePlugin} = require("webpack");
const packageJson = require("../../../package.json");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = (env, argv) => {
  const PROD = argv.mode === "production";
  const version = "2.0";

  return {
    "devServer": {
      "host": "127.0.0.1",
      "hot": false,  // for jest snapshot reason
      "open": ["/a.node", "/b.node"],
      "onAfterSetupMiddleware": ReactSSRMiddleware({
        "reqToProps": (req) => url.parse(req.url, true).query,
      }),
    },
    "devtool": false,
    "entry": {
      "a.web": path.resolve(__dirname, "a.web"),
      "b.web": path.resolve(__dirname, "b.web"),
    },
    "mode": argv.mode,
    "module": {
      "rules": [
        {
          "exclude": /node_modules/u,
          "sideEffects": false,
          "test": /\.(cjs|jsx|js|mjs)$/,
          "use": [
            {
              "loader": "babel-loader",
              "options": {
                "plugins": [
                  [
                    "babel-plugin-styled-components",
                    {
                      "displayName": !PROD,
                      "minify": true,
                      "pure": true,
                      "transpileTemplateLiterals": true,
                    },
                  ],
                ],
                "presets": packageJson.babel.presets,
              },
            },
          ],
        },
        {
          "test": /\.(svg)$/ui,
          "use": [
            {
              "loader": "file-loader",
            },
          ],
        },
        {
          "test":/\.css$/,
          "use":[{"loader": MiniCssExtractPlugin.loader},{"loader":"css-loader"}],
        },
      ],
    },
    "optimization": {
      "chunkIds": "named",
      "minimizer": PROD
        ? [
          new TerserPlugin({
            "extractComments": false,
            "terserOptions": {
              "output": {
                "comments": false,
              },
            },
          }),
        ]
        : [],
      "splitChunks": {
        "cacheGroups": {
          "vendors": {
            "chunks": "initial",
            "name": "vendors",
            "test": /[\\/]node_modules[\\/]/,
          },
        },
      },
    },
    "output": {
      "filename": "[name].[contenthash].js",
      "path": path.resolve(__dirname, "..", "dist"),
      "publicPath": "",
    },
    "plugins": [
      new ESLintPlugin({
        "overrideConfigFile": path.resolve(__dirname, "..", "..", "..", ".eslintrc.js"),
        "extensions": ["jsx", "mjs", "cjs", "js"],
        "fix": true,
      }),
      new MiniCssExtractPlugin({
        "filename": "[name].[contenthash].css",
      }),
      new DefinePlugin({
        "NAME": JSON.stringify(packageJson.name),
      }),
      new ReactSSRWebpackPlugin(
        {
          "entry": {
            "a.node": path.resolve(__dirname, "a.node"),
            "b.node": path.resolve(__dirname, "b.node"),
          },
          "resolve": {
            "extensions": [".cjs", ".jsx", ".js", ".mjs"],
          },
        },
        {version}
      ),
      new CopyPlugin({
        "patterns": [{"from": path.resolve(__dirname, "..", "..", "favicon.ico")}],
      }),
    ],
    "resolve": {
      "alias": {
        "react-dom$": "react-dom/profiling",
        "scheduler/tracing": "scheduler/tracing-profiling",
      },
      "extensions": [".cjs", ".jsx", ".js", ".mjs"],
    },
    "target": "web",
    "stats": {
      "children": true,
    },
  };
};
