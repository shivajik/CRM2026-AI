// Placeholder for Vercel function detection
// This file is overwritten by script/build-api.ts during build
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(503).json({ 
    error: "Function not built",
    message: "This placeholder will be replaced during build" 
  });
}
