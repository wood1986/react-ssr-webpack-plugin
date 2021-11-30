import {App} from "./App";
import ReactDOM from "react-dom";

ReactDOM.createRoot(
  document.getElementById("root"),
  {"hydrate": true}
).render(<App {...globalThis.props} />);
