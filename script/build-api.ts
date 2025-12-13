import { build as esbuild } from "esbuild";

async function buildApi() {
  console.log("Building API for Vercel...");
  
  await esbuild({
    entryPoints: ["api/[...path].ts"],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: "api/index.mjs",
    external: ["@vercel/node"],
    minify: false,
    logLevel: "info",
  });
  
  console.log("API build complete!");
}

buildApi().catch((err) => {
  console.error(err);
  process.exit(1);
});
