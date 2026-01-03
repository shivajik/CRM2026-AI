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
      binary: ['image/*', 'application/pdf', 'application/zip'],
      requestId: 'x-vercel-id'
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
      
      let dbStatus = "unknown";
      try {
        const { pool } = await import("../server/db");
        const client = await pool.connect();
        await client.query("SELECT 1");
        client.release();
        dbStatus = "connected";
      } catch (e: any) {
        dbStatus = `failed: ${e.message}`;
      }

      res.json({
        status: "handler_initialized",
        initDuration: `${duration}ms`,
        database: dbStatus,
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
      
      console.log("Test login body:", JSON.stringify(body));
      console.log("Test login email:", body?.email);

      // Test database query
      const client = await pool.connect();
      try {
        const result = await client.query(
          "SELECT id, email, first_name, is_active FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
          [body?.email || '']
        );

        res.json({
          status: "success",
          userFound: result.rows.length > 0,
          emailReceived: body?.email,
          userPreview: result.rows[0] ? { 
            id: result.rows[0].id.substring(0, 8), 
            email: result.rows[0].email,
            isActive: result.rows[0].is_active 
          } : null,
          bodyType: typeof body,
          hasBody: !!body
        });
      } finally {
        client.release();
      }
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
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("DB Connection Timeout (5s)")), 5000)
      );
      
      const dbPromise = (async () => {
        const client = await pool.connect();
        try {
          const result = await client.query("SELECT NOW() as time, current_database() as db");
          return result;
        } finally {
          client.release();
        }
      })();

      const result = await Promise.race([dbPromise, timeoutPromise]) as any;
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

  // Debug inserts to validate write operations (login attempts + auth tokens)
  if (req.url === "/api/debug-inserts" || req.url?.startsWith("/api/debug-inserts")) {
    try {
      const { pool } = await import("../server/db");
      const start = Date.now();
      const client = await pool.connect();
      try {
        const email = (req.body as any)?.email || "superadmin@nexuscrm.com";
        // Insert login attempt
        const ins1 = await client.query(
          "insert into login_attempts (email, success, failure_reason) values ($1, true, null) returning id, created_at",
          [email]
        );
        // Find user id
        const u = await client.query(
          "select id from users where lower(email)=lower($1) limit 1",
          [email]
        );
        const userId = u.rows[0]?.id;
        let tokenId: string | null = null;
        if (userId) {
          const ins2 = await client.query(
            "insert into auth_tokens (user_id, refresh_token, expires_at) values ($1, $2, NOW() + interval '7 days') returning id",
            [userId, `debug-${Date.now()}`]
          );
          tokenId = ins2.rows[0]?.id || null;
        }
        const duration = Date.now() - start;
        res.json({
          status: "writes_ok",
          ms: duration,
          loginAttemptId: ins1.rows[0]?.id || null,
          tokenInserted: !!tokenId,
        });
      } finally {
        client.release();
      }
      return;
    } catch (error: any) {
      res.status(500).json({
        status: "writes_failed",
        error: error.message,
        code: error.code,
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
