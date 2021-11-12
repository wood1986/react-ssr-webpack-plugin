<div align="center"><h1><a href="./examples/shell"><code>./examples/shell</code> Deep Dive</a></h1></div>

#### Run with `yarn shell:start`

* This script runs
  * `yarn app:1.0 && yarn app:2.0`:
    * Build two versions, `1.0` and `2.0`
    * Think about `1.0` was the last week build and `2.0` is this week build
    * In `1.0`, `index.web.js` is inlined and come with the html. You can inspect the `<head>` with http://localhost:8080/a.node?version=1.0
    * In `2.0`, `index.web.js` is downloaded separately after the html is loaded. You can inspect `<head>` and network with http://localhost:8080/a.node?version=2.0
  * `yarn shell`:
    * Build the shell in `examples/shell`
  * `cp ./examples/app/dist/2.0.json ./examples/app/dist/default.json`
    * Set which version goes live
  * `node --inspect ./examples/shell/dist/index.js ./examples/app/dist`
    * Run the shell
    * The shell will load and execute the js in `examples/app/dist`

* Open http://localhost:8080/a.node like what you did in [`./examples/app` Deep Dive](/examples/app/README.md).
  * `query.version = default` means `default.json` in `examples/app/dist/default.json` is in use. You can also check the content with this url http://localhost:8080/default.json.
  * `json.__VERSION__ = 2.0` means the actual hashed js of `a.node.js` in `2.0.json` is used by default. This also implies `2.0.json` and `default.json` are identical.
  * To check the `2.0.json` content, you can use this url http://localhost:8080/2.0.json
  * To visit the previous version `1.0`, you can use this url http://localhost:8080/a.node?version=1.0. You can also check `1.0.json` content with this url http://localhost:8080/1.0.json
  * Now you can travel different builds http://localhost:8080/a.node?version=1.0 and http://localhost:8080/a.node?version=2.0 without a second deployment
  * See [this logic](/examples/shell/index.js#L20-L24) for the details.

<div align="center"><h1>Tips</h1></div>

  * The middleware [invalidates](/examples/shell/index.js#L20-L24) node require cache for the default case which does not have `?version` querystring scenario. This makes sure each request is using the expected or latest server build to response the html.
  * You can upload all client and server js in the same place. To make a particular build go live, you can just run `cp 2.0.json default.json`.
  * Because of that, you do not need to restart the shell on each server build deployment unless you need to update the node version or the shell, `index.js`.
  * This shell example does not have a mechanism to release the outdated server entry file in require cache. You need to think about when and how or just simpily restart the node regularly.
  * This shell example does not have an access control for the server builds and the manifest JSON. Hackers can download your server builds. Therefore,
    * Do not hard-coded any secret in the application logic.
    * You can add some naming pattern to `version` e.g. `manifest.<version>.json` and then forbid all external requests to `/manifest.*.json` in your proxy. Blocking the manifest JSON should be enough because all server builds named with a hash. Only manifest JSON has this information.
  * Avoiding singleton is a must in order to get the shell pattern working.
  * The ideal infrastructure in Kubernetes with this plugin should
    * Use [AWS S3](https://aws.amazon.com/s3/), [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) or other cloud storage to store client, server build and the shell `index.js`.
    * Mount the previous storage as a Volume in Kubernetes via [CSI](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) and [driver](https://kubernetes-csi.github.io/docs/drivers.html).
    * Run the shell `index.js` with the native Docker node image directly.
      * You do not need to provision the node image for example [`COPY`](https://docs.docker.com/engine/reference/builder/#copy) the JS files to the image because it is in the volume.

