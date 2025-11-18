import { TCargo, TNewCargo, TSize } from "./types/index.ts";
import { smallID } from "./utils/index.ts";
import { calculateVolume, normalizeSize } from "./3d.ts";
import { EOrientation } from "./enums/3d.ts";

export function createCargo(newCargo: TNewCargo): TCargo {
  const orientation = newCargo.orientation || EOrientation.Horizontal;
  const size = normalizeSize(newCargo as TSize, orientation);
  const volume = calculateVolume(size, newCargo.units);

  const cargo: TCargo = {
    id: smallID(),
    units: newCargo.units,
    orientation,
    priority: newCargo.priority || 0,
    volume,
    ...size,
    x: 0,
    y: 0,
    z: 0,
  };

  return cargo;
}
