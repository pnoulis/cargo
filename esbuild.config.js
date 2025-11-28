import esbuild from "esbuild";
import fs from "fs";
import path from "path";

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
    entryPoints: ["src/meta/vendor.ts"],
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

// Plugin to handle PNG imports
const pngPlugin = {
  name: "png-loader",
  setup(build) {
    build.onResolve({ filter: /\.png$/ }, (args) => {
      let resolvedPath;

      if (path.isAbsolute(args.path)) {
        resolvedPath = args.path;
      } else {
        // Resolve relative to the importer's directory
        resolvedPath = path.resolve(path.dirname(args.importer), args.path);
      }

      return {
        path: resolvedPath,
        namespace: "png-loader",
      };
    });

    build.onLoad(
      { filter: /\.png$/, namespace: "png-loader" },
      async (args) => {
        const data = await fs.promises.readFile(args.path);
        const base64 = data.toString("base64");
        const dataUrl = `data:image/png;base64,${base64}`;

        return {
          contents: `export default ${JSON.stringify(dataUrl)}`,
          loader: "js",
        };
      },
    );
  },
};

// Build app
await esbuild.build({
  entryPoints: ["src/test.ts", "src/app.tsx"],
  bundle: true,
  outdir: "dist",
  format: "esm",
  target: ["node24", "es2024"],
  platform: "browser",
  packages: "external",
  jsx: "automatic",
  jsxImportSource: "react",
  sourcemap: true,
  plugins: [pngPlugin],
});

console.log("Build complete!");
