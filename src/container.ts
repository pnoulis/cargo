import { TContainer, TNewContainer, TSize, TBoundingBox } from "./types/index.ts";
import { smallID } from "./utils/index.ts";
import { calculateVolume, normalizeSize, isContained } from "./3d.ts";
import { EOrientation } from "./enums/index.ts";

export function createContainer(newContainer: TNewContainer): TContainer {
  const size = normalizeSize(newContainer as TSize, EOrientation.Horizontal);
  const volume = calculateVolume(size, newContainer.units);

  const container: TContainer = {
    id: smallID(),
    maxWeight: Number.POSITIVE_INFINITY,
    ...newContainer,
    clearance: { l: 0, w: 0, h: 0, ...newContainer.clearance },
    volume,
    ...size,
    x: 0,
    y: 0,
    z: 0,
  };

  return container;
}

export function isWithinContainer(container: TContainer, box: TBoundingBox): boolean {
  return isContained(container, box);
}
