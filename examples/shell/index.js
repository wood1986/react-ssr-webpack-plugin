const http = require("http");
const path = require("path");
const polka = require("polka");
const serveStatic = require("serve-static");
const url = require("url");

// eslint-disable-next-line no-magic-numbers
const workdir = path.resolve(process.cwd(), process.argv.slice(2)[0] || ".");
// eslint-disable-next-line no-console
console.log(`The shell on the url "http://localhost:8080" is running for the directory "${workdir}" ...`);

// eslint-disable-next-line no-magic-numbers
[[http.createServer(), [process.env.PORT || 8080]]].forEach(([server, args]) => {
  polka({server})
    .use(serveStatic(workdir))
    // eslint-disable-next-line max-statements
    .get("/:entry", async (req, res) => {
      try {
        const {query} = url.parse(req.url, true);
        if (!query.version) {
          // default case http://localhost:8080/a.node
          query.version = "default";
          delete __non_webpack_require__.cache[path.resolve(workdir, query.version)];
        }

        // otherwise 'something' will be required when using http://localhost:8080/a.node?version=something
        const manifest = __non_webpack_require__(path.resolve(workdir, query.version));
        query.__VERSION__ = manifest.__VERSION__;
        if (!manifest[`${req.params.entry}.js`]) {
          const error = new Error();
          error.code = "MODULE_NOT_FOUND";
          throw error;
        }
        const module = __non_webpack_require__(path.resolve(workdir, manifest[`${req.params.entry}.js`]));

        // this is similar to reqToProps in webpack.config.js
        const html = await module.default(query);
        res.writeHead(
          // eslint-disable-next-line no-magic-numbers
          200,
          {
            "Content-Type": "text/html",
          }
        );
        res.end(html);
        return;
      } catch (error) {
        if (error.code === "MODULE_NOT_FOUND") {
          // eslint-disable-next-line no-magic-numbers
          res.writeHead(404);
          res.end("Not Found");
          return;
        }
        // eslint-disable-next-line no-magic-numbers
        res.writeHead(500);
        res.end(error.stack);
        return;
      }
    })
    .listen(...args);
  });
