export type TPosition = {
  x: number;
  y: number;
  z: number;
};

export type TSize = {
  l: number;
  w: number;
  h: number;
};

export type TBoundingBox = TPosition & TSize;
