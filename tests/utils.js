const webpackDevServer = require("webpack-dev-server/lib/Server");
const webpack = require("webpack");
const PLUGIN_NAME = "ReactSSRWebpackPlugin";

// eslint-disable-next-line max-statements
async function launchWebpackDevServer({configFn, mode, host, port}) {
  const config = configFn({}, {mode});
  config.devServer.open = [];
  config.devServer.devMiddleware = {
    "writeToDisk": true,  // jest does not support overriding resolver on the fly
  };
  config.infrastructureLogging = {
    "level": "none",
  };
  config.stats = false;
  const compiler = webpack(config);
  const devServer = new webpackDevServer({...config.devServer, host, port}, compiler);
  await devServer.start();
  await new Promise((resolve) => {
    compiler.hooks.afterDone.tap(PLUGIN_NAME, resolve);
  });
  return devServer;
}

async function testPages({browser, host, port, urls}) {
  for (const url of (urls || [])) {
    const page = await browser.newPage();
    page.on("error", (err) => { throw err; });
    page.on("pageerror", (err) => {
      // this is for testing __SOURCES__
      throw err;
    });
    page.on("requestfailed", (req) => {
      // this is for testing __FILENAMES__
      throw new Error(`${req.url()} request is failed.`);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        // this is for testing __DIGESTS__.
        throw new Error(msg.text());
      }
    });

    await page.goto(`http://${host}:${port}/${url}`, {"waitUntil": "networkidle0"});
    await page.close();
  }
}

module.exports = {
  launchWebpackDevServer,
  testPages,
};
