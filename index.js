/* eslint-disable max-lines-per-function, max-statements */
const crypto = require("crypto");
const fs = require("fs");
const {patchFs, patchRequire} = require("fs-monkey");
const path = require("path");
const webpack = require("webpack");
const ResolverFactory = require("webpack/lib/ResolverFactory");
const PLUGIN_NAME = "ReactSSRWebpackPlugin";

function extractFiles(compilation) {
  const warnings = [];
  const chunks = {};

  Array.from(compilation.chunks).reduce((chunks, chunk) => {
    return Array.from(chunk.files).reduce((chunks, file) => {
      const ext = path.extname(file);
      const name = `${(chunk.name || chunk.id)}${file.endsWith(".hot-update.js") ? ".hot-update" : ""}${ext}`;

      if (!(chunk.name || chunk.id)) {
        return chunks;
      }

      if (chunks[name] && chunks[name] !== file) {
        warnings.push(new webpack.WebpackError(
          `'${file}' will overwrite '${chunks[name]}' as the primarily '${name}' chunk. You may have runtime error when using __FILES__["${name}"].`
        ));
      }
      chunks[name] = file;
      return chunks;
    }, chunks);
  }, chunks);

  return [chunks, warnings];
}

function extractSources(compilation, files) {
  return Object.values(files).reduce((sources, file) => {
    sources[file] = compilation.assets[file].source();
    return sources;
  }, {});
}

function extractDigests(assets, algorithm) {
  return Object.entries(assets).reduce((digests, [key, source]) => {
    digests[key] = `${algorithm}-${crypto.createHash(algorithm).update(source).digest("base64")}`;
    return digests;
  }, {});
}

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

class ReactSSRWebpackPlugin {
  constructor(options, configs = {}) {
    this.configs = configs;
    this.configs.version = this.configs.version || "manifest";
    this.configs.algorithm = this.configs.algorithm || "sha256";
    this.configs.noRequire = this.configs.noRequire == undefined ? true : this.configs.noRequire;
    this.options = webpack.config.getNormalizedWebpackOptions({
      "entry": {...options.entry},
      "resolve": {...options.resolve},
      "target": "node",
    });
    webpack.config.applyWebpackOptionsDefaults(this.options);
  }

