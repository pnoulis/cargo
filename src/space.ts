import type { TDimensions } from "./plane.ts";
import { normalizeDimensions } from "./plane.ts";
import { smallID } from "./encrypt.ts";
import { calculateVolume } from "./volume.ts";

export type TSpace = TDimensions & {
  id: string | number;
  volume: number;
  clearance?: TDimensions;
};

export type TNewSpace = TDimensions;

export function createSpace(newSpace: TNewSpace): TSpace {
  const dimensions = normalizeDimensions(newSpace as TDimensions);
  const volume = calculateVolume(dimensions);
  return {
    id: smallID(),
    ...dimensions,
    volume,
  };
}
