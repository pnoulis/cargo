import { React } from "react";
import "./ResultsDisplay.css";
import cubeSvg from "@assets/cube.svg";
import { usePacking } from "../context/PackingContext.tsx";
import { renderPack } from "@common/render.ts";

export function ResultsDisplay() {
  const { pack } = usePacking();
  const [activeTab, setActiveTab] = React.useState(0);

  React.useEffect(() => {
    if (!pack?.loadedCargo.length) return;
    log("will render pack");
    renderPack(pack);
  }, [pack]);

  if (!(pack && pack.loadedCargo.length)) {
    return (
      <div className="results-display results-display--empty">
        <img src={cubeSvg} alt="Empty state cube" className="cube-svg" />
      </div>
    );
  }

  return (
    <div id="layout-canvas">
      <div className="canvas-tabs">
        {pack.grids.map((_, i) => (
          <button
            key={i}
            className={`canvas-tab ${activeTab === i ? "canvas-tab--active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            Level {i}
          </button>
        ))}
      </div>
      <div className="canvas-container">
        {pack.grids.map((_, i) => (
          <canvas
            key={i}
            id={`canvas-${i}`}
            className={`canvas-view ${activeTab === i ? "canvas-view--active" : ""}`}
          />
        ))}
      </div>
    </div>
  );

}
