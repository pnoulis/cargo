import { React } from "react";
import "./NumberInput.css";

interface NumberInputProps {
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  step?: string;
  min?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  onBlur,
  placeholder,
  step = "1",
  min = "0",
  disabled = false,
  error = false,
  className = "",
}: NumberInputProps) {
  const numValue = typeof value === "string" ? (value ? parseFloat(value) : "") : value;
  const stepValue = parseFloat(step);

  const handleIncrement = () => {
    if (typeof numValue === "number") {
      const newValue = numValue + stepValue;
      onChange(newValue.toString());
    } else if (numValue === "") {
      onChange(stepValue.toString());
    }
  };

  const handleDecrement = () => {
    if (typeof numValue === "number") {
      const minNum = parseFloat(min);
      const newValue = Math.max(minNum, numValue - stepValue);
      onChange(newValue.toString());
    }
  };

  return (
    <div className={`number-input ${error ? "number-input-field-error" : ""} ${className}`}>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="number-input-value"
      />
      <div className="number-input-controls">
        <button
          type="button"
          className="number-input-btn up"
          onClick={handleIncrement}
          disabled={disabled}
          aria-label="Increase value"
        >
          ▲
        </button>
        <button
          type="button"
          className="number-input-btn down"
          onClick={handleDecrement}
          disabled={disabled}
          aria-label="Decrease value"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
