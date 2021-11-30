import "bootstrap/dist/css/bootstrap-reboot.min.css";
import {App} from "./App";
import ReactDOM from "react-dom";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register(new URL("./sw.js", import.meta.url), {"scope": "/b.node"});
// }

ReactDOM.createRoot(
  document.getElementById("root"),
  {"hydrate": true}
).render(<App {...globalThis.props} />);
