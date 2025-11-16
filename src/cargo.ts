import type { TPosition, TPlane } from "./plane.ts";
import { movePlane, space2plane, generateNegativePlanes } from "./plane.ts";
import type { TLoad } from "./load.ts";
import { rotateLoad } from "./load.ts";
import type { TSpace } from "./space.ts";

export type TCargo = {
  load: TLoad[];
};

export type TPlacedLoad = TLoad &
  TPosition & {
    orientation: TPosition;
  };

export function loadCargo(space: TSpace, loads: TLoad[]): TCargo {
  const loadDecreasingVolume = loads.toSorted((a, b) => b.volume - a.volume);

  const planes = [space2plane(space)];

  log(space);
  for (const load of loadDecreasingVolume) {
    log(load);
    let candidatePlane: TPlane;
    let acceptablePlanes: TPlane[] = [];

    for (const plane of planes) {
      log("add load to plane");
      log(plane);

      // The load must fit the available space.

      // Try the longX orientation
      candidatePlane = movePlane(plane, load);
      if (candidatePlane.volume >= 0) {
        log("candidate fits in the longX orientation");
        acceptablePlanes.push(candidatePlane);
      }

      // Try the longY orientation
      candidatePlane = movePlane(plane, rotateLoad(load));
      if (candidatePlane.volume >= 0) {
        log("candidate fits in the longY orientation");
        acceptablePlanes.push(candidatePlane);
      }
    }
    log(acceptablePlanes);

    for (const plane of acceptablePlanes) {
      log(generateNegativePlanes(space, plane));
    }
  }

  return {} as TCargo;
}
