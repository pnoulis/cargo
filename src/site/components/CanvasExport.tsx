import { usePacking } from "../context/PackingContext.tsx";
import { makePackZipArchiveFilename } from "@common/exports.ts";
import "./CanvasExport.css";

type TCanvasExportProps = {
  blobs: Record<string, { blob: Blob; url: string; filename: string }>;
};

export function CanvasExport({ blobs }: TCanvasExportProps) {
  return (
    <ul className="export-list">
      <li>
        <a className="export-link" href={blobs.zip.url} download={blobs.zip.filename}>
          {blobs.zip.filename}
        </a>
      </li>
    </ul>
  );
}
