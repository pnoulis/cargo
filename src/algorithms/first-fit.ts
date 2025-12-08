import { TCargo, rotateCargo } from "../cargo.ts";
import { TPack, TPackedCargo, fitsWithinPack } from "../pack.ts";
import { createBoundingBox, isColliding, isBound, EPosition } from "../geometry.ts";
import type { TOnCargoLoad } from "./onCargoLoad.ts";

// https://en.wikipedia.org/wiki/First-fit_bin_packing

export function loadFirstFitDecreasingCargo(
  pack: TPack,
  pendingCargo: TCargo[],
  onLoad: TOnCargoLoad,
): TCargo[] {
  // https://en.wikipedia.org/wiki/First-fit-decreasing_bin_packing
  const sortedCargo = pendingCargo.toSorted((a, b) => b.volume - a.volume);

  for (let i = 0, y = 0; i < sortedCargo.length; i++) {
    if (!fitsWithinPack(pack, sortedCargo[i])) continue;
    do {
      if (
        tryLoading(pack, pack.loadedCargo[y], sortedCargo[i], onLoad) ||
        tryLoading(pack, pack.loadedCargo[y], rotateCargo(sortedCargo[i]), onLoad)
      ) {
        pack.loadedCargo.push(sortedCargo[i] as TPackedCargo);
        pack.remainderVolume -= sortedCargo[i].volume;
        pack.remainderVolume = pack.remainderVolume.toPrecision(3);

        pendingCargo.splice(
          pendingCargo.findIndex((cargo) => cargo.id === sortedCargo[i].id),
          1,
        );
        break;
      }
    } while (y++ < pack.loadedCargo.length);
  }

  return pendingCargo;
}

function tryLoading(
  pack: TPack,
  base: TPackedCargo,
  candidate: TCargo,
  onLoad: TOnCargoLoad,
): TPackedCargo | null {
  // Under normal conditions (no bugs or errors) the base will be undefined on the first
  // cargo to be loaded. Therefore, the 1st cargo is to be placed at position:
  // 0,0,0 and grid 0, column 0;
  base ||= createBoundingBox() as TPackedCargo;

  // Try on the top
  candidate.x = base.x;
  candidate.y = base.y;
  candidate.z = base.z + base.h;
  if (isBound(pack.container, candidate) && isPositionAvailable(pack.loadedCargo, candidate)) {
    return onLoad(pack, base, candidate as TPackedCargo, EPosition.top);
  }

  // Try on the side
  candidate.x = base.x;
  candidate.y = base.y + base.w;
  candidate.z = base.z;
  if (isBound(pack.container, candidate) && isPositionAvailable(pack.loadedCargo, candidate)) {
    return onLoad(pack, base, candidate as TPackedCargo, EPosition.side);
  }

  // Try on the front
  candidate.x = base.x + base.l;
  candidate.y = base.y;
  candidate.z = base.z;
  if (isBound(pack.container, candidate) && isPositionAvailable(pack.loadedCargo, candidate)) {
    return onLoad(pack, base, candidate as TPackedCargo, EPosition.front);
  }

  return null;
}

function isPositionAvailable(loadedCargo: TCargo[], candidate: TCargo): boolean {
  for (let i = 0; i < loadedCargo.length; i++)
    if (isColliding(loadedCargo[i], candidate)) return false;
  return true;
}
