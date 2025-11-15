import { loadCargo } from "./load.ts";
import type { TSpace, TCargo } from "./load.ts";
import { ReactDOMClient } from "react-dom/client";
import IMG_DWIGHT from "../assets/best-favicon-in-the-www.png";

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(App());

function App() {
  return (
    <div>
      <img src={IMG_DWIGHT} alt="dwight" />
    </div>
  );
}
