import { React } from "react";
import { CanvasList } from "./CanvasList.tsx";
import { CanvasPlaceholder } from "./CanvasPlaceholder.tsx";
import { CanvasExport } from "./CanvasExport.tsx";
import { usePacking } from "../context/PackingContext.tsx";
import { renderPack } from "@common/render.ts";
import { zipPack, makePackZipArchiveFilename } from "@common/exports.ts";

export function CanvasLayout() {
  const { pack, isExporting, isPacked } = usePacking();
  const [isExported, setIsExported] = React.useState(false);
  const loadedCargo = pack?.loadedCargo?.length;
  const renderRef = React.useRef<boolean>(null);
  const canvasElementListRef = React.useRef<HTMLCanvasElement[]>([]);
  const blobsRef = React.useRef<Blob[]>(null);

  function setCanvasRef(canvas: HTMLCanvasElement, i: index) {
    canvasElementListRef.current[i] = canvas;
  }

  React.useEffect(() => {
    if (!loadedCargo || renderRef.current) return;
    renderPack(pack);
    renderRef.current = true;
  }, [isPacked, pack]);

  React.useEffect(() => {
    if (!loadedCargo || blobsRef.current) return;
    zipPack(pack, canvasElementListRef.current).then((blob: Blob) => {
      const filename = makePackZipArchiveFilename(pack.container.name);
      blobsRef.current = {};
      blobsRef.current.zip = {
        blob,
        url: URL.createObjectURL(blob),
        filename,
      };
      setIsExported(true);
    });
  }, [isExporting]);


  if (isExported) return <CanvasExport blobs={blobsRef.current} />;
  if (!loadedCargo) return <CanvasPlaceholder />;
  return <CanvasList grids={pack.grids} onCanvasElementRender={setCanvasRef} />;
}
