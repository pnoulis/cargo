import { EUnit, cm2m } from "./utils/index.ts";

export type TPosition = {
  x: number;
  y: number;
  z: number;
};

export type TDimensions = {
  l: number;
  w: number;
  h: number;
};

export enum EAxis {
  x = "x",
  y = "y",
  z = "z",
}

export type TOrientation = {
  /* X-axis: *TILT* your head left/right. The axis goes front-to-back through the head */
  roll: number;
  /* Y-axis: *MOVE* your head up/down. The axis goes left-to-right through the head */
  pitch: number;
  /* Z-axis: *MOVE* your head left/right. The axis goes up-down through the center */
  yaw: number;
};

export type TBoundingBox = TPosition & TDimensions;

export type TBody = TBoundingBox &
  Partial<TOrientation> & {
    volume: number;
    weight: number;
    unit: EUnit;
  };

export function createBoundingBox(bb?: Partial<TBoundingBox>): TBoundingBox {
  return { x: 0, y: 0, z: 0, l: 0, w: 0, h: 0, ...bb };
}

export function roll<T>(body: TBody, degrees: number): T {
  body.roll ||= 0;
  body.roll += degrees;
  return body as T;
}

export function pitch<T>(body: TBody, degrees: number): T {
  body.pitch ||= 0;
  body.pitch += degrees;
  return body as T;
}

export function yaw<T>(body: TBody, degrees: number): T {
  body.yaw ||= 0;
  body.yaw += degrees;
  return body as T;
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
export function isBound(a: TBoundingBox, b: TBoundingBox): boolean {
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

export function normalizeDimensions(dimensions: TDimensions): TDimensions {
  return {
    l: dimensions.l > dimensions.w ? dimensions.l : dimensions.w,
    w: dimensions.l < dimensions.w ? dimensions.l : dimensions.w,
    h: dimensions.h,
  };
}

// Volume: M^3
// V = L * W * H
export function calculateVolume(dimensions: TDimensions, unit: EUnit): number {
  let volume;

  switch (unit) {
    case EUnit.Meter:
      volume = dimensions.l * dimensions.w * dimensions.h;
      break;
    case EUnit.Centimeter:
      volume = cm2m(dimensions.l) * cm2m(dimensions.w) * cm2m(dimensions.h);
      break;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }

  return normalizeVolume(volume);
}

export function normalizeVolume(volume: number): number {
  return parseFloat(volume.toFixed(2));
}
