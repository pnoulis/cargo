import { React } from "react";
import "./CanvasList.css";
import { TGrid } from "@common/pack.ts";

interface CanvasListProps {
  grids: TGrid[];
  onCanvasElementRender: (canvas: HTMLCanvasElement, i: number) => void;
}

export function CanvasList({ grids, onCanvasElementRender }: CanvasListProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <section className="canvas-tabbed-ui">
      <ul className="canvas-tabs">
        {grids.map((_, i) => (
          <button
            key={i}
            className={`canvas-tab ${activeTab === i ? "active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            Level {i}
          </button>
        ))}
      </ul>
      <ul className="canvas-list">
        {grids.map((_, i) => (
          <canvas
            ref={(canvas) => onCanvasElementRender(canvas, i)}
            key={i}
            id={`canvas-${i}`}
            data-grid-id={i}
            className={`canvas-item ${activeTab === i ? "active" : ""}`}
          />
        ))}
      </ul>
    </section>
  );
}
