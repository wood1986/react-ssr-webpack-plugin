/* eslint-disable max-lines-per-function, max-statements */
const crypto = require("crypto");
const path = require("path");
const webpack = require("webpack");
const ResolverFactory = require("webpack/lib/ResolverFactory");
const PLUGIN_NAME = "ReactSSRWebpackPlugin";
const prettier = require("prettier");

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

function genManifest(version, entries, routes) {
  routes = routes.map(({pattern, entry}) => {
    return `{
      "pattern": "${pattern}",
      "entry": ${entry.toString()}
    }`;
  });

  return `module.exports = {
    "__VERSION__": "${version}",
    "__ENTRIES__": ${JSON.stringify(entries)},
    "__ROUTES__": [${routes}]
  };`;
}

class ReactSSRWebpackPlugin {
  constructor(options, config = {}) {
    this.config = config;
    this.config.version = this.config.version || "manifest";
    this.config.algorithm = this.config.algorithm || "sha256";
    this.config.routes = this.config.routes || [
      {
        "pattern": "/:entry",
        "entry": ({params}) => params.entry,
      },
    ];
    this.config.node = this.config.node == undefined ? true : this.config.node;

    this.options = webpack.config.getNormalizedWebpackOptions({
      "entry": options.entry,
      "resolve": options.resolve,
      "resolveLoader": options.resolveLoader,
      "target": "node",
      "output": {
        "library": {
          "type": "commonjs2",
        },
      },
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

      if (this.config.node) {
        new webpack.node.NodeTargetPlugin().apply(childCompiler);
      }

      new webpack.library.EnableLibraryPlugin(this.options.output.library.type).apply(childCompiler);
      new webpack.optimize.LimitChunkCountPlugin({"maxChunks": 1}).apply(childCompiler);
      childCompiler.options.output.library = this.options.output.library;
      webpack.EntryOptionPlugin.applyEntryOption(childCompiler, compilation.compiler.context, this.options.entry);

      childCompiler.hooks.thisCompilation.tap(PLUGIN_NAME, (childCompilation, {normalModuleFactory}) => {
        childCompilation.hooks.processAssets.tapAsync(
          {
            "name": PLUGIN_NAME,
            "stage": webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
          },
          (_assets, callback) => {
            childCompilation.emitAsset(
              `${this.config.version}.js`,
              new webpack.sources.RawSource(
                prettier.format(
                  genManifest(
                    this.config.version,
                    extractFiles(childCompilation)[0],
                    this.config.routes
                  ),
                  {
                    "semi": false,
                    "parser": "babel",
                  }
                )
              )
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
          digests = extractDigests(sources, this.config.algorithm);
          compilation.warnings.push(...warnings);
          childCompiler.runAsChild((error, _entries, childCompilation) => {
            if (error) {
              callback(error);
              return;
            }

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

            callback(null);
          });
        }
      );
    });
  }
}

module.exports = {
  PLUGIN_NAME,
  ReactSSRWebpackPlugin,
};
