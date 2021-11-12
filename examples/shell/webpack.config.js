const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const PROD = argv.mode === "production";

  return {
    "devtool": false,
    "entry": {
      "index": path.resolve(__dirname, "index.js"),
    },
    "mode": argv.mode,
    "output": {
      "filename": "[name].js",
      "libraryTarget": "commonjs2",
      "path": path.resolve(__dirname, "dist"),
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
    },
    "resolve": {
      "mainFields": ["main"],
    },
    "stats": {
      "children": true,
      "entrypoints": true,
      "colors": true,
    },
    "target": "node",
  };
};
