// Wrapper to load CommonJS build in ESM context
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load the CommonJS build
const handler = require('./index.cjs');

export default handler;

