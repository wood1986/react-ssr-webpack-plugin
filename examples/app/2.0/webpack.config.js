const path = require("path");
const {ReactSSRWebpackPlugin, ReactSSRMiddleware} = require("../../../index");
const configFn = require("../webpack.config");
const url = require("url");

module.exports = (env, argv) => {
  const config = configFn(env, argv);
  const version = "2.0";

  config.entry = {
    "a.web": path.resolve(__dirname, "a", "index.web"),
    "b.web": path.resolve(__dirname, "b", "index.web"),
  };

  config.devServer = {
    ...config.devServer,
    "onAfterSetupMiddleware": new ReactSSRMiddleware({
      "reqToProps": (req) => ({
        ...url.parse(req.url, true),
        "__VERSION__": version,
      }),
    }),
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
        },
      },
      {version}
    ),
  ];

  return config;
};
