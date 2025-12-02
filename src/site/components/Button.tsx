import { React } from "react";
import "./Button.css";

interface ButtonProps {
  value: string;
  type: string;
  disabled?: boolean;
  className?: string;
  style: Record<string, any>;
  children: React.ReactNode;
}

export function Button({
  children,
  type = "submit",
  disabled = false,
  className = "",
  style,
}: ButtonProps) {
  return (
    <button disabled={disabled} type={type} className={`button ${className}`} style={style}>
      {children}
    </button>
  );
}
