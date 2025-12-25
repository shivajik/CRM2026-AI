# Staging Deployment Checklist

## Pre-Deployment Checklist

### Code Review
- [ ] All changes reviewed and approved
- [ ] No breaking changes to existing APIs
- [ ] All new endpoints gated by feature flag
- [ ] TypeScript compilation succeeds
- [ ] Linting passes

### Database
- [ ] Migration scripts reviewed (`migrations/0001_add_multi_workspace_support.sql`)
- [ ] Rollback script verified (`migrations/0001_add_multi_workspace_support_down.sql`)
- [ ] No destructive schema changes (no DROP, no column renames)

### Tests
- [ ] All existing tests pass
- [ ] New workspace tests added
- [ ] Feature flag toggle tests included

## Deployment Steps

### Step 1: Backup Staging Database
```bash
pg_dump $DATABASE_URL > backup_staging_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Deploy Code with Feature Flag OFF
```bash
# Deploy to staging
git push staging main

# Verify feature flag is OFF
curl -H "Authorization: Bearer $TOKEN" https://staging.app/api/features
# Should return: {"multi_workspace_enabled": false}
```

### Step 3: Run Database Migrations
```bash
# Apply additive migrations
npm run db:push

# Verify tables created
psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'workspace%' OR table_name = 'feature_flags';"
```

### Step 4: Run Smoke Tests (Flag OFF)
```bash
# Run existing regression tests
npm test

# Manual checks:
# - [ ] User can register
# - [ ] User can login
# - [ ] Dashboard loads correctly
# - [ ] Contacts CRUD works
# - [ ] Quotations work
# - [ ] Invoices work
# - [ ] Tasks work
# - [ ] No workspace UI visible
```

### Step 5: Enable Feature Flag for Test Tenant
```bash
# Create test tenant or use existing
curl -X POST https://staging.app/api/admin/tenants/TEST_TENANT_ID/enable-multi-workspace \
  -H "Authorization: Bearer $SAAS_ADMIN_TOKEN"
```

### Step 6: Run Workspace Feature Tests (Flag ON)
```bash
# Manual checks with test tenant:
# - [ ] Workspace switcher appears
# - [ ] Can view workspaces
# - [ ] Can create new workspace
# - [ ] Can switch between workspaces
# - [ ] Can invite users to workspace
# - [ ] Invitation flow works
# - [ ] Workspace settings accessible
# - [ ] Activity logs recorded
```

### Step 7: Test Rollback
```bash
# Disable feature flag
curl -X POST https://staging.app/api/admin/tenants/TEST_TENANT_ID/disable-multi-workspace \
  -H "Authorization: Bearer $SAAS_ADMIN_TOKEN"

# Verify:
# - [ ] Workspace UI hidden
# - [ ] All existing features work
# - [ ] No errors in logs
```

### Step 8: Run Full Regression Suite
```bash
npm run test:e2e
```

## Post-Deployment Verification

### Functional Checks
- [ ] All APIs respond correctly
- [ ] No 500 errors in logs
- [ ] No database errors
- [ ] Performance metrics normal

### Security Checks
- [ ] Only SaaS admins can toggle feature flags
- [ ] Workspace access properly restricted
- [ ] Invitations expire correctly
- [ ] Cross-tenant data isolation maintained

## Rollback Procedure

If issues found:

### Quick Rollback (Feature Flag Only)
```bash
# Disable globally
psql $DATABASE_URL -c "UPDATE feature_flags SET enabled = false WHERE key = 'multi_workspace_enabled';"
```

### Full Rollback (Code + Database)
```bash
# 1. Rollback code
git revert HEAD
git push staging main

# 2. Rollback database (optional - tables can remain)
psql $DATABASE_URL -f migrations/0001_add_multi_workspace_support_down.sql

# 3. Restore from backup if needed
psql $DATABASE_URL < backup_staging_XXXXXXXX.sql
```

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |
| Product Owner | | | |
