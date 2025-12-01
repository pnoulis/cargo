import { React } from "react";
import { usePacking } from "../context/PackingContext.tsx";
import "./ActionPanel.css";

export function ActionPanel() {
  const { container, cargoItems, isPacking, executePacking, resetAll } =
    usePacking();

  const canPack = container && cargoItems.length > 0;

  const handleExport = () => {
    // Export functionality to be implemented
    console.log("Export functionality coming soon");
  };

  return (
    <div className="action-panel">
      <button
        className="action-panel__btn action-panel__btn--primary"
        onClick={executePacking}
        disabled={!canPack || isPacking}
      >
        {isPacking ? "Packing..." : "Pack Container"}
      </button>

      <button
        className="action-panel__btn action-panel__btn--secondary"
        onClick={handleExport}
        disabled={isPacking}
      >
        Export
      </button>

      <button
        className="action-panel__btn action-panel__btn--secondary"
        onClick={resetAll}
        disabled={isPacking}
      >
        Reset All
      </button>
    </div>
  );
}
