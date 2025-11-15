import type { TDimensions } from "./dimensions.ts";
import { generateID } from "./encrypt.ts";
import { calculateVolume } from "./volume.ts";

export type TSpace = TDimensions & {
  id: string | number;
  volume: number;
  clearance?: TDimensions;
};

export type TNewSpace = TDimensions;

export function createSpace(newSpace: TNewSpace): TSpace {
  return {
    id: generateID(),
    x: newSpace.x,
    y: newSpace.y,
    z: newSpace.z,
    volume: calculateVolume({ x: newSpace.x, y: newSpace.y, z: newSpace.z }),
  };
}
