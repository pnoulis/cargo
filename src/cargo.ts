import {
  normalizeDimensions,
  calculateVolume,
  TDimensions,
  TBody,
  TPosition,
} from "./geometry.ts";
import { smallID, EUnit } from "./utils/index.ts";

export enum ECargoOrientation {
  parallel = 0, // parallel to the long side of container
  perpendicular = -90, // perpendicular to the long side of the container
}

export type TCargo = TBody & {
  id: string;
  priority: number;
};

export type TNewCargo = TDimensions &
  Partial<TPosition> & {
    id?: string;
    priority?: number;
    orientation?: ECargoOrientation;
    weight?: number;
    unit: EUnit;
  };

export function createCargo(newCargo: TNewCargo): TCargo {
  return {
    id: newCargo.id || smallID(),
    unit: newCargo.unit,
    priority: newCargo.priority || 0,
    volume: calculateVolume(newCargo, newCargo.unit),
    weight: newCargo.weight || 0,
    /* Constrain orientation to axis */
    yaw: newCargo.orientation || ECargoOrientation.parallel,
    /* Position */
    x: newCargo.x || 0,
    y: newCargo.y || 0,
    z: newCargo.z || 0,
    /* Dimensions (l,w,h) */
    ...normalizeDimensions(newCargo),
  };
}

export function rotateCargo(cargo: TCargo): TCargo {
  let tmp;

  if (cargo.yaw === ECargoOrientation.parallel) {
    cargo.yaw = ECargoOrientation.perpendicular;
    tmp = cargo.l;
    cargo.l = cargo.w;
    cargo.w = tmp;
  } else {
    cargo.yaw = ECargoOrientation.parallel;
    tmp = cargo.w;
    cargo.w = cargo.l;
    cargo.l = tmp;
  }

  return cargo;
}
