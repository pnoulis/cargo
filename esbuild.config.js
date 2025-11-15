import esbuild from "esbuild";
import fs from "fs";

const VENDOR_BUNDLE = "dist/vendor.js";

/**
 * Check if React vendor bundle already exists
 */
function isVendorBuilt() {
  return fs.existsSync(VENDOR_BUNDLE);
}

/**
 * Build React and React-DOM as separate vendor bundle
 */
async function buildVendor() {
  if (isVendorBuilt()) return;

  await esbuild.build({
    entryPoints: ["src/vendor.ts"],
    bundle: true,
    outdir: "dist",
    format: "esm",
    target: ["node24", "es2024"],
    platform: "browser",
    sourcemap: false,
  });
}

// Build vendor first if needed
await buildVendor();

// Build app
await esbuild.build({
  entryPoints: ["src/load.ts", "src/app.tsx"],
  bundle: true,
  outdir: "dist",
  format: "esm",
  target: ["node24", "es2024"],
  platform: "browser",
  packages: "external",
  jsx: "automatic",
  jsxImportSource: "react",
  sourcemap: true,
  plugins: [],
});

console.log("Build complete!");
