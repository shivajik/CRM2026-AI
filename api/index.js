// ESM wrapper to load CommonJS build
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
import { readFileSync } from "fs";

// Get current file path for createRequire
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(__filename);

// Load the bundled CommonJS function
const handlerModule = require("./index.cjs");
const handler = handlerModule.default || handlerModule;

export default handler;

