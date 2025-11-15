import { EUnit } from "./units.ts";

export type TDimensions = {
  l: number;
  w: number;
  h: number;
  unit: EUnit;
};

export type TPosition = {
  x: number;
  y: number;
  z: number;
};

export type TPlane = TDimensions & TPosition;
