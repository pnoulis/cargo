import { React } from "react";
import "./CargoGroup.css";
import { usePacking } from "../context/PackingContext.tsx";
import { TCargoGroup } from "@common/clients";
import { TCargo } from "@common/cargo";
import { Button } from "./Button.tsx";

interface CargoItemProps {
  cargoGroup: TCargoGroup;
}

export function CargoGroup({ cargoGroup }: CargoItemProps) {
  const { dispatchRemoveCargo, dispatchAddCargo } = usePacking();
  const cargo = cargoGroup.cargo[0];

  return (
    <article className="cargo-group">
      <dl className="cargo-group-data">
        <div className="data-tuple">
          <dt>Name:</dt>
          <dd>{cargo.name}</dd>
        </div>
        <div className="data-tuple">
          <dt>Length:</dt>
          <dd>{cargo.l}</dd>
        </div>
        <div className="data-tuple">
          <dt>Width:</dt>
          <dd>{cargo.w}</dd>
        </div>
        <div className="data-tuple">
          <dt>Height:</dt>
          <dd>{cargo.h}</dd>
        </div>
        <div className="data-tuple">
          <dt>Weight:</dt>
          <dd>{cargo.weight}</dd>
        </div>
        <div className="data-tuple">
          <dt>Volume:</dt>
          <dd>{cargo.volume}</dd>
        </div>
        <div className="data-tuple">
          <dt>Priority:</dt>
          <dd>{cargo.priority}</dd>
        </div>
        <div className="data-tuple">
          <dt>Quantity:</dt>
          <dd>{cargoGroup.quantity}</dd>
        </div>
      </dl>
      <section className="cargo-group-controls">
        <Button type="button" onClick={() => dispatchRemoveCargo(cargoGroup.id)}>
          Add
        </Button>
        <Button type="button" onClick={() => dispatchAddCargo(cargoGroup.id)}>
          Remove
        </Button>
      </section>
    </article>
  );
}
