import { React } from "react";
import "./ContainerForm.css";
import { parseContainerUpdate } from "../utils/validation.ts";
import { NumberInput } from "./NumberInput.tsx";
import { UnitSelector } from "./UnitSelector.tsx";
import { createContainer } from "@common/container.ts";
import { TPack } from "@comman/pack.ts";
import { Alert, useAlert } from "./Alert.tsx";
import { usePacking } from "../context/PackingContext.tsx";
import { Button } from "./Button.tsx";

function initializeForm(pack: TPack) {
  if (pack && pack.container) return { ...pack.container };
  return createContainer({ maxWeight: 1000 });
}

export function ContainerForm() {
  const [errors, setErrors] = React.useState({});
  const { pack, dispatchPackContainer } = usePacking();
  const [container, setContainer] = React.useState(() => initializeForm(pack));
  const [allowSubmit, setAllowSubmit] = React.useState(pack?.container);
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    container.name ||= "Untitled container";
    dispatchPackContainer(container);
  }

  return (
    <>
      <Alert {...alert} />
      <form className="container-form" onSubmit={handleSubmit}>
        <div className="container-form-field name-input">
          <input
            type="text"
            value={container.name}
            name="name"
            placeholder="Container name"
            onChange={(e) => updateContainer("name", e.target.value)}
          />
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
        <Button className="container-form-submit" type="submit" disabled={!allowSubmit}>
          Pack Container
        </Button>
      </form>
    </>
  );
}
