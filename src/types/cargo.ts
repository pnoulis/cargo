import type { TBoundingBox, TSize } from "./3d.ts";
import type { EOrientation, EUnit } from "../enums/index.ts";

export type TCargo = TBoundingBox & {
  id: string;
  volume: number;
  units: EUnit;
  orientation: EOrientation;
  priority: number;
};

export type TNewCargo = TSize & {
  units: EUnit;
  orientation?: EOrientation;
  priority?: number;
};
