import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  
  if (_req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || "not set",
      SUPABASE_DATABASE_URL: !!process.env.SUPABASE_DATABASE_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
    },
    message: "Vercel function is running"
  });
}
