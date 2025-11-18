import type { TCargo, TContainer } from "./types/index.ts";
import { createCargo } from "./cargo.ts";
import { createContainer } from "./container.ts";
import { EUnit } from "./enums/index.ts";
import { m2cm } from "./utils/index.ts";

export const cargo: TCargo[] = [
  createCargo({ l: 120, w: 80, h: 50, units: EUnit.Centimeter }),
  createCargo({ l: 120, w: 100, h: 50, units: EUnit.Centimeter }),
  createCargo({ l: 160, w: 80, h: 50, units: EUnit.Centimeter }),
  createCargo({ l: 200, w: 120, h: 50, units: EUnit.Centimeter }),
  createCargo({ l: 220, w: 120, h: 50, units: EUnit.Centimeter }),
];

export const containers: TContainer[] = [
  createContainer({
    l: m2cm(13.6),
    w: m2cm(2.4),
    h: m2cm(2.75),
    units: EUnit.Centimeter,
  }),
  createContainer({
    l: m2cm(8),
    w: m2cm(2.4),
    h: m2cm(2.8),
    units: EUnit.Centimeter,
  }),
  createContainer({
    l: m2cm(7.1),
    w: m2cm(2.4),
    h: m2cm(2.8),
    units: EUnit.Centimeter,
  }),
];
