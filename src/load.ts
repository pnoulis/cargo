import type { TDimensions, TPosition } from "./plane.ts";
import { smallID } from "./encrypt.ts";
import { calculateVolume } from "./volume.ts";
import { EUnit } from "./units.ts";

export type TLoad = TDimensions & {
  id: string | number;
  volume: number;
};

export type TPlacedLoad = TLoad &
  TPosition & {
    orientation: TDimensions;
  };

export type TNewLoad = TDimensions;

export function createLoad(newLoad: TNewLoad): TLoad {
  return {
    id: smallID(),
    l: newLoad.l,
    w: newLoad.w,
    h: newLoad.h,
    unit: newLoad.unit,
    volume: calculateVolume({
      l: newLoad.l,
      w: newLoad.w,
      h: newLoad.h,
      unit: newLoad.unit,
    }),
  };
}
