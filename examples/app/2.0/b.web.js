// eslint-disable-next-line id-length
import {App as B} from "./B";
import ReactDOM from "react-dom";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register(new URL("./sw.js", import.meta.url), {"scope": "/b.node"});
// }

ReactDOM.createRoot(
  document.getElementById("root"),
  {"hydrate": true}
).render(<B {...globalThis.props} />);
