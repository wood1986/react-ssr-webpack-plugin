/* eslint-disable max-lines-per-function */
const path = require("path");
const {ReactSSRWebpackPlugin, ReactSSRMiddleware} = require("../../src");
const url = require("url");
const graphql = require("./graphql");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const packageJson = require("../../package.json");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = (env, argv) => {
  const PROD = argv.mode === "production";
  const version = `manifest.${argv.mode}`;

  return {
    "devServer": {
      "host": "127.0.0.1",
      "hot": false,  // for jest snapshot reason
      "open": ["/index"],
      "setupMiddlewares": (middlewares, devServer) => {
        graphql(devServer);

        return [
          ...middlewares,
          {
            "name": "ReactSSRWebpackPlugin",
            "path": "*",
            "middleware": ReactSSRMiddleware(
              devServer.compiler,
              {
                "reqToProps": (req) => ({
                  "port": req.socket.localPort, // for relay.test.js
                  "host": req.socket.localAddress, // for relay.test.js
                  "url": url.parse(req.originalUrl, true),
                }),
                version,
                "patchGlobal": (global) => {
                  global.fetch = require("node-fetch");
                },
              }
            ),
          },
        ];
      },
    },
    "devtool": false,
    "entry": {
      "index": path.resolve(__dirname, "src", "index.web"),
    },
    "mode": argv.mode,
    "module": {
      "rules": [
        {
          "exclude": /node_modules/u,
          "test": /\.jsx?$/u,
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
                  [
                    "relay",
                    {
                      "compat": true,
                    },
                  ],
                ],
                "presets": packageJson.babel.presets,
              },
            },
          ],
        },
      ],
    },
    "optimization": {
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
      "path": path.resolve(__dirname, "dist"),
      "publicPath": "",
    },
    "plugins": [
      new ESLintPlugin({
        "overrideConfigFile": path.resolve(__dirname, "..", "..", ".eslintrc.js"),
        "extensions": ["jsx", "mjs", "cjs", "js"],
        "fix": true,
      }),
      new ReactSSRWebpackPlugin(
        {
          "entry": {
            "index": path.resolve(__dirname, "src", "index.node"),
          },
          "resolve": {
            "extensions": [".cjs", ".jsx", ".js", ".mjs"],
          },
        },
        {
          version,
          "node": true,
        }
      ),
      new CopyPlugin({
        "patterns": [{"from": path.resolve(__dirname, "..", "favicon.ico")}],
      }),
    ],
    "resolve": {
      "extensions": [".js", ".json", ".jsx", ".mjs"],
    },
    "target": "web",
    "stats": {
      "children": true,
    },
  };
};
