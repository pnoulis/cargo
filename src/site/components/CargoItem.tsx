import { React } from "react";
import { usePacking } from "../context/PackingContext.tsx";
import { CargoInput } from "../context/PackingContext.tsx";
import {
  validateDimension,
  validateWeight,
  validatePriority,
  validateQuantity,
} from "../utils/validation.ts";
import { NumberInput } from "./NumberInput.tsx";
import "./CargoItem.css";
import { createCargo } from '@common/cargo.ts';

interface CargoItemProps {
  cargo: CargoInput;
}

export function CargoItem2() {
    const [cargo, setCargo] = React.useState(() => createCargo())
}


export function CargoItem({ cargo }: CargoItemProps) {
  const { removeCargo, updateCargo, unit } = usePacking();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState(cargo);
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
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const isEditFormValid = () => {
    const dimL = validateDimension(editData.l);
    const dimW = validateDimension(editData.w);
    const dimH = validateDimension(editData.h);
    const wgt = validateWeight(editData.weight || undefined);
    const prio = validatePriority(editData.priority || undefined);
    const qty = validateQuantity(editData.quantity || undefined);

    return !dimL.error && !dimW.error && !dimH.error && !wgt.error && !prio.error && !qty.error;
  };

  const handleSave = () => {
    if (isEditFormValid()) {
      updateCargo(cargo.id!, {
        ...editData,
        l: parseFloat(editData.l.toString()),
        w: parseFloat(editData.w.toString()),
        h: parseFloat(editData.h.toString()),
        weight: editData.weight ? parseFloat(editData.weight.toString()) : undefined,
        priority: editData.priority ? parseInt(editData.priority.toString()) : undefined,
        quantity: parseInt(editData.quantity?.toString() || "1"),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData(cargo);
    setErrors({ l: "", w: "", h: "", weight: "", priority: "", quantity: "" });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="cargo-item cargo-item--editing">
        <div className="cargo-item__edit-grid">
          <div className="cargo-item__field">
            <label className="cargo-item__label">Length ({unitLabel})</label>
            <NumberInput
              value={editData.l}
              onChange={(e) => handleEditChange("l", e)}
              step={step}
              min="0"
              error={!!errors.l}
            />
            {errors.l && <span className="cargo-item__error">{errors.l}</span>}
          </div>

          <div className="cargo-item__field">
            <label className="cargo-item__label">Width ({unitLabel})</label>
            <NumberInput
              value={editData.w}
              onChange={(e) => handleEditChange("w", e)}
              step={step}
              min="0"
              error={!!errors.w}
            />
            {errors.w && <span className="cargo-item__error">{errors.w}</span>}
          </div>

          <div className="cargo-item__field">
            <label className="cargo-item__label">Height ({unitLabel})</label>
            <NumberInput
              value={editData.h}
              onChange={(e) => handleEditChange("h", e)}
              step={step}
              min="0"
              error={!!errors.h}
            />
            {errors.h && <span className="cargo-item__error">{errors.h}</span>}
          </div>

          <div className="cargo-item__field">
            <label className="cargo-item__label">Weight (kg)</label>
            <NumberInput
              value={editData.weight || ""}
              onChange={(e) => handleEditChange("weight", e)}
              step="0.1"
              min="0"
              error={!!errors.weight}
            />
            {errors.weight && (
              <span className="cargo-item__error">{errors.weight}</span>
            )}
          </div>

          <div className="cargo-item__field">
            <label className="cargo-item__label">Priority (0-100)</label>
            <NumberInput
              value={editData.priority || ""}
              onChange={(e) => handleEditChange("priority", e)}
              step="1"
              min="0"
              error={!!errors.priority}
            />
            {errors.priority && (
              <span className="cargo-item__error">{errors.priority}</span>
            )}
          </div>

          <div className="cargo-item__field">
            <label className="cargo-item__label">Quantity</label>
            <NumberInput
              value={editData.quantity || ""}
              onChange={(e) => handleEditChange("quantity", e)}
              step="1"
              min="1"
              error={!!errors.quantity}
            />
            {errors.quantity && (
              <span className="cargo-item__error">{errors.quantity}</span>
            )}
          </div>
        </div>

        <div className="cargo-item__actions">
          <button
            className="cargo-item__btn cargo-item__btn--save"
            onClick={handleSave}
            disabled={!isEditFormValid()}
          >
            Save
          </button>
          <button
            className="cargo-item__btn cargo-item__btn--cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateCargo(cargo.id!, {
        ...cargo,
        quantity: newQuantity,
      });
    }
  };

  const getQuantity = () => cargo.quantity || 1;

  return (
    <div className="cargo-item">
      <div className="cargo-item__content">
        <div className="cargo-item__dimensions">
          {cargo.l} × {cargo.w} × {cargo.h} {unitLabel}
        </div>
        <div className="cargo-item__details">
          {cargo.weight && <span>Weight: {cargo.weight} kg</span>}
          {cargo.priority && <span>Priority: {cargo.priority}</span>}
        </div>
        <div className="cargo-item__quantity">
          <button
            className="cargo-item__qty-btn"
            onClick={() => handleQuantityChange(getQuantity() - 1)}
            disabled={getQuantity() <= 1}
          >
            −
          </button>
          <span className="cargo-item__qty-value">Qty: {getQuantity()}</span>
          <button
            className="cargo-item__qty-btn"
            onClick={() => handleQuantityChange(getQuantity() + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="cargo-item__actions">
        <button
          className="cargo-item__btn cargo-item__btn--edit"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          className="cargo-item__btn cargo-item__btn--delete"
          onClick={() => removeCargo(cargo.id!)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
