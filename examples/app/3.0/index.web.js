import "bootstrap/dist/css/bootstrap-reboot.min.css";
import {App} from "./App";
import {BrowserRouter} from "react-router-dom";
import ReactDOM from "react-dom";

ReactDOM.createRoot(
  document.getElementById("root"),
  {"hydrate": true}
).render(<BrowserRouter><App {...globalThis.props}/></BrowserRouter>);
