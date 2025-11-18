import { TSize, TBoundingBox } from "./types/index.ts";
import { EUnit, EOrientation } from "./enums/index.js";
import { cm2m } from "./utils/index.ts";

export function normalizeSize(size: TSize, orientation: EOrientation): TSize {
  return orientation === EOrientation.Horizontal
    ? {
        l: size.l > size.w ? size.l : size.w,
        w: size.l < size.w ? size.l : size.w,
        h: size.h,
      }
    : {
        l: size.l < size.w ? size.l : size.w,
        w: size.l > size.w ? size.l : size.w,
        h: size.h,
      };
}

// Volume: M^3
// V = L * W * H
export function calculateVolume(size: TSize, units: EUnit): number {
  let volume;

  switch (units) {
    case EUnit.Meter:
      volume = size.l * size.w * size.h;
      break;
    case EUnit.Centimeter:
      volume = cm2m(size.l) * cm2m(size.w) * cm2m(size.h);
      break;
    default:
      throw new Error(`Unknown unit: ${units}`);
  }

  return normalizeVolume(volume);
}

export function normalizeVolume(volume: number): number {
  return parseFloat(volume.toFixed(2));
}

export function rotate<T>(box: TBoundingBox): T {
  const tmp = box.l;
  box.l = box.w;
  box.w = tmp;
  return box as T;
}

// The order is important here
// Read it as: is B colliding/intersecting with A
export function isColliding(a: TBoundingBox, b: TBoundingBox): boolean {
  return (
    /* X AXIS */
    b.x < a.x + a.l &&
    b.x + b.l > a.x &&
    /* Y AXIS */
    b.y < a.y + a.w &&
    b.y + b.w > a.y &&
    /* Z AXIS */
    b.z < a.z + a.h &&
    b.z + b.h > a.z
  );
}

// The order is important here
// Read it as: is B fully contained within A
export function isContained(a: TBoundingBox, b: TBoundingBox): boolean {
  return (
    /* X AXIS */
    b.x >= a.x &&
    b.x + b.l <= a.x + a.l &&
    /* Y AXIS */
    b.y >= a.y &&
    b.y + b.w <= a.y + a.w &&
    /* Z AXIS */
    b.z >= a.z &&
    b.z + b.h <= a.z + a.h
  );
}
