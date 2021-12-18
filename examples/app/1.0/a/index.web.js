import {App} from "./App";
import ReactDOM from "react-dom";

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <App {...globalThis.props} />
);
