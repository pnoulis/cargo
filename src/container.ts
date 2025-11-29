import {
  normalizeDimensions,
  calculateVolume,
  TDimensions,
  T3DCoordinates,
  TBody,
  createBoundingBox,
} from "./geometry.ts";
import { smallID, EUnit } from "./utils/index.ts";
import { TCargo, rotateCargo } from "./cargo.ts";
import { loadFirstFitDecreasingCargo } from "./algorithms/first-fit.ts";

export type TContainer = TBody & {
  id: string;
  maxWeight: number;
  clearance: T3DCoordinates;
};

export type TNewContainer = TDimensions &
  Partial<T3DCoordinates> & {
    id?: string;
    clearance?: T3DCoordinates;
    weight?: number;
    maxWeight?: number;
    unit: EUnit;
  };

export type TPack = {
  id: string;
  container: TContainer;
  remainderVolume: number;
  pendingCargo: TCargo[];
  loadedCargo: TCargo[];
};

export type TNewPack = {
  id?: string;
  container: TContainer;
  cargo?: TCargo[];
};

export function createContainer(newContainer: TNewContainer): TContainer {
  return {
    id: newContainer.id || smallID(),
    unit: newContainer.unit,
    volume: calculateVolume(newContainer, newContainer.unit),
    weight: newContainer.weight || 0,
    maxWeight: newContainer.maxWeight || Number.POSITIVE_INFINITY,
    /* Clearance */
    clearance: { x: 0, y: 0, z: 0, ...newContainer.clearance },
    /* Position */
    x: newContainer.x || 0,
    y: newContainer.y || 0,
    z: newContainer.z || 0,
    /* Dimensions (l,w,h) */
    ...normalizeDimensions(newContainer),
  };
}

export function createPack(newPack: TNewPack): TPack {
  return {
    id: newPack.id || smallID(),
    container: newPack.container,
    remainderVolume: newPack.container.volume,
    pendingCargo: newPack.cargo || [],
    loadedCargo: [],
  };
}

export function fitsWithinPack(pack: TPack, cargo: TCargo): boolean {
  return pack.remainderVolume >= cargo.volume;
}

export function packContainer(container: TContainer, cargo: TCargo[]): TPack {
  const pack = createPack({ container, cargo });
  return packPack(pack);
}

/* The power of the english language in the palm of my hand */
export function packPack(pack: TPack): TPack {
  loadFirstFitDecreasingCargo(pack, pack.pendingCargo);
  return pack;
}

/**
 * @returns the cargo both pending and loaded or null in case the pack was empty
 *
 */
export function unpack(pack: TPack): TCargo | null {
  throw new Error("TODO: unpackPacked");
}

/**
 * @returns the left out cargo due to unmet criteria or null in case of no
 * issues
 */
export function addCargo(pack: TPack, ...cargo: TCargo[]): TCargo | null {
  throw new Error("TODO: addCargo");
}

/**
 * @returns the removed cargo or null in case it is part of the load or it was
 * not found in pending
 */
export function removeCargo(pack: TPack, cargo: string): TCargo | null {
  throw new Error("TODO: removeCargo");
}

/**
 * @returns the cargo that could not be loaded or null in case they all were
 */
export function loadCargo(pack: TPack, ...cargo: TCargo[]): TCargo[] | null {
  throw new Error("TODO: loadCargo");
}

/**
 * @returns the unloaded cargo or null in case it was not part of the load
 */
export function unloadCargo(pack: TPack, cargo: string): TCargo | null {
  throw new Error("TODO: unloadCargo");
}
