# Nexus CRM

## Overview

Nexus CRM is a modular, multi-tenant Customer Relationship Management (CRM) SaaS application. It provides organizations with tools to manage contacts, track deals through a sales pipeline, and organize tasks. The application implements custom JWT-based authentication with tenant isolation, ensuring each organization's data remains separate and secure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for theming
- **Structure**: Pages in `client/src/pages/`, reusable components in `client/src/components/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with `/api` prefix for all endpoints
- **Authentication**: Custom JWT implementation with access tokens (15min) and refresh tokens (7 days)
- **Password Security**: bcrypt for password hashing
- **Middleware**: Custom auth middleware for route protection and tenant validation

### Multi-Tenancy Model
- Row-level isolation using `tenant_id` on all data tables
- JWT payload contains `userId`, `tenantId`, and `email`
- Middleware extracts tenant context from authenticated requests
- All CRUD operations filter by tenant to prevent cross-tenant data access

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Managed via `drizzle-kit push` command
- **Connection**: Uses `pg` Pool with Supabase PostgreSQL
- **CRITICAL**: Server uses `SUPABASE_DATABASE_URL` while drizzle-kit CLI defaults to `DATABASE_URL`
  - When running drizzle-kit commands, always specify: `DATABASE_URL="$SUPABASE_DIRECT_URL" npx drizzle-kit push`
  - The `SUPABASE_DIRECT_URL` bypasses pgbouncer for DDL operations

### Core Data Models
- **Tenants**: Organizations using the CRM
- **Users**: Application users belonging to a tenant
- **Roles**: Permission sets for users
- **AuthTokens**: JWT refresh token storage
- **Modules**: Available CRM features (Contacts, Deals, Tasks)
- **TenantModules**: Feature toggle per tenant
- **Contacts**: Customer/lead records
- **Deals**: Sales opportunities with pipeline stages
- **Tasks**: To-do items with status and priority

### Module System
- Master list of available modules stored in database
- Tenant-specific module enablement
- Backend blocks routes for disabled modules
- Frontend hides sidebar items based on enabled modules

## External Dependencies

### Database
- **PostgreSQL**: Primary data store via Supabase
- **Connection**: Configured through `DATABASE_URL` environment variable

### Authentication
- **jsonwebtoken**: JWT token generation and verification
- **bcrypt**: Password hashing

### Key NPM Packages
- **drizzle-orm**: Database ORM and query builder
- **express**: HTTP server framework
- **@tanstack/react-query**: Data fetching and caching
- **wouter**: Client-side routing
- **zod**: Schema validation
- **Radix UI**: Headless UI component primitives
- **recharts**: Dashboard charts and visualizations

### Development Tools
- **Vite**: Frontend build and development server
- **tsx**: TypeScript execution for server
- **drizzle-kit**: Database migration tooling

## Multi-Workspace Feature (December 2024)

### Overview
Multi-workspace support allows users to access multiple agencies/tenants from a single account. This feature is fully backward-compatible and controlled by the `multi_workspace_enabled` feature flag.

### Feature Flag Control
- **Default State**: OFF - no impact on existing users
- **Storage**: `feature_flags` table with global and per-tenant overrides
- **SaaS Admin API**: Enable/disable via `/api/admin/tenants/:id/enable-multi-workspace`

### Database Tables Added
- `feature_flags` - Feature toggle storage
- `workspace_users` - User-to-workspace membership linking
- `workspace_invitations` - Pending invitations with expiry
- `workspace_activity_logs` - Audit trail

### API Endpoints (Flag-Gated)
- `GET /api/features` - Feature flags status
- `GET /api/workspaces` - User's workspaces
- `POST /api/workspaces` - Create workspace
- `POST /api/workspaces/:id/switch` - Switch workspace (returns new JWT)
- `GET/PATCH/DELETE /api/workspaces/:id/members/*` - Member management
- `GET/POST/DELETE /api/workspaces/:id/invitations/*` - Invitation management

### JWT Token Flow
When multi-workspace is enabled:
- Login includes `activeWorkspaceId` in JWT payload
- Workspace switch returns new tokens with updated `activeWorkspaceId`
- Refresh preserves and validates `activeWorkspaceId`

### Documentation
- `docs/feature_flags.md` - How to toggle features
- `docs/STAGING_DEPLOYMENT.md` - Staging deployment checklist
- `docs/PRODUCTION_ROLLOUT.md` - Phased production rollout plan
- `docs/FINAL_REPORT.md` - Comprehensive implementation summary

### Migration Files
- `migrations/0001_add_multi_workspace_support.sql` - Up migration
- `migrations/0001_add_multi_workspace_support_down.sql` - Rollback migration
- `migrations/0002_add_workspace_modules.sql` - 6 workspace modules migration

## Workspace Management Modules (December 2024)

### Overview
Six comprehensive workspace management modules for enterprise-grade CRM functionality. All modules are feature-flagged using `multi_workspace_enabled` for safe rollout.

### Module 1: Billing & Subscription Management
**Database Tables**: `workspace_subscription_plans`, `workspace_subscriptions`, `workspace_payment_methods`, `workspace_invoices`, `workspace_usage`

**API Endpoints**:
- `GET /api/workspace/plans` - Available subscription plans
- `GET /api/workspace/:id/subscription` - Current subscription
- `GET /api/workspace/:id/usage` - Usage metrics
- `GET /api/workspace/:id/invoices` - Billing history
- `GET /api/workspace/:id/payment-methods` - Payment methods

**UI**: Billing tab in WorkspaceSettings with plan cards, usage metrics, and invoice history

### Module 2: Workspace Branding (White-Label)
**Database Tables**: `workspace_branding`, `workspace_pdf_settings`

**API Endpoints**:
- `GET/PUT /api/workspace/:id/branding` - Logo, colors, theme
- `GET/PUT /api/workspace/:id/pdf-settings` - PDF template customization

**UI**: Branding tab with color picker, logo upload, and PDF settings

### Module 3: Advanced Roles & Permissions
**Database Tables**: `workspace_custom_roles`, `workspace_role_permissions`, `workspace_resource_permissions`

**API Endpoints**:
- `GET/POST /api/workspace/:id/roles` - Custom role management
- `GET/PUT/DELETE /api/workspace/:id/roles/:roleId` - Individual role CRUD

**Features**: Granular resource-level permissions (contacts, deals, proposals, reports)

### Module 4: Workspace Analytics & Insights
**Database Tables**: `workspace_analytics`

**API Endpoints**:
- `GET /api/workspace/:id/analytics/summary` - Dashboard summary
- `GET /api/workspace/:id/analytics` - Detailed metrics with filters

**UI**: Analytics tab with revenue, proposals, leads, and team performance metrics

### Module 5: Deletion & Restore (Soft-Delete)
**Database Tables**: Uses `deleted_at` on tenants table + `workspace_deletion_logs`

**API Endpoints**:
- `DELETE /api/workspace/:id` - Soft-delete (30-day retention)
- `POST /api/workspace/:id/restore` - Restore workspace
- `GET /api/workspace/deleted` - View deleted workspaces
- `GET /api/workspace/:id/deletion-logs` - Deletion history

**Features**: 30-day recovery period before permanent deletion, audit logs

### Module 6: Onboarding Wizard
**Database Tables**: `workspace_onboarding`

**API Endpoints**:
- `GET /api/workspace/:id/onboarding` - Progress status
- `PUT /api/workspace/:id/onboarding/:step` - Update step status
- `POST /api/workspace/:id/onboarding/complete` - Mark completed
- `POST /api/workspace/:id/onboarding/dismiss` - Dismiss wizard

**UI**: OnboardingWizard component with 5-step guided setup:
1. Customize branding
2. Invite team members
3. Add first client
4. Create project
5. Send first proposal

### Component Locations
- `client/src/pages/WorkspaceSettings.tsx` - Main settings page (7 tabs including Portal)
- `client/src/components/workspace/OnboardingWizard.tsx` - Onboarding wizard
- `client/src/pages/CustomerPortal.tsx` - Client-facing portal interface

### Storage Interface
All storage methods defined in `server/storage.ts` with type-safe interfaces using Drizzle ORM

## Customer Portal Module (December 2024)

### Overview
The Customer Portal allows clients to securely access their proposals, quotations, invoices, documents, and tasks. Access is controlled through workspace-level settings and the `customer_portal_enabled` feature flag.

### Feature Flag Control
- **Flag Name**: `customer_portal_enabled`
- **Default State**: OFF - no customer portal access until enabled
- **Per-Workspace Settings**: Each workspace can customize portal visibility and permissions

### Database Tables
- `customerPortalSettings` - Per-workspace portal configuration
- `customerPortalActivityLogs` - Audit trail of customer actions
- `customerDocuments` - Documents shared with customers
- `passwordResetTokens` - Password reset token management for customers

### API Endpoints
**Portal Settings (Admin)**:
- `GET /api/workspaces/:id/portal-settings` - Get workspace portal configuration
- `PUT /api/workspaces/:id/portal-settings` - Update portal configuration

**Customer Portal (Client-Facing)**:
- `GET /api/portal/settings` - Get portal settings for customer's workspace
- `GET /api/portal/documents` - Get documents shared with customer
- `POST /api/portal/proposals/:id/accept` - Accept a proposal
- `POST /api/portal/proposals/:id/reject` - Reject a proposal
- `POST /api/portal/quotations/:id/accept` - Accept a quotation
- `POST /api/portal/quotations/:id/reject` - Reject a quotation

**Activity Logging**:
- Customer actions (login, view, accept/reject) are logged to `customerPortalActivityLogs`

### Portal Settings Configuration
Workspace admins can configure:
- **Content Visibility**: showProposals, showQuotations, showInvoices, showDocuments, showTasks
- **Permissions**: allowComments, allowFileUploads, allowOnlinePayments
- **Branding**: welcomeMessage for personalized greeting

### UI Components
- **CustomerPortal.tsx**: Tabbed interface with Proposals, Quotations, Invoices, Documents, Tasks, Profile sections
- **WorkspaceSettings.tsx**: Portal tab with toggle switches for all configuration options

### Security Model
- Customers authenticate via JWT tokens
- Portal access is blocked if `customer_portal_enabled` is off
- Content visibility respects per-workspace settings
- All customer actions are logged for audit