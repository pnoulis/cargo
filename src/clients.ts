import { TCargo } from "./cargo.ts";

export enum ECargoState {
  Pending = "pending",
  Loaded = "loaded",
  Failed = "failed",
}

export type TCargoGroup = {
  id: string;
  quantity: number;
  cargo: TCargo;
  pendingCargo: number;
  loadedCargo: number;
  failedCargo: number;
};
