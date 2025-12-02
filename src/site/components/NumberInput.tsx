import { React } from "react";
import "./NumberInput.css";

interface NumberInputProps {
  name: string;
  value: string | number;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  step?: string;
  min?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function NumberInput({
  name,
  value,
  onChange,
  placeholder,
  step = "1.0",
  min = "0",
  disabled = false,
  error = false,
  className = "",
}: NumberInputProps) {
  function handleIncrement() {
    value ||= 0;
    if (typeof value !== "number") throw new Error(`Invalid argument: ${value}`);
    onChange(name, value + parseFloat(step));
  }

  function handleDecrement() {
    value ||= 0;
    if (typeof value !== "number") throw new Error(`Invalid argument: ${value}`);
    return onChange(name, Math.max(min, value - parseFloat(step)));
  }

  return (
    <div className={`number-input ${error ? "error" : ""} ${className}`}>
      <input
        name={name}
        value={value || ""}
        type="number"
        inputMode="decimal"
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      <div className="number-input-controls">
          <button
          type="button"
          className="number-input-btn"
          onClick={handleIncrement}
          disabled={disabled}
          aria-label="Increase value"
        >
          ▲
        </button>
        <button
          type="button"
          className="number-input-btn"
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
