import ReactDOMClient from "npm:react-dom/client";
import App from "./app/app.jsx";



function render() {
  ReactDOMClient.hydrateRoot(
    document.getElementById("app"),
    <App />,
  );
}

render();
