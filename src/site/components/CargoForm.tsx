import { React } from "react";
import "./CargoForm.css";
import { parseCargoUpdate } from "../utils/validation.ts";
import { NumberInput } from "./NumberInput.tsx";
import { createCargo } from "@/cargo";
import { Alert, useAlert } from "./Alert.tsx";
import { UnitSelector } from "./UnitSelector.tsx";

export function CargoForm() {
  const [cargo, setCargo] = React.useState(() => createCargo());
  const [errors, setErrors] = React.useState({});
  const { emitAlert, alert } = useAlert();

  function updateCargo(name: string, value: unknown): void {
    const result = parseCargoUpdate(name, value);
    if (result.valid) {
      setErrors({ [name]: "" });
      setCargo({ ...cargo, [name]: result.value });
    } else {
      setErrors({ [name]: result.error });
      emitAlert(result.error);
    }
  }

  return (
    <>
      <Alert {...alert} />
      <form className="cargo-form">
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
        <UnitSelector style={{ gridColumn: 4, justifySelf: "end" }} />
        <button type="submit" className="cargo-form-submit" disabled={false}>
          Add Cargo
        </button>
      </form>
    </>
  );
}
