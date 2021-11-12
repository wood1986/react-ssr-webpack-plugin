<div align="center"><h1>react-ssr-webpack-plugin</h1></div>

`react-ssr-webpack-plugin` is a webpack plugin to generate JS files for server side rendering. These JS files are able to output HTMLs ***dynamically*** with different input parameters. It targets at ***react*** applications and advanced developers who want to work directly with the fundamental libraries and tools such as `react`, `webpack`, `babel` and so on rather than a framework such as `Next.js`, `Gatsby` or `Razzle`. It also provides a middleware for the existing `webpack-dev-server` to simulate the server side rendering. To achieve this, you will need not only 2 tools, `ReactSSRWebpackPlugin` and `ReactSSRMiddleware` but also a design pattern.

<div align="center"><h1>Features / Expectations</h1></div>

* The plugin should output JS files for node.js to execute and then generate the whole HTML rather than a rendered HTML.
* The JS files should expose a function for node.js to `require` / `import` and pass parameters.
* The JS files should be executed anywhere without `npm install`.
* The JS files should output HTML dynamically by passing different input parameters.
* [Multiple builds of JS files should coexist and be executed at the same time without a re-deployment or restart.](#server-build-versioning)
* All static assets in the HTML output should support long term caching with a hashed filename.
* It should support [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* Developers should be able to control any tags and their position anywhere in the page via JSX.
* Developers should be able to inline any static assets anywhere in the page.
* `webpack-dev-server` should be used to simulate server side rendering with the existing `webpack.config.js` for web and node target.
* `webpack-dev-server` can response differently based on the request parameters without compiling again or restart.

<div align="center"><h1>How</h1></div>

* Install
  ```bash
  npm install --save-dev react-ssr-webpack-plugin # for npm

  # OR

  yarn add --save-dev react-ssr-webpack-plugin # for yarn
  ```
* Configure `webpack.config.js`
  ```js
  const {ReactSSRWebpackPlugin, ReactSSRMiddleware} = require("react-ssr-webpack-plugin");

  module.exports = {
    ...
    "devServer": {
      "onAfterSetupMiddleware": ReactSSRMiddleware({
          /* If the html response depends on the req
             parameters, you can implement reqToProps
             function. This plugin will call this function
             and then pass the result as a props to the entry */
          reqToProps: (req) => url.parse(req.url, true).query,
        }),
      },
    },
    "plugins": [
      new ReactSSRWebpackPlugin(
        /* webpack-like config but it only supports "entry", "resolve" and "resolveLoader" */
        {
          "entry": {
            "YOUR_NODE_ENTRY_NAME": path.resolve(__dirname, "YOUR_NODE_ENTRY_JS_FILE"),
            "a": path.resolve(__dirname, "a.node"),
          },
          /* The configuration and functionality will be same as
             https://webpack.js.org/configuration/resolve/.
             But this is for child compiler to generate ssr build */
          "resolve": {
            ...
          },
          "resolveLoader": {
            ...
          },
        },
        /* ReactSSRWebpackPlugin specific config */
        {
          /* Default is "manifest", it is for naming the manifest file.
             In this case, 2.0.json will be generated. Normally you
             should pass the build number from the CI environment variable.
             If you pass nothing, manifest.json will be generated. */
          "version": "2.0" ,
          /* Default is "sha256", The hashing function for
             subresource integrity purpose */
          "algorithm": "sha256",
        }
      )
    ]
    ...
  };
  ```

* Use [`a.node.js`](/examples/app/2.0/a.node.js) and [`a.web.js`](/examples/app/2.0/a.web.js) as an example to adjust your app
  * [`a.node.js`](/examples/app/2.0/a.node.js) is the entry for generating the server build which will be specified in [`webpack.config.js`](/examples/app/2.0/webpack.config.js#L114).
  * [`a.web.js`](/examples/app/2.0/a.web.js) is the entry for generating the client build which will be specified in [`webpack.config.js`](/examples/app/2.0/webpack.config.js#L26).
  * Each `<entry>.node.js` should only __***default***__ export one __***async***__ function. __***default***__ export and ***async*** are ***must***.
  * [`__SOURCES__`](/examples/app/2.0/a.node.js#L20), [`__FILES__`](/examples/app/2.0/a.node.js#L25), [`__DIGESTS__`](/examples/app/2.0/a.node.js#L25) are the core tokens and they will get replaced at build time.
    * [`__SOURCES__`](/examples/app/2.0/a.node.js#L20) is used to get and inline the actual source.
    * [`__FILES__`](/examples/app/2.0/a.node.js#L25) is used to get the hashed filename.
    * [`__DIGEST__`](/examples/app/2.0/a.node.js#L25) is used for the [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  * The key name, `a.web.js` and `vendor.js` in `__SOURCES__['a.web.js']` and `__FILE__['vendors.js']` are from [`entry`](/examples/app/2.0/webpack.config.js#L27) and [`splitChunks`](/examples/app/2.0/webpack.config.js#L89)

* Go check [examples/app](/examples/app) for the full implementation

<div align="center"><h1>Limitations / Known issues</h1></div>

* ***Only*** support react app and
  * JSX is the template language.

* ***Does not*** support the classic css modules
  * You have to use CSS-in-JS such as [`styled-components`](https://styled-components.com), [`jss`](https://cssinjs.org), ...
  * As for the 3rd party page level css such as [bootstrap](https://getbootstrap.com/docs/4.5/getting-started/contents/#css-files), you still can `import/require` it in the `<entry>.web.js`, as long as node.js does not run the css code. That's why `<entry>.node.js` does not `import/require` css.
  * See [a.web.js](/examples/app/2.0/a.web.js#L1) and [webpack.config.js](/examples/app/2.0/webpack.config.js#L65-L68).

* A pure isomorphic React component is required
  * The following code is not supported and you ***should avoid it*** because you will easily get a hydration warning.
    ```js
    function Component(props) {
      if (ENVIRONMENT === "web") {
        // do something
      }

      if (ENVIRONMENT === "node") {
        // do something
      }

      return <>
        {(ENVIRONMENT === "web") && <p>web</p>}
        {(ENVIRONMENT === "node") && <p>node</p>}
      </>
    }
    ```
  * With this plugin, both server and client build share the same value for the `ENVIRONMENT`.
  * Environment-specific logics should live inside the `<entry>.web.js` and `<entry>.node.js` only and respectively.
    * You can use `resolve` options to load different js for node target.
    * Otherwise, keeping the variant as minimum as possible is the best practice.

<div align="center"><h1>Server build versioning</h1></div>

### Background
Practically, when we deploy the client build, all static assets' filename must have a hash. This is for not only the long-term caching purpose but also the version travelling. It means you can revisit previous or preview upcoming build anytime without a second deployment. When there is a live site issue, you can rollback your PROD build instantly by invalidating the static path such as `index.html` in the CDN cache. We can apply the same strategy into the server build and think about node.js is a browser. ***Then you do not need to restart the server on each deployment if node.js version does not change.***

### Prerequisite
* ***Must not*** use any singleton pattern
  * For example, the store on server side is instantiated once and shared with different requests. You may leak some sensitive information to other request.
  * ***To identify it, you can think about if there is a variable which is created once AND shared AND lives until the application exit.***
  * ***Each request should go through all the variable creation progress.***
  * Thanks `react` and its functional programming paradigm. Most states are scoped and created on each incoming request.
  * Make the best use of [React Context](https://reactjs.org/docs/context.html) to store global things on each incoming request.

* ***Must not*** have `externals: [nodeExternals()]` in `webpack.config.js`
  * No need to run `npm install` before running the server build.
  * node.js can require the new server build on the fly without a restart.
  * This allows node.js to run two versions of server build which depends on a package in different major versions at the same time.

* The web-framework-related logic and application logic should be separated.
  * The web framework logic means:
    * [express](https://github.com/expressjs/express), [polka](https://github.com/lukeed/polka)...
    * Parse the query string, request headers, cookies, url segments...
    * Call and pass the previous parsing results to the entry function. See [this](/index.js#L254-L261).
    * Respond the HTML from the entry function result.
  * The application logic means:
    * Data fetching
    * Store initialization
    * `renderToStaticMarkup` or `renderToString`
    * `<head>` and `<body>` structuring
    * Go check [examples/relay](/examples/relay) for the full implementation

* The web framework is just a shell and has zero knowledge about your app except the root/entry function.
  * The deployment cycle for the shell and app are separately.
  * The shell does not need to restart if there is a new server build.

* Go check [examples/shell](/examples/shell) for the full implementation
