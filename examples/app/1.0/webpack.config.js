const path = require("path");
const {ReactSSRWebpackPlugin} = require("../../../index");
const configFn = require("../2.0/webpack.config");

module.exports = (env, argv) => {
  const config = configFn(env, argv);
  const version = "1.0";

  config.entry = {
    "a.web": path.resolve(__dirname, "a.web"),
  };

  const index = config.plugins.findIndex((plugin) => plugin instanceof ReactSSRWebpackPlugin);
  config.plugins[index] = new ReactSSRWebpackPlugin(
    {
      "entry": {
        "a.node": path.resolve(__dirname, "a.node"),
      },
      "resolve": {
        "extensions": [".cjs", ".jsx", ".js", ".mjs"],
      },
    },
    {version}
  );

  config.devServer.open = ["/a.node"];

  return config;
};
