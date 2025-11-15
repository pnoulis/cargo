import { loadCargo } from "./load.ts";
import type { TSpace, TCargo } from "./load.ts";
import { ReactDOMClient } from "react-dom/client";

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(App());

function App() {
  return (
    <div>
      <h1>hello world!!!</h1>
    </div>
  );
}
