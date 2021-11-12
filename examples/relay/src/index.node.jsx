import {
  RelayNetworkLayer,
  urlMiddleware,
} from "react-relay-network-modern/es";
import {
  renderToStaticMarkup,
  renderToString,
} from "react-dom/server";
import {App} from "./Root";
import {ServerStyleSheet} from "styled-components";
import {createEnvironment} from "./environment";
import fetch from "node-fetch";
import {fetchQuery} from "relay-runtime";
import rootQuery from "./__generated__/RootQuery.graphql.js";

globalThis.fetch = fetch;

export default async (props) => {
  const sheet = new ServerStyleSheet();

  const ssr = props.ssr !== "false";
  const graphqlUrl = `http://${props.host}:${props.port}/graphql`;
  const network = new RelayNetworkLayer([
    urlMiddleware({
      "url": graphqlUrl,
    }),
  ]);
  const environment = createEnvironment({
    "isServer": true,
    network,
  });
  const variables = {
    "id": props.id || "3j881qym",
  };

  ssr && (await fetchQuery(environment, rootQuery, variables).toPromise());
  const __html = ssr ? renderToString(sheet.collectStyles(<App environment={environment} variables={variables} />)) : "";
  return "<!DOCTYPE html>" + renderToStaticMarkup(<html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="></link>
      <script dangerouslySetInnerHTML={{"__html": [
        `globalThis.__RELAY_STORE__ = ${JSON.stringify(ssr ? environment.getStore().getSource().toJSON() : {}).replace(/</g, "\\u003c")};`,
        `globalThis.__RELAY_ROOT_VARIABLES__ = ${JSON.stringify(variables).replace(/</g, "\\u003c")};`,
        `globalThis.__PROPS__ = ${JSON.stringify(props).replace(/</g, "\\u003c")};`,
        `globalThis.__GRAPHQL_URL__ = ${JSON.stringify(graphqlUrl)};`,
      ].join("")}} />
      <script dangerouslySetInnerHTML={{"__html": __SOURCES__["index.js"]}} />
      {sheet.getStyleElement()}
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{__html}} />
      <script integrity={__DIGESTS__["vendors.js"]} src={__webpack_public_path__ + __FILES__["vendors.js"]} crossOrigin="anonymous" />
    </body>
  </html>);
};
