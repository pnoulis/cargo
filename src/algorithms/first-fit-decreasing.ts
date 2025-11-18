import { TPackedContainer, TBoundingBox } from "../types/index.ts";
import { isWithinContainer } from "../container.ts";
import { isColliding, rotate } from "../3d.ts";

export function tryFirstFitCargo(
  pack: TPackedContainer,
  cargo: TBoundingBox,
): boolean {
  let i = 0;
  do {
    if (
      findFirstFit(
        pack,
        /* Special case: fitting the first cargo */
        pack.cargo[i] || { x: 0, y: 0, z: 0, l: 0, w: 0, h: 0 },
        cargo,
      ) ||
      findFirstFit(
        pack,
        pack.cargo[i] || { x: 0, y: 0, z: 0, l: 0, w: 0, h: 0 },
        rotate<TBoundingBox>(cargo),
      )
    )
      return true;
  } while (i++ < pack.cargo.length);
  return false;
}

function findFirstFit(
  pack: TPackedContainer,
  base: TBoundingBox,
  target: TBoundingBox,
) {
  // Try on the top
  target.x = base.x;
  target.y = base.y;
  target.z = base.z + base.h;
  if (
    isWithinContainer(pack.container, target) &&
    isPositionAvailable(pack.cargo, target)
  )
    return target;

  // Try on the side
  target.x = base.x;
  target.y = base.y + base.w;
  target.z = base.z;
  if (
    isWithinContainer(pack.container, target) &&
    isPositionAvailable(pack.cargo, target)
  )
    return target;

  // Try on the front
  target.x = base.x + base.l;
  target.y = base.y;
  target.z = base.z;
  if (
    isWithinContainer(pack.container, target) &&
    isPositionAvailable(pack.cargo, target)
  )
    return target;

  return null;
}

function isPositionAvailable(
  cargo: TBoundingBox[],
  target: TBoundingBox,
): boolean {
  for (let i = 0; i < cargo.length; i++)
    if (isColliding(cargo[i], target)) return false;
  return true;
}
