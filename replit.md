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