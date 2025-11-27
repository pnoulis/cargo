import "./utils/globals.ts";
import { TCargo, createCargo } from "./cargo.ts";
import { TContainer, createContainer, packContainer } from "./container.ts";
import { EUnit } from "./utils/index.ts";

const cargo: TCargo[] = [
  createCargo({ l: 100, w: 50, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 100, w: 50, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 100, w: 50, h: 100, unit: EUnit.Centimeter }),
];

const containers: TContainer[] = [
  createContainer({ l: 150, w: 100, h: 100, unit: EUnit.Centimeter }),
];

const pack = packContainer(containers[0], cargo);
log(pack);
