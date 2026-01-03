import { build } from "esbuild";
import path from "path";

async function buildApi() {
  console.log("Building API for Vercel...");

  const nodeBuiltins = [
    "http", "https", "fs", "path", "url", "util", "crypto", "stream", "events",
    "buffer", "querystring", "zlib", "net", "tls", "dns", "os", "child_process",
    "cluster", "dgram", "readline", "repl", "string_decoder", "timers", "tty",
    "vm", "worker_threads", "assert", "console", "module", "process"
  ];

  try {
    await build({
      entryPoints: ["api/[...path].ts"],
      bundle: true,
      platform: "node",
      target: "node20",
      format: "esm",
      outfile: "api/index.js",
      external: ["@vercel/node", "serverless-http", ...nodeBuiltins],
      minify: false,
      sourcemap: false,
      logLevel: "info",
      alias: {
        "@": path.resolve(process.cwd(), "client/src"),
        "@shared": path.resolve(process.cwd(), "shared"),
      },
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    });

    console.log("✓ API built successfully to api/index.js");
  } catch (error) {
    console.error("✗ Build failed:", error);
    process.exit(1);
  }
}

buildApi();

