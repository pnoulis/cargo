import { getLocalISO8601DateTimeString } from "./utils/time.ts";
import { JSZip } from "jszip";

export function canvas2blob(canvas: HTMLCanvasElement[]): Promise<Blob[]> {
  const blobs: Blob[] = [];

  return new Promise((resolve) => {
    next(0);
    function next(i: number) {
      if (i === canvas.length) return resolve(blobs);
      canvas[i].toBlob((blob) => {
        blobs.push(blob);
        next(i + 1);
      });
    }
  });
}

export function makePackPlanFilename(gridLevel) {
  return `plan-${gridLevel}.png`;
}

export function makePackZipArchiveFilename(packName) {
  return (
    "cargo-export." +
    packName.replaceAll(" ", "_") +
    "." +
    getLocalISO8601DateTimeString().replaceAll(":", "-")
  );
}

export async function zipPack(pack, canvasElementList: HTMLCanvasElement[]): Blob {
  const zip = new JSZip();
  const blobs = await canvas2blob(canvasElementList);

  for (let i = 0; i < blobs.length; i++) {
    const filename = makePackPlanFilename(i);
    zip.file(filename, blobs[i]);
  }

  return zip.generateAsync({ type: "blob" });
}
