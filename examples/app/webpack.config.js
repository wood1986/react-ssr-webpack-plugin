/* eslint-disable prefer-named-capture-group, require-unicode-regexp, max-lines-per-function */
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const {DefinePlugin} = require("webpack");
const packageJson = require("../../package.json");
const {PLUGIN_NAME} = require("../../src");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");

module.exports = (env, argv) => {
  const PROD = argv.mode === "production";

  return {
    "devServer": {
      "host": "127.0.0.1",
      "hot": false,  // for jest snapshot reason
    },
    "devtool": false,
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
          "use": (info) => {
            const isNode = info.compiler === PLUGIN_NAME;
            return (isNode ? [] : [{"loader": MiniCssExtractPlugin.loader}])
              .concat([
                {
                  "loader":"css-loader",
                  "ident": "css-loader",
                  "options": {
                    "modules": {
                      "exportOnlyLocals": isNode,
                    },
                  },
                },
            ]);
          },
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
          new CssMinimizerPlugin(),
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
      new StylelintPlugin({
        "configFile": path.resolve(__dirname, "..", "..", ".stylelintrc.json"),
        "fix": true,
      }),
      new MiniCssExtractPlugin({
        "filename": "[name].[contenthash].css",
      }),
      new DefinePlugin({
        "NAME": JSON.stringify(packageJson.name),
      }),
      new CopyPlugin({
        "patterns": [{"from": path.resolve(__dirname, "..", "favicon.ico")}],
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
