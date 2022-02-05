const fs = require("fs");
const {patchFs, patchRequire} = require("fs-monkey");
const {ReactSSREntry} = require("./ReactSSREntry");
const {PLUGIN_NAME} = require("./ReactSSRWebpackPlugin");
const url = require("url");

function unionFs(fss) {
  const readFileSync = "readFileSync";
  const realpathSync = "realpathSync";
  const statSync = "statSync";

  function setupFunc(key) {
    return (...args) => {
      const errors = [];
      // eslint-disable-next-line id-length
      for (let i = 0; i < fss.length; i++) {
        try {
          return fss[i][key].apply(fss[i], args);
        } catch(err) {
          errors.push(err);
        }
      }

      if (errors.length == fss.length) {
        // 1. some third party relies on the exception
        // and error code such as stylelint-webpack-plugin
        // 2. return error created by fs not ufs
        throw errors[errors.length - 1];
      }
    };
  }

  return {
    [readFileSync]: setupFunc(readFileSync),
    [realpathSync]: setupFunc(realpathSync),
    [statSync]: setupFunc(statSync),
  };
}

/**
 * @callback ReactSSRMiddleware~Function
 * @param {Object} req -
 * The request object
 *
 * @param {Object} res -
 * The response object
 *
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} ReactSSRMiddleware~Config
 * @property {ReactSSRMiddleware~Config~PatchGlobal} patchGlobal
 * This callback allows you to patch global object without bundling
 * a dependency to the server chunk but you need it at runtime. For example,
 * if cloudflare worker is the production environment, you do not need
 * to include fetch to the server chunk because fetch is runtime api
 * But you need it in your local development environment.
 * Default is `() => {}`
 *
 * @property {ReactSSRMiddleware~Config~ReqToProps} reqToProps
 * This callback allows you to convert the request object
 * to ***a plain object*** before passing to `<App {...props} />`.
 * If it does not return a plain object, it will return http 500 error.
 * Default is `() => ({})`
 *
 * @property {ReactSSRMiddleware~Config~ResultToRes} resultToRes
 * This callback allows you to define your own function to perform http response
 * Default callback supports status code and body.
 *
 * @property {string} version
 * The version of the JS entry to be executed.
 * If you customize `version` in plugin options,
 * you need to put same value here.
 * Default is `manifest`
 */

/**
 * @callback ReactSSRMiddleware~Config~ReqToProps
 * @param {Object} req
 * The request object
 *
 * @returns {Object} The plain object
 */

/**
 * @callback ReactSSRMiddleware~Config~ResultToRes
 * @param {Object} res
 * The response object
 *
 * @param {Object} result
 * The result object from the entry
 *
 * @returns {void}
 */

/**
 * @callback ReactSSRMiddleware~Config~PatchGlobal
 * @param {Object} global
 * The environment global object
 *
 * @returns {void}
 */

/**
 * A custom webpack-dev-server middleware for performing server side rendering
 * and live reload when server code has modification
 * @function ReactSSRMiddleware
 * @param {Object} compiler
 * The webpack compiler
 *
 * @param {ReactSSRMiddleware~Config} config
 * The middleware config
 *
 * @returns {ReactSSRMiddleware~Function}
 * The middleware function
 */

function ReactSSRMiddleware(
  compiler,
  {
    reqToProps = () => ({}),
    version = "manifest",
    resultToRes = (res, {body, statusCode}) => {
      // eslint-disable-next-line no-magic-numbers
      if (statusCode != 200) {
        res.type("text");
      }
      res.status(statusCode).send(body);
    },
    patchGlobal = () => {},
  }
) {
  const ufs = unionFs([{...compiler.outputFileSystem}, {...fs}]);
  patchFs(ufs);       // this is for pnp
  patchRequire(ufs);  // this is for classic require
  patchGlobal(globalThis);

  compiler.hooks.invalid.tap(PLUGIN_NAME, () => {
    Object
      .keys(require.cache)
      .filter(id => id.startsWith(compiler.outputPath))
      .forEach(id => {
        delete require.cache[id];
      });
  });

  return async (req, res) => {
    const result = await ReactSSREntry({
      "props": reqToProps(req),
      require,
      "workdir": compiler.outputPath,
      "url": url.parse(req.originalUrl, true),
      version,
    });

    resultToRes(res, result);
  };
}

module.exports = {
  ReactSSRMiddleware,
};
