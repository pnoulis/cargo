import { React } from "react";
import "./PackController.css";
import "./cargo-state-animation.css";
import { usePacking } from "../context/PackingContext.tsx";
import { Button } from "./Button.tsx";

export function PackController() {
  const { pack, resetAll, editContainer, exportPack } = usePacking();

  return (
    <article key={pack.id} className={`pack-panel cargo-state-animation pending`}>
      <dl className="pack-panel-data">
        <div className="data-tuple">
          <dt>Name:</dt>
          <dd>{pack.container.name}</dd>
        </div>
        <div className="data-tuple">
          <dt>Length:</dt>
          <dd>{pack.container.l}</dd>
        </div>
        <div className="data-tuple">
          <dt>Width:</dt>
          <dd>{pack.container.w}</dd>
        </div>
        <div className="data-tuple">
          <dt>Height:</dt>
          <dd>{pack.container.h}</dd>
        </div>
        <div className="data-tuple">
          <dt>Weight:</dt>
          <dd>{pack.container.weight}</dd>
        </div>
        <div className="data-tuple">
          <dt>Max weight:</dt>
          <dd>{pack.container.maxWeight}</dd>
        </div>
        <div className="data-tuple">
          <dt>Cargo count:</dt>
          <dd>{pack.pendingCargo.length + pack.loadedCargo.length}</dd>
        </div>
        <div className="data-tuple">
          <dt>Pending cargo:</dt>
          <dd>{pack.pendingCargo.length}</dd>
        </div>
        <div className="data-tuple">
          <dt>Loaded cargo:</dt>
          <dd>{pack.loadedCargo.length}</dd>
        </div>
        <div className="data-tuple">
          <dt>Volume:</dt>
          <dd>{pack.container.volume}</dd>
        </div>
        <div className="data-tuple">
          <dt>Remainder volume:</dt>
          <dd>{pack.remainderVolume}</dd>
        </div>
      </dl>
      <section className="pack-panel-controls">
        <Button type="button" onClick={editContainer}>
          Edit
        </Button>
        <Button type="button" onClick={resetAll}>
          Reset all
        </Button>
        <Button type="button" onClick={exportPack}>
          Export
        </Button>
      </section>
    </article>
  );
}
