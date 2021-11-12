// eslint-disable-next-line id-length
import {App as A} from "./A";
import ReactDOM from "react-dom";

ReactDOM.createRoot(
  document.getElementById("root"),
  {"hydrate": true}
).render(<A {...globalThis.props} />);
