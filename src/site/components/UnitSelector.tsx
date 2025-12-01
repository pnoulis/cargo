import { React } from "react";
import { EUnit } from "@/utils/index.ts";
import { usePacking } from "../context/PackingContext.tsx";
import "./UnitSelector.css";

interface UnitSelectorProps {
  style: Record<string, any>;
}

export function UnitSelector({ style }: UnitSelectorProps) {
  const { unit, setUnit } = usePacking();

  return (
    <fieldset className="unit-selector" style={style}>
      <legend>
        <span>Unit:</span>
      </legend>
      <label className="unit-selector-radio">
        <input
          type="radio"
          name="unit"
          value={EUnit.Centimeter}
          checked={unit === EUnit.Centimeter}
          onChange={(e) => setUnit(parseInt(e.target.value) as EUnit)}
        />
        <span>cm</span>
      </label>
      <label className="unit-selector-radio">
        <input
          type="radio"
          name="unit"
          value={EUnit.Meter}
          checked={unit === EUnit.Meter}
          onChange={(e) => setUnit(parseInt(e.target.value) as EUnit)}
        />
        <span>m</span>
      </label>
    </fieldset>
  );
}
