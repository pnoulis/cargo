import type { TDimensions } from "./dimensions.ts";
import { cm2m } from "./units.ts";

// Volume: M^3
export function calculateVolume(dimensions: TDimensions): number {
  return cm2m(dimensions.x) * cm2m(dimensions.y) * cm2m(dimensions.z);
}
