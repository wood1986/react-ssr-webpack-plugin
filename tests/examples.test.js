const puppeteer = require("puppeteer");
const {launchWebpackDevServer, testPages} = require("./utils");
const tests = [
  {
    "name": "examples/app/1.0",
    "urls": (mode) => [
      "a.node",
      `1.0.${mode}.js`,
    ],
  },
  {
    "name": "examples/app/2.0",
    "urls": (mode) => [
      "a.node",
      "b.node",
      `2.0.${mode}.js`,
    ],
  },
  {
    "name": "examples/app/3.0",
    "urls": (mode) => [
      "a.node",
      "b.node",
      `3.0.${mode}.js`,
    ],
  },
  {
    "name": "examples/relay",
    "urls": (mode) => [
      "index",
      "index?ssr=false",
      `manifest.${mode}.js`,
    ],
  },
].reduce(
  (memo, test, index) => ([
    ...memo,
    // eslint-disable-next-line no-magic-numbers
    {...test, "mode": "development", "host": "127.0.0.1", "port": 8000 + index * 2},
    // eslint-disable-next-line no-magic-numbers
    {...test, "mode": "production", "host": "127.0.0.1", "port": 8000 + index * 2 + 1},
  ]),
  []
);
let browser = null;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

afterAll(async () => {
  await browser.close();
});

test.concurrent.each(tests)("$name should not have any page error for $mode version", async ({name, mode, urls, host, port}) => {
  const configFn = require(`../${name}/webpack.config`);
  const devServer = await launchWebpackDevServer({configFn, mode, host, port});
  await expect(testPages({browser, port, host, "urls": urls(mode)}))["resolves"].toBeUndefined();
  await devServer.stop();
});
