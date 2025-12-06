import { React } from "react";
import "./ResultsDisplay.css";
import cubeSvg from "@assets/cube.svg";
import { usePacking } from "../context/PackingContext.tsx";
import { renderPack } from "@common/render";

export function ResultsDisplay() {
  const { pack } = usePacking();

  React.useEffect(() => {
    if (!pack?.loadedCargo.length) return;
    log("will render pack");
    /* renderPack(pack); */
  }, [pack?.id || ""]);

  if (!(pack && pack.loadedCargo.length)) {
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
