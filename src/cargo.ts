import type { TDimensions, TPosition } from "./plane.ts";
import type { TLoad } from "./load.ts";
import type { TSpace } from "./space.ts";
import { smallID } from "./encrypt.ts";
import { calculateVolume } from "./volume.ts";
import { EUnit } from "./units.ts";

export type TCargo = {
  load: TLoad[];
};

export function loadCargo(space: TSpace, load: TLoad[]): TCargo {
  return {} as TCargo;
}
