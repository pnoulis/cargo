import type { TDimensions } from "./plane.ts";
import { smallID } from "./encrypt.ts";
import { calculateVolume } from "./volume.ts";

export type TSpace = TDimensions & {
  id: string | number;
  volume: number;
  clearance?: TDimensions;
};

export type TNewSpace = TDimensions;

export function createSpace(newSpace: TNewSpace): TSpace {
  return {
    id: smallID(),
    l: newSpace.l,
    w: newSpace.w,
    h: newSpace.h,
    unit: newSpace.unit,
    volume: calculateVolume({
      l: newSpace.l,
      w: newSpace.w,
      h: newSpace.h,
      unit: newSpace.unit,
    }),
  };
}
