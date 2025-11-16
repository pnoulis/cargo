import { normalizeVolume } from "./volume.ts";
import type { TLoad } from "./load.ts";
import type { TSpace } from "./space.ts";
import { EUnit } from "./units.ts";

export type TDimensions = {
  l: number;
  w: number;
  h: number;
  unit: EUnit;
};

export type TPosition = {
  x: number;
  y: number;
  z: number;
};

export type TPlane = TDimensions &
  TPosition & {
    volume: number;
  };

export function normalizeDimensions(dimensions: TDimensions): TDimensions {
  const normalized = [dimensions.l, dimensions.w, dimensions.h].sort(
    (a, b) => b - a,
  );

  return {
    l: normalized[0] || 0,
    w: normalized[1] || 0,
    h: normalized[2] || 0,
    unit: dimensions.unit,
  };
}

export function space2plane(space: TSpace, position?: TPosition): TPlane {
  return {
    l: space.l,
    w: space.w,
    h: space.h,
    x: position?.x || 0,
    y: position?.y || 0,
    z: position?.z || 0,
    volume: space.volume,
    unit: space.unit,
  };
}

export function movePlane(plane: TPlane, load: TLoad): TPlane {
  const newPlane: Partial<TPlane> = {
    l: plane.l - load.l /* Free space, negative space */,
    w: plane.w - load.w /* Free space, negative space */,
    h: plane.h - load.h /* Free space, negative space */,
    x: plane.x + load.l /* Used space, positive space */,
    y: plane.y + load.w /* Used space, positive space */,
    z: plane.z + load.h /* Used space, positive space */,
  };

  newPlane.volume = normalizeVolume(plane.volume - load.volume);

  return newPlane as TPlane;
}

export function generateNegativePlanes(
  space: TSpace,
  plane: TPlane,
): Record<string, TPlane | null> {
  // Top negative plane
  const top =
    plane.h < space.h
      ? {
          ...plane,
          l: space.l,
          w: space.w,
          h: plane.h,
        }
      : null;

  // Right negative plane
  const right =
    plane.w < space.w
      ? {
          ...plane,
          l: space.l,
          w: plane.w,
          h: space.h,
        }
      : null;

  // Front negative plane
  const front =
    plane.l < space.l
      ? {
          ...plane,
          l: plane.l,
          w: space.w,
          h: space.h,
        }
      : null;

  return { top, right, front };
}
