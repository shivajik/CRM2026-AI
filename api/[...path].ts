import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";

let handler: any = null;
let initError: Error | null = null;

function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

async function initHandler() {
  if (handler) return handler;
  if (initError) throw initError;
  
  try {
    console.log("Initializing serverless handler...");
    console.log("Environment check - SUPABASE_DATABASE_URL exists:", !!process.env.SUPABASE_DATABASE_URL);
    console.log("Environment check - DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("Environment check - JWT_SECRET exists:", !!process.env.JWT_SECRET);
    
    const { createApp } = await import("../server/app");
    const app = await createApp();
    handler = serverless(app);
    console.log("Serverless handler initialized successfully");
    return handler;
  } catch (error: any) {
    console.error("Failed to initialize handler:", error.message);
    console.error("Stack:", error.stack);
    initError = error;
    throw error;
  }
}

export default async function (req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const h = await initHandler();
    return await h(req, res);
  } catch (error: any) {
    console.error("Request handler error:", error.message);
    res.status(500).json({ 
      message: "Server initialization failed",
      error: error.message,
      hint: "Check Vercel function logs for more details"
    });
  }
}
