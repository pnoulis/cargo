import { React } from "react";
import { EUnit } from "@/utils/index.ts";
import { usePacking } from "../context/PackingContext.tsx";
import {
  validateDimension,
  validateWeight,
  validatePriority,
  validateQuantity,
} from "../utils/validation.ts";
import { NumberInput } from "./NumberInput.tsx";
import "./CargoForm.css";

export function CargoForm() {
  const { addCargo, unit, setUnit } = usePacking();

  const [title, setTitle] = React.useState("");

  const [formData, setFormData] = React.useState({
    l: "",
    w: "",
    h: "",
    weight: "",
    priority: "",
    quantity: "1",
  });

  const [errors, setErrors] = React.useState({
    l: "",
    w: "",
    h: "",
    weight: "",
    priority: "",
    quantity: "",
  });

  const unitLabel = unit === 0 ? "cm" : "m";
  const step = unit === 0 ? "1" : "0.01";

  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "l":
      case "w":
      case "h":
        const dimValidation = validateDimension(value);
        error = dimValidation.error || "";
        break;
      case "weight":
        const weightValidation = validateWeight(value || undefined);
        error = weightValidation.error || "";
        break;
      case "priority":
        const priorityValidation = validatePriority(value || undefined);
        error = priorityValidation.error || "";
        break;
      case "quantity":
        const quantityValidation = validateQuantity(value || undefined);
        error = quantityValidation.error || "";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const isFormValid = () => {
    const dimL = validateDimension(formData.l);
    const dimW = validateDimension(formData.w);
    const dimH = validateDimension(formData.h);
    const wgt = validateWeight(formData.weight || undefined);
    const prio = validatePriority(formData.priority || undefined);
    const qty = validateQuantity(formData.quantity || undefined);

    return (
      !dimL.error &&
      !dimW.error &&
      !dimH.error &&
      !wgt.error &&
      !prio.error &&
      !qty.error &&
      formData.l &&
      formData.w &&
      formData.h
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    addCargo({
      l: parseFloat(formData.l),
      w: parseFloat(formData.w),
      h: parseFloat(formData.h),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      priority: formData.priority ? parseInt(formData.priority) : undefined,
      quantity: parseInt(formData.quantity),
    });

    // Reset form
    setTitle("");
    setFormData({
      l: "",
      w: "",
      h: "",
      weight: "",
      priority: "",
      quantity: "1",
    });
    setErrors({
      l: "",
      w: "",
      h: "",
      weight: "",
      priority: "",
      quantity: "",
    });
  };

  return (
    <form className="cargo-form" onSubmit={handleSubmit}>
      <div className="cargo-form__header">
        <input
          type="text"
          className="cargo-form__title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add Cargo Item"
        />
        <div className="cargo-form__unit-selector">
          <label className="cargo-form__unit-label">Unit:</label>
          <label className="cargo-form__radio">
            <input
              type="radio"
              name="cargo-unit"
              value={EUnit.Centimeter}
              checked={unit === EUnit.Centimeter}
              onChange={(e) => setUnit(parseInt(e.target.value) as EUnit)}
            />
            <span>cm</span>
          </label>
          <label className="cargo-form__radio">
            <input
              type="radio"
              name="cargo-unit"
              value={EUnit.Meter}
              checked={unit === EUnit.Meter}
              onChange={(e) => setUnit(parseInt(e.target.value) as EUnit)}
            />
            <span>m</span>
          </label>
        </div>
      </div>
      <div className="cargo-form__grid">
        <div className="cargo-form__field">
          <label className="cargo-form__label">Length ({unitLabel})</label>
          <NumberInput
            value={formData.l}
            onChange={(e) => handleChange("l", e)}
            placeholder="0"
            step={step}
            min="0"
            error={!!errors.l}
          />
          {errors.l && <span className="cargo-form__error">{errors.l}</span>}
        </div>

        <div className="cargo-form__field">
          <label className="cargo-form__label">Width ({unitLabel})</label>
          <NumberInput
            value={formData.w}
            onChange={(e) => handleChange("w", e)}
            placeholder="0"
            step={step}
            min="0"
            error={!!errors.w}
          />
          {errors.w && <span className="cargo-form__error">{errors.w}</span>}
        </div>

        <div className="cargo-form__field">
          <label className="cargo-form__label">Height ({unitLabel})</label>
          <NumberInput
            value={formData.h}
            onChange={(e) => handleChange("h", e)}
            placeholder="0"
            step={step}
            min="0"
            error={!!errors.h}
          />
          {errors.h && <span className="cargo-form__error">{errors.h}</span>}
        </div>

        <div className="cargo-form__field">
          <label className="cargo-form__label">Weight (kg)</label>
          <NumberInput
            value={formData.weight}
            onChange={(e) => handleChange("weight", e)}
            placeholder="Optional"
            step="0.1"
            min="0"
            error={!!errors.weight}
          />
          {errors.weight && (
            <span className="cargo-form__error">{errors.weight}</span>
          )}
        </div>

        <div className="cargo-form__field">
          <label className="cargo-form__label">Priority (0-100)</label>
          <NumberInput
            value={formData.priority}
            onChange={(e) => handleChange("priority", e)}
            placeholder="Optional"
            step="1"
            min="0"
            error={!!errors.priority}
          />
          {errors.priority && (
            <span className="cargo-form__error">{errors.priority}</span>
          )}
        </div>

        <div className="cargo-form__field">
          <label className="cargo-form__label">Quantity</label>
          <NumberInput
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", e)}
            placeholder="1"
            step="1"
            min="1"
            error={!!errors.quantity}
          />
          {errors.quantity && (
            <span className="cargo-form__error">{errors.quantity}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="cargo-form__submit"
        disabled={!isFormValid()}
      >
        Add Cargo
      </button>
    </form>
  );
}
