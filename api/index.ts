import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/app";

// serverless-http is external, load it dynamically
let serverless: any = null;
async function getServerless() {
  if (!serverless) {
    const serverlessModule = await import("serverless-http");
    serverless = serverlessModule.default || serverlessModule;
  }
  return serverless;
}

let app: any = null;
let handler: any = null;

export default async function vercelHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Initialize app and handler on first request (cached for subsequent requests)
  if (!app) {
    try {
      console.log("[Vercel] Initializing Express app...");
      console.log("[Vercel] DB URL exists:", !!process.env.SUPABASE_DATABASE_URL);
      console.log("[Vercel] JWT Secret exists:", !!process.env.JWT_SECRET);
      
      app = await createApp();
      const serverlessHttp = await getServerless();
      handler = serverlessHttp(app, {
        binary: ['image/*', 'application/pdf', 'application/zip'],
      });
      console.log("[Vercel] Express app initialized successfully");
    } catch (error: any) {
      console.error("[Vercel] Initialization error:", error);
      console.error("[Vercel] Error stack:", error.stack);
      return res.status(500).json({ 
        error: "Server initialization failed",
        message: error.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
      });
    }
  }

  // Handle CORS
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Delegate to serverless handler
  try {
    return await handler(req, res);
  } catch (error: any) {
    console.error("[Vercel] Handler error:", error);
    return res.status(500).json({ 
      error: "Request handling failed",
      message: error.message 
    });
  }
}

