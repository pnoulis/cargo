import "./globals.ts";
import { loadCargo } from "./cargo.ts";
import type { TSpace } from "./space.ts";
import { TLoad, createLoad } from "./load.ts";
import { createSpace } from "./space.ts";
import { m2cm, EUnit } from "./units.ts";

const loads: TLoad[] = [
  createLoad({ l: 120, w: 80, h: 50, unit: EUnit.Centimeter }),
  createLoad({ l: 120, w: 100, h: 50, unit: EUnit.Centimeter }),
  createLoad({ l: 160, w: 80, h: 50, unit: EUnit.Centimeter }),
  createLoad({ l: 200, w: 120, h: 50, unit: EUnit.Centimeter }),
  createLoad({ l: 220, w: 120, h: 50, unit: EUnit.Centimeter }),
  createLoad({ l: 40, w: 40, h: 50, unit: EUnit.Centimeter }),
];

const spaces: TSpace[] = [
  createSpace({
    l: m2cm(13.6),
    w: m2cm(2.4),
    h: m2cm(2.75),
    unit: EUnit.Centimeter,
  }),
  createSpace({
    l: m2cm(8),
    w: m2cm(2.4),
    h: m2cm(2.8),
    unit: EUnit.Centimeter,
  }),
  createSpace({
    l: m2cm(7.1),
    w: m2cm(2.4),
    h: m2cm(2.8),
    unit: EUnit.Centimeter,
  }),
];

loadCargo(spaces[2], loads.slice(0, 1));
