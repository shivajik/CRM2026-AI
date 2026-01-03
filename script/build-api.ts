import { build as esbuild } from "esbuild";

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
    outfile: "api/index.js",
    external: ["@vercel/node", "serverless-http", ...nodeBuiltins],
    minify: false,
    logLevel: "info",
  });
  
  console.log("API build complete!");
}

buildApi().catch((err) => {
  console.error(err);
  process.exit(1);
});
