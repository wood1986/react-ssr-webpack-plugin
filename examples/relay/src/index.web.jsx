import {
  RelayNetworkLayer,
  cacheMiddleware,
  urlMiddleware,
} from "react-relay-network-modern/es";
import {App} from "./Root";
import ReactDOM from "react-dom";
import {createEnvironment} from "./environment";

const network = new RelayNetworkLayer([
  cacheMiddleware(),
  urlMiddleware({
    "url": globalThis.__GRAPHQL_URL__ || "http://localhost:8080/graphql",
  }),
]);

const environment = createEnvironment({
  "isServer": false,
  network,
  "records": globalThis.__RELAY_STORE__,
});

if (globalThis.__PROPS__.hydrate) {
  ReactDOM.hydrateRoot(
    document.getElementById("root"),
    <App environment={environment} variables={globalThis.__PROPS__.variables} />
  );
} else {
  ReactDOM.createRoot(
    document.getElementById("root")
  ).render(<App environment={environment} variables={globalThis.__PROPS__.variables} />);
}

