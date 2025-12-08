import {
  normalizeDimensions,
  calculateVolume,
  TDimensions,
  T3DCoordinates,
  TBody,
} from "./geometry.ts";
import { smallID, EUnit } from "./utils/index.ts";

export type TContainer = TBody & {
  id: string;
  name?: string;
  maxWeight: number;
  clearance: T3DCoordinates;
};

export type TNewContainer = TDimensions &
  Partial<T3DCoordinates> & {
    id?: string;
    name?: string;
    clearance?: T3DCoordinates;
    weight?: number;
    maxWeight?: number;
    unit: EUnit;
  };

export function createContainer(newContainer: TNewContainer): TContainer {
  newContainer = { unit: EUnit.Centimeter, ...newContainer };

  return {
    /* TContainer */
    id: newContainer.id || smallID(),
    name: newContainer.name,
    maxWeight: newContainer.maxWeight || Number.POSITIVE_INFINITY,
    clearance: { x: 0, y: 0, z: 0, ...newContainer.clearance },

    /* TBody */
    unit: newContainer.unit,
    volume: calculateVolume(newContainer, newContainer.unit),
    weight: newContainer.weight || 0,

    /* T3DCoordinates */
    x: 0,
    y: 0,
    z: 0,

    /* TDimensions */
    ...normalizeDimensions(newContainer),
  };
}
