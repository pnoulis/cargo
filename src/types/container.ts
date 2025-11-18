import type { TBoundingBox, TSize } from "./3d.ts";
import type { TCargo } from "./cargo.ts";
import type { EUnit } from "../enums/index.ts";

export type TContainer = TBoundingBox & {
  id: string;
  volume: number;
  maxWeight: number;
  clearance: TSize;
};

export type TNewContainer = TSize & {
  units: EUnit;
  maxWeight?: number;
  clearance?: TSize;
};

export type TPackedContainer = {
  id: string;
  container: TContainer;
  remainderVolume: number;
  pendingCargo: TCargo[];
  cargo: TCargo[];
};
