import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import { createApp } from "../server/app";

let handler: any = null;

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).end();
    return;
  }

  try {
    if (!handler) {
      console.log("Initializing serverless handler...");
      const app = await createApp();
      handler = serverless(app);
      console.log("Serverless handler initialized successfully");
    }
    return await handler(req, res);
  } catch (error: any) {
    console.error("Serverless handler error:", error);
    handler = null;
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV !== "production" ? error.message : undefined
    });
  }
}
