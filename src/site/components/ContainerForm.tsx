import { React } from "react";
import { EUnit } from "@/utils/index.ts";
import { usePacking } from "../context/PackingContext.tsx";
import { validateDimension, validateWeight } from "../utils/validation.ts";
import { NumberInput } from "./NumberInput.tsx";
import "./ContainerForm.css";
import { UnitSelector } from "./UnitSelector.tsx";

export function PackForm() {
  return (
    <form className="pack-form">
      <div className="pack-form-field name-input">
        <input type="text" name="name" placeholder="Container name" />
      </div>
      <div className="pack-form-field">
        <label>Length:</label>
        <NumberInput placeholder="0" step="0.1" min="0" />
      </div>
      <div className="pack-form-field">
        <label>Width:</label>
        <NumberInput placeholder="0" step="0.1" min="0" />
      </div>
      <div className="pack-form-field">
        <label>Height:</label>
        <NumberInput placeholder="0" step="0.1" min="0" />
      </div>
      <div className="pack-form-field">
        <label>Max Weight (kg):</label>
        <NumberInput placeholder="Optional" step="0.1" min="0" />
      </div>
      <UnitSelector style={{ gridColumn: 3, justifySelf: "end" }} />
    </form>
  );
}

export function ContainerForm() {
  const { container, setContainer, unit, setUnit } = usePacking();

  const [formData, setFormData] = React.useState({
    name: container?.name ?? "",
    l: container?.l ?? "",
    w: container?.w ?? "",
    h: container?.h ?? "",
    maxWeight: container?.maxWeight ?? "",
  });

  const [errors, setErrors] = React.useState({
    l: "",
    w: "",
    h: "",
    maxWeight: "",
  });

  const unitLabel = unit === 0 ? "cm" : "m";
  const step = unit === 0 ? "1" : "0.01";

  const validateAndUpdate = React.useCallback(
    (field: string, value: string) => {
      let error = "";

      if (field === "maxWeight") {
        const validation = validateWeight(value || undefined);
        error = validation.error || "";
      } else {
        const validation = validateDimension(value);
        error = validation.error || "";
      }

      setErrors((prev) => ({ ...prev, [field]: error }));

      // Only update context if all required fields are valid
      const updatedData = { ...formData, [field]: value };
      const allValid =
        !validateDimension(updatedData.l).error &&
        !validateDimension(updatedData.w).error &&
        !validateDimension(updatedData.h).error &&
        !validateWeight(updatedData.maxWeight || undefined).error;

      if (allValid && updatedData.l && updatedData.w && updatedData.h) {
        setContainer({
          l: parseFloat(updatedData.l),
          w: parseFloat(updatedData.w),
          h: parseFloat(updatedData.h),
          maxWeight: updatedData.maxWeight ? parseFloat(updatedData.maxWeight) : undefined,
        });
      }

      setFormData(updatedData);
    },
    [formData, setContainer],
  );

  return (
    <div className="container-form">
      <div className="container-form__header">
        <div className="container-form__name-field">
          <input
            type="text"
            className="container-form__name-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onBlur={() => {
              setContainer({
                name: formData.name,
                l: formData.l ? parseFloat(formData.l) : 0,
                w: formData.w ? parseFloat(formData.w) : 0,
                h: formData.h ? parseFloat(formData.h) : 0,
                maxWeight: formData.maxWeight ? parseFloat(formData.maxWeight) : undefined,
              });
            }}
            placeholder="container name"
          />
        </div>
        <div className="container-form__unit-selector">
          <label className="container-form__unit-label">Unit:</label>
          <label className="container-form__radio">
            <input
              type="radio"
              name="container-unit"
              value={EUnit.Centimeter}
              checked={unit === EUnit.Centimeter}
              onChange={(e) => setUnit(parseInt(e.target.value) as EUnit)}
            />
            <span>cm</span>
          </label>
          <label className="container-form__radio">
            <input
              type="radio"
              name="container-unit"
              value={EUnit.Meter}
              checked={unit === EUnit.Meter}
              onChange={(e) => setUnit(parseInt(e.target.value) as EUnit)}
            />
            <span>m</span>
          </label>
        </div>
      </div>
      <div className="container-form__grid">
        <div className="container-form__field">
          <label className="container-form__label">Length ({unitLabel})</label>
          <NumberInput
            value={formData.l}
            onChange={(e) => validateAndUpdate("l", e)}
            placeholder="0"
            step={step}
            min="0"
            error={!!errors.l}
          />
          {errors.l && <span className="container-form__error">{errors.l}</span>}
        </div>

        <div className="container-form__field">
          <label className="container-form__label">Width ({unitLabel})</label>
          <NumberInput
            value={formData.w}
            onChange={(e) => validateAndUpdate("w", e)}
            placeholder="0"
            step={step}
            min="0"
            error={!!errors.w}
          />
          {errors.w && <span className="container-form__error">{errors.w}</span>}
        </div>

        <div className="container-form__field">
          <label className="container-form__label">Height ({unitLabel})</label>
          <NumberInput
            value={formData.h}
            onChange={(e) => validateAndUpdate("h", e)}
            placeholder="0"
            step={step}
            min="0"
            error={!!errors.h}
          />
          {errors.h && <span className="container-form__error">{errors.h}</span>}
        </div>

        <div className="container-form__field">
          <label className="container-form__label">Max Weight (kg)</label>
          <NumberInput
            value={formData.maxWeight}
            onChange={(e) => validateAndUpdate("maxWeight", e)}
            placeholder="Optional"
            step="0.1"
            min="0"
            error={!!errors.maxWeight}
          />
          {errors.maxWeight && <span className="container-form__error">{errors.maxWeight}</span>}
        </div>
      </div>
    </div>
  );
}
