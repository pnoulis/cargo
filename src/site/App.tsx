import { React } from "react";
import { ReactDOMClient } from "react-dom/client";
import "@meta/globals";
import "./App.css";
import { CargoLoaderPage } from "./CargoLoaderPage.tsx";

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(<App />);

function App() {
  return <CargoLoaderPage />;
}
