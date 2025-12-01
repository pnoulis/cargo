import type { TPack, TPackedCargo } from "../pack.ts";
import type { EPosition } from "../geometry.ts";

export type TOnCargoLoad = (
  pack: TPack,
  base: TPackedCargo,
  candidate: TPackedCargo,
  position: EPosition,
) => TPackedCargo | null;
