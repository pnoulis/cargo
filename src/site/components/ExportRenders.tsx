interface ExportRendersProps {
  blobs: Blob[];
}

function getIso8601DateString(): string {
  return new Date().toISOString().split(".")[0] + "Z";
}

export function ExportRenders({ blobs }: EXportRendersProps) {
  return (
    <ul>
      {blobs.map((blob: Blob, i) => {
        const url = URL.createObjectURL(blob);
        const filename = `cargo-plan-${i}-${getIso8601DateString()}.png`;
        return (
          <li>
            <a href={url} download={filename}>
              ${filename}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
