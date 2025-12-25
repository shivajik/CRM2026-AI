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
  // CRITICAL FIX: Vercel pre-parses JSON body into req.body (object)
  // Express body parser middleware is smart enough to handle this,
  // but we need to ensure it's available to the handler
  
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

  // Handle login directly for Vercel to ensure body is properly parsed
  if ((req.url === "/api/auth/login" || req.url?.startsWith("/api/auth/login")) && req.method === "POST") {
    try {
      const body = req.body || {};
      const email = body.email || (typeof body === 'string' ? JSON.parse(body).email : undefined);
      const password = body.password || (typeof body === 'string' ? JSON.parse(body).password : undefined);
      
      console.log("[Vercel Auth] Login attempt for:", email);
      
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }
      
      // Use the serverless handler for full auth flow
      const h = await initHandler();
      return await h(req, res);
    } catch (error: any) {
      console.error("[Vercel Auth] Login error:", error.message);
      res.status(500).json({ message: "Login failed: " + error.message });
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
    
    // CRITICAL FIX: Vercel pre-parses JSON body into req.body (object)
    // serverless-http doesn't expect this and Express body parser won't re-parse it
    // We need to preserve the already-parsed body so Express middleware can access it
    const preRequestBody = req.body;
    
    const result = await h(req, res);
    
    // If body was lost during handler processing, restore it
    if (!req.body && preRequestBody && typeof preRequestBody === 'object') {
      req.body = preRequestBody;
    }
    
    return result;
  } catch (error: any) {
    console.error("Request handler error:", error.message);
    res.status(500).json({ 
      message: "Server initialization failed",
      error: error.message,
      hint: "Check Vercel function logs for more details"
    });
  }
}
