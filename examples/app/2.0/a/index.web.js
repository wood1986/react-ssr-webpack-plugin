import "bootstrap/dist/css/bootstrap-reboot.min.css";
import {App} from "./App";
import ReactDOM from "react-dom";

const worker = new Worker(new URL("./worker.js", import.meta.url));
// eslint-disable-next-line no-console
worker.onmessage = console.log;

ReactDOM.createRoot(
  document.getElementById("root"),
  {"hydrate": true}
).render(<App {...globalThis.props} />);
