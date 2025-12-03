import { React } from "react";
import "./Button.css";

interface ButtonProps {
  value: string;
  type: string;
  disabled?: boolean;
  className?: string;
  style: Record<string, any>;
  children: React.ReactNode;
  onClick: () => void;
}

export function Button({
  children,
  type = "submit",
  disabled = false,
  className = "",
  style,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`button ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
