<div align="center"><h1><a href="./examples/relay"><code>./examples/relay</code> Deep Dive</a></h1></div>

#### Run `relay-compiler` with `yarn relay-compiler`
* Generate code as part of a build step which can then be referenced at runtime

#### Run `webpack` with `yarn relay`
* `manifest.json` should look like this
    ```json
    {
      "__VERSION__": "manifest",
      "index.js": "index.2be4a781f5217e8622a5.js"
    }
    ```
* The data fetch logic is done at [index.node.jsx#L36](/examples/relay/src/index.node.jsx#L36)
* The store initialization is done at [index.node.jsx#L44-L47](/examples/relay/src/index.node.jsx#L44-L47)
#### Run `webpack-dev-server` with `yarn relay:start`
* The [graphql server](/examples/relay/graphql/index.js) runs under `webpack-dev-server` with [this config](/examples/relay/webpack.config.js#L27)
* To simulate client side rendering instantly, you can use this [url](http://127.0.0.1:8080/index?ssr=false).
* This plugin is not responsible for handling`?ssr=true`. But you can check [this file](/examples/relay/graphql/index.js) to see how it works.