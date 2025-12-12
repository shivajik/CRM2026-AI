-- Migration: Add Multi-Workspace Support
-- Version: 0001
-- Date: 2024-12-12
-- Description: Adds feature flags, workspace_users, workspace_invitations, and workspace_activity_logs tables
-- IMPORTANT: This migration is ADDITIVE ONLY - no existing tables or columns are modified

-- =====================================================
-- UP MIGRATION
-- =====================================================

-- Feature Flags table - global and per-tenant feature toggles
CREATE TABLE IF NOT EXISTS "feature_flags" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text NOT NULL,
  "tenant_id" varchar REFERENCES "tenants"("id") ON DELETE CASCADE,
  "enabled" boolean NOT NULL DEFAULT false,
  "description" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Create index for efficient flag lookups
CREATE INDEX IF NOT EXISTS "idx_feature_flags_key" ON "feature_flags"("key");
CREATE INDEX IF NOT EXISTS "idx_feature_flags_tenant_key" ON "feature_flags"("tenant_id", "key");

-- Insert default global feature flag for multi-workspace (DISABLED by default)
INSERT INTO "feature_flags" ("key", "tenant_id", "enabled", "description")
VALUES ('multi_workspace_enabled', NULL, false, 'Enables multi-workspace support allowing users to access multiple agencies/tenants')
ON CONFLICT DO NOTHING;

-- Workspace Users - links users to workspaces (tenants) they can access
CREATE TABLE IF NOT EXISTS "workspace_users" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "workspace_id" varchar NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
  "role" text NOT NULL DEFAULT 'member',
  "is_primary" boolean NOT NULL DEFAULT false,
  "invited_by" varchar REFERENCES "users"("id") ON DELETE SET NULL,
  "joined_at" timestamp NOT NULL DEFAULT now(),
  "last_accessed_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create indexes for efficient workspace lookups
CREATE INDEX IF NOT EXISTS "idx_workspace_users_user" ON "workspace_users"("user_id");
CREATE INDEX IF NOT EXISTS "idx_workspace_users_workspace" ON "workspace_users"("workspace_id");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_workspace_users_unique" ON "workspace_users"("user_id", "workspace_id");

-- Workspace Invitations - pending invitations to join a workspace
CREATE TABLE IF NOT EXISTS "workspace_invitations" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" varchar NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
  "email" text NOT NULL,
  "role" text NOT NULL DEFAULT 'member',
  "token" text NOT NULL UNIQUE,
  "invited_by" varchar NOT NULL REFERENCES "users"("id") ON DELETE SET NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "expires_at" timestamp NOT NULL,
  "accepted_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create indexes for invitation lookups
CREATE INDEX IF NOT EXISTS "idx_workspace_invitations_email" ON "workspace_invitations"("email");
CREATE INDEX IF NOT EXISTS "idx_workspace_invitations_token" ON "workspace_invitations"("token");
CREATE INDEX IF NOT EXISTS "idx_workspace_invitations_workspace" ON "workspace_invitations"("workspace_id");
CREATE INDEX IF NOT EXISTS "idx_workspace_invitations_status" ON "workspace_invitations"("status");

-- Workspace Activity Logs - audit trail for workspace events
CREATE TABLE IF NOT EXISTS "workspace_activity_logs" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "workspace_id" varchar NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
  "user_id" varchar REFERENCES "users"("id") ON DELETE SET NULL,
  "action" text NOT NULL,
  "details" text,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create index for activity log queries
CREATE INDEX IF NOT EXISTS "idx_workspace_activity_workspace" ON "workspace_activity_logs"("workspace_id");
CREATE INDEX IF NOT EXISTS "idx_workspace_activity_user" ON "workspace_activity_logs"("user_id");
CREATE INDEX IF NOT EXISTS "idx_workspace_activity_action" ON "workspace_activity_logs"("action");

-- =====================================================
-- VERIFICATION QUERIES
-- Run these after migration to verify success
-- =====================================================
-- SELECT COUNT(*) FROM feature_flags WHERE key = 'multi_workspace_enabled';
-- SELECT table_name FROM information_schema.tables WHERE table_name IN ('feature_flags', 'workspace_users', 'workspace_invitations', 'workspace_activity_logs');

-- =====================================================
-- BACKFILL QUERY (to be run ONLY when enabling multi-workspace for existing users)
-- This links existing users to their current tenant as primary workspace
-- ONLY run this when multi_workspace_enabled flag is being turned ON
-- =====================================================
-- INSERT INTO workspace_users (user_id, workspace_id, role, is_primary)
-- SELECT id, tenant_id, 
--   CASE 
--     WHEN is_admin = true THEN 'owner'
--     WHEN user_type = 'agency_admin' THEN 'admin'
--     ELSE 'member'
--   END,
--   true
-- FROM users
-- WHERE tenant_id IS NOT NULL
-- ON CONFLICT (user_id, workspace_id) DO NOTHING;
