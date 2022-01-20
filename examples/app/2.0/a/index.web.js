import {App} from "./App";
import ReactDOM from "react-dom";

const worker = new Worker(new URL("./worker.js", import.meta.url));
// eslint-disable-next-line no-console
worker.onmessage = console.log;

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <App {...globalThis.props} />
);
