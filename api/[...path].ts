import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import { createApp } from "../server/app";

let handler: any = null;
let initError: Error | null = null;

function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

// Parse Vercel request body into req.body
function parseBody(req: VercelRequest): any {
  if (!req.body) return undefined;
  
  // If body is already an object, return it
  if (typeof req.body === 'object') {
    return req.body;
  }
  
  // If body is a string, try to parse as JSON
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return req.body;
    }
  }
  
  return req.body;
}

async function initHandler() {
  if (handler) return handler;
  if (initError) throw initError;
  
  try {
    console.log("Initializing serverless handler...");
    console.log("Environment check - SUPABASE_DATABASE_URL exists:", !!process.env.SUPABASE_DATABASE_URL);
    console.log("Environment check - DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("Environment check - JWT_SECRET exists:", !!process.env.JWT_SECRET);
    
    const app = await createApp();
    handler = serverless(app, {
      binary: ['application/octet-stream', 'image/*'],
    });
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
  // Ensure body is properly parsed for JSON requests
  if (req.body && typeof req.body === 'string' && req.headers['content-type']?.includes('application/json')) {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      console.error("Failed to parse request body:", e);
    }
  }
  
  setCorsHeaders(req, res);
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Debug endpoint for troubleshooting
  if (req.url === "/api/debug-handler" || req.url?.startsWith("/api/debug-handler")) {
    try {
      const startTime = Date.now();
      await initHandler();
      const duration = Date.now() - startTime;
      res.json({
        status: "handler_initialized",
        initDuration: `${duration}ms`,
        env: {
          SUPABASE_DATABASE_URL: !!process.env.SUPABASE_DATABASE_URL,
          DATABASE_URL: !!process.env.DATABASE_URL,
          JWT_SECRET: !!process.env.JWT_SECRET,
          NODE_ENV: process.env.NODE_ENV,
          VERCEL: process.env.VERCEL
        }
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        status: "init_failed",
        error: error.message,
        stack: error.stack?.split('\n').slice(0, 5)
      });
      return;
    }
  }

  // Test login endpoint to debug request body
  if (req.url === "/api/test-login" || req.url?.startsWith("/api/test-login")) {
    try {
      const { pool } = await import("../server/db");
      const body = req.body;
      
      // Test if we can read request body
      if (!body || !body.email) {
        res.json({
          status: "no_body",
          receivedBody: body,
          contentType: req.headers['content-type'],
          method: req.method
        });
        return;
      }

      // Test database query
      const client = await pool.connect();
      const result = await client.query(
        "SELECT id, email, first_name FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
        [body.email]
      );
      client.release();

      res.json({
        status: "success",
        userFound: result.rows.length > 0,
        email: body.email,
        userPreview: result.rows[0] ? { id: result.rows[0].id.substring(0, 8), email: result.rows[0].email } : null
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        status: "test_login_failed",
        error: error.message,
        code: error.code
      });
      return;
    }
  }

  // Test database connection endpoint
  if (req.url === "/api/test-db" || req.url?.startsWith("/api/test-db")) {
    try {
      const { pool } = await import("../server/db");
      const startTime = Date.now();
      const client = await pool.connect();
      const result = await client.query("SELECT NOW() as time, current_database() as db");
      client.release();
      const duration = Date.now() - startTime;
      res.json({
        status: "db_connected",
        queryDuration: `${duration}ms`,
        result: result.rows[0]
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        status: "db_failed",
        error: error.message,
        code: error.code
      });
      return;
    }
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