  apply(compiler) {
    let files = {};
    let sources = {};
    let digests = {};
    let warnings = [];

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      let childCompiler = compilation.createChildCompiler(PLUGIN_NAME);
      new webpack.node.NodeTemplatePlugin().apply(childCompiler);
      new webpack.node.NodeTargetPlugin().apply(childCompiler);
      new webpack.library.EnableLibraryPlugin("commonjs2").apply(childCompiler);
      new webpack.LoaderTargetPlugin("node").apply(childCompiler);
      if (this.configs.noRequire) {
        new webpack.optimize.LimitChunkCountPlugin({"maxChunks": 1}).apply(childCompiler);
      } else {
        new webpack.optimize.SplitChunksPlugin(compilation.options.optimization.splitChunks).apply(childCompiler);
      }

      childCompiler.resolverFactory = new ResolverFactory();
      childCompiler.resolverFactory.hooks.resolveOptions.for("normal").tap(PLUGIN_NAME, (resolveOptions) => {
        resolveOptions = webpack.util.cleverMerge(this.options.resolve, resolveOptions);
        resolveOptions.fileSystem = compilation.compiler.inputFileSystem;
        return resolveOptions;
      });
      childCompiler.resolverFactory.hooks.resolveOptions.for("context").tap(PLUGIN_NAME, (resolveOptions) => {
        resolveOptions = webpack.util.cleverMerge(this.options.resolve, resolveOptions);
        resolveOptions.fileSystem = compilation.compiler.inputFileSystem;
        resolveOptions.resolveToContext = true;
        return resolveOptions;
      });
      childCompiler.resolverFactory.hooks.resolveOptions.for("loader").tap(PLUGIN_NAME, (resolveOptions) => {
        resolveOptions = webpack.util.cleverMerge(this.options.resolveLoader, resolveOptions);
        resolveOptions.fileSystem = compilation.compiler.inputFileSystem;
        return resolveOptions;
      });

      childCompiler.options.output.library = {
        ...childCompiler.options.output.library,
        "name": "",
        "type": "commonjs2",
      };
      webpack.EntryOptionPlugin.applyEntryOption(childCompiler, compilation.compiler.context, this.options.entry);

      childCompiler.hooks.thisCompilation.tap(PLUGIN_NAME, (childCompilation, {normalModuleFactory}) => {
        childCompilation.hooks.processAssets.tapAsync(
          {
            "name": PLUGIN_NAME,
            "stage": webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
          },
          (_assets, callback) => {
            if (childCompilation.errors.length > 0) {
              callback(childCompilation.errors);
              return;
            }

            const string = JSON.stringify(
              {
                "__VERSION__": this.configs.version,
                ...extractFiles(childCompilation)[0],
              },
              null,
              // eslint-disable-next-line no-magic-numbers
              2
            );

            childCompilation.emitAsset(
              `${this.configs.version}.json`,
              new webpack.sources.RawSource(string)
            );

            callback();
          }
        );

        childCompilation.dependencyTemplates.set(
          webpack.dependencies.ConstDependency,
          new webpack.dependencies.ConstDependency.Template()
        );

        const handler = (parser) => {
          const cases = {
            "__FILES__": (value) => files[value] || "",
            "__DIGESTS__": (value) => digests[files[value]] || "",
            "__SOURCES__": (value) => sources[files[value]] || "",
          };

          Object.entries(cases).forEach(([token, fn]) => {
            parser.hooks.expressionMemberChain.for(token).tap(PLUGIN_NAME, (expression) => {
              const {value} = expression.property;

              parser.state.current.buildInfo.cacheable = false;
              const dep = new webpack.dependencies.ConstDependency(
                JSON.stringify(fn(value)),
                expression.range
              );
              dep.loc = expression.loc;
              parser.state.current.addDependency(dep);

              if (!fn(value)) {
                childCompilation.warnings.push(new webpack.WebpackError(
                  `${token}['${value}'] is not found.\n` +
                  "Empty string will be used. You may have runtime error."
                ));
              }
              return true;
            });
          });
        };

        normalModuleFactory.hooks.parser.for("javascript/auto").tap(PLUGIN_NAME, handler);
      });

      compilation.hooks.processAssets.tapAsync(
        {
          "name": PLUGIN_NAME,
          "stage": webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        (_assets, callback) => {
          [files, warnings] = extractFiles(compilation);
          sources = extractSources(compilation, files);
          digests = extractDigests(sources, this.configs.algorithm);
          compilation.warnings.push(...warnings);
          childCompiler.runAsChild((error, _entries, childCompilation) => {
            const {parentCompilation} = childCompilation.compiler;
            parentCompilation.fileDependencies.addAll(childCompilation.fileDependencies);
            parentCompilation.contextDependencies.addAll(childCompilation.contextDependencies);
            parentCompilation.buildDependencies.addAll(childCompilation.buildDependencies);
            parentCompilation.missingDependencies.addAll(childCompilation.missingDependencies);

            // this is for webpack-dev-server auto-reload purpose
            // the parent compilation hash does not include this child
            // because it is too late
            parentCompilation.fullHash = `${parentCompilation.fullHash}|${childCompilation.fullHash}`;
            parentCompilation.hash = `${parentCompilation.hash}|${childCompilation.hash}`;

            callback(error);
          });
        }
      );
    });
  }
}

function ReactSSRMiddleware({reqToProps}) {
  return ({app, compiler}) => {
    let files = {};
    let outputPath = "";

    const ufs = unionFs([{...compiler.outputFileSystem}, {...fs}]);
    patchFs(ufs);       // this is for pnp
    patchRequire(ufs);  // this is for classic require

    app.get("/:entry", (req, res, next) => {
      const entry = `${req.params.entry}.js`;

      if (!files[entry]) {
        next();
        return;
      }

      require(`${outputPath}/${files[entry]}`)
        .default(reqToProps(req))
        .then((html) => {
          res.send(html);
        })
        .then(next)
        .catch(next);
    });

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      if (compilation.name === PLUGIN_NAME) {
        ({outputPath} = compilation.compiler);
        compilation.hooks.afterSeal.tapAsync(PLUGIN_NAME, (callback) => {
          [files] = extractFiles(compilation);
          callback();
        });
      }
    });

    compiler.hooks.invalid.tap(PLUGIN_NAME, () => {
      Object
        .keys(require.cache)
        .filter(id => id.startsWith(outputPath))
        .forEach(id => {
          delete require.cache[id];
        });
    });
  };
}

module.exports = {
  ReactSSRMiddleware,
  ReactSSRWebpackPlugin,
};
