-- Migration: Add Workspace Modules (Billing, Branding, Roles, Analytics, Deletion, Onboarding)
-- Safe, additive-only migration - no column removals or renames
-- All new features are behind feature flags

-- Add deleted_at column to tenants for soft-delete (Module 5)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- ==================== MODULE 1: WORKSPACE BILLING SYSTEM ====================

-- Workspace Plans table
CREATE TABLE IF NOT EXISTS workspace_plans (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  monthly_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  yearly_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  max_members INTEGER NOT NULL DEFAULT 1,
  max_automations INTEGER NOT NULL DEFAULT 5,
  max_emails_per_month INTEGER NOT NULL DEFAULT 100,
  max_proposals INTEGER NOT NULL DEFAULT 10,
  max_storage_mb INTEGER NOT NULL DEFAULT 100,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Workspace Subscriptions table
CREATE TABLE IF NOT EXISTS workspace_subscriptions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id VARCHAR REFERENCES workspace_plans(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'trial',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  trial_ends_at TIMESTAMP,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancel_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Workspace Usage table
CREATE TABLE IF NOT EXISTS workspace_usage (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 0,
  automations_used INTEGER NOT NULL DEFAULT 0,
  emails_sent INTEGER NOT NULL DEFAULT 0,
  proposals_created INTEGER NOT NULL DEFAULT 0,
  storage_mb_used DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Workspace Invoices table (placeholder)
CREATE TABLE IF NOT EXISTS workspace_invoices (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  subscription_id VARCHAR REFERENCES workspace_subscriptions(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  period_start TIMESTAMP,
  period_end TIMESTAMP,
  paid_at TIMESTAMP,
  due_date TIMESTAMP,
  pdf_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Workspace Payment Methods table (placeholder)
CREATE TABLE IF NOT EXISTS workspace_payment_methods (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'card',
  last4 TEXT,
  brand TEXT,
  expiry_month INTEGER,
  expiry_year INTEGER,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==================== MODULE 2: WHITE-LABEL BRANDING SYSTEM ====================

-- Workspace Branding table
CREATE TABLE IF NOT EXISTS workspace_branding (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  logo_url TEXT,
  logo_light_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#64748b',
  accent_color TEXT DEFAULT '#f59e0b',
  email_signature TEXT,
  custom_domain TEXT,
  custom_domain_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Workspace PDF Settings table
CREATE TABLE IF NOT EXISTS workspace_pdf_settings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  header_logo_url TEXT,
  footer_text TEXT,
  show_company_address BOOLEAN NOT NULL DEFAULT true,
  show_company_phone BOOLEAN NOT NULL DEFAULT true,
  show_company_email BOOLEAN NOT NULL DEFAULT true,
  proposal_template TEXT,
  invoice_template TEXT,
  quotation_template TEXT,
  terms_and_conditions TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==================== MODULE 3: CUSTOM ROLE & PERMISSION BUILDER ====================

-- Workspace Custom Roles table
CREATE TABLE IF NOT EXISTS workspace_custom_roles (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6b7280',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Workspace Role Permissions table
CREATE TABLE IF NOT EXISTS workspace_role_permissions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id VARCHAR NOT NULL REFERENCES workspace_custom_roles(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  allowed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==================== MODULE 4: WORKSPACE ANALYTICS DASHBOARD ====================

-- Workspace Analytics Cache table
CREATE TABLE IF NOT EXISTS workspace_analytics_cache (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_date TIMESTAMP NOT NULL,
  value DECIMAL(15, 2) NOT NULL DEFAULT 0,
  metadata TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==================== MODULE 5: WORKSPACE DELETION & RESTORE ====================

-- Workspace Deletion Logs table
CREATE TABLE IF NOT EXISTS workspace_deletion_logs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  deleted_by VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  restored_by VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT,
  scheduled_purge_at TIMESTAMP,
  ip_address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==================== MODULE 6: WORKSPACE ONBOARDING WIZARD ====================

-- Workspace Onboarding Progress table
CREATE TABLE IF NOT EXISTS workspace_onboarding_progress (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  current_step INTEGER NOT NULL DEFAULT 1,
  step1_add_branding TEXT NOT NULL DEFAULT 'not_started',
  step2_add_team_members TEXT NOT NULL DEFAULT 'not_started',
  step3_add_first_client TEXT NOT NULL DEFAULT 'not_started',
  step4_create_project TEXT NOT NULL DEFAULT 'not_started',
  step5_create_proposal TEXT NOT NULL DEFAULT 'not_started',
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==================== INDEXES FOR PERFORMANCE ====================

CREATE INDEX IF NOT EXISTS idx_workspace_subscriptions_workspace ON workspace_subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_subscriptions_status ON workspace_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_workspace_usage_workspace_period ON workspace_usage(workspace_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_workspace_invoices_workspace ON workspace_invoices(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_custom_roles_workspace ON workspace_custom_roles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_role_permissions_role ON workspace_role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_workspace_analytics_workspace_type ON workspace_analytics_cache(workspace_id, metric_type, metric_date);
CREATE INDEX IF NOT EXISTS idx_workspace_deletion_logs_workspace ON workspace_deletion_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tenants_deleted_at ON tenants(deleted_at);

-- ==================== SEED DEFAULT PLANS ====================

INSERT INTO workspace_plans (name, display_name, description, monthly_price, yearly_price, max_members, max_automations, max_emails_per_month, max_proposals, max_storage_mb, features, sort_order)
VALUES
  ('free', 'Free', 'Perfect for getting started', 0, 0, 2, 3, 50, 5, 50, ARRAY['Basic CRM', 'Email integration', 'Task management'], 1),
  ('pro', 'Pro', 'For growing teams', 29, 290, 10, 25, 1000, 50, 500, ARRAY['Everything in Free', 'Custom branding', 'Advanced automations', 'Priority support', 'API access'], 2),
  ('agency', 'Agency', 'For agencies and enterprises', 99, 990, -1, -1, -1, -1, 5000, ARRAY['Everything in Pro', 'Unlimited members', 'Unlimited automations', 'White-label', 'Dedicated support', 'Custom integrations'], 3)
ON CONFLICT (name) DO NOTHING;
