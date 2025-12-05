import esbuild from "esbuild";
import fs from "fs";
import Path from "path";
import { Buffer } from "node:buffer";

const __DIRNAME = Path.resolve(process.cwd(), process.env.BUILDIR);

const VENDOR_BUNDLE = "dist/vendor.js";

const RE_ALIAS = /^@[a-zA-Z]+\//;

function resolveAlias(path) {
  const [aliasImport] = path.match(RE_ALIAS);
  if (!aliasImport) throw new Error(`Unresolved import path alias: ${path}`);
  const alias = aliasImport.substring(1, aliasImport.length - 1);

  switch (alias) {
    case "common":
      return Path.resolve(__DIRNAME, "src", path.slice(aliasImport.length));
    case "meta":
      return Path.resolve(__DIRNAME, "src/meta", path.slice(aliasImport.length));
    case "site":
      return Path.resolve(__DIRNAME, "src/site", path.slice(aliasImport.length));
    case "assets":
      return Path.resolve(__DIRNAME, "assets", path.slice(aliasImport.length));
    default:
      throw new Error(`Unresolved import path alias: ${alias}`);
  }
}

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

      if (Path.isAbsolute(args.path)) {
        resolvedPath = args.path;
      } else {
        // Resolve relative to the importer's directory
        resolvedPath = Path.resolve(Path.dirname(args.importer), args.path);
      }

      return {
        path: resolvedPath,
        namespace: "png-loader",
      };
    });

    build.onLoad({ filter: /\.png$/, namespace: "png-loader" }, async (args) => {
      const data = await fs.promises
        .readFile(args.path, "utf-8")
        .then((data) => data.toString("base64"));

      const dataUrl = `data:image/png;base64,${data}`;

      return {
        contents: `export default ${JSON.stringify(dataUrl)}`,
        loader: "js",
      };
    });
  },
};

// Plugin to handle SVG imports
const svgPlugin = {
  name: "svg-loader",
  setup(build) {
    build.onResolve({ filter: /\.svg$/ }, (args) => {
      let resolvedPath;

      if (Path.isAbsolute(args.path)) {
        resolvedPath = args.path;
      } else if (args.path.at(0) === "@") {
        // Path alias
        resolvedPath = resolveAlias(args.path);
      } else {
        // Resolve relative to the importer's directory
        resolvedPath = Path.resolve(Path.dirname(args.importer), args.path);
      }

      return {
        path: resolvedPath,
        namespace: "svg-loader",
      };
    });

    build.onLoad({ filter: /\.svg$/, namespace: "svg-loader" }, async (args) => {
      const data = await fs.promises
        .readFile(args.path, "utf-8")
        .then((data) => Buffer.from(data).toString("base64"));

      const dataUrl = `data:image/svg+xml;base64,${data}`;

      return {
        contents: `export default ${JSON.stringify(dataUrl)}`,
        loader: "js",
      };
    });
  },
};

// Build app
await esbuild.build({
  entryPoints: ["src/test.ts", "src/site/App.tsx"],
  bundle: true,
  outdir: "dist",
  format: "esm",
  target: ["node24", "es2024"],
  platform: "browser",
  packages: "external",
  jsx: "automatic",
  jsxImportSource: "react",
  sourcemap: true,
  plugins: [pngPlugin, svgPlugin],
});

console.log("Build complete!");
