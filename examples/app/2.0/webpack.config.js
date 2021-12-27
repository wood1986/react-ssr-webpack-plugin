/* eslint-disable max-lines-per-function */
const path = require("path");
const {ReactSSRWebpackPlugin, ReactSSRMiddleware} = require("../../../src");
const configFn = require("../webpack.config");
const url = require("url");

module.exports = (env, argv) => {
  const config = configFn(env, argv);
  const version = `2.0.${argv.mode}`;

  config.entry = {
    "a.web": path.resolve(__dirname, "a", "index.web"),
    "b.web": path.resolve(__dirname, "b", "index.web"),
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
          "a.node": path.resolve(__dirname, "a", "index.node"),
          "b.node": path.resolve(__dirname, "b", "index.node"),
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
            "pattern": "/:entry",
            "entry": ({params}) => params.entry,
          },
        ],
        version,
        "node": false,
      }
    ),
  ];

  return config;
};
