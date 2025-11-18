import "./globals.ts";
import { TCargo, TContainer } from "./types/index.ts";
import { EUnit } from "./enums/index.ts";
import { createCargo } from "./cargo.ts";
import { createContainer } from "./container.ts";
import { packCargo } from "./packed-container.ts";
import { rotate } from "./3d.ts";



debugger;
const cargo: TCargo[] = [
  createCargo({ l: 100, w: 50, h: 100, units: EUnit.Centimeter }),
  createCargo({ l: 100, w: 50, h: 100, units: EUnit.Centimeter }),
  createCargo({ l: 100, w: 50, h: 100, units: EUnit.Centimeter }),
];


const container: TContainer[] = [
  createContainer({ l: 150, w: 100, h: 100, units: EUnit.Centimeter }),
];

const pack = packCargo(container[0], cargo);
log(pack);
