import { React } from "react";
import { EUnit } from "@/utils/index.ts";
import { usePacking } from "../context/PackingContext.tsx";
import "./UnitSelector.css";

interface UnitSelectorProps {
  name: string;
  value?: EUnit;
  onChange: (name: string, value: EUnit) => void;
  style: Record<string, any>;
}

export function UnitSelector({ name, value, onChange, style }: UnitSelectorProps) {
  const { unit, setUnit } = usePacking();

  return (
    <fieldset className="unit-selector" style={style}>
      <legend>
        <span>Unit:</span>
      </legend>
      <label className="unit-selector-radio">
        <input
          type="radio"
          name={name}
          value={EUnit.Centimeter}
          checked={value === EUnit.Centimeter}
          onChange={(e) => onChange(name, e.target.value)}
          tabIndex="0"
        />
        <span>cm</span>
      </label>
      <label className="unit-selector-radio">
        <input
          type="radio"
          name={name}
          value={EUnit.Meter}
          checked={value === EUnit.Meter}
          onChange={(e) => onChange(name, e.target.value)}
          tabIndex="0"
        />
        <span>m</span>
      </label>
    </fieldset>
  );
}
