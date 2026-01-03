// ESM wrapper to load CommonJS build
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Load the bundled CommonJS function
const handlerModule = require("./index.cjs");
const handler = handlerModule.default || handlerModule;

export default handler;

