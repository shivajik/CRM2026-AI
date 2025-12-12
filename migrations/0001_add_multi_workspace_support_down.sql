-- Migration ROLLBACK: Remove Multi-Workspace Support
-- Version: 0001
-- Date: 2024-12-12
-- Description: Reverses the multi-workspace migration
-- IMPORTANT: Only run this if you need to completely rollback the feature

-- =====================================================
-- DOWN MIGRATION (ROLLBACK)
-- =====================================================

-- Step 1: Drop activity logs first (depends on users and tenants)
DROP TABLE IF EXISTS "workspace_activity_logs" CASCADE;

-- Step 2: Drop invitations (depends on users and tenants)
DROP TABLE IF EXISTS "workspace_invitations" CASCADE;

-- Step 3: Drop workspace users (depends on users and tenants)
DROP TABLE IF EXISTS "workspace_users" CASCADE;

-- Step 4: Remove the multi_workspace_enabled flag (optional - keep for audit)
-- DELETE FROM "feature_flags" WHERE "key" = 'multi_workspace_enabled';

-- Step 5: Drop feature flags table if you want complete removal
-- Note: This will remove ALL feature flags, not just multi-workspace
-- Only uncomment if you want to completely remove the feature flags system
-- DROP TABLE IF EXISTS "feature_flags" CASCADE;

-- =====================================================
-- VERIFICATION QUERIES
-- Run these after rollback to verify success
-- =====================================================
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_name IN ('feature_flags', 'workspace_users', 'workspace_invitations', 'workspace_activity_logs');
-- Expected: No rows (tables should not exist)
