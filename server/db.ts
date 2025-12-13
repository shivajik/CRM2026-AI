import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE CONNECTION ERROR: No database URL configured");
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('SUPABASE') || k.includes('PG')));
}

const FALLBACK_CONNECTION = "postgresql://localhost:5432/fallback";

declare global {
  var _pgPool: pg.Pool | undefined;
}

function getPool(): pg.Pool {
  if (globalThis._pgPool) {
    return globalThis._pgPool;
  }

  console.log("[DB] Creating new database pool...");
  
  const isProduction = process.env.NODE_ENV === 'production';
  const hasSupabaseUrl = !!process.env.SUPABASE_DATABASE_URL;
  
  const pool = new Pool({
    connectionString: connectionString || FALLBACK_CONNECTION,
    ssl: (isProduction || hasSupabaseUrl) ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    allowExitOnIdle: true,
  });

  pool.on('error', (err) => {
    console.error('[DB] Pool error:', err.message);
  });

  pool.on('connect', () => {
    console.log('[DB] New client connected to pool');
  });

  globalThis._pgPool = pool;
  return pool;
}

export const pool = getPool();
export const db = drizzle(pool, { schema });

export async function initializeAITables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_settings (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        tenant_id VARCHAR NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
        ai_enabled BOOLEAN NOT NULL DEFAULT true,
        email_ai_enabled BOOLEAN NOT NULL DEFAULT true,
        task_ai_enabled BOOLEAN NOT NULL DEFAULT true,
        proposal_ai_enabled BOOLEAN NOT NULL DEFAULT true,
        client_ai_enabled BOOLEAN NOT NULL DEFAULT true,
        report_ai_enabled BOOLEAN NOT NULL DEFAULT true,
        monthly_token_limit INTEGER NOT NULL DEFAULT 100000,
        tokens_used_this_month INTEGER NOT NULL DEFAULT 0,
        token_reset_date TIMESTAMP NOT NULL DEFAULT NOW(),
        preferred_model TEXT DEFAULT 'gpt-4o-mini',
        custom_instructions TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_usage (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        tenant_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
        module TEXT NOT NULL,
        action TEXT NOT NULL,
        tokens_used INTEGER NOT NULL DEFAULT 0,
        input_tokens INTEGER DEFAULT 0,
        output_tokens INTEGER DEFAULT 0,
        model TEXT DEFAULT 'gpt-4o-mini',
        success BOOLEAN NOT NULL DEFAULT true,
        latency_ms INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_logs (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        tenant_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
        module TEXT NOT NULL,
        action TEXT NOT NULL,
        input_content TEXT,
        output_content TEXT,
        context_data TEXT,
        resource_type TEXT,
        resource_id VARCHAR,
        feedback_rating INTEGER,
        feedback_comment TEXT,
        error_message TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_content_versions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        tenant_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
        module TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id VARCHAR NOT NULL,
        original_content TEXT,
        generated_content TEXT NOT NULL,
        action TEXT NOT NULL,
        version_number INTEGER NOT NULL DEFAULT 1,
        is_applied BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log("[DB] AI tables initialized successfully");
  } catch (error) {
    console.error("[DB] Error initializing AI tables:", error);
  } finally {
    client.release();
  }
}
