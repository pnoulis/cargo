import { React } from "react";
import { ReactDOMClient } from "react-dom/client";
import "@meta/globals";
import "./app.css";
import { PackForm, ContainerForm } from "./components/ContainerForm.tsx";
import { CargoList } from "./components/CargoList.tsx";
import { PackingProvider } from "./context/PackingContext.tsx";
/* import { ActionPanel } from "./components/ActionPanel.tsx"; */
/* import { ResultsDisplay } from "./components/ResultsDisplay.tsx"; */

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(App());

function App() {
  return (
    <PackingProvider>
      <div className="pack-dashboard">
        <header className="pack-configurator">
          <PackForm />
        </header>
        <section className="cargo-configurator">
          <CargoList />
        </section>
        <section className="pack-renderer"></section>
      </div>
    </PackingProvider>
  );
}

function PackCanvas(props) {
  return (
    <canvas id="rendered-pack" width="150" height="500">
      rendered pack
    </canvas>
  );
}
