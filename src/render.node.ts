import { createCanvas, Canvas } from "canvas";
import * as config from "@meta/config";
import * as Path from "node:path";
import { createWriteStream } from "node:fs";
import { TCargo, createCargo } from "./cargo.ts";
import { TContainer, createContainer } from "./container.ts";
import { packContainer, TPack, EGrid, TPackedCargo } from "./pack.ts";
import { EUnit } from "./utils/index.ts";

enum ERenderColumnFlow {
  Vertical = 0,
  Horizontal = 1,
}

const GridRowColors = [
  "#e6194b", // red
  "#3cb44b", // green
  "#0082c8", // blue
  "#f58231", // orange
  "#911eb4", // purple
  "#46f0f0", // cyan
  "#f032e6", // magenta
  "#d2f53c", // lime
  "#fabebe", // light pink
  "#008080", // teal
  "#ffe119", // yellow
  "#aa6e28", // brown
  "#800000", // maroon
  "#aaffc3", // mint
  "#000080", // navy
];

const CANVAS_PADDING_Y = 100;
const CANVAS_PADDING_X = 100;
const SCALE = 2;
const CARGO_MIN_WIDTH = 80;
const TEXT_OFFSET = 10;
const COLUMN_GAP = 10;
const ROW_GAP = 5;
const MIN_CANVAS_HEIGHT = 2000;
const MIN_CANVAS_WIDTH = 2000;
const FONT_SIZE = 20;
const ID_COLUMN = 400;

export function renderPack(pack: TPack, flow: ERenderColumnFlow, png) {
  const gridCount = pack.grids.length;
  const minWidthScale =
    CARGO_MIN_WIDTH / (pack.minCargoW - (COLUMN_GAP > ROW_GAP ? COLUMN_GAP : ROW_GAP));
  const packWidth = pack.container.w * minWidthScale * SCALE;
  const packLength = pack.container.l * minWidthScale * SCALE;

  let canvasWidth, canvasHeight;
  if (flow === ERenderColumnFlow.Horizontal) {
    canvasWidth = gridCount * packWidth;
    if (MIN_CANVAS_WIDTH > canvasWidth) canvasWidth = MIN_CANVAS_WIDTH;
    canvasHeight = MIN_CANVAS_HEIGHT > packLength ? MIN_CANVAS_HEIGHT : packLength;
  } else {
    canvasWidth = MIN_CANVAS_WIDTH > packWidth ? MIN_CANVAS_WIDTH : packWidth;
    canvasHeight = gridCount * packLength;
    if (MIN_CANVAS_HEIGHT > canvasHeight) canvasHeight = MIN_CANVAS_HEIGHT;
  }

  const canvas = createCanvas(canvasWidth + CANVAS_PADDING_X + ID_COLUMN, canvasHeight + CANVAS_PADDING_Y);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvasWidth + CANVAS_PADDING_X + ID_COLUMN, canvasHeight + CANVAS_PADDING_Y);
  ctx.strokeStyle = "black";
  ctx.font = FONT_SIZE * SCALE + "px Arial"; // font size + family
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";

  let x, y, w, h;
  let i = 0;
  for (const cargo of pack.loadedCargo) {
    x = getCargoXStart(cargo, flow, pack);
    w = getCargoXEnd(cargo);
    y = getCargoYStart(cargo, flow, pack);
    h = getCargoYEnd(cargo);

    ctx.strokeStyle = GridRowColors[cargo.grid[EGrid.column]];
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "black";
    ctx.fillText(cargo.id, x + TEXT_OFFSET * SCALE, y + h / 2);

    ctx.fillText(`${cargo.id}: ${cargo.name || "Untitled"}`, 5, 20 + i * 45);
    i++;
  }

  canvas.createPNGStream().pipe(png);
  png.on("finish", () => log("The PNG file was created."));

  function getCargoXStart(cargo: TPackedCargo, flow: ERenderColumnFlow, pack: TPack): number {
    let x = cargo.y * minWidthScale * SCALE;
    x += CANVAS_PADDING_X + ID_COLUMN;
    return Math.trunc(x);
  }

  function getCargoXEnd(cargo: TPackedCargo): number {
    let w = cargo.w * minWidthScale * SCALE;
    w -= COLUMN_GAP;
    return Math.trunc(w);
  }

  function getCargoYStart(cargo: TPackedCargo, flow: ERenderColumnFlow, pack: TPack): number {
    let y = cargo.x * minWidthScale * SCALE;
    y += cargo.grid[EGrid.index] * packLength;
    y += CANVAS_PADDING_Y;
    return Math.trunc(y);
  }

  function getCargoYEnd(cargo: TPackedCargo): number {
    let l = cargo.l * minWidthScale * SCALE;
    l -= ROW_GAP;
    return Math.trunc(l);
  }
}
