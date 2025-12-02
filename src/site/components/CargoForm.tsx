import { React } from "react";
import "./CargoForm.css";
import { parseCargoUpdate } from "../utils/validation.ts";
import { NumberInput } from "./NumberInput.tsx";
import { createCargo } from "@/cargo";
import { Alert, useAlert } from "./Alert.tsx";
import { UnitSelector } from "./UnitSelector.tsx";
import { Button } from "./Button.tsx";

export function CargoForm() {
  const [cargo, setCargo] = React.useState(() => createCargo());
  const [errors, setErrors] = React.useState({});
  const [allowSubmit, setAllowSubmit] = React.useState(false);
  const { emitAlert, alert } = useAlert();

  function updateCargo(name: string, value: unknown): void {
    const result = parseCargoUpdate(name, value);
    let nextErr = errors;
    let nextCargo = cargo;

    if (result.valid) {
      nextErr[name] = "";
      nextCargo[name] = result.value;
      setErrors({ ...nextErr });
      setCargo({ ...nextCargo });
      if (Object.values(nextErr).join("")) setAllowSubmit(false);
      else if (nextCargo.l && nextCargo.w && nextCargo.h) setAllowSubmit(true);
    } else {
      nextErr[name] = result.error;
      setAllowSubmit(false);
      setErrors({ ...nextErr });
      emitAlert(result.error);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    log(e);
    e.preventDefault();
  }

  return (
    <>
      <Alert {...alert} />
      <form className="cargo-form" onSubmit={handleSubmit}>
        <div className="cargo-form-field name-input">
          <input type="text" name="name" placeholder="Add Cargo item" />
        </div>
        <div className="cargo-form-field">
          <label>Length:</label>
          <NumberInput
            name="l"
            value={cargo.l}
            placeholder="0"
            step="0.1"
            min="0"
            onChange={updateCargo}
            error={errors.l}
          />
        </div>
        <div className="cargo-form-field">
          <label>Width:</label>
          <NumberInput
            name="w"
            value={cargo.w}
            placeholder="0"
            step="0.1"
            min="0"
            onChange={updateCargo}
            error={errors.w}
          />
        </div>
        <div className="cargo-form-field">
          <label>Height:</label>
          <NumberInput
            name="h"
            value={cargo.h}
            placeholder="0"
            step="0.1"
            min="0"
            onChange={updateCargo}
            error={errors.h}
          />
        </div>
        <div className="cargo-form-field">
          <label>Weight:</label>
          <NumberInput
            name="weight"
            value={cargo.weight}
            placeholder="Optional"
            step="0.1"
            min="0"
            onChange={updateCargo}
            error={errors.weight}
          />
        </div>
        <div className="cargo-form-field">
          <label>Priority (0-100):</label>
          <NumberInput
            name="priority"
            value={cargo.priority}
            placeholder="Optional"
            step="1"
            min="0"
            onChange={updateCargo}
            error={errors.priority}
          />
        </div>
        <div className="cargo-form-field">
          <label>Quantity:</label>
          <NumberInput
            name="quantity"
            value={cargo.quantity}
            placeholder="Optional"
            step="1"
            min="0"
            onChange={updateCargo}
            error={errors.quantity}
          />
        </div>
        <UnitSelector
          name="unit"
          value={cargo.unit}
          onChange={updateCargo}
          style={{ gridColumn: 4, justifySelf: "end" }}
        />
        <Button className="cargo-form-submit" type="submit" disabled={!allowSubmit}>
          Add Cargo
        </Button>
      </form>
    </>
  );
}
