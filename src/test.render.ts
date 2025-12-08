import { renderPack } from "./render.node.ts";
import { createWriteStream } from "node:fs";
import { TCargo, createCargo } from "./cargo.ts";
import { TContainer, createContainer } from "./container.ts";
import { createPack, packPack, TPack, EGrid, TPackedCargo } from "./pack.ts";
import { EUnit } from "./utils/index.ts";
import * as config from "@meta/config";
import * as Path from "node:path";

const cargo: TCargo[] = [
  createCargo({ l: 100, w: 50, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 100, w: 50, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 100, w: 50, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 70, w: 50, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 30, w: 33, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
  createCargo({ l: 25, w: 25, h: 100, unit: EUnit.Centimeter }),
];

const containers: TContainer[] = [
  createContainer({ l: 300, w: 200, h: 200, unit: EUnit.Centimeter }),
];

const pack = createPack({ container: containers[0], cargo });
packPack(pack);

log(pack);
const filename = Path.join(config.RENDER_EXPORT_DIR(), "out.png");

const png = createWriteStream(filename);

renderPack(pack, null, png);
