import { TPackedCargo } from "./pack.ts";

export enum ECargoState {
  Pending = "pending",
  Loaded = "loaded",
  Failed = "failed",
}

type TClientCargo = TPackedCargo & {
  state: ECargoState;
};

export type TCargoGroup = {
  id: string;
  quantity: number;
  cargo: TClientCargo[];
  pendingCargo: number;
  loadedCargo: number;
  failedCargo: number;
};
