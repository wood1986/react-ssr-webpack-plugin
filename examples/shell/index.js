const http = require("http");
const path = require("path");
const polka = require("polka");
const serveStatic = require("serve-static");
const url = require("url");
const {ReactSSRCommonMiddleware} = require("../../src/ReactSSRCommonMiddleware.js");

// eslint-disable-next-line no-magic-numbers
const workdir = path.resolve(process.cwd(), process.argv.slice(2)[0] || ".");
// eslint-disable-next-line no-console
console.log(`The shell on the url "http://localhost:8080" is running for the directory "${workdir}" ...`);

// eslint-disable-next-line no-magic-numbers
[[http.createServer(), [process.env.PORT || 8080]]].forEach(([server, args]) => {
  polka({
    server,
  })
    .use(serveStatic(workdir))
    // eslint-disable-next-line max-statements
    .get(
      "*",
      ReactSSRCommonMiddleware({
        "requireFn": __non_webpack_require__,
        "reqToProps": (req) => ({"url": url.parse(req.url, true)}),
        workdir,
        "version": "default",
      })
    )
    .listen(...args);
  });
