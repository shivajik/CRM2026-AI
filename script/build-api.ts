import { build as esbuild } from "esbuild";
import path from "path";

// Node.js built-in modules that should be external
const nodeBuiltins = [
  "http", "https", "fs", "path", "url", "util", "crypto", "stream", "events",
  "buffer", "querystring", "zlib", "net", "tls", "dns", "os", "child_process",
  "cluster", "dgram", "readline", "repl", "string_decoder", "timers", "tty",
  "vm", "worker_threads", "assert", "console", "module", "process"
];

async function buildApi() {
  console.log("Building API for Vercel...");
  
  await esbuild({
    entryPoints: ["api/[...path].ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "api/index.cjs",
    // Only externalize Vercel runtime and Node built-ins
    // Everything else (including server code, bcryptjs, etc.) gets bundled
    external: ["@vercel/node", ...nodeBuiltins],
    minify: false,
    logLevel: "info",
    // Resolve .ts files and path aliases
    loader: {
      ".ts": "ts",
    },
    alias: {
      "@": path.resolve(process.cwd(), "client/src"),
      "@shared": path.resolve(process.cwd(), "shared"),
    },
  });
  
  console.log("API build complete!");
}

buildApi().catch((err) => {
  console.error(err);
  process.exit(1);
});
