const http = require("http");
const path = require("path");
const polka = require("polka");
const serveStatic = require("serve-static");
const url = require("url");
const {ReactSSREntry, ReactSSRResponse} = require("../../utils");

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
      async (req, res) => {
        const reqUrl = url.parse(req.url, true);

        const result = await ReactSSREntry({
          "require": __non_webpack_require__,
          workdir,
          "props": {"url": reqUrl},
          "url": reqUrl,
          "version": reqUrl.query.version || "default",
        });
        ReactSSRResponse(res, result);
        return;
      }
    )
    .listen(...args);
  });
