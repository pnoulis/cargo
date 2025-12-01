import { React } from "react";
import { usePacking } from "../context/PackingContext.tsx";
import "./ResultsDisplay.css";

export function ResultsDisplay() {
  const { pack, error } = usePacking();

  if (error) {
    return (
      <div className="results-display results-display--error">
        <div className="results-display__icon">⚠️</div>
        <div className="results-display__message">{error}</div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="results-display results-display--empty">
        <CubeSVG />
      </div>
    );
  }

  const totalCargo = pack.loadedCargo.length + pack.pendingCargo.length;
  const packedCount = pack.loadedCargo.length;
  const unpackedCount = pack.pendingCargo.length;
  const utilization = pack.container.volume
    ? (((pack.container.volume - pack.remainderVolume) / pack.container.volume) * 100).toFixed(1)
    : "0";

  const isFullyPacked = unpackedCount === 0;

  return (
    <div
      className={`results-display ${
        isFullyPacked ? "results-display--success" : "results-display--warning"
      }`}
    >
      <div className="results-display__header">
        <div className="results-display__icon">{isFullyPacked ? "✓" : "⚠"}</div>
        <div className="results-display__title">
          {isFullyPacked ? "All items packed!" : "Packing complete"}
        </div>
      </div>

      <div className="results-display__stats">
        <div className="results-display__stat">
          <div className="results-display__stat-label">Packed Items</div>
          <div className="results-display__stat-value">
            {packedCount} / {totalCargo}
          </div>
        </div>

        <div className="results-display__stat">
          <div className="results-display__stat-label">Volume Utilization</div>
          <div className="results-display__stat-value">{utilization}%</div>
        </div>
      </div>

      {unpackedCount > 0 && (
        <div className="results-display__unpacked">
          <div className="results-display__unpacked-title">
            {unpackedCount} item{unpackedCount !== 1 ? "s" : ""} could not fit:
          </div>
          <ul className="results-display__unpacked-list">
            {pack.pendingCargo.map((cargo) => (
              <li key={cargo.id} className="results-display__unpacked-item">
                {cargo.l} × {cargo.w} × {cargo.h} ({cargo.volume} unit³)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CubeSVG() {
  return (
    <svg viewBox="0 0 200 200" className="cube-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Front face */}
      <rect x="50" y="70" width="100" height="80" fill="#3b82f6" opacity="0.8" />

      {/* Top face */}
      <polygon points="50,70 80,50 180,50 150,70" fill="#3b82f6" opacity="0.5" />

      {/* Right side face */}
      <polygon points="150,70 180,50 180,130 150,150" fill="#3b82f6" opacity="0.5" />

      {/* Front face top stroke - full width */}
      <line x1="50" y1="70" x2="150" y2="70" stroke="black" strokeWidth="1" opacity="0.5" />

      {/* Left-most vertical edge */}
      <line x1="50" y1="70" x2="50" y2="150" stroke="black" strokeWidth="1" opacity="0.5" />

      {/* Left-most top-most horizontal edge */}
      <line x1="50" y1="70" x2="80" y2="50" stroke="black" strokeWidth="1" opacity="0.5" />

      {/* Top-most front right horizontal edge */}
      <line x1="150" y1="70" x2="180" y2="50" stroke="black" strokeWidth="1" opacity="0.5" />

      {/* Back edge of top face - full width */}
      <line x1="80" y1="50" x2="180" y2="50" stroke="black" strokeWidth="1" opacity="0.5" />

      {/* Right-most vertical edge - front */}
      <line x1="150" y1="70" x2="150" y2="150" stroke="black" strokeWidth="1" opacity="0.5" />

      {/* Right-most vertical edge - back */}
      <line x1="180" y1="50" x2="180" y2="130" stroke="black" strokeWidth="1" opacity="0.5" />

      {/* Front bottom stroke */}
      <line x1="50" y1="150" x2="150" y2="150" stroke="black" strokeWidth="1" opacity="0.5" />

      {/* Right bottom stroke */}
      <line x1="150" y1="150" x2="180" y2="130" stroke="black" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
