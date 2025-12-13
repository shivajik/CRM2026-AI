import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import { createApp } from "../server/app";

let handler: any = null;

function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

export default async function (req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (!handler) {
      console.log("Initializing serverless handler...");
      console.log("Environment check - SUPABASE_DATABASE_URL exists:", !!process.env.SUPABASE_DATABASE_URL);
      console.log("Environment check - DATABASE_URL exists:", !!process.env.DATABASE_URL);
      console.log("Environment check - JWT_SECRET exists:", !!process.env.JWT_SECRET);
      const app = await createApp();
      handler = serverless(app);
      console.log("Serverless handler initialized successfully");
    }
    return await handler(req, res);
  } catch (error: any) {
    console.error("Serverless handler error:", error);
    console.error("Error stack:", error.stack);
    handler = null;
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined
    });
  }
}
