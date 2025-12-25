-- Rollback Migration: Remove Workspace Modules
-- WARNING: This will drop all module data

-- Drop indexes first
DROP INDEX IF EXISTS idx_tenants_deleted_at;
DROP INDEX IF EXISTS idx_workspace_deletion_logs_workspace;
DROP INDEX IF EXISTS idx_workspace_analytics_workspace_type;
DROP INDEX IF EXISTS idx_workspace_role_permissions_role;
DROP INDEX IF EXISTS idx_workspace_custom_roles_workspace;
DROP INDEX IF EXISTS idx_workspace_invoices_workspace;
DROP INDEX IF EXISTS idx_workspace_usage_workspace_period;
DROP INDEX IF EXISTS idx_workspace_subscriptions_status;
DROP INDEX IF EXISTS idx_workspace_subscriptions_workspace;

-- Drop Module 6 tables
DROP TABLE IF EXISTS workspace_onboarding_progress;

-- Drop Module 5 tables
DROP TABLE IF EXISTS workspace_deletion_logs;

-- Drop Module 4 tables
DROP TABLE IF EXISTS workspace_analytics_cache;

-- Drop Module 3 tables
DROP TABLE IF EXISTS workspace_role_permissions;
DROP TABLE IF EXISTS workspace_custom_roles;

-- Drop Module 2 tables
DROP TABLE IF EXISTS workspace_pdf_settings;
DROP TABLE IF EXISTS workspace_branding;

-- Drop Module 1 tables
DROP TABLE IF EXISTS workspace_payment_methods;
DROP TABLE IF EXISTS workspace_invoices;
DROP TABLE IF EXISTS workspace_usage;
DROP TABLE IF EXISTS workspace_subscriptions;
DROP TABLE IF EXISTS workspace_plans;

-- Remove deleted_at column from tenants
ALTER TABLE tenants DROP COLUMN IF EXISTS deleted_at;
