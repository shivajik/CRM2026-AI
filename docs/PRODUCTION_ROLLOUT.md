# Production Rollout Plan

## Overview

This document outlines the safe, incremental rollout strategy for multi-workspace support in production. The feature is deployed with flag OFF, tested with pilot tenants, then gradually enabled.

## Pre-Rollout Requirements

### Prerequisites
- [ ] All staging tests passed
- [ ] Staging sign-off obtained
- [ ] Backup procedures documented
- [ ] Monitoring/alerting configured
- [ ] Rollback tested in staging

### Environment Variables
```bash
# No new required environment variables
# Feature is controlled via database flags, not env vars
```

## Phase 1: Deploy Code (Flag OFF)

### 1.1 Create Production Backup
```bash
# Automated backup script
pg_dump $PROD_DATABASE_URL | gzip > backup_prod_$(date +%Y%m%d_%H%M%S).sql.gz

# Upload to secure storage
aws s3 cp backup_prod_*.sql.gz s3://backups/crm/
```

### 1.2 Deploy Application
```bash
# Deploy with feature flag defaulting to OFF
git push production main

# Verify deployment
curl https://app.domain.com/api/health
```

### 1.3 Run Database Migrations
```bash
npm run db:push

# Verify migration success
psql $PROD_DATABASE_URL -c "SELECT COUNT(*) FROM feature_flags WHERE key = 'multi_workspace_enabled';"
# Expected: 1 row with enabled = false
```

### 1.4 Smoke Test (Existing Features)
- [ ] Login works
- [ ] Dashboard loads
- [ ] Core CRM features operational
- [ ] No errors in application logs
- [ ] No workspace UI visible

## Phase 2: Pilot Activation

### 2.1 Select Pilot Tenants
Choose 1-3 trusted tenants for initial testing:
- [ ] Tenant A: `<tenant_id_a>`
- [ ] Tenant B: `<tenant_id_b>`

### 2.2 Enable for Pilot Tenants
```bash
# Enable for each pilot tenant
curl -X POST https://app.domain.com/api/admin/tenants/TENANT_A_ID/enable-multi-workspace \
  -H "Authorization: Bearer $SAAS_ADMIN_TOKEN"
```

### 2.3 Monitor Pilot (24-72 hours)
Check for:
- [ ] Errors in application logs
- [ ] Database query performance
- [ ] API response times
- [ ] User-reported issues
- [ ] Workspace operations working

### Pilot Monitoring Queries
```sql
-- Check workspace activity
SELECT action, COUNT(*) FROM workspace_activity_logs 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY action;

-- Check for errors
SELECT * FROM workspace_activity_logs 
WHERE action LIKE '%error%'
ORDER BY created_at DESC LIMIT 100;
```

## Phase 3: Gradual Rollout

### 3.1 Enable for 10% of Tenants
```bash
# Select next batch of tenants
# Enable via admin API or direct database update
```

### 3.2 Monitor for 48 hours
- [ ] Error rate stable
- [ ] Performance metrics normal
- [ ] No user complaints

### 3.3 Enable for 50% of Tenants
```bash
# Repeat monitoring
```

### 3.4 Enable Globally (100%)
```bash
# Enable global flag
psql $PROD_DATABASE_URL -c "UPDATE feature_flags SET enabled = true WHERE key = 'multi_workspace_enabled' AND tenant_id IS NULL;"
```

## Monitoring Checklist

### Metrics to Watch
| Metric | Normal Range | Alert Threshold |
|--------|--------------|-----------------|
| API Error Rate | < 0.1% | > 1% |
| p99 Latency | < 500ms | > 2s |
| DB Query Time | < 100ms avg | > 500ms avg |
| Login Success Rate | > 99% | < 95% |

### Log Patterns to Monitor
```bash
# Check for workspace-related errors
grep -i "workspace" /var/log/app/*.log | grep -i "error"

# Check for database errors
grep -i "database\|sql" /var/log/app/*.log | grep -i "error"
```

### Alert Rules
```yaml
# Example Prometheus alert rules
- alert: WorkspaceAPIErrors
  expr: rate(http_requests_total{path=~"/api/workspaces.*", status=~"5.."}[5m]) > 0.1
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High error rate on workspace APIs"

- alert: FeatureFlagCheck
  expr: feature_flag_check_failures_total > 10
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Feature flag checks failing"
```

## Rollback Commands

### Quick Rollback (Disable Feature Only)
```bash
# Disable for all tenants
psql $PROD_DATABASE_URL -c "UPDATE feature_flags SET enabled = false WHERE key = 'multi_workspace_enabled';"

# Verify
curl -H "Authorization: Bearer $TOKEN" https://app.domain.com/api/features
# Should show: {"multi_workspace_enabled": false}
```

### Emergency Code Rollback
```bash
# Revert to previous deployment
git revert HEAD
git push production main

# OR rollback via deployment platform
# heroku rollback
# kubectl rollout undo deployment/app
```

### Database Rollback (Last Resort)
```bash
# Restore from backup
gunzip backup_prod_XXXXXXXX.sql.gz
psql $PROD_DATABASE_URL < backup_prod_XXXXXXXX.sql
```

## Post-Rollout Validation

### Day 1 Checks
- [ ] Error rates within normal range
- [ ] User activity normal
- [ ] No data inconsistencies
- [ ] Workspace operations functioning

### Week 1 Review
- [ ] Analyze workspace usage patterns
- [ ] Review any support tickets
- [ ] Performance impact assessment
- [ ] User feedback collection

## Sign-Off Checklist

| Milestone | Owner | Date | Status |
|-----------|-------|------|--------|
| Code deployed | DevOps | | |
| Migrations applied | DBA | | |
| Smoke tests passed | QA | | |
| Pilot enabled | Product | | |
| Pilot validated | Product | | |
| 50% rollout | Product | | |
| Full rollout | Product | | |
| Post-rollout review | Team | | |

## Contact Information

| Role | Contact |
|------|---------|
| On-call Engineer | |
| Database Admin | |
| Product Owner | |
