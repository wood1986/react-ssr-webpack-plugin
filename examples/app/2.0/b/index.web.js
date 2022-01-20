import {App} from "./App";
import ReactDOM from "react-dom";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register(new URL("./sw.js", import.meta.url), {"scope": "/b.node"});
// }

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <App {...globalThis.props} />
);
