/* eslint-disable max-lines-per-function, max-statements */
const {isPlainObject} = require("is-plain-object");
const path = require("path");
const {matchPath} = require("react-router");
const url = require("url");

function return404(req, res) {
  // eslint-disable-next-line no-magic-numbers
  res.writeHead(404);
  res.end(`Cannot GET ${url.parse(req.url, true).href}`);
}

function ReactSSRCommonMiddleware({requireFn, reqToProps, workdir, version}) {
  return function (req, res, next) {
    try {
      const props = reqToProps(req);
      if (!isPlainObject(props)) {
        next("reqToProps does not return a plain object.");
        return;
      }

      let finalVersion = props.url.query.version || version;
      delete requireFn.cache[`${path.resolve(workdir, finalVersion)}.js`];

      const {
        __ROUTES__,
        __ENTRIES__,
        __VERSION__,
      } = requireFn(`${workdir}/${finalVersion}`);
      const route = __ROUTES__.find((route) => matchPath(route.pattern, req.path));
      if (!route) {
        return404(req, res);
        return;
      }

      const entry = `${route.entry(matchPath(route.pattern, req.path))}.js`;
      if (!__ENTRIES__[entry]) {
        return404(req, res);
        return;
      }

      requireFn(`${workdir}/${__ENTRIES__[entry]}`)
        .default({...props, __VERSION__})
        .then(({html, statusCode}) => {
          res.writeHead(
            // eslint-disable-next-line no-magic-numbers
            statusCode,
            {
              "Content-Type": "text/html",
            }
          );
          res.end(html);
        })
        .catch(error => {
          // eslint-disable-next-line no-magic-numbers
          res.writeHead(500);
          res.end(error.stack);
          return;
        });
    } catch (err) {
      next(err);
      return;
    }
  };
}

module.exports = {
  ReactSSRCommonMiddleware,
};
