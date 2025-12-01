import { React } from "react";
import { usePacking } from "../context/PackingContext.tsx";
import { CargoForm } from "./CargoForm.tsx";
import { CargoItem } from "./CargoItem.tsx";
import "./CargoList.css";

export function CargoList() {
  const { cargoItems } = usePacking();

  return (
    <div className="cargo-list">
      <CargoForm />

      <div className="cargo-list__container">
        {cargoItems.length === 0 ? (
          <div className="cargo-list__empty">
            No cargo items yet. Add one above to get started.
          </div>
        ) : (
          <div className="cargo-list__items">
            {cargoItems.map((cargo) => (
              <CargoItem key={cargo.id} cargo={cargo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
