<div align="center"><h1><a href="./examples/app"><code>./examples/app</code> Deep Dive</a></h1></div>

#### Run `webpack` with `yarn app:2.0`
*  Run the following scripts to see the HTML output
    ```bash
    $ cd examples/app/dist
    $ node -e "require('./' + require('./2.0.json')['a.node.js']).default({}).then(console.log)" > index.html
    ```
* `2.0.json` lets you locate the server build entry chunk via a stable name. You may use this to run the previous scripts to generate a static HTML in the build or deployment pipeline.
    ```json
    {
      "__VERSION__": "2.0",
      "a.node": "a.node.20cc990c5b6946197b2e.js",
      "b.node": "b.node.52a760434a5ab7b2d87d.js"
    }
    ```

#### Run `webpack-dev-server` with `yarn app:2.0:start`
  * You have to implement `reqToProps` method if your server side logic depends on request parameters.
  * [`webpack.config.js`](/examples/app/2.0/webpack.config.js#L22) makes [`props`](/examples/app/2.0/b.node.js#L6) to be `{ "version": "ANY_STRING" }` when you hit http://localhost:8080/a.node?version=ANY_STRING. See [this](/index.js#L254-L261) for the details.
  * The server build entry is a ***must*** to ***default export*** [an ***async*** function with an argument `props`](/examples/app/2.0/b.node.js#L6).
  * http://localhost:8080/b.node is an example of multi entries.