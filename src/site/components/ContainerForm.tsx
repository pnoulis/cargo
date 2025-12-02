import { React } from "react";
import "./ContainerForm.css";
import { parseContainerUpdate } from "../utils/validation.ts";
import { NumberInput } from "./NumberInput.tsx";
import { UnitSelector } from "./UnitSelector.tsx";
import { createContainer } from "@/container.ts";
import { Alert, useAlert } from "./Alert.tsx";
import { usePacking } from "../context/PackingContext.tsx";

export function ContainerForm() {
  const [container, setContainer] = React.useState(() => createContainer({ maxWeight: 1000 }));
  const [errors, setErrors] = React.useState({});
  const [allowSubmit, setAllowSubmit] = React.useState(false);
  const { dispatchPackContainer } = usePacking();
  const { emitAlert, alert } = useAlert();

  function updateContainer(name: string, value: unknown): void {
    const result = parseContainerUpdate(name, value);
    let nextErr = errors;
    let nextContainer = container;

    if (result.valid) {
      nextErr[name] = "";
      nextContainer[name] = result.value;
      setErrors({ ...nextErr });
      setContainer({ ...nextContainer });
      if (Object.values(nextErr).join("")) setAllowSubmit(false);
      else if (nextContainer.l && nextContainer.w && nextContainer.h) setAllowSubmit(true);
    } else {
      nextErr[name] = result.error;
      setAllowSubmit(false);
      setErrors({ ...nextErr });
      emitAlert(result.error);
    }
  }

  return (
    <>
      <Alert {...alert} />
      <form className="container-form">
        <div className="container-form-field name-input">
          <input type="text" name="name" placeholder="Container name" />
        </div>
        <div className="container-form-field">
          <label>Length:</label>
          <NumberInput
            name="l"
            value={container.l}
            placeholder="0"
            step="0.1"
            min="0"
            onChange={updateContainer}
            error={errors.l}
          />
        </div>
        <div className="container-form-field">
          <label>Width:</label>
          <NumberInput
            name="w"
            value={container.w}
            placeholder="0"
            step="0.1"
            min="0"
            onChange={updateContainer}
            error={errors.w}
          />
        </div>
        <div className="container-form-field">
          <label>Height:</label>
          <NumberInput
            name="h"
            value={container.h}
            placeholder="0"
            step="0.1"
            min="0"
            onChange={updateContainer}
            error={errors.h}
          />
        </div>
        <div className="container-form-field">
          <label>Max Weight (kg):</label>
          <NumberInput
            name="maxWeight"
            value={container.maxWeight}
            placeholder="Optional"
            step="0.1"
            min="0"
            onChange={updateContainer}
            error={errors.maxWeight}
          />
        </div>
        <UnitSelector
          name="unit"
          value={container.unit}
          onChange={updateContainer}
          style={{ gridColumn: 3, justifySelf: "end" }}
        />
        <button type="submit" className="container-form-submit" disabled={!allowSubmit}>
          Pack Container
        </button>
      </form>
    </>
  );
}
