const path = require("path");
const {ReactSSRWebpackPlugin, ReactSSRMiddleware} = require("../../../src");
const configFn = require("../webpack.config");
const url = require("url");

module.exports = (env, argv) => {
  const config = configFn(env, argv);
  const version = `1.0.${argv.mode}`;

  config.entry = {
    "a.web": path.resolve(__dirname, "a", "index.web"),
  };

  config.devServer = {
    ...config.devServer,
    "onAfterSetupMiddleware": new ReactSSRMiddleware({
      "reqToProps": (req) => ({"url": url.parse(req.url, true)}),
      version,
    }),
    "open": ["/a.node"],
  };

  config.plugins = [
    ...config.plugins,
    new ReactSSRWebpackPlugin(
      {
        "entry": {
          "a.node": path.resolve(__dirname, "a", "index.node"),
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
            "pattern": "/a.node",
            "entry": () => "a.node",
          },
        ],
        version,
      }
    ),
  ];

  return config;
};
