import type { TDimensions } from "./plane.ts";
import { smallID } from "./encrypt.ts";
import { calculateVolume } from "./volume.ts";
import { normalizeDimensions } from "./plane.ts";

export type TLoad = TDimensions & {
  id: string | number;
  volume: number;
};

export type TNewLoad = TDimensions;

export function createLoad(newLoad: TNewLoad): TLoad {
  const dimensions = normalizeDimensions(newLoad as TDimensions);
  const volume = calculateVolume(dimensions);
  return {
    id: smallID(),
    ...dimensions,
    volume,
  };
}

export function rotateLoad(load: TLoad): TLoad {
  return { ...load, l: load.w, w: load.l };
}
