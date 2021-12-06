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
    "onAfterSetupMiddleware": new ReactSSRMiddleware({
      "reqToProps": (req) => ({"url": url.parse(req.url, true)}),
      version,
    }),
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
        },
      },
      {
        "routes": [
          {
            "pattern": "*",
            "entry": () => "index.node",
          },
        ],
        version,
      }
    ),
  ];

  return config;
};
