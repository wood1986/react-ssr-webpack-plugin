import "bootstrap/dist/css/bootstrap-reboot.min.css";

// eslint-disable-next-line id-length
import {App as A} from "./A";
import ReactDOM from "react-dom";

const worker = new Worker(new URL("./worker.js", import.meta.url));
// eslint-disable-next-line no-console
worker.onmessage = console.log;

ReactDOM.createRoot(
  document.getElementById("root"),
  {"hydrate": true}
).render(<A {...globalThis.props} />);
