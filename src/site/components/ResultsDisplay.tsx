import { React } from "react";
import "./ResultsDisplay.css";
import cubeSvg from "@assets/cube.svg";
import { usePacking } from "../context/PackingContext.tsx";
import { renderPack } from "@common/render";

export function ResultsDisplay() {
  const { pack, cargoGroups } = usePacking();

  React.useEffect(() => {
    if (!cargoGroups.length) return;
    log(pack);
    renderPack(pack);
  }, [cargoGroups]);

  if (!pack) {
    return (
      <div className="results-display results-display--empty">
        <img src={cubeSvg} alt="Empty state cube" className="cube-svg" />
      </div>
    );
  }

  return (
    <div id="layout-canvas">
      <canvas id="canvas">yolo</canvas>
    </div>
  );
}
