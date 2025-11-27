import { TCargo, rotateCargo } from "../cargo.ts";
import { TPack, fitsWithinPack } from "../container.ts";
import {
  createBoundingBox,
  isColliding,
  isBound,
  TBoundingBox,
} from "../geometry.ts";

// https://en.wikipedia.org/wiki/First-fit_bin_packing

export function loadFirstFitDecreasingCargo(
  pack: TPack,
  pendingCargo: TCargo[],
): TCargo[] {
  // https://en.wikipedia.org/wiki/First-fit-decreasing_bin_packing
  const sortedCargo = pendingCargo.toSorted((a, b) => b.volume - a.volume);

  for (let i = 0, y = 0; i < sortedCargo.length; i++) {
    if (!fitsWithinPack(pack, sortedCargo[i])) continue;
    do {
      if (
        tryLoading(pack, pack.loadedCargo[y], sortedCargo[i]) ||
        tryLoading(pack, pack.loadedCargo[y], rotateCargo(sortedCargo[i]))
      ) {
        pack.loadedCargo.push(sortedCargo[i]);
        pack.remainderVolume -= sortedCargo[i].volume;
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
  anchor: TBoundingBox,
  candidate: TCargo,
): TCargo | null {
  // Under normal conditions (no bugs or errors) the anchor will be undefined on the first
  // cargo to be loaded. Therefore, the 1st cargo is to be placed at position:
  // 0,0,0.
  anchor ||= createBoundingBox();

  // Try on the top
  candidate.x = anchor.x;
  candidate.y = anchor.y;
  candidate.z = anchor.z + anchor.h;
  if (
    isBound(pack.container, candidate) &&
    isPositionAvailable(pack.loadedCargo, candidate)
  )
    return candidate;

  // Try on the side
  candidate.x = anchor.x;
  candidate.y = anchor.y + anchor.w;
  candidate.z = anchor.z;
  if (
    isBound(pack.container, candidate) &&
    isPositionAvailable(pack.loadedCargo, candidate)
  )
    return candidate;

  // Try on the front
  candidate.x = anchor.x + anchor.l;
  candidate.y = anchor.y;
  candidate.z = anchor.z;
  if (
    isBound(pack.container, candidate) &&
    isPositionAvailable(pack.loadedCargo, candidate)
  )
    return candidate;

  return null;
}

function isPositionAvailable(
  loadedCargo: TCargo[],
  candidate: TCargo,
): boolean {
  for (let i = 0; i < loadedCargo.length; i++)
    if (isColliding(loadedCargo[i], candidate)) return false;
  return true;
}
