import { React } from "react";
import "./CargoList.css";
import { usePacking } from "../context/PackingContext.tsx";
import { CargoGroup } from "./CargoGroup.tsx";

export function CargoList() {
  const { cargoGroups } = usePacking();

  return (
    <ul className="layout-cargo-list">
      {cargoGroups.length === 0 ? (
        <li className="cargo-list-empty">No cargo items yet. Add one above to get started.</li>
      ) : (
        cargoGroups.map((cargoGroup) => (
          <li key={cargoGroup.id} className="layout-cargo-list-item">
            <CargoGroup cargoGroup={cargoGroup} />
          </li>
        ))
      )}
    </ul>
  );
}
