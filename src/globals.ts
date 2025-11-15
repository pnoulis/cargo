import * as debug from "./debug.ts";

declare global {
  var log: typeof debug.log;
  var dir: typeof debug.dir;
}

globalThis.log = debug.log;
globalThis.dir = debug.dir;
