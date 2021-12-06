const fs = require("fs");
const {patchFs, patchRequire} = require("fs-monkey");
const {ReactSSRCommonMiddleware} = require("./ReactSSRCommonMiddleware");
const {PLUGIN_NAME} = require("./ReactSSRWebpackPlugin");

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

function ReactSSRMiddleware({reqToProps, version = "manifest"}) {
  return ({app, compiler}) => {
    const ufs = unionFs([{...compiler.outputFileSystem}, {...fs}]);
    patchFs(ufs);       // this is for pnp
    patchRequire(ufs);  // this is for classic require

    app.get(
      "/*",
      ReactSSRCommonMiddleware({
        "requireFn": require,
        "workdir": compiler.outputPath,
        reqToProps,
        version,
      })
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
