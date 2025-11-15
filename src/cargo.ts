import type { TDimensions } from "./dimensions.ts";
import { generateID } from "./encrypt.ts";
import { calculateVolume } from "./volume.ts";

export type TCargo = TDimensions & {
  id: string | number;
  volume: number;
};

export type TNewCargo = TDimensions;

export function createCargo(newCargo: TNewCargo): TCargo {
  return {
    id: generateID(),
    x: newCargo.x,
    y: newCargo.y,
    z: newCargo.z,
    volume: calculateVolume({ x: newCargo.x, y: newCargo.y, z: newCargo.z }),
  };
}
