# Feature Flags Documentation

## Overview

This document describes the feature flag system used to control multi-workspace functionality in the CRM application. All new multi-workspace behaviors are gated behind feature flags to ensure safe, non-breaking rollout.

## Feature Flags

### `multi_workspace_enabled`

**Description:** Enables multi-workspace support allowing users to access multiple agencies/tenants from a single account.

**Default State:** `OFF` (disabled)

**Scope:** Can be set globally or per-tenant

| Level | Description | Priority |
|-------|-------------|----------|
| Global | Applies to all tenants unless overridden | Lower |
| Per-Tenant | Overrides global setting for specific tenant | Higher |

## How to Toggle Feature Flags

### Via Environment Variable (Global)

Set `MULTI_WORKSPACE_ENABLED=true` in environment variables for global default.

### Via SaaS Admin API

**Enable for specific tenant:**
```bash
POST /api/admin/tenants/:tenantId/enable-multi-workspace
Authorization: Bearer <saas_admin_token>
```

**Disable for specific tenant:**
```bash
POST /api/admin/tenants/:tenantId/disable-multi-workspace
Authorization: Bearer <saas_admin_token>
```

**Set any feature flag:**
```bash
POST /api/admin/feature-flags
Authorization: Bearer <saas_admin_token>
Content-Type: application/json

{
  "key": "multi_workspace_enabled",
  "enabled": true,
  "tenantId": "optional-tenant-id",
  "description": "Optional description"
}
```

### Via Database (Direct)

```sql
-- Enable globally
UPDATE feature_flags SET enabled = true WHERE key = 'multi_workspace_enabled' AND tenant_id IS NULL;

-- Enable for specific tenant
INSERT INTO feature_flags (key, tenant_id, enabled, description)
VALUES ('multi_workspace_enabled', 'tenant-uuid', true, 'Enabled for pilot')
ON CONFLICT (key, tenant_id) DO UPDATE SET enabled = true;
```

## Checking Feature Flag Status

### Frontend

```typescript
// Fetch feature flags for current user
const response = await fetch('/api/features', {
  headers: { Authorization: `Bearer ${token}` }
});
const features = await response.json();

if (features.multi_workspace_enabled) {
  // Show workspace switcher UI
}
```

### Backend

```typescript
// In route handlers or middleware
const isEnabled = await storage.getFeatureFlag('multi_workspace_enabled', req.user.tenantId);

if (isEnabled) {
  // Execute multi-workspace logic
} else {
  // Use existing single-tenant behavior
}
```

## Behavior When Flag is OFF

When `multi_workspace_enabled` is OFF:

1. **UI:** Workspace switcher is hidden
2. **API:** 
   - `/api/workspaces/*` endpoints return 403 with code `MULTI_WORKSPACE_DISABLED`
   - All data operations use existing `tenantId` from JWT
3. **Data:** No changes to data isolation; users see only their tenant's data
4. **Authentication:** JWT contains only `tenantId`, no `activeWorkspaceId`

## Behavior When Flag is ON

When `multi_workspace_enabled` is ON:

1. **UI:** Workspace switcher appears in header
2. **API:**
   - All workspace endpoints become available
   - Workspace context resolved from `X-Workspace-Id` header or query param
3. **Data:** Users can access data from all workspaces they're members of
4. **Authentication:** JWT may include `activeWorkspaceId`

## Rollback Procedure

To quickly disable multi-workspace:

1. Set feature flag to OFF:
   ```sql
   UPDATE feature_flags SET enabled = false WHERE key = 'multi_workspace_enabled';
   ```

2. Clear any tenant-specific overrides:
   ```sql
   DELETE FROM feature_flags WHERE key = 'multi_workspace_enabled' AND tenant_id IS NOT NULL;
   ```

3. Restart application servers to clear any cached state.

No data migration or code changes required - the system falls back to single-tenant behavior immediately.

## Testing Feature Flags

1. **Unit Tests:** Test flag checking logic returns correct values
2. **Integration Tests:** Verify endpoints behave correctly when flag ON vs OFF
3. **E2E Tests:** Full user flows with flag toggled

## Security Considerations

- Only SaaS admins can modify feature flags
- Feature flag API endpoints require `saas_admin` user type
- Flag changes are logged in workspace activity logs
