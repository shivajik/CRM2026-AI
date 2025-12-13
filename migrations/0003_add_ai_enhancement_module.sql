-- AI Enhancement Module Migration
-- Adds AI settings, usage tracking, logs, and content versioning

-- AI Settings - workspace-level AI configuration
CREATE TABLE IF NOT EXISTS ai_settings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
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

-- AI Usage - track AI usage per request
CREATE TABLE IF NOT EXISTS ai_usage (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- AI Logs - detailed logs of AI interactions
CREATE TABLE IF NOT EXISTS ai_logs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- AI Content Versions - store AI content history
CREATE TABLE IF NOT EXISTS ai_content_versions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  module TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id VARCHAR NOT NULL,
  field_name TEXT NOT NULL,
  original_content TEXT,
  generated_content TEXT NOT NULL,
  action TEXT NOT NULL,
  is_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_tenant ON ai_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_logs_tenant ON ai_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON ai_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_content_versions_resource ON ai_content_versions(resource_type, resource_id);

-- Insert default ai_enhancement_enabled feature flag (disabled by default)
INSERT INTO feature_flags (key, tenant_id, enabled, description, created_at, updated_at)
VALUES ('ai_enhancement_enabled', NULL, false, 'Enables AI enhancement features across all modules', NOW(), NOW())
ON CONFLICT DO NOTHING;
