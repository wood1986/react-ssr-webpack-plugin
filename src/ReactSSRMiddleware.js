const fs = require("fs");
const {patchFs, patchRequire} = require("fs-monkey");
const {ReactSSRResponse} = require("./ReactSSRResponse");
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
        throw new Error(`all fs.${key} throw an exception.`);
      }
    };
  }

  return {
    [readFileSync]: setupFunc(readFileSync),
    [realpathSync]: setupFunc(realpathSync),
    [statSync]: setupFunc(statSync),
  };
}

function ReactSSRMiddleware({
  reqToProps = (req) => ({"url": url.parse(req.url, true)}),
  version = "manifest",
  resultToRes = ReactSSRResponse,
  patchGlobal = () => {},
}) {
  return ({app, compiler}) => {
    const ufs = unionFs([{...compiler.outputFileSystem}, {...fs}]);
    patchFs(ufs);       // this is for pnp
    patchRequire(ufs);  // this is for classic require
    patchGlobal(globalThis);

    app.get(
      "*",
      async (req, res) => {
        const result = await ReactSSREntry({
          "props": reqToProps(req),
          require,
          "workdir": compiler.outputPath,
          "url": url.parse(req.url, true),
          version,
        });

        resultToRes(res, result);
        return;
      }
    );

    compiler.hooks.invalid.tap(PLUGIN_NAME, () => {
      Object
        .keys(require.cache)
        .filter(id => id.startsWith(compiler.outputPath))
        .forEach(id => {
          delete require.cache[id];
        });
    });
  };
}

module.exports = {
  ReactSSRMiddleware,
};
