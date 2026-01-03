// Wrapper to load CommonJS build in ESM context
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load the CommonJS build
const handlerModule = require('./index.cjs');

// Handle both default export and direct export
const handler = handlerModule.default || handlerModule;

export default handler;

