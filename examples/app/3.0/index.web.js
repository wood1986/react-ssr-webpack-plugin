import "bootstrap/dist/css/bootstrap-reboot.min.css";
import {App} from "./App";
import {BrowserRouter} from "react-router-dom";
import ReactDOM from "react-dom";

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <BrowserRouter><App {...globalThis.props}/></BrowserRouter>
);
