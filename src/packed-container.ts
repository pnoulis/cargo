import type { TCargo, TPackedContainer, TContainer } from "./types/index.ts";
import { smallID } from "./utils/index.ts";
import { tryFirstFitCargo } from "./algorithms/first-fit-decreasing.ts";

export function packCargo(
  container: TContainer,
  cargo: TCargo[],
): TPackedContainer {
  const sortedCargo = cargo.toSorted((a, b) => b.volume - a.volume);
  const pack = createPack(container, [...sortedCargo]);

  for (let i = 0; i < sortedCargo.length; i++) {
    if (!canLoadCargo(pack, sortedCargo[i])) continue;
    if (!tryFirstFitCargo(pack, sortedCargo[i])) continue;

    pack.cargo.push(sortedCargo[i]);
    pack.pendingCargo.splice(i, 1);
    pack.remainderVolume -= sortedCargo[i].volume;
  }

  return pack;
}

export function createPack(
  container: TContainer,
  cargo: TCargo[],
): TPackedContainer {
  return {
    id: smallID(),
    container: container,
    remainderVolume: container.volume,
    pendingCargo: cargo,
    cargo: [],
  };
}

export function addCargo() {}
export function delCargo() {}

export function canLoadCargo(pack: TPackedContainer, cargo: TCargo) {
  return pack.remainderVolume >= cargo.volume;
}
