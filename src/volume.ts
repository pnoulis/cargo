import type { TDimensions } from "./plane.ts";
import { cm2m, EUnit } from "./units.ts";

// Volume: M^3
export function calculateVolume(dimensions: TDimensions): number {
  let volume;

  switch (dimensions.unit) {
    case EUnit.Meter:
      volume = dimensions.l * dimensions.w * dimensions.h;
      break;
    case EUnit.Centimeter:
      volume = cm2m(dimensions.l) * cm2m(dimensions.w) * cm2m(dimensions.h);
      break;
    default:
      throw new Error(`Unknown enum unit: ${dimensions.unit}`);
  }

  return parseFloat(volume.toFixed(2));
}
