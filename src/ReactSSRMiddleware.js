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
