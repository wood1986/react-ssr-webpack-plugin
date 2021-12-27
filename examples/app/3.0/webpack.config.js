/* eslint-disable max-lines-per-function */
const path = require("path");
const {ReactSSRWebpackPlugin, ReactSSRMiddleware} = require("../../../src");
const configFn = require("../webpack.config");
const url = require("url");

module.exports = (env, argv) => {
  const config = configFn(env, argv);
  const version = `3.0.${argv.mode}`;

  config.entry = {
    "index.web": path.resolve(__dirname, "index.web"),
  };

  config.devServer = {
    ...config.devServer,
    "setupMiddlewares": (middlewares, devServer) => ([
      ...middlewares,
      {
        "name": "ReactSSRWebpackPlugin",
        "path": "*",
        "middleware": ReactSSRMiddleware(
          devServer.compiler,
          {
            "reqToProps": (req) => ({"url": url.parse(req.originalUrl, true)}),
            version,
          }
        ),
      },
    ]),
    "open": ["/a.node", "/b.node"],
  };

  config.plugins = [
    ...config.plugins,
    new ReactSSRWebpackPlugin(
      {
        "entry": {
          "index.node": path.resolve(__dirname, "index.node"),
        },
        "resolve": {
          "extensions": [".cjs", ".jsx", ".js", ".mjs"],
          "fallback": {
            "stream": require.resolve("stream-browserify"),
            "util": require.resolve("util"),
          },
        },
      },
      {
        "routes": [
          {
            "pattern": "/(.*)",
            "entry": () => "index.node",
          },
        ],
        version,
        "node": false,
      }
    ),
  ];

  return config;
};
