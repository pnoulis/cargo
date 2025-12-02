import { EPosition, TDimensions } from "./geometry.ts";
import { TContainer } from "./container.ts";
import { TCargo } from "./cargo.ts";
import { smallID } from "./utils/index.ts";
import { loadFirstFitDecreasingCargo } from "./algorithms/first-fit.ts";

/**
 * A Grid is a tracking device for cargo which is particularly helpful in the
 * rendering of 3D objects into a 2D plane. (projection).
 *
 * The first cargo to be loaded will be on grid 0, column 0.
 * The first cargo to be stacked on top of another cargo will be on grid 1, column 0.
 * The first cargo to be stacked on top of 2 cargo will be on grid 2, column 0
 * and so on...

 * The first cargo to be loaded in front of another cargo in grid N will be in
 * grid N, column 1.
 * The first cargo to be loaded in front of 2 cargos in grid N will be in grid
 * N, column 2 and so on...
 *
 */
export type TGrid = TDimensions;

export enum EGrid {
  index = 0,
  column = 1,
  row = 2,
}

export type TPackedCargo = TCargo & {
  grid: [number, number, number] /* grid index, column, row */;
};

export type TPack = {
  id: string;
  container: TContainer;
  remainderVolume: number;
  pendingCargo: TCargo[];
  loadedCargo: TPackedCargo[];
  grids: TGrid[];
  minCargoL: number;
  minCargoW: number;
  minCargoH: number;
  maxCargoL: number;
  maxCargoW: number;
  maxCargoH: number;
};

export type TNewPack = {
  id?: string;
  container: TContainer;
  cargo?: TCargo[];
};

export function createPack(newPack: TNewPack): TPack {
  newPack = { container: {}, ...newPack };
  return {
    id: newPack.id || smallID(),
    container: newPack.container,
    remainderVolume: newPack.container.volume,
    pendingCargo: newPack.cargo || [],
    loadedCargo: [],
    grids: [],
    minCargoL: Number.POSITIVE_INFINITY,
    minCargoW: Number.POSITIVE_INFINITY,
    minCargoH: Number.POSITIVE_INFINITY,
    maxCargoL: 0,
    maxCargoW: 0,
    maxCargoH: 0,
  };
}

export function createGrid(): TGrid {
  return { l: 0, w: 0, h: 0 };
}

export function fitsWithinPack(pack: TPack, cargo: TCargo): boolean {
  return pack.remainderVolume >= cargo.volume;
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

/* The power of the english language in the palm of my hand */
export function packPack(pack: TPack): TPack {
  loadFirstFitDecreasingCargo(pack, pack.pendingCargo, handleCargoLoad);
  return pack;
}

export function packContainer(container: TContainer, cargo: TCargo[]): TPack {
  const pack = createPack({ container, cargo });
  return packPack(pack);
}

export function handleCargoLoad(
  pack: TPack,
  base: TPackedCargo,
  candidate: TPackedCargo,
  position: EPosition,
): TPackedCargo | null {
  // Place the Cargo in the grid
  if (!pack.loadedCargo.length) {
    candidate.grid = [0, 0, 0];
  } else {
    switch (position) {
      case EPosition.top:
        candidate.grid = [
          base.grid[EGrid.index] + 1,
          base.grid[EGrid.column],
          base.grid[EGrid.row],
        ];
        break;
      case EPosition.side:
        candidate.grid = [
          base.grid[EGrid.index],
          base.grid[EGrid.column],
          base.grid[EGrid.row] + 1,
        ];
        break;
      case EPosition.front:
        candidate.grid = [
          base.grid[EGrid.index],
          base.grid[EGrid.column] + 1,
          base.grid[EGrid.row],
        ];
        break;
      default:
        throw new Error(`Unknown position: ${position}`);
    }
  }

  // Create a new Grid if needed
  let grid = pack.grids[candidate.grid[EGrid.index]];

  if (!grid) {
    grid = createGrid();
    pack.grids.push(grid);
  }

  // Expand the Grid to equal the sum of its Cargo in all axis
  if (candidate.x + candidate.l > grid.l) grid.l += Math.abs(grid.l - candidate.l);
  if (candidate.y + candidate.w > grid.w) grid.w += Math.abs(grid.w - candidate.w);
  if (candidate.z + candidate.h > grid.h) grid.h += Math.abs(grid.h - candidate.h);

  // Compute usefull statistics
  if (candidate.l > pack.maxCargoL) pack.maxCargoL = candidate.l;
  else if (candidate.l < pack.minCargoL) pack.minCargoL = candidate.l;

  if (candidate.w > pack.maxCargoW) pack.maxCargoW = candidate.w;
  else if (candidate.w < pack.minCargoW) pack.minCargoW = candidate.w;

  if (candidate.z > pack.maxCargoH) pack.maxCargoH = candidate.h;
  else if (candidate.z < pack.minCargoH) pack.minCargoH = candidate.h;

  // Compute possibly usefull statistics

  return candidate;
}
