import { React } from "react";
import { ContainerForm } from "./components/ContainerForm.tsx";
import { CargoList } from "./components/CargoList.tsx";
import { ActionPanel } from "./components/ActionPanel.tsx";
import { ResultsDisplay } from "./components/ResultsDisplay.tsx";
import "./PackingPlanner.css";

export function PackingPlanner() {
  return (
    <div className="packing-planner">
      <div className="packing-planner__header">
        <div className="packing-planner__header-container">
          <ContainerForm />
          <ActionPanel />
        </div>
      </div>

      <div className="packing-planner__left">
        <CargoList />
      </div>

      <div className="packing-planner__right">
        <ResultsDisplay />
      </div>
    </div>
  );
}
