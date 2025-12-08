import "./CanvasPlaceholder.css";
import cubeSvg from "@assets/cube.svg";

export function CanvasPlaceholder() {
  return (
    <div className="canvas-placeholder">
      <img src={cubeSvg} alt="canvas placeholder" className="cube-svg" />
    </div>
  );
}
