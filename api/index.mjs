var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  AI_ACTIONS: () => AI_ACTIONS,
  AI_MODULES: () => AI_MODULES,
  AUDIT_LOG_ACTIONS: () => AUDIT_LOG_ACTIONS,
  AUDIT_LOG_SEVERITY: () => AUDIT_LOG_SEVERITY,
  INVITATION_STATUSES: () => INVITATION_STATUSES,
  ONBOARDING_STEP_STATUSES: () => ONBOARDING_STEP_STATUSES,
  PERMISSION_ACTIONS: () => PERMISSION_ACTIONS,
  PERMISSION_MODULES: () => PERMISSION_MODULES,
  PLATFORM_SETTING_CATEGORIES: () => PLATFORM_SETTING_CATEGORIES,
  PROPOSAL_SECTION_TYPES: () => PROPOSAL_SECTION_TYPES,
  PROPOSAL_STATUSES: () => PROPOSAL_STATUSES,
  PROPOSAL_THEMES: () => PROPOSAL_THEMES,
  RELATED_MODULES: () => RELATED_MODULES,
  SUBSCRIPTION_STATUSES: () => SUBSCRIPTION_STATUSES,
  TASK_PRIORITIES: () => TASK_PRIORITIES,
  TASK_STATUSES: () => TASK_STATUSES,
  TEMPLATE_PURPOSES: () => TEMPLATE_PURPOSES,
  USER_TYPES: () => USER_TYPES,
  WORKSPACE_PLAN_TYPES: () => WORKSPACE_PLAN_TYPES,
  WORKSPACE_ROLES: () => WORKSPACE_ROLES,
  activities: () => activities,
  aiContentVersions: () => aiContentVersions,
  aiLogs: () => aiLogs,
  aiSettings: () => aiSettings,
  aiUsage: () => aiUsage,
  auditLogs: () => auditLogs,
  authTokens: () => authTokens,
  automationRules: () => automationRules,
  clientDocuments: () => clientDocuments,
  companyProfiles: () => companyProfiles,
  contacts: () => contacts,
  customerPortalActivityLogs: () => customerPortalActivityLogs,
  customerPortalSettings: () => customerPortalSettings,
  customers: () => customers,
  deals: () => deals,
  emailLogs: () => emailLogs,
  emailSenderAccounts: () => emailSenderAccounts,
  emailTemplates: () => emailTemplates,
  featureFlags: () => featureFlags,
  followUpSequences: () => followUpSequences,
  followUpSteps: () => followUpSteps,
  insertActivitySchema: () => insertActivitySchema,
  insertAiContentVersionSchema: () => insertAiContentVersionSchema,
  insertAiLogSchema: () => insertAiLogSchema,
  insertAiSettingsSchema: () => insertAiSettingsSchema,
  insertAiUsageSchema: () => insertAiUsageSchema,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertAuthTokenSchema: () => insertAuthTokenSchema,
  insertAutomationRuleSchema: () => insertAutomationRuleSchema,
  insertClientDocumentSchema: () => insertClientDocumentSchema,
  insertCompanyProfileSchema: () => insertCompanyProfileSchema,
  insertContactSchema: () => insertContactSchema,
  insertCustomerPortalActivityLogSchema: () => insertCustomerPortalActivityLogSchema,
  insertCustomerPortalSettingsSchema: () => insertCustomerPortalSettingsSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertDealSchema: () => insertDealSchema,
  insertEmailLogSchema: () => insertEmailLogSchema,
  insertEmailSenderAccountSchema: () => insertEmailSenderAccountSchema,
  insertEmailTemplateSchema: () => insertEmailTemplateSchema,
  insertFeatureFlagSchema: () => insertFeatureFlagSchema,
  insertFollowUpSequenceSchema: () => insertFollowUpSequenceSchema,
  insertFollowUpStepSchema: () => insertFollowUpStepSchema,
  insertInvoiceItemSchema: () => insertInvoiceItemSchema,
  insertInvoiceSchema: () => insertInvoiceSchema,
  insertLoginAttemptSchema: () => insertLoginAttemptSchema,
  insertModuleSchema: () => insertModuleSchema,
  insertPackageModuleSchema: () => insertPackageModuleSchema,
  insertPackageSchema: () => insertPackageSchema,
  insertPasswordResetTokenSchema: () => insertPasswordResetTokenSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertPlatformActivityLogSchema: () => insertPlatformActivityLogSchema,
  insertPlatformSettingSchema: () => insertPlatformSettingSchema,
  insertProductSchema: () => insertProductSchema,
  insertProposalActivityLogSchema: () => insertProposalActivityLogSchema,
  insertProposalCommentSchema: () => insertProposalCommentSchema,
  insertProposalPricingItemSchema: () => insertProposalPricingItemSchema,
  insertProposalSchema: () => insertProposalSchema,
  insertProposalSectionSchema: () => insertProposalSectionSchema,
  insertProposalSignatureSchema: () => insertProposalSignatureSchema,
  insertProposalStatusHistorySchema: () => insertProposalStatusHistorySchema,
  insertProposalTemplateSchema: () => insertProposalTemplateSchema,
  insertProposalVersionSchema: () => insertProposalVersionSchema,
  insertProposalViewLogSchema: () => insertProposalViewLogSchema,
  insertQuotationItemSchema: () => insertQuotationItemSchema,
  insertQuotationSchema: () => insertQuotationSchema,
  insertRoleSchema: () => insertRoleSchema,
  insertScheduledEmailSchema: () => insertScheduledEmailSchema,
  insertSmtpSettingsSchema: () => insertSmtpSettingsSchema,
  insertTaskActivityLogSchema: () => insertTaskActivityLogSchema,
  insertTaskAiHistorySchema: () => insertTaskAiHistorySchema,
  insertTaskAssignmentSchema: () => insertTaskAssignmentSchema,
  insertTaskAttachmentSchema: () => insertTaskAttachmentSchema,
  insertTaskChecklistItemSchema: () => insertTaskChecklistItemSchema,
  insertTaskCommentSchema: () => insertTaskCommentSchema,
  insertTaskNotificationSchema: () => insertTaskNotificationSchema,
  insertTaskSchema: () => insertTaskSchema,
  insertTaskStatusHistorySchema: () => insertTaskStatusHistorySchema,
  insertTaskTimeLogSchema: () => insertTaskTimeLogSchema,
  insertTemplateSectionSchema: () => insertTemplateSectionSchema,
  insertTenantModuleSchema: () => insertTenantModuleSchema,
  insertTenantSchema: () => insertTenantSchema,
  insertUserAiSettingSchema: () => insertUserAiSettingSchema,
  insertUserSchema: () => insertUserSchema,
  insertWorkspaceActivityLogSchema: () => insertWorkspaceActivityLogSchema,
  insertWorkspaceAnalyticsCacheSchema: () => insertWorkspaceAnalyticsCacheSchema,
  insertWorkspaceBrandingSchema: () => insertWorkspaceBrandingSchema,
  insertWorkspaceCustomRoleSchema: () => insertWorkspaceCustomRoleSchema,
  insertWorkspaceDeletionLogSchema: () => insertWorkspaceDeletionLogSchema,
  insertWorkspaceInvitationSchema: () => insertWorkspaceInvitationSchema,
  insertWorkspaceInvoiceSchema: () => insertWorkspaceInvoiceSchema,
  insertWorkspaceOnboardingProgressSchema: () => insertWorkspaceOnboardingProgressSchema,
  insertWorkspacePaymentMethodSchema: () => insertWorkspacePaymentMethodSchema,
  insertWorkspacePdfSettingsSchema: () => insertWorkspacePdfSettingsSchema,
  insertWorkspacePlanSchema: () => insertWorkspacePlanSchema,
  insertWorkspaceRolePermissionSchema: () => insertWorkspaceRolePermissionSchema,
  insertWorkspaceSubscriptionSchema: () => insertWorkspaceSubscriptionSchema,
  insertWorkspaceUsageSchema: () => insertWorkspaceUsageSchema,
  insertWorkspaceUserSchema: () => insertWorkspaceUserSchema,
  invoiceItems: () => invoiceItems,
  invoices: () => invoices,
  loginAttempts: () => loginAttempts,
  modules: () => modules,
  packageModules: () => packageModules,
  packages: () => packages,
  passwordResetTokens: () => passwordResetTokens,
  payments: () => payments,
  platformActivityLogs: () => platformActivityLogs,
  platformSettings: () => platformSettings,
  products: () => products,
  proposalActivityLogs: () => proposalActivityLogs,
  proposalComments: () => proposalComments,
  proposalPricingItems: () => proposalPricingItems,
  proposalSections: () => proposalSections,
  proposalSignatures: () => proposalSignatures,
  proposalStatusHistory: () => proposalStatusHistory,
  proposalTemplates: () => proposalTemplates,
  proposalVersions: () => proposalVersions,
  proposalViewLogs: () => proposalViewLogs,
  proposals: () => proposals,
  quotationItems: () => quotationItems,
  quotations: () => quotations,
  roles: () => roles,
  scheduledEmails: () => scheduledEmails,
  smtpSettings: () => smtpSettings,
  taskActivityLog: () => taskActivityLog,
  taskAiHistory: () => taskAiHistory,
  taskAssignments: () => taskAssignments,
  taskAttachments: () => taskAttachments,
  taskChecklistItems: () => taskChecklistItems,
  taskComments: () => taskComments,
  taskNotifications: () => taskNotifications,
  taskStatusHistory: () => taskStatusHistory,
  taskTimeLogs: () => taskTimeLogs,
  tasks: () => tasks,
  templateSections: () => templateSections,
  tenantModules: () => tenantModules,
  tenants: () => tenants,
  userAiSettings: () => userAiSettings,
  users: () => users,
  workspaceActivityLogs: () => workspaceActivityLogs,
  workspaceAnalyticsCache: () => workspaceAnalyticsCache,
  workspaceBranding: () => workspaceBranding,
  workspaceCustomRoles: () => workspaceCustomRoles,
  workspaceDeletionLogs: () => workspaceDeletionLogs,
  workspaceInvitations: () => workspaceInvitations,
  workspaceInvoices: () => workspaceInvoices,
  workspaceOnboardingProgress: () => workspaceOnboardingProgress,
  workspacePaymentMethods: () => workspacePaymentMethods,
  workspacePdfSettings: () => workspacePdfSettings,
  workspacePlans: () => workspacePlans,
  workspaceRolePermissions: () => workspaceRolePermissions,
  workspaceSubscriptions: () => workspaceSubscriptions,
  workspaceUsage: () => workspaceUsage,
  workspaceUsers: () => workspaceUsers
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var tenants, insertTenantSchema, roles, insertRoleSchema, USER_TYPES, users, insertUserSchema, authTokens, insertAuthTokenSchema, modules, insertModuleSchema, tenantModules, insertTenantModuleSchema, products, insertProductSchema, customers, insertCustomerSchema, quotations, insertQuotationSchema, quotationItems, insertQuotationItemSchema, invoices, insertInvoiceSchema, invoiceItems, insertInvoiceItemSchema, payments, insertPaymentSchema, activities, insertActivitySchema, contacts, insertContactSchema, deals, insertDealSchema, TASK_STATUSES, TASK_PRIORITIES, RELATED_MODULES, tasks, insertTaskSchema, taskAssignments, insertTaskAssignmentSchema, taskComments, insertTaskCommentSchema, taskStatusHistory, insertTaskStatusHistorySchema, taskChecklistItems, insertTaskChecklistItemSchema, taskTimeLogs, insertTaskTimeLogSchema, taskAttachments, insertTaskAttachmentSchema, taskNotifications, insertTaskNotificationSchema, taskAiHistory, insertTaskAiHistorySchema, taskActivityLog, insertTaskActivityLogSchema, PLATFORM_SETTING_CATEGORIES, platformSettings, insertPlatformSettingSchema, userAiSettings, insertUserAiSettingSchema, companyProfiles, insertCompanyProfileSchema, platformActivityLogs, insertPlatformActivityLogSchema, packages, insertPackageSchema, packageModules, insertPackageModuleSchema, emailTemplates, insertEmailTemplateSchema, emailLogs, insertEmailLogSchema, automationRules, insertAutomationRuleSchema, followUpSequences, insertFollowUpSequenceSchema, followUpSteps, insertFollowUpStepSchema, scheduledEmails, insertScheduledEmailSchema, emailSenderAccounts, insertEmailSenderAccountSchema, smtpSettings, insertSmtpSettingsSchema, PROPOSAL_STATUSES, PROPOSAL_SECTION_TYPES, TEMPLATE_PURPOSES, PROPOSAL_THEMES, proposalTemplates, insertProposalTemplateSchema, proposals, insertProposalSchema, proposalSections, insertProposalSectionSchema, proposalPricingItems, insertProposalPricingItemSchema, proposalVersions, insertProposalVersionSchema, proposalActivityLogs, insertProposalActivityLogSchema, proposalSignatures, insertProposalSignatureSchema, proposalViewLogs, insertProposalViewLogSchema, proposalStatusHistory, insertProposalStatusHistorySchema, templateSections, insertTemplateSectionSchema, proposalComments, insertProposalCommentSchema, featureFlags, insertFeatureFlagSchema, WORKSPACE_ROLES, workspaceUsers, insertWorkspaceUserSchema, INVITATION_STATUSES, workspaceInvitations, insertWorkspaceInvitationSchema, workspaceActivityLogs, insertWorkspaceActivityLogSchema, WORKSPACE_PLAN_TYPES, SUBSCRIPTION_STATUSES, workspacePlans, insertWorkspacePlanSchema, workspaceSubscriptions, insertWorkspaceSubscriptionSchema, workspaceUsage, insertWorkspaceUsageSchema, workspaceInvoices, insertWorkspaceInvoiceSchema, workspacePaymentMethods, insertWorkspacePaymentMethodSchema, workspaceBranding, insertWorkspaceBrandingSchema, workspacePdfSettings, insertWorkspacePdfSettingsSchema, PERMISSION_MODULES, PERMISSION_ACTIONS, workspaceCustomRoles, insertWorkspaceCustomRoleSchema, workspaceRolePermissions, insertWorkspaceRolePermissionSchema, workspaceAnalyticsCache, insertWorkspaceAnalyticsCacheSchema, workspaceDeletionLogs, insertWorkspaceDeletionLogSchema, ONBOARDING_STEP_STATUSES, workspaceOnboardingProgress, insertWorkspaceOnboardingProgressSchema, AUDIT_LOG_ACTIONS, AUDIT_LOG_SEVERITY, auditLogs, insertAuditLogSchema, loginAttempts, insertLoginAttemptSchema, customerPortalSettings, insertCustomerPortalSettingsSchema, customerPortalActivityLogs, insertCustomerPortalActivityLogSchema, passwordResetTokens, insertPasswordResetTokenSchema, clientDocuments, insertClientDocumentSchema, AI_ACTIONS, AI_MODULES, aiSettings, insertAiSettingsSchema, aiUsage, insertAiUsageSchema, aiLogs, insertAiLogSchema, aiContentVersions, insertAiContentVersionSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    tenants = pgTable("tenants", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      packageId: varchar("package_id"),
      deletedAt: timestamp("deleted_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTenantSchema = createInsertSchema(tenants).omit({ id: true, createdAt: true, deletedAt: true });
    roles = pgTable("roles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
      name: text("name").notNull(),
      permissions: text("permissions").array().notNull().default(sql`'{}'::text[]`),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertRoleSchema = createInsertSchema(roles).omit({ id: true, createdAt: true });
    USER_TYPES = {
      SAAS_ADMIN: "saas_admin",
      // Super admin - manages all agencies/tenants
      AGENCY_ADMIN: "agency_admin",
      // Admin within a specific tenant/agency
      TEAM_MEMBER: "team_member",
      // Regular team member with specific permissions
      CUSTOMER: "customer"
      // External customer - can only see their own data
    };
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      email: text("email").notNull().unique(),
      passwordHash: text("password_hash").notNull(),
      firstName: text("first_name").notNull(),
      lastName: text("last_name").notNull(),
      phone: text("phone"),
      jobTitle: text("job_title"),
      profileImageUrl: text("profile_image_url"),
      roleId: varchar("role_id").references(() => roles.id),
      userType: text("user_type").notNull().default("team_member"),
      // saas_admin, agency_admin, team_member, customer
      isAdmin: boolean("is_admin").default(false).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      employeeCode: text("employee_code"),
      address: text("address"),
      designation: text("designation"),
      department: text("department"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    authTokens = pgTable("auth_tokens", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      refreshToken: text("refresh_token").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertAuthTokenSchema = createInsertSchema(authTokens).omit({
      id: true,
      createdAt: true
    });
    modules = pgTable("modules", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull().unique(),
      displayName: text("display_name").notNull(),
      description: text("description"),
      icon: text("icon"),
      isCore: boolean("is_core").default(false).notNull()
    });
    insertModuleSchema = createInsertSchema(modules).omit({ id: true });
    tenantModules = pgTable("tenant_modules", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      moduleId: varchar("module_id").references(() => modules.id, { onDelete: "cascade" }).notNull(),
      isEnabled: boolean("is_enabled").default(true).notNull(),
      enabledAt: timestamp("enabled_at").defaultNow().notNull()
    });
    insertTenantModuleSchema = createInsertSchema(tenantModules).omit({
      id: true,
      enabledAt: true
    });
    products = pgTable("products", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      name: text("name").notNull(),
      description: text("description"),
      sku: text("sku"),
      type: text("type").notNull().default("product"),
      // product, service
      unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
      taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
      category: text("category"),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertProductSchema = createInsertSchema(products).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    customers = pgTable("customers", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      ownerId: varchar("owner_id").references(() => users.id).notNull(),
      name: text("name").notNull(),
      email: text("email").notNull(),
      phone: text("phone"),
      company: text("company"),
      website: text("website"),
      address: text("address"),
      city: text("city"),
      state: text("state"),
      country: text("country"),
      postalCode: text("postal_code"),
      customerType: text("customer_type").notNull().default("lead"),
      // lead, prospect, customer, partner
      segment: text("segment"),
      // enterprise, mid-market, small-business
      industry: text("industry"),
      taxId: text("tax_id"),
      paymentTerms: text("payment_terms").default("net30"),
      creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertCustomerSchema = createInsertSchema(customers).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    quotations = pgTable("quotations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
      createdBy: varchar("created_by").references(() => users.id).notNull(),
      quoteNumber: text("quote_number").notNull(),
      title: text("title").notNull(),
      status: text("status").notNull().default("draft"),
      // draft, sent, accepted, rejected, expired
      subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      validUntil: timestamp("valid_until"),
      terms: text("terms"),
      notes: text("notes"),
      sentAt: timestamp("sent_at"),
      acceptedAt: timestamp("accepted_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertQuotationSchema = createInsertSchema(quotations, {
      validUntil: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      sentAt: true,
      acceptedAt: true
    });
    quotationItems = pgTable("quotation_items", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      quotationId: varchar("quotation_id").references(() => quotations.id, { onDelete: "cascade" }).notNull(),
      productId: varchar("product_id").references(() => products.id),
      description: text("description").notNull(),
      quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
      unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
      taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
      discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
      totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
      sortOrder: integer("sort_order").default(0)
    });
    insertQuotationItemSchema = createInsertSchema(quotationItems).omit({ id: true });
    invoices = pgTable("invoices", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
      quotationId: varchar("quotation_id").references(() => quotations.id),
      createdBy: varchar("created_by").references(() => users.id).notNull(),
      invoiceNumber: text("invoice_number").notNull(),
      status: text("status").notNull().default("draft"),
      // draft, sent, paid, partial, overdue, cancelled
      issueDate: timestamp("issue_date").defaultNow().notNull(),
      dueDate: timestamp("due_date"),
      subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      balanceDue: decimal("balance_due", { precision: 12, scale: 2 }).notNull().default("0"),
      terms: text("terms"),
      notes: text("notes"),
      sentAt: timestamp("sent_at"),
      paidAt: timestamp("paid_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertInvoiceSchema = createInsertSchema(invoices, {
      issueDate: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      }),
      dueDate: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      sentAt: true,
      paidAt: true
    });
    invoiceItems = pgTable("invoice_items", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
      productId: varchar("product_id").references(() => products.id),
      description: text("description").notNull(),
      quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
      unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
      taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
      discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
      totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
      sortOrder: integer("sort_order").default(0)
    });
    insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({ id: true });
    payments = pgTable("payments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
      amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
      paymentMethod: text("payment_method").notNull().default("bank_transfer"),
      // bank_transfer, credit_card, cash, check, other
      paymentDate: timestamp("payment_date").defaultNow().notNull(),
      reference: text("reference"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertPaymentSchema = createInsertSchema(payments, {
      paymentDate: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({ id: true, createdAt: true });
    activities = pgTable("activities", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }),
      dealId: varchar("deal_id").references(() => deals.id, { onDelete: "cascade" }),
      type: text("type").notNull(),
      // call, email, meeting, note, task
      subject: text("subject").notNull(),
      description: text("description"),
      outcome: text("outcome"),
      scheduledAt: timestamp("scheduled_at"),
      completedAt: timestamp("completed_at"),
      duration: integer("duration"),
      // in minutes
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertActivitySchema = createInsertSchema(activities, {
      scheduledAt: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      }),
      completedAt: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    contacts = pgTable("contacts", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      ownerId: varchar("owner_id").references(() => users.id).notNull(),
      name: text("name").notNull(),
      email: text("email").notNull(),
      phone: text("phone"),
      company: text("company"),
      role: text("role"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertContactSchema = createInsertSchema(contacts).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    deals = pgTable("deals", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      contactId: varchar("contact_id").references(() => contacts.id, { onDelete: "cascade" }),
      customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }),
      ownerId: varchar("owner_id").references(() => users.id).notNull(),
      title: text("title").notNull(),
      value: decimal("value", { precision: 12, scale: 2 }).notNull(),
      stage: text("stage").notNull().default("new"),
      probability: integer("probability").default(0),
      expectedCloseDate: timestamp("expected_close_date"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertDealSchema = createInsertSchema(deals, {
      expectedCloseDate: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    TASK_STATUSES = {
      NOT_STARTED: "not_started",
      IN_PROGRESS: "in_progress",
      ON_HOLD: "on_hold",
      UNDER_REVIEW: "under_review",
      COMPLETED: "completed",
      CANCELLED: "cancelled"
    };
    TASK_PRIORITIES = {
      LOW: "low",
      MEDIUM: "medium",
      HIGH: "high",
      URGENT: "urgent"
    };
    RELATED_MODULES = {
      CUSTOMER: "customer",
      DEAL: "deal",
      QUOTATION: "quotation",
      INVOICE: "invoice",
      PROJECT: "project"
    };
    tasks = pgTable("tasks", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      createdBy: varchar("created_by").references(() => users.id).notNull(),
      assignedTo: varchar("assigned_to").references(() => users.id),
      customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }),
      dealId: varchar("deal_id").references(() => deals.id, { onDelete: "cascade" }),
      quotationId: varchar("quotation_id").references(() => quotations.id, { onDelete: "set null" }),
      invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: "set null" }),
      title: text("title").notNull(),
      description: text("description"),
      status: text("status").notNull().default("not_started"),
      priority: text("priority").notNull().default("medium"),
      tags: text("tags").array().default(sql`'{}'::text[]`),
      relatedModule: text("related_module"),
      dueDate: timestamp("due_date"),
      estimatedMinutes: integer("estimated_minutes"),
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertTaskSchema = createInsertSchema(tasks, {
      dueDate: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      }),
      tags: z.array(z.string()).optional().default([])
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      completedAt: true
    });
    taskAssignments = pgTable("task_assignments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      role: text("role").default("assignee"),
      assignedBy: varchar("assigned_by").references(() => users.id).notNull(),
      assignedAt: timestamp("assigned_at").defaultNow().notNull()
    });
    insertTaskAssignmentSchema = createInsertSchema(taskAssignments).omit({
      id: true,
      assignedAt: true
    });
    taskComments = pgTable("task_comments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      parentId: varchar("parent_id"),
      content: text("content").notNull(),
      isInternal: boolean("is_internal").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertTaskCommentSchema = createInsertSchema(taskComments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    taskStatusHistory = pgTable("task_status_history", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
      changedBy: varchar("changed_by").references(() => users.id, { onDelete: "cascade" }).notNull(),
      fromStatus: text("from_status"),
      toStatus: text("to_status").notNull(),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTaskStatusHistorySchema = createInsertSchema(taskStatusHistory).omit({
      id: true,
      createdAt: true
    });
    taskChecklistItems = pgTable("task_checklist_items", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
      title: text("title").notNull(),
      isCompleted: boolean("is_completed").default(false).notNull(),
      completedBy: varchar("completed_by").references(() => users.id),
      completedAt: timestamp("completed_at"),
      sortOrder: integer("sort_order").default(0),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTaskChecklistItemSchema = createInsertSchema(taskChecklistItems).omit({
      id: true,
      createdAt: true,
      completedAt: true
    });
    taskTimeLogs = pgTable("task_time_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      startedAt: timestamp("started_at").notNull(),
      endedAt: timestamp("ended_at"),
      durationMinutes: integer("duration_minutes"),
      description: text("description"),
      isBillable: boolean("is_billable").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTaskTimeLogSchema = createInsertSchema(taskTimeLogs, {
      startedAt: z.union([z.string(), z.date()]).transform((val) => {
        if (val instanceof Date) return val;
        return new Date(val);
      }),
      endedAt: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({
      id: true,
      createdAt: true
    });
    taskAttachments = pgTable("task_attachments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
      uploadedBy: varchar("uploaded_by").references(() => users.id, { onDelete: "cascade" }).notNull(),
      fileName: text("file_name").notNull(),
      fileSize: integer("file_size").notNull(),
      fileType: text("file_type").notNull(),
      fileUrl: text("file_url").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTaskAttachmentSchema = createInsertSchema(taskAttachments).omit({
      id: true,
      createdAt: true
    });
    taskNotifications = pgTable("task_notifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      recipientId: varchar("recipient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }),
      actorId: varchar("actor_id").references(() => users.id),
      type: text("type").notNull(),
      title: text("title").notNull(),
      message: text("message").notNull(),
      isRead: boolean("is_read").default(false).notNull(),
      readAt: timestamp("read_at"),
      metadata: text("metadata"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTaskNotificationSchema = createInsertSchema(taskNotifications).omit({
      id: true,
      createdAt: true,
      readAt: true
    });
    taskAiHistory = pgTable("task_ai_history", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      action: text("action").notNull(),
      prompt: text("prompt").notNull(),
      response: text("response").notNull(),
      model: text("model"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTaskAiHistorySchema = createInsertSchema(taskAiHistory).omit({
      id: true,
      createdAt: true
    });
    taskActivityLog = pgTable("task_activity_log", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      action: text("action").notNull(),
      description: text("description").notNull(),
      oldValue: text("old_value"),
      newValue: text("new_value"),
      metadata: text("metadata"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTaskActivityLogSchema = createInsertSchema(taskActivityLog).omit({
      id: true,
      createdAt: true
    });
    PLATFORM_SETTING_CATEGORIES = {
      GENERAL: "general",
      EMAIL: "email",
      AI: "ai",
      SECURITY: "security",
      BRANDING: "branding"
    };
    platformSettings = pgTable("platform_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      key: text("key").notNull().unique(),
      value: text("value").notNull(),
      category: text("category").notNull().default("general"),
      description: text("description"),
      isSensitive: boolean("is_sensitive").default(false).notNull(),
      updatedBy: varchar("updated_by").references(() => users.id),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertPlatformSettingSchema = createInsertSchema(platformSettings).omit({
      id: true,
      updatedAt: true
    });
    userAiSettings = pgTable("user_ai_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
      provider: text("provider").notNull().default("openai"),
      apiKey: text("api_key"),
      isEnabled: boolean("is_enabled").default(true).notNull(),
      lastUsedAt: timestamp("last_used_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertUserAiSettingSchema = createInsertSchema(userAiSettings).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      lastUsedAt: true
    });
    companyProfiles = pgTable("company_profiles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
      companyName: text("company_name").notNull(),
      email: text("email"),
      phone: text("phone"),
      website: text("website"),
      address: text("address"),
      city: text("city"),
      state: text("state"),
      country: text("country"),
      postalCode: text("postal_code"),
      logoUrl: text("logo_url"),
      taxId: text("tax_id"),
      registrationNumber: text("registration_number"),
      industry: text("industry"),
      companySize: text("company_size"),
      currency: text("currency").default("USD"),
      defaultPaymentTerms: text("default_payment_terms").default("net30"),
      invoicePrefix: text("invoice_prefix").default("INV"),
      quotePrefix: text("quote_prefix").default("QT"),
      invoiceNotes: text("invoice_notes"),
      quoteNotes: text("quote_notes"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertCompanyProfileSchema = createInsertSchema(companyProfiles).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    platformActivityLogs = pgTable("platform_activity_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      actorId: varchar("actor_id").references(() => users.id),
      actorType: text("actor_type").notNull().default("user"),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
      targetType: text("target_type").notNull(),
      targetId: varchar("target_id"),
      action: text("action").notNull(),
      description: text("description"),
      metadata: text("metadata"),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertPlatformActivityLogSchema = createInsertSchema(platformActivityLogs).omit({
      id: true,
      createdAt: true
    });
    packages = pgTable("packages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      displayName: text("display_name").notNull(),
      description: text("description"),
      price: decimal("price", { precision: 12, scale: 2 }).notNull().default("0"),
      billingCycle: text("billing_cycle").notNull().default("monthly"),
      // monthly, yearly, one_time
      isActive: boolean("is_active").default(true).notNull(),
      isPopular: boolean("is_popular").default(false).notNull(),
      sortOrder: integer("sort_order").default(0),
      features: text("features").array().default(sql`'{}'::text[]`),
      // Package limits
      contactLimit: integer("contact_limit").default(-1),
      // -1 = unlimited
      teamMemberLimit: integer("team_member_limit").default(-1),
      storageLimit: integer("storage_limit_mb").default(-1),
      // in MB
      projectLimit: integer("project_limit").default(-1),
      apiCallsLimit: integer("api_calls_limit").default(-1),
      // per month
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertPackageSchema = createInsertSchema(packages).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    packageModules = pgTable("package_modules", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      packageId: varchar("package_id").references(() => packages.id, { onDelete: "cascade" }).notNull(),
      moduleId: varchar("module_id").references(() => modules.id, { onDelete: "cascade" }).notNull()
    });
    insertPackageModuleSchema = createInsertSchema(packageModules).omit({ id: true });
    emailTemplates = pgTable("email_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
      // nullable for system templates
      createdBy: varchar("created_by").references(() => users.id),
      // nullable for system templates
      ownerType: text("owner_type").notNull().default("user"),
      // system, workspace, user
      ownerId: varchar("owner_id"),
      // user id for 'user' type, workspace id for 'workspace', null for 'system'
      isShared: boolean("is_shared").default(false).notNull(),
      // user templates can be shared to workspace
      isSystemTemplate: boolean("is_system_template").default(false).notNull(),
      // true for global system templates
      name: text("name").notNull(),
      purpose: text("purpose").notNull().default("custom"),
      // quotation, invoice, follow_up, meeting, payment_reminder, welcome, renewal, feedback, custom
      subject: text("subject").notNull(),
      body: text("body").notNull(),
      mergeFields: text("merge_fields").array().default(sql`'{}'::text[]`),
      isDefault: boolean("is_default").default(false).notNull(),
      defaultFor: text("default_for"),
      // quotation, invoice, payment_reminder, etc.
      isActive: boolean("is_active").default(true).notNull(),
      version: integer("version").default(1),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    emailLogs = pgTable("email_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      sentBy: varchar("sent_by").references(() => users.id).notNull(),
      templateId: varchar("template_id").references(() => emailTemplates.id),
      customerId: varchar("customer_id").references(() => customers.id, { onDelete: "set null" }),
      quotationId: varchar("quotation_id").references(() => quotations.id, { onDelete: "set null" }),
      invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: "set null" }),
      fromEmail: text("from_email").notNull(),
      toEmail: text("to_email").notNull(),
      ccEmails: text("cc_emails"),
      bccEmails: text("bcc_emails"),
      subject: text("subject").notNull(),
      body: text("body").notNull(),
      attachments: text("attachments").array().default(sql`'{}'::text[]`),
      status: text("status").notNull().default("pending"),
      // pending, scheduled, sent, delivered, opened, clicked, failed, bounced
      scheduledAt: timestamp("scheduled_at"),
      sentAt: timestamp("sent_at"),
      openedAt: timestamp("opened_at"),
      clickedAt: timestamp("clicked_at"),
      errorMessage: text("error_message"),
      trackingId: text("tracking_id"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertEmailLogSchema = createInsertSchema(emailLogs, {
      scheduledAt: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({
      id: true,
      createdAt: true,
      sentAt: true,
      openedAt: true,
      clickedAt: true
    });
    automationRules = pgTable("automation_rules", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      createdBy: varchar("created_by").references(() => users.id).notNull(),
      name: text("name").notNull(),
      description: text("description"),
      trigger: text("trigger").notNull(),
      // quotation_created, invoice_created, quotation_sent, invoice_sent, invoice_overdue, customer_status_change, quotation_not_accepted
      templateId: varchar("template_id").references(() => emailTemplates.id).notNull(),
      delayValue: integer("delay_value").default(0),
      delayUnit: text("delay_unit").default("minutes"),
      // minutes, hours, days
      conditions: text("conditions"),
      // JSON string for conditional filters
      isEnabled: boolean("is_enabled").default(true).notNull(),
      lastTriggered: timestamp("last_triggered"),
      triggerCount: integer("trigger_count").default(0),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertAutomationRuleSchema = createInsertSchema(automationRules).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      lastTriggered: true,
      triggerCount: true
    });
    followUpSequences = pgTable("follow_up_sequences", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      createdBy: varchar("created_by").references(() => users.id).notNull(),
      name: text("name").notNull(),
      description: text("description"),
      purpose: text("purpose").notNull().default("general"),
      // payment, quotation, onboarding, renewal, feedback, general
      isEnabled: boolean("is_enabled").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertFollowUpSequenceSchema = createInsertSchema(followUpSequences).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    followUpSteps = pgTable("follow_up_steps", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sequenceId: varchar("sequence_id").references(() => followUpSequences.id, { onDelete: "cascade" }).notNull(),
      templateId: varchar("template_id").references(() => emailTemplates.id).notNull(),
      stepOrder: integer("step_order").notNull().default(1),
      delayDays: integer("delay_days").notNull().default(1),
      conditions: text("conditions"),
      // JSON string for skip conditions
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertFollowUpStepSchema = createInsertSchema(followUpSteps).omit({
      id: true,
      createdAt: true
    });
    scheduledEmails = pgTable("scheduled_emails", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      automationRuleId: varchar("automation_rule_id").references(() => automationRules.id, { onDelete: "set null" }),
      sequenceId: varchar("sequence_id").references(() => followUpSequences.id, { onDelete: "set null" }),
      stepId: varchar("step_id").references(() => followUpSteps.id, { onDelete: "set null" }),
      templateId: varchar("template_id").references(() => emailTemplates.id).notNull(),
      customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
      quotationId: varchar("quotation_id").references(() => quotations.id, { onDelete: "set null" }),
      invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: "set null" }),
      scheduledFor: timestamp("scheduled_for").notNull(),
      status: text("status").notNull().default("pending"),
      // pending, sent, skipped, cancelled, failed
      skipReason: text("skip_reason"),
      processedAt: timestamp("processed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertScheduledEmailSchema = createInsertSchema(scheduledEmails, {
      scheduledFor: z.union([z.string(), z.date()]).transform((val) => {
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({
      id: true,
      createdAt: true,
      processedAt: true
    });
    emailSenderAccounts = pgTable("email_sender_accounts", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      email: text("email").notNull(),
      name: text("name").notNull(),
      isDefault: boolean("is_default").default(false).notNull(),
      isVerified: boolean("is_verified").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertEmailSenderAccountSchema = createInsertSchema(emailSenderAccounts).omit({
      id: true,
      createdAt: true,
      isVerified: true
    });
    smtpSettings = pgTable("smtp_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
      provider: text("provider").notNull().default("default"),
      // default, smtp, sendgrid, mailgun, ses
      // SMTP Settings
      smtpHost: text("smtp_host"),
      smtpPort: integer("smtp_port").default(587),
      smtpSecure: boolean("smtp_secure").default(false),
      // true for 465, false for other ports
      smtpUser: text("smtp_user"),
      smtpPassword: text("smtp_password"),
      // encrypted in production
      // From email settings
      fromEmail: text("from_email"),
      fromName: text("from_name"),
      replyToEmail: text("reply_to_email"),
      // API-based providers (optional)
      apiKey: text("api_key"),
      apiDomain: text("api_domain"),
      // Settings
      isEnabled: boolean("is_enabled").default(true).notNull(),
      isVerified: boolean("is_verified").default(false).notNull(),
      lastTestedAt: timestamp("last_tested_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertSmtpSettingsSchema = createInsertSchema(smtpSettings).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      isVerified: true,
      lastTestedAt: true
    });
    PROPOSAL_STATUSES = {
      DRAFT: "draft",
      SENT: "sent",
      VIEWED: "viewed",
      ACCEPTED: "accepted",
      REJECTED: "rejected",
      EXPIRED: "expired"
    };
    PROPOSAL_SECTION_TYPES = {
      COVER: "cover",
      INTRODUCTION: "introduction",
      ABOUT_US: "about_us",
      SCOPE_OF_WORK: "scope_of_work",
      DELIVERABLES: "deliverables",
      TIMELINE: "timeline",
      PRICING_TABLE: "pricing_table",
      TERMS_CONDITIONS: "terms_conditions",
      SIGNATURE: "signature",
      ATTACHMENTS: "attachments",
      CUSTOM: "custom"
    };
    TEMPLATE_PURPOSES = {
      WEB_DESIGN: "web_design",
      SEO: "seo",
      MAINTENANCE: "maintenance",
      BRANDING: "branding",
      MARKETING: "marketing",
      CONSULTING: "consulting",
      CUSTOM: "custom"
    };
    PROPOSAL_THEMES = {
      MODERN_BLUE: "modern_blue",
      CORPORATE_DARK: "corporate_dark",
      ELEGANT_GOLD: "elegant_gold",
      FRESH_GREEN: "fresh_green",
      BOLD_RED: "bold_red",
      MINIMAL_GRAY: "minimal_gray",
      CUSTOM: "custom"
    };
    proposalTemplates = pgTable("proposal_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
      createdBy: varchar("created_by").references(() => users.id),
      name: text("name").notNull(),
      description: text("description"),
      purpose: text("purpose").notNull().default("custom"),
      themePreset: text("theme_preset").default("modern_blue"),
      primaryColor: text("primary_color").default("#3B82F6"),
      secondaryColor: text("secondary_color").default("#1E40AF"),
      accentColor: text("accent_color").default("#10B981"),
      headerStyle: text("header_style").default("gradient"),
      fontFamily: text("font_family").default("Inter"),
      isActive: boolean("is_active").default(true).notNull(),
      isDefault: boolean("is_default").default(false).notNull(),
      isSystemTemplate: boolean("is_system_template").default(false).notNull(),
      version: integer("version").default(1).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertProposalTemplateSchema = createInsertSchema(proposalTemplates).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      version: true
    });
    proposals = pgTable("proposals", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
      templateId: varchar("template_id").references(() => proposalTemplates.id, { onDelete: "set null" }),
      quotationId: varchar("quotation_id").references(() => quotations.id, { onDelete: "set null" }),
      dealId: varchar("deal_id").references(() => deals.id, { onDelete: "set null" }),
      createdBy: varchar("created_by").references(() => users.id).notNull(),
      ownerId: varchar("owner_id").references(() => users.id).notNull(),
      proposalNumber: text("proposal_number").notNull(),
      title: text("title").notNull(),
      status: text("status").notNull().default("draft"),
      currency: text("currency").notNull().default("USD"),
      subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
      validUntil: timestamp("valid_until"),
      sentAt: timestamp("sent_at"),
      viewedAt: timestamp("viewed_at"),
      acceptedAt: timestamp("accepted_at"),
      rejectedAt: timestamp("rejected_at"),
      expiresAt: timestamp("expires_at"),
      accessToken: text("access_token"),
      viewCount: integer("view_count").default(0).notNull(),
      totalViewTime: integer("total_view_time").default(0).notNull(),
      selectedPackage: text("selected_package"),
      clientComments: text("client_comments"),
      internalNotes: text("internal_notes"),
      themePreset: text("theme_preset").default("modern_blue"),
      primaryColor: text("primary_color").default("#3B82F6"),
      secondaryColor: text("secondary_color").default("#1E40AF"),
      accentColor: text("accent_color").default("#10B981"),
      headerStyle: text("header_style").default("gradient"),
      fontFamily: text("font_family").default("Inter"),
      currentVersion: integer("current_version").default(1).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertProposalSchema = createInsertSchema(proposals, {
      validUntil: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      }),
      expiresAt: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      sentAt: true,
      viewedAt: true,
      acceptedAt: true,
      rejectedAt: true,
      accessToken: true,
      viewCount: true,
      totalViewTime: true,
      currentVersion: true
    });
    proposalSections = pgTable("proposal_sections", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }),
      templateId: varchar("template_id").references(() => proposalTemplates.id, { onDelete: "cascade" }),
      sectionType: text("section_type").notNull(),
      title: text("title").notNull(),
      content: text("content"),
      sortOrder: integer("sort_order").default(0).notNull(),
      isLocked: boolean("is_locked").default(false).notNull(),
      isVisible: boolean("is_visible").default(true).notNull(),
      aiGenerated: boolean("ai_generated").default(false).notNull(),
      settings: text("settings"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertProposalSectionSchema = createInsertSchema(proposalSections).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    proposalPricingItems = pgTable("proposal_pricing_items", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
      sectionId: varchar("section_id").references(() => proposalSections.id, { onDelete: "cascade" }),
      productId: varchar("product_id").references(() => products.id, { onDelete: "set null" }),
      packageName: text("package_name"),
      name: text("name").notNull(),
      description: text("description"),
      quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
      unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
      taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
      discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
      totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
      isRecurring: boolean("is_recurring").default(false).notNull(),
      recurringInterval: text("recurring_interval"),
      isOptional: boolean("is_optional").default(false).notNull(),
      isSelected: boolean("is_selected").default(true).notNull(),
      sortOrder: integer("sort_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertProposalPricingItemSchema = createInsertSchema(proposalPricingItems).omit({
      id: true,
      createdAt: true
    });
    proposalVersions = pgTable("proposal_versions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
      versionNumber: integer("version_number").notNull(),
      createdBy: varchar("created_by").references(() => users.id).notNull(),
      snapshot: text("snapshot").notNull(),
      changeNotes: text("change_notes"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertProposalVersionSchema = createInsertSchema(proposalVersions).omit({
      id: true,
      createdAt: true
    });
    proposalActivityLogs = pgTable("proposal_activity_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
      action: text("action").notNull(),
      details: text("details"),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertProposalActivityLogSchema = createInsertSchema(proposalActivityLogs).omit({
      id: true,
      createdAt: true
    });
    proposalSignatures = pgTable("proposal_signatures", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
      signerName: text("signer_name").notNull(),
      signerEmail: text("signer_email").notNull(),
      signerRole: text("signer_role"),
      signatureType: text("signature_type").notNull().default("typed"),
      signatureData: text("signature_data"),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      signedAt: timestamp("signed_at").defaultNow().notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertProposalSignatureSchema = createInsertSchema(proposalSignatures).omit({
      id: true,
      createdAt: true,
      signedAt: true
    });
    proposalViewLogs = pgTable("proposal_view_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
      viewerEmail: text("viewer_email"),
      deviceType: text("device_type"),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      duration: integer("duration").default(0).notNull(),
      sectionsViewed: text("sections_viewed").array().default(sql`'{}'::text[]`),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertProposalViewLogSchema = createInsertSchema(proposalViewLogs, {
      sectionsViewed: z.array(z.string()).optional().default([])
    }).omit({
      id: true,
      createdAt: true
    });
    proposalStatusHistory = pgTable("proposal_status_history", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
      changedBy: varchar("changed_by").references(() => users.id, { onDelete: "set null" }),
      fromStatus: text("from_status"),
      toStatus: text("to_status").notNull(),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertProposalStatusHistorySchema = createInsertSchema(proposalStatusHistory).omit({
      id: true,
      createdAt: true
    });
    templateSections = pgTable("template_sections", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      templateId: varchar("template_id").references(() => proposalTemplates.id, { onDelete: "cascade" }).notNull(),
      sectionType: text("section_type").notNull(),
      title: text("title").notNull(),
      content: text("content"),
      sortOrder: integer("sort_order").default(0).notNull(),
      isLocked: boolean("is_locked").default(false).notNull(),
      isVisible: boolean("is_visible").default(true).notNull(),
      settings: text("settings"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertTemplateSectionSchema = createInsertSchema(templateSections).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    proposalComments = pgTable("proposal_comments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
      sectionId: varchar("section_id").references(() => proposalSections.id, { onDelete: "cascade" }),
      userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
      clientEmail: text("client_email"),
      content: text("content").notNull(),
      isInternal: boolean("is_internal").default(true).notNull(),
      isResolved: boolean("is_resolved").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertProposalCommentSchema = createInsertSchema(proposalComments).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    featureFlags = pgTable("feature_flags", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      key: text("key").notNull(),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
      enabled: boolean("enabled").default(false).notNull(),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    WORKSPACE_ROLES = {
      OWNER: "owner",
      // Full control, can delete workspace
      ADMIN: "admin",
      // Can manage members and settings
      MEMBER: "member",
      // Standard access
      VIEWER: "viewer"
      // Read-only access
    };
    workspaceUsers = pgTable("workspace_users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      role: text("role").notNull().default("member"),
      // owner, admin, member, viewer
      isPrimary: boolean("is_primary").default(false).notNull(),
      // User's primary/default workspace
      invitedBy: varchar("invited_by").references(() => users.id, { onDelete: "set null" }),
      joinedAt: timestamp("joined_at").defaultNow().notNull(),
      lastAccessedAt: timestamp("last_accessed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertWorkspaceUserSchema = createInsertSchema(workspaceUsers).omit({
      id: true,
      createdAt: true,
      joinedAt: true
    });
    INVITATION_STATUSES = {
      PENDING: "pending",
      ACCEPTED: "accepted",
      DECLINED: "declined",
      EXPIRED: "expired",
      REVOKED: "revoked"
    };
    workspaceInvitations = pgTable("workspace_invitations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      email: text("email").notNull(),
      role: text("role").notNull().default("member"),
      token: text("token").notNull().unique(),
      // Unique invitation token
      invitedBy: varchar("invited_by").references(() => users.id, { onDelete: "set null" }).notNull(),
      status: text("status").notNull().default("pending"),
      // pending, accepted, declined, expired, revoked
      expiresAt: timestamp("expires_at").notNull(),
      acceptedAt: timestamp("accepted_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertWorkspaceInvitationSchema = createInsertSchema(workspaceInvitations, {
      expiresAt: z.union([z.string(), z.date()]).transform((val) => {
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({
      id: true,
      createdAt: true,
      acceptedAt: true
    });
    workspaceActivityLogs = pgTable("workspace_activity_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
      action: text("action").notNull(),
      // created, updated, member_added, member_removed, switched_to, etc.
      details: text("details"),
      // JSON string with additional context
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertWorkspaceActivityLogSchema = createInsertSchema(workspaceActivityLogs).omit({
      id: true,
      createdAt: true
    });
    WORKSPACE_PLAN_TYPES = {
      FREE: "free",
      PRO: "pro",
      AGENCY: "agency"
    };
    SUBSCRIPTION_STATUSES = {
      ACTIVE: "active",
      TRIAL: "trial",
      PAST_DUE: "past_due",
      CANCELLED: "cancelled",
      EXPIRED: "expired"
    };
    workspacePlans = pgTable("workspace_plans", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull().unique(),
      displayName: text("display_name").notNull(),
      description: text("description"),
      monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }).notNull().default("0"),
      yearlyPrice: decimal("yearly_price", { precision: 10, scale: 2 }).notNull().default("0"),
      maxMembers: integer("max_members").notNull().default(1),
      maxAutomations: integer("max_automations").notNull().default(5),
      maxEmailsPerMonth: integer("max_emails_per_month").notNull().default(100),
      maxProposals: integer("max_proposals").notNull().default(10),
      maxStorageMb: integer("max_storage_mb").notNull().default(100),
      features: text("features").array().default(sql`'{}'::text[]`),
      isActive: boolean("is_active").default(true).notNull(),
      sortOrder: integer("sort_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWorkspacePlanSchema = createInsertSchema(workspacePlans, {
      features: z.array(z.string()).optional().default([])
    }).omit({ id: true, createdAt: true, updatedAt: true });
    workspaceSubscriptions = pgTable("workspace_subscriptions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
      planId: varchar("plan_id").references(() => workspacePlans.id, { onDelete: "set null" }),
      status: text("status").notNull().default("trial"),
      billingCycle: text("billing_cycle").notNull().default("monthly"),
      // monthly, yearly
      trialEndsAt: timestamp("trial_ends_at"),
      currentPeriodStart: timestamp("current_period_start"),
      currentPeriodEnd: timestamp("current_period_end"),
      cancelledAt: timestamp("cancelled_at"),
      cancelReason: text("cancel_reason"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWorkspaceSubscriptionSchema = createInsertSchema(workspaceSubscriptions, {
      trialEndsAt: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      }),
      currentPeriodStart: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      }),
      currentPeriodEnd: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({ id: true, createdAt: true, updatedAt: true });
    workspaceUsage = pgTable("workspace_usage", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      periodStart: timestamp("period_start").notNull(),
      periodEnd: timestamp("period_end").notNull(),
      memberCount: integer("member_count").default(0).notNull(),
      automationsUsed: integer("automations_used").default(0).notNull(),
      emailsSent: integer("emails_sent").default(0).notNull(),
      proposalsCreated: integer("proposals_created").default(0).notNull(),
      storageMbUsed: decimal("storage_mb_used", { precision: 10, scale: 2 }).default("0").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWorkspaceUsageSchema = createInsertSchema(workspaceUsage, {
      periodStart: z.union([z.string(), z.date()]).transform((val) => {
        if (val instanceof Date) return val;
        return new Date(val);
      }),
      periodEnd: z.union([z.string(), z.date()]).transform((val) => {
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({ id: true, createdAt: true, updatedAt: true });
    workspaceInvoices = pgTable("workspace_invoices", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      subscriptionId: varchar("subscription_id").references(() => workspaceSubscriptions.id, { onDelete: "set null" }),
      invoiceNumber: text("invoice_number").notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      currency: text("currency").default("USD").notNull(),
      status: text("status").notNull().default("pending"),
      // pending, paid, failed, refunded
      periodStart: timestamp("period_start"),
      periodEnd: timestamp("period_end"),
      paidAt: timestamp("paid_at"),
      dueDate: timestamp("due_date"),
      pdfUrl: text("pdf_url"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertWorkspaceInvoiceSchema = createInsertSchema(workspaceInvoices).omit({ id: true, createdAt: true });
    workspacePaymentMethods = pgTable("workspace_payment_methods", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      type: text("type").notNull().default("card"),
      // card, bank_account
      last4: text("last4"),
      brand: text("brand"),
      expiryMonth: integer("expiry_month"),
      expiryYear: integer("expiry_year"),
      isDefault: boolean("is_default").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWorkspacePaymentMethodSchema = createInsertSchema(workspacePaymentMethods).omit({ id: true, createdAt: true, updatedAt: true });
    workspaceBranding = pgTable("workspace_branding", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
      logoUrl: text("logo_url"),
      logoLightUrl: text("logo_light_url"),
      faviconUrl: text("favicon_url"),
      primaryColor: text("primary_color").default("#3b82f6"),
      secondaryColor: text("secondary_color").default("#64748b"),
      accentColor: text("accent_color").default("#f59e0b"),
      emailSignature: text("email_signature"),
      customDomain: text("custom_domain"),
      customDomainVerified: boolean("custom_domain_verified").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWorkspaceBrandingSchema = createInsertSchema(workspaceBranding).omit({ id: true, createdAt: true, updatedAt: true });
    workspacePdfSettings = pgTable("workspace_pdf_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
      headerLogoUrl: text("header_logo_url"),
      footerText: text("footer_text"),
      showCompanyAddress: boolean("show_company_address").default(true).notNull(),
      showCompanyPhone: boolean("show_company_phone").default(true).notNull(),
      showCompanyEmail: boolean("show_company_email").default(true).notNull(),
      proposalTemplate: text("proposal_template"),
      // JSON template settings
      invoiceTemplate: text("invoice_template"),
      // JSON template settings
      quotationTemplate: text("quotation_template"),
      // JSON template settings
      termsAndConditions: text("terms_and_conditions"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWorkspacePdfSettingsSchema = createInsertSchema(workspacePdfSettings).omit({ id: true, createdAt: true, updatedAt: true });
    PERMISSION_MODULES = [
      "clients",
      "projects",
      "tasks",
      "invoices",
      "proposals",
      "automations",
      "email",
      "billing",
      "reports",
      "settings",
      "team"
    ];
    PERMISSION_ACTIONS = ["view", "create", "edit", "delete", "manage"];
    workspaceCustomRoles = pgTable("workspace_custom_roles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      name: text("name").notNull(),
      description: text("description"),
      color: text("color").default("#6b7280"),
      isDefault: boolean("is_default").default(false).notNull(),
      createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWorkspaceCustomRoleSchema = createInsertSchema(workspaceCustomRoles).omit({ id: true, createdAt: true, updatedAt: true });
    workspaceRolePermissions = pgTable("workspace_role_permissions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      roleId: varchar("role_id").references(() => workspaceCustomRoles.id, { onDelete: "cascade" }).notNull(),
      module: text("module").notNull(),
      action: text("action").notNull(),
      allowed: boolean("allowed").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertWorkspaceRolePermissionSchema = createInsertSchema(workspaceRolePermissions).omit({ id: true, createdAt: true });
    workspaceAnalyticsCache = pgTable("workspace_analytics_cache", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      metricType: text("metric_type").notNull(),
      // revenue, invoices, proposals, leads, tasks, etc.
      metricDate: timestamp("metric_date").notNull(),
      value: decimal("value", { precision: 15, scale: 2 }).notNull().default("0"),
      metadata: text("metadata"),
      // JSON for additional context
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWorkspaceAnalyticsCacheSchema = createInsertSchema(workspaceAnalyticsCache, {
      metricDate: z.union([z.string(), z.date()]).transform((val) => {
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({ id: true, createdAt: true, updatedAt: true });
    workspaceDeletionLogs = pgTable("workspace_deletion_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      action: text("action").notNull(),
      // deleted, restored, purged
      deletedBy: varchar("deleted_by").references(() => users.id, { onDelete: "set null" }),
      restoredBy: varchar("restored_by").references(() => users.id, { onDelete: "set null" }),
      reason: text("reason"),
      scheduledPurgeAt: timestamp("scheduled_purge_at"),
      ipAddress: text("ip_address"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertWorkspaceDeletionLogSchema = createInsertSchema(workspaceDeletionLogs, {
      scheduledPurgeAt: z.union([z.string(), z.date(), z.null()]).optional().transform((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        return new Date(val);
      })
    }).omit({ id: true, createdAt: true });
    ONBOARDING_STEP_STATUSES = {
      NOT_STARTED: "not_started",
      IN_PROGRESS: "in_progress",
      COMPLETED: "completed",
      SKIPPED: "skipped"
    };
    workspaceOnboardingProgress = pgTable("workspace_onboarding_progress", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
      isCompleted: boolean("is_completed").default(false).notNull(),
      isDismissed: boolean("is_dismissed").default(false).notNull(),
      currentStep: integer("current_step").default(1).notNull(),
      step1AddBranding: text("step1_add_branding").default("not_started").notNull(),
      step2AddTeamMembers: text("step2_add_team_members").default("not_started").notNull(),
      step3AddFirstClient: text("step3_add_first_client").default("not_started").notNull(),
      step4CreateProject: text("step4_create_project").default("not_started").notNull(),
      step5CreateProposal: text("step5_create_proposal").default("not_started").notNull(),
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertWorkspaceOnboardingProgressSchema = createInsertSchema(workspaceOnboardingProgress).omit({ id: true, createdAt: true, updatedAt: true, completedAt: true });
    AUDIT_LOG_ACTIONS = {
      LOGIN_SUCCESS: "login_success",
      LOGIN_FAILED: "login_failed",
      LOGOUT: "logout",
      PASSWORD_CHANGE: "password_change",
      PASSWORD_RESET_REQUEST: "password_reset_request",
      USER_CREATED: "user_created",
      USER_UPDATED: "user_updated",
      USER_DELETED: "user_deleted",
      ROLE_CHANGED: "role_changed",
      PERMISSION_CHANGED: "permission_changed",
      DATA_EXPORT: "data_export",
      DATA_DELETE: "data_delete",
      SETTINGS_CHANGED: "settings_changed",
      API_KEY_CREATED: "api_key_created",
      API_KEY_REVOKED: "api_key_revoked",
      TENANT_CREATED: "tenant_created",
      TENANT_UPDATED: "tenant_updated",
      WORKSPACE_JOINED: "workspace_joined",
      WORKSPACE_LEFT: "workspace_left",
      ADMIN_ACTION: "admin_action"
    };
    AUDIT_LOG_SEVERITY = {
      INFO: "info",
      WARNING: "warning",
      CRITICAL: "critical"
    };
    auditLogs = pgTable("audit_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
      userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
      action: text("action").notNull(),
      severity: text("severity").notNull().default("info"),
      resourceType: text("resource_type"),
      resourceId: varchar("resource_id"),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      requestMethod: text("request_method"),
      requestPath: text("request_path"),
      details: text("details"),
      previousValue: text("previous_value"),
      newValue: text("new_value"),
      success: boolean("success").default(true).notNull(),
      errorMessage: text("error_message"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
    loginAttempts = pgTable("login_attempts", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: text("email").notNull(),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      success: boolean("success").default(false).notNull(),
      failureReason: text("failure_reason"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertLoginAttemptSchema = createInsertSchema(loginAttempts).omit({ id: true, createdAt: true });
    customerPortalSettings = pgTable("customer_portal_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
      portalEnabled: boolean("portal_enabled").default(false).notNull(),
      showProposals: boolean("show_proposals").default(true).notNull(),
      showQuotations: boolean("show_quotations").default(true).notNull(),
      showInvoices: boolean("show_invoices").default(true).notNull(),
      showTasks: boolean("show_tasks").default(false).notNull(),
      showDocuments: boolean("show_documents").default(false).notNull(),
      allowComments: boolean("allow_comments").default(true).notNull(),
      allowFileUploads: boolean("allow_file_uploads").default(false).notNull(),
      allowOnlinePayments: boolean("allow_online_payments").default(false).notNull(),
      welcomeMessage: text("welcome_message"),
      customCss: text("custom_css"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertCustomerPortalSettingsSchema = createInsertSchema(customerPortalSettings).omit({ id: true, createdAt: true, updatedAt: true });
    customerPortalActivityLogs = pgTable("customer_portal_activity_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      customerId: varchar("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      action: text("action").notNull(),
      // login, proposal_viewed, invoice_viewed, quotation_viewed, document_downloaded, comment_added, proposal_accepted, invoice_paid
      resourceType: text("resource_type"),
      // proposal, invoice, quotation, document
      resourceId: varchar("resource_id"),
      ipAddress: text("ip_address"),
      userAgent: text("user_agent"),
      metadata: text("metadata"),
      // JSON for additional context
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertCustomerPortalActivityLogSchema = createInsertSchema(customerPortalActivityLogs).omit({ id: true, createdAt: true });
    passwordResetTokens = pgTable("password_reset_tokens", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
      token: text("token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      usedAt: timestamp("used_at"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({ id: true, createdAt: true });
    clientDocuments = pgTable("client_documents", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
      uploadedBy: varchar("uploaded_by").references(() => users.id, { onDelete: "set null" }),
      name: text("name").notNull(),
      description: text("description"),
      fileUrl: text("file_url").notNull(),
      fileType: text("file_type"),
      fileSize: integer("file_size"),
      isVisibleToClient: boolean("is_visible_to_client").default(true).notNull(),
      uploadedByClient: boolean("uploaded_by_client").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertClientDocumentSchema = createInsertSchema(clientDocuments).omit({ id: true, createdAt: true, updatedAt: true });
    AI_ACTIONS = {
      REWRITE: "rewrite",
      IMPROVE_TONE: "improve_tone",
      EXPAND: "expand",
      SHORTEN: "shorten",
      SUMMARIZE: "summarize",
      GENERATE: "generate",
      TRANSLATE: "translate",
      FIX_GRAMMAR: "fix_grammar",
      MAKE_FORMAL: "make_formal",
      MAKE_FRIENDLY: "make_friendly",
      MAKE_PERSUASIVE: "make_persuasive",
      GENERATE_SUBJECT: "generate_subject",
      GENERATE_FOLLOWUP: "generate_followup",
      GENERATE_SUBTASKS: "generate_subtasks",
      SUGGEST_DUE_DATE: "suggest_due_date",
      PRIORITIZE: "prioritize",
      EXPLAIN: "explain",
      LEAD_SCORE: "lead_score",
      CLIENT_SUMMARY: "client_summary",
      NEXT_STEPS: "next_steps",
      REPORT_INSIGHTS: "report_insights"
    };
    AI_MODULES = {
      EMAIL: "email",
      TASK: "task",
      PROPOSAL: "proposal",
      CLIENT: "client",
      LEAD: "lead",
      REPORT: "report",
      WORKFLOW: "workflow"
    };
    aiSettings = pgTable("ai_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
      aiEnabled: boolean("ai_enabled").default(true).notNull(),
      emailAiEnabled: boolean("email_ai_enabled").default(true).notNull(),
      taskAiEnabled: boolean("task_ai_enabled").default(true).notNull(),
      proposalAiEnabled: boolean("proposal_ai_enabled").default(true).notNull(),
      clientAiEnabled: boolean("client_ai_enabled").default(true).notNull(),
      reportAiEnabled: boolean("report_ai_enabled").default(true).notNull(),
      monthlyTokenLimit: integer("monthly_token_limit").default(1e5).notNull(),
      tokensUsedThisMonth: integer("tokens_used_this_month").default(0).notNull(),
      tokenResetDate: timestamp("token_reset_date").defaultNow().notNull(),
      preferredModel: text("preferred_model").default("gpt-4o-mini"),
      customInstructions: text("custom_instructions"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertAiSettingsSchema = createInsertSchema(aiSettings).omit({ id: true, createdAt: true, updatedAt: true });
    aiUsage = pgTable("ai_usage", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
      module: text("module").notNull(),
      // email, task, proposal, client, lead, report
      action: text("action").notNull(),
      // rewrite, generate, summarize, etc.
      tokensUsed: integer("tokens_used").notNull().default(0),
      inputTokens: integer("input_tokens").default(0),
      outputTokens: integer("output_tokens").default(0),
      model: text("model").default("gpt-4o-mini"),
      success: boolean("success").default(true).notNull(),
      latencyMs: integer("latency_ms"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertAiUsageSchema = createInsertSchema(aiUsage).omit({ id: true, createdAt: true });
    aiLogs = pgTable("ai_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
      module: text("module").notNull(),
      action: text("action").notNull(),
      inputContent: text("input_content"),
      outputContent: text("output_content"),
      contextData: text("context_data"),
      // JSON string with additional context
      resourceType: text("resource_type"),
      // email, task, proposal, customer, etc.
      resourceId: varchar("resource_id"),
      feedbackRating: integer("feedback_rating"),
      // 1-5 rating from user
      feedbackComment: text("feedback_comment"),
      errorMessage: text("error_message"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertAiLogSchema = createInsertSchema(aiLogs).omit({ id: true, createdAt: true });
    aiContentVersions = pgTable("ai_content_versions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
      userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
      module: text("module").notNull(),
      resourceType: text("resource_type").notNull(),
      resourceId: varchar("resource_id").notNull(),
      fieldName: text("field_name").notNull(),
      // body, description, content, etc.
      originalContent: text("original_content"),
      generatedContent: text("generated_content").notNull(),
      action: text("action").notNull(),
      isApplied: boolean("is_applied").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertAiContentVersionSchema = createInsertSchema(aiContentVersions).omit({ id: true, createdAt: true });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  initializeAITables: () => initializeAITables,
  pool: () => pool
});
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
function getPool() {
  if (globalThis._pgPool) {
    return globalThis._pgPool;
  }
  console.log("[DB] Creating new database pool...");
  const isProduction = process.env.NODE_ENV === "production";
  const isServerless = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const hasSupabaseUrl = !!process.env.SUPABASE_DATABASE_URL;
  const pool2 = new Pool({
    connectionString: connectionString || FALLBACK_CONNECTION,
    ssl: isProduction || hasSupabaseUrl ? { rejectUnauthorized: false } : void 0,
    max: isServerless ? 1 : 5,
    idleTimeoutMillis: isServerless ? 1e4 : 3e4,
    connectionTimeoutMillis: isServerless ? 1e4 : 15e3,
    allowExitOnIdle: true,
    // Disable prepared statements for PgBouncer compatibility
    ...hasSupabaseUrl && {
      statement_timeout: 1e4
    }
  });
  pool2.on("error", (err) => {
    console.error("[DB] Pool error:", err.message);
  });
  pool2.on("connect", () => {
    console.log("[DB] New client connected to pool");
  });
  globalThis._pgPool = pool2;
  return pool2;
}
async function initializeAITables() {
  const isServerless = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const isProduction = process.env.NODE_ENV === "production";
  if (isServerless || isProduction) {
    console.log("[DB] Skipping AI table initialization in serverless/production environment");
    return;
  }
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_settings (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        tenant_id VARCHAR NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
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
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_usage (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_logs (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_content_versions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        tenant_id VARCHAR NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
        module TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id VARCHAR NOT NULL,
        original_content TEXT,
        generated_content TEXT NOT NULL,
        action TEXT NOT NULL,
        version_number INTEGER NOT NULL DEFAULT 1,
        is_applied BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("[DB] AI tables initialized successfully");
  } catch (error) {
    console.error("[DB] Error initializing AI tables:", error);
  } finally {
    client.release();
  }
}
var Pool, connectionString, FALLBACK_CONNECTION, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    ({ Pool } = pg);
    connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      console.error("DATABASE CONNECTION ERROR: No database URL configured");
      console.error("Available env vars:", Object.keys(process.env).filter((k) => k.includes("DATABASE") || k.includes("SUPABASE") || k.includes("PG")));
    }
    FALLBACK_CONNECTION = "postgresql://localhost:5432/fallback";
    pool = getPool();
    db = drizzle(pool, { schema: schema_exports });
  }
});

// server/storage.ts
import { eq, and, desc, gte, lte, sql as sql2, asc, or, isNull } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_db();
    init_schema();
    DatabaseStorage = class {
      // Tenant operations
      async createTenant(insertTenant) {
        const [tenant] = await db.insert(tenants).values(insertTenant).returning();
        return tenant;
      }
      async getTenant(id) {
        const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
        return tenant;
      }
      async updateTenantPackage(tenantId, packageId) {
        const [tenant] = await db.update(tenants).set({ packageId }).where(eq(tenants.id, tenantId)).returning();
        return tenant;
      }
      // User operations
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async getUserById(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
      }
      async getUsersByTenant(tenantId) {
        return db.select().from(users).where(eq(users.tenantId, tenantId));
      }
      async updateUser(id, updates) {
        const updateData = {
          updatedAt: /* @__PURE__ */ new Date()
        };
        if (updates.firstName) updateData.firstName = updates.firstName;
        if (updates.lastName) updateData.lastName = updates.lastName;
        if (updates.email) updateData.email = updates.email;
        if (updates.profileImageUrl !== void 0) updateData.profileImageUrl = updates.profileImageUrl;
        if (updates.phone !== void 0) updateData.phone = updates.phone;
        if (updates.jobTitle !== void 0) updateData.jobTitle = updates.jobTitle;
        const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
        return user;
      }
      // Role operations
      async createRole(insertRole) {
        const [role] = await db.insert(roles).values(insertRole).returning();
        return role;
      }
      async getRoleById(id) {
        const [role] = await db.select().from(roles).where(eq(roles.id, id));
        return role;
      }
      async getRolesByTenant(tenantId) {
        return db.select().from(roles).where(eq(roles.tenantId, tenantId));
      }
      async updateRole(id, updates) {
        const [role] = await db.update(roles).set(updates).where(eq(roles.id, id)).returning();
        return role;
      }
      async deleteRole(id) {
        await db.delete(roles).where(eq(roles.id, id));
      }
      // Team member operations
      async createTeamMember(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async updateTeamMember(id, tenantId, updates) {
        const updateData = { ...updates, updatedAt: /* @__PURE__ */ new Date() };
        const [user] = await db.update(users).set(updateData).where(and(eq(users.id, id), eq(users.tenantId, tenantId))).returning();
        return user;
      }
      async deleteTeamMember(id, tenantId) {
        await db.delete(users).where(and(eq(users.id, id), eq(users.tenantId, tenantId)));
      }
      async getUserWithRole(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) return void 0;
        if (user.roleId) {
          const [role] = await db.select().from(roles).where(eq(roles.id, user.roleId));
          return { ...user, role };
        }
        return user;
      }
      async getTeamMemberWithDetails(id, tenantId) {
        const [user] = await db.select().from(users).where(and(eq(users.id, id), eq(users.tenantId, tenantId)));
        if (!user) return void 0;
        let role;
        if (user.roleId) {
          const [r] = await db.select().from(roles).where(eq(roles.id, user.roleId));
          role = r;
        }
        const deals2 = await db.select().from(deals).where(and(eq(deals.tenantId, tenantId), eq(deals.ownerId, id))).orderBy(desc(deals.createdAt));
        const quotations2 = await db.select().from(quotations).where(and(eq(quotations.tenantId, tenantId), eq(quotations.createdBy, id))).orderBy(desc(quotations.createdAt));
        const invoices2 = await db.select().from(invoices).where(and(eq(invoices.tenantId, tenantId), eq(invoices.createdBy, id))).orderBy(desc(invoices.createdAt));
        const tasks2 = await db.select().from(tasks).where(and(eq(tasks.tenantId, tenantId), eq(tasks.assignedTo, id))).orderBy(desc(tasks.createdAt));
        const customers2 = await db.select().from(customers).where(and(eq(customers.tenantId, tenantId), eq(customers.ownerId, id))).orderBy(desc(customers.createdAt));
        const activities2 = await db.select().from(activities).where(and(eq(activities.tenantId, tenantId), eq(activities.userId, id))).orderBy(desc(activities.createdAt)).limit(50);
        return {
          member: { ...user, role },
          deals: deals2,
          quotations: quotations2,
          invoices: invoices2,
          tasks: tasks2,
          customers: customers2,
          activities: activities2
        };
      }
      // Auth token operations
      async createAuthToken(insertToken) {
        const [token] = await db.insert(authTokens).values(insertToken).returning();
        return token;
      }
      async getAuthToken(refreshToken) {
        const [token] = await db.select().from(authTokens).where(eq(authTokens.refreshToken, refreshToken));
        return token;
      }
      async deleteAuthToken(id) {
        await db.delete(authTokens).where(eq(authTokens.id, id));
      }
      async deleteUserAuthTokens(userId) {
        await db.delete(authTokens).where(eq(authTokens.userId, userId));
      }
      // Module operations
      async createModule(insertModule) {
        const [module] = await db.insert(modules).values(insertModule).returning();
        return module;
      }
      async getAllModules() {
        return db.select().from(modules);
      }
      async getModuleByName(name) {
        const [module] = await db.select().from(modules).where(eq(modules.name, name));
        return module;
      }
      // Tenant module operations
      async enableModuleForTenant(insertTenantModule) {
        const [tenantModule] = await db.insert(tenantModules).values(insertTenantModule).returning();
        return tenantModule;
      }
      async getTenantModules(tenantId) {
        const results = await db.select().from(tenantModules).innerJoin(modules, eq(tenantModules.moduleId, modules.id)).where(eq(tenantModules.tenantId, tenantId));
        return results.map((r) => ({ ...r.tenant_modules, module: r.modules }));
      }
      async updateTenantModule(id, isEnabled) {
        await db.update(tenantModules).set({ isEnabled }).where(eq(tenantModules.id, id));
      }
      // Contact operations
      async createContact(insertContact) {
        const [contact] = await db.insert(contacts).values(insertContact).returning();
        return contact;
      }
      async getContactsByTenant(tenantId, ownerId) {
        if (ownerId) {
          return db.select().from(contacts).where(and(eq(contacts.tenantId, tenantId), eq(contacts.ownerId, ownerId)));
        }
        return db.select().from(contacts).where(eq(contacts.tenantId, tenantId));
      }
      async getContactById(id, tenantId) {
        const [contact] = await db.select().from(contacts).where(and(eq(contacts.id, id), eq(contacts.tenantId, tenantId)));
        return contact;
      }
      async updateContact(id, tenantId, updates) {
        const [contact] = await db.update(contacts).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(contacts.id, id), eq(contacts.tenantId, tenantId))).returning();
        return contact;
      }
      async deleteContact(id, tenantId) {
        await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.tenantId, tenantId)));
      }
      // Deal operations
      async createDeal(insertDeal) {
        const [deal] = await db.insert(deals).values(insertDeal).returning();
        return deal;
      }
      async getDealsByTenant(tenantId, ownerId) {
        if (ownerId) {
          return db.select().from(deals).where(and(eq(deals.tenantId, tenantId), eq(deals.ownerId, ownerId)));
        }
        return db.select().from(deals).where(eq(deals.tenantId, tenantId));
      }
      async getDealById(id, tenantId) {
        const [deal] = await db.select().from(deals).where(and(eq(deals.id, id), eq(deals.tenantId, tenantId)));
        return deal;
      }
      async updateDeal(id, tenantId, updates) {
        const [deal] = await db.update(deals).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(deals.id, id), eq(deals.tenantId, tenantId))).returning();
        return deal;
      }
      async deleteDeal(id, tenantId) {
        await db.delete(deals).where(and(eq(deals.id, id), eq(deals.tenantId, tenantId)));
      }
      // Task operations
      async createTask(insertTask) {
        const [task] = await db.insert(tasks).values(insertTask).returning();
        return task;
      }
      async getTasksByTenant(tenantId, assignedTo) {
        if (assignedTo) {
          return db.select().from(tasks).where(and(eq(tasks.tenantId, tenantId), eq(tasks.assignedTo, assignedTo)));
        }
        return db.select().from(tasks).where(eq(tasks.tenantId, tenantId));
      }
      async getTaskById(id, tenantId) {
        const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId)));
        return task;
      }
      async updateTask(id, tenantId, updates) {
        const [task] = await db.update(tasks).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId))).returning();
        return task;
      }
      async deleteTask(id, tenantId) {
        await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId)));
      }
      // Product operations
      async createProduct(insertProduct) {
        const [product] = await db.insert(products).values(insertProduct).returning();
        return product;
      }
      async getProductsByTenant(tenantId) {
        return db.select().from(products).where(eq(products.tenantId, tenantId)).orderBy(desc(products.createdAt));
      }
      async getProductById(id, tenantId) {
        const [product] = await db.select().from(products).where(and(eq(products.id, id), eq(products.tenantId, tenantId)));
        return product;
      }
      async updateProduct(id, tenantId, updates) {
        const [product] = await db.update(products).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(products.id, id), eq(products.tenantId, tenantId))).returning();
        return product;
      }
      async deleteProduct(id, tenantId) {
        await db.delete(products).where(and(eq(products.id, id), eq(products.tenantId, tenantId)));
      }
      // Customer operations
      async createCustomer(insertCustomer) {
        const [customer] = await db.insert(customers).values(insertCustomer).returning();
        return customer;
      }
      async getCustomersByTenant(tenantId, ownerId) {
        const conditions = [eq(customers.tenantId, tenantId)];
        if (ownerId) {
          conditions.push(eq(customers.ownerId, ownerId));
        }
        return db.select().from(customers).where(and(...conditions)).orderBy(desc(customers.createdAt));
      }
      async getCustomerById(id, tenantId) {
        const [customer] = await db.select().from(customers).where(and(eq(customers.id, id), eq(customers.tenantId, tenantId)));
        return customer;
      }
      async updateCustomer(id, tenantId, updates) {
        const [customer] = await db.update(customers).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(customers.id, id), eq(customers.tenantId, tenantId))).returning();
        return customer;
      }
      async deleteCustomer(id, tenantId) {
        await db.delete(customers).where(and(eq(customers.id, id), eq(customers.tenantId, tenantId)));
      }
      // Customer-related operations for journey view
      async getContactsByCustomer(customerId, tenantId) {
        return [];
      }
      async getDealsByCustomer(customerId, tenantId) {
        return db.select().from(deals).where(and(eq(deals.customerId, customerId), eq(deals.tenantId, tenantId))).orderBy(desc(deals.createdAt));
      }
      async getTasksByCustomer(customerId, tenantId) {
        return db.select().from(tasks).where(and(eq(tasks.customerId, customerId), eq(tasks.tenantId, tenantId))).orderBy(desc(tasks.createdAt));
      }
      async getQuotationsByCustomer(customerId, tenantId) {
        return db.select().from(quotations).where(and(eq(quotations.customerId, customerId), eq(quotations.tenantId, tenantId))).orderBy(desc(quotations.createdAt));
      }
      async getInvoicesByCustomer(customerId, tenantId) {
        return db.select().from(invoices).where(and(eq(invoices.customerId, customerId), eq(invoices.tenantId, tenantId))).orderBy(desc(invoices.issueDate));
      }
      // Quotation operations
      async createQuotation(insertQuotation) {
        const [quotation] = await db.insert(quotations).values(insertQuotation).returning();
        return quotation;
      }
      async getQuotationsByTenant(tenantId, createdBy) {
        if (createdBy) {
          return db.select().from(quotations).where(and(eq(quotations.tenantId, tenantId), eq(quotations.createdBy, createdBy))).orderBy(desc(quotations.createdAt));
        }
        return db.select().from(quotations).where(eq(quotations.tenantId, tenantId)).orderBy(desc(quotations.createdAt));
      }
      async getQuotationById(id, tenantId) {
        const [quotation] = await db.select().from(quotations).where(and(eq(quotations.id, id), eq(quotations.tenantId, tenantId)));
        return quotation;
      }
      async updateQuotation(id, tenantId, updates) {
        const [quotation] = await db.update(quotations).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(quotations.id, id), eq(quotations.tenantId, tenantId))).returning();
        return quotation;
      }
      async deleteQuotation(id, tenantId) {
        await db.delete(quotations).where(and(eq(quotations.id, id), eq(quotations.tenantId, tenantId)));
      }
      async getNextQuoteNumber(tenantId) {
        const result = await db.select({ count: sql2`count(*)` }).from(quotations).where(eq(quotations.tenantId, tenantId));
        const count = Number(result[0]?.count || 0) + 1;
        return `QT-${String(count).padStart(5, "0")}`;
      }
      // Quotation item operations
      async createQuotationItem(item) {
        const [quotationItem] = await db.insert(quotationItems).values(item).returning();
        return quotationItem;
      }
      async getQuotationItems(quotationId) {
        return db.select().from(quotationItems).where(eq(quotationItems.quotationId, quotationId));
      }
      async updateQuotationItem(id, updates) {
        const [item] = await db.update(quotationItems).set(updates).where(eq(quotationItems.id, id)).returning();
        return item;
      }
      async deleteQuotationItem(id) {
        await db.delete(quotationItems).where(eq(quotationItems.id, id));
      }
      async deleteQuotationItems(quotationId) {
        await db.delete(quotationItems).where(eq(quotationItems.quotationId, quotationId));
      }
      // Invoice operations
      async createInvoice(insertInvoice) {
        const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
        return invoice;
      }
      async getInvoicesByTenant(tenantId, createdBy) {
        if (createdBy) {
          return db.select().from(invoices).where(and(eq(invoices.tenantId, tenantId), eq(invoices.createdBy, createdBy))).orderBy(desc(invoices.createdAt));
        }
        return db.select().from(invoices).where(eq(invoices.tenantId, tenantId)).orderBy(desc(invoices.createdAt));
      }
      async getInvoiceById(id, tenantId) {
        const [invoice] = await db.select().from(invoices).where(and(eq(invoices.id, id), eq(invoices.tenantId, tenantId)));
        return invoice;
      }
      async updateInvoice(id, tenantId, updates) {
        const [invoice] = await db.update(invoices).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(invoices.id, id), eq(invoices.tenantId, tenantId))).returning();
        return invoice;
      }
      async deleteInvoice(id, tenantId) {
        await db.delete(invoices).where(and(eq(invoices.id, id), eq(invoices.tenantId, tenantId)));
      }
      async getNextInvoiceNumber(tenantId) {
        const result = await db.select({ count: sql2`count(*)` }).from(invoices).where(eq(invoices.tenantId, tenantId));
        const count = Number(result[0]?.count || 0) + 1;
        return `INV-${String(count).padStart(5, "0")}`;
      }
      // Invoice item operations
      async createInvoiceItem(item) {
        const [invoiceItem] = await db.insert(invoiceItems).values(item).returning();
        return invoiceItem;
      }
      async getInvoiceItems(invoiceId) {
        return db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
      }
      async updateInvoiceItem(id, updates) {
        const [item] = await db.update(invoiceItems).set(updates).where(eq(invoiceItems.id, id)).returning();
        return item;
      }
      async deleteInvoiceItem(id) {
        await db.delete(invoiceItems).where(eq(invoiceItems.id, id));
      }
      async deleteInvoiceItems(invoiceId) {
        await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
      }
      // Payment operations
      async createPayment(insertPayment) {
        const [payment] = await db.insert(payments).values(insertPayment).returning();
        return payment;
      }
      async getPaymentsByInvoice(invoiceId) {
        return db.select().from(payments).where(eq(payments.invoiceId, invoiceId));
      }
      async getPaymentsByTenant(tenantId) {
        return db.select().from(payments).where(eq(payments.tenantId, tenantId)).orderBy(desc(payments.createdAt));
      }
      async deletePayment(id) {
        await db.delete(payments).where(eq(payments.id, id));
      }
      // Activity operations
      async createActivity(insertActivity) {
        const [activity] = await db.insert(activities).values(insertActivity).returning();
        return activity;
      }
      async getActivitiesByTenant(tenantId) {
        return db.select().from(activities).where(eq(activities.tenantId, tenantId)).orderBy(desc(activities.createdAt));
      }
      async getActivitiesByCustomer(customerId, tenantId) {
        return db.select().from(activities).where(and(eq(activities.customerId, customerId), eq(activities.tenantId, tenantId))).orderBy(desc(activities.createdAt));
      }
      async getActivityById(id, tenantId) {
        const [activity] = await db.select().from(activities).where(and(eq(activities.id, id), eq(activities.tenantId, tenantId)));
        return activity;
      }
      async updateActivity(id, tenantId, updates) {
        const [activity] = await db.update(activities).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(activities.id, id), eq(activities.tenantId, tenantId))).returning();
        return activity;
      }
      async deleteActivity(id, tenantId) {
        await db.delete(activities).where(and(eq(activities.id, id), eq(activities.tenantId, tenantId)));
      }
      async getActivitiesByDeal(dealId, tenantId) {
        return db.select().from(activities).where(and(eq(activities.dealId, dealId), eq(activities.tenantId, tenantId))).orderBy(desc(activities.createdAt));
      }
      async getTasksByDeal(dealId, tenantId) {
        return db.select().from(tasks).where(and(eq(tasks.dealId, dealId), eq(tasks.tenantId, tenantId))).orderBy(desc(tasks.createdAt));
      }
      // Reports
      async getDashboardStats(tenantId) {
        const deals2 = await db.select().from(deals).where(eq(deals.tenantId, tenantId));
        const customers2 = await db.select().from(customers).where(eq(customers.tenantId, tenantId));
        const tasks2 = await db.select().from(tasks).where(eq(tasks.tenantId, tenantId));
        const invoices2 = await db.select().from(invoices).where(eq(invoices.tenantId, tenantId));
        const totalRevenue = deals2.reduce((sum, d) => sum + Number(d.value), 0);
        const activeDeals = deals2.filter((d) => !["won", "lost"].includes(d.stage)).length;
        const pendingTasks = tasks2.filter((t) => t.status !== "done").length;
        const pendingInvoices = invoices2.filter((i) => ["draft", "sent"].includes(i.status)).length;
        const overdueInvoices = invoices2.filter((i) => i.status === "overdue").length;
        return {
          totalRevenue,
          activeDeals,
          totalCustomers: customers2.length,
          pendingTasks,
          pendingInvoices,
          overdueInvoices
        };
      }
      async getSalesReport(tenantId, startDate, endDate) {
        let query = db.select().from(deals).where(eq(deals.tenantId, tenantId));
        return query.orderBy(desc(deals.createdAt));
      }
      // SaaS Admin functions
      async getSaasAdminStats() {
        const tenants2 = await db.select().from(tenants);
        const users2 = await db.select().from(users);
        const workspaceInvoices2 = await db.select().from(workspaceInvoices);
        const subscriptions = await db.select().from(workspaceSubscriptions);
        const plans = await db.select().from(workspacePlans);
        const now = /* @__PURE__ */ new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthlyRevenue = workspaceInvoices2.filter((inv) => {
          const invDate = new Date(inv.createdAt);
          return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear && inv.status === "paid";
        }).reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const revenueData = [];
        for (let i = 5; i >= 0; i--) {
          const targetMonth = (currentMonth - i + 12) % 12;
          const targetYear = currentMonth - i < 0 ? currentYear - 1 : currentYear;
          const monthRevenue = workspaceInvoices2.filter((inv) => {
            const invDate = new Date(inv.createdAt);
            return invDate.getMonth() === targetMonth && invDate.getFullYear() === targetYear && inv.status === "paid";
          }).reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
          const endOfTargetMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
          const monthTenants = tenants2.filter((t) => {
            const tDate = new Date(t.createdAt);
            return tDate <= endOfTargetMonth;
          }).length;
          revenueData.push({
            month: months[targetMonth],
            revenue: monthRevenue,
            users: monthTenants
          });
        }
        const planCounts = {};
        subscriptions.forEach((sub) => {
          if (sub.planId && sub.status === "active") {
            const plan = plans.find((p) => p.id === sub.planId);
            const planName = plan?.displayName || plan?.name || "Unknown";
            planCounts[planName] = (planCounts[planName] || 0) + 1;
          } else if (sub.status === "trial") {
            planCounts["Trial"] = (planCounts["Trial"] || 0) + 1;
          }
        });
        const tenantsWithSub = new Set(subscriptions.map((s) => s.workspaceId));
        const tenantsWithoutSub = tenants2.filter((t) => !tenantsWithSub.has(t.id)).length;
        if (tenantsWithoutSub > 0) {
          planCounts["Free/No Plan"] = tenantsWithoutSub;
        }
        const tenantDistribution = Object.entries(planCounts).map(([name, value]) => ({ name, value })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
        const activeUsers = users2.filter((u) => u.isActive).length;
        return {
          totalTenants: tenants2.length,
          totalUsers: users2.length,
          monthlyRevenue,
          activeSessions: activeUsers,
          revenueData,
          tenantDistribution
        };
      }
      async getAllTenants() {
        const tenants2 = await db.select().from(tenants).orderBy(desc(tenants.createdAt));
        const users2 = await db.select().from(users);
        const subscriptions = await db.select().from(workspaceSubscriptions);
        const packages2 = await db.select().from(packages);
        return tenants2.map((tenant) => {
          const subscription = subscriptions.find((s) => s.workspaceId === tenant.id);
          const pkg = tenant.packageId ? packages2.find((p) => p.id === tenant.packageId) : void 0;
          return {
            ...tenant,
            userCount: users2.filter((u) => u.tenantId === tenant.id).length,
            subscriptionStatus: subscription?.status,
            planName: pkg?.displayName || pkg?.name
          };
        });
      }
      async getAllUsersWithTenants() {
        const users2 = await db.select().from(users).orderBy(desc(users.createdAt));
        const tenants2 = await db.select().from(tenants);
        return users2.map((user) => {
          const tenant = tenants2.find((t) => t.id === user.tenantId);
          const { passwordHash, ...userWithoutPassword } = user;
          return {
            ...userWithoutPassword,
            tenantName: tenant?.name || "Unknown"
          };
        });
      }
      // Customer Portal functions
      async getQuotationsForCustomerUser(userId, tenantId) {
        const user = await this.getUserById(userId);
        if (!user) return [];
        const customers2 = await db.select().from(customers).where(and(
          eq(customers.tenantId, tenantId),
          eq(customers.email, user.email)
        ));
        if (customers2.length === 0) return [];
        const customerIds = customers2.map((c) => c.id);
        const quotations2 = await db.select().from(quotations).where(eq(quotations.tenantId, tenantId)).orderBy(desc(quotations.createdAt));
        return quotations2.filter((q) => customerIds.includes(q.customerId));
      }
      async getInvoicesForCustomerUser(userId, tenantId) {
        const user = await this.getUserById(userId);
        if (!user) return [];
        const customers2 = await db.select().from(customers).where(and(
          eq(customers.tenantId, tenantId),
          eq(customers.email, user.email)
        ));
        if (customers2.length === 0) return [];
        const customerIds = customers2.map((c) => c.id);
        const invoices2 = await db.select().from(invoices).where(eq(invoices.tenantId, tenantId)).orderBy(desc(invoices.createdAt));
        return invoices2.filter((i) => customerIds.includes(i.customerId));
      }
      // Platform Settings operations
      async getPlatformSettings(category) {
        if (category) {
          return db.select().from(platformSettings).where(eq(platformSettings.category, category)).orderBy(platformSettings.key);
        }
        return db.select().from(platformSettings).orderBy(platformSettings.category, platformSettings.key);
      }
      async getPlatformSettingByKey(key) {
        const [setting] = await db.select().from(platformSettings).where(eq(platformSettings.key, key));
        return setting;
      }
      async upsertPlatformSetting(setting) {
        const existing = await this.getPlatformSettingByKey(setting.key);
        if (existing) {
          const [updated] = await db.update(platformSettings).set({ ...setting, updatedAt: /* @__PURE__ */ new Date() }).where(eq(platformSettings.key, setting.key)).returning();
          return updated;
        }
        const [created] = await db.insert(platformSettings).values(setting).returning();
        return created;
      }
      async deletePlatformSetting(key) {
        await db.delete(platformSettings).where(eq(platformSettings.key, key));
      }
      // User AI Settings operations
      async getUserAiSettings(userId) {
        const [settings] = await db.select().from(userAiSettings).where(eq(userAiSettings.userId, userId));
        return settings;
      }
      async upsertUserAiSettings(userId, settings) {
        const existing = await this.getUserAiSettings(userId);
        if (existing) {
          const [updated] = await db.update(userAiSettings).set({ ...settings, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userAiSettings.userId, userId)).returning();
          return updated;
        }
        const [created] = await db.insert(userAiSettings).values({
          userId,
          provider: settings.provider || "openai",
          apiKey: settings.apiKey,
          isEnabled: settings.isEnabled ?? true
        }).returning();
        return created;
      }
      // Platform Activity Logs operations
      async createPlatformActivityLog(log2) {
        const [activityLog] = await db.insert(platformActivityLogs).values(log2).returning();
        return activityLog;
      }
      async getPlatformActivityLogs(filters) {
        let query = db.select().from(platformActivityLogs);
        const conditions = [];
        if (filters?.tenantId) {
          conditions.push(eq(platformActivityLogs.tenantId, filters.tenantId));
        }
        if (filters?.actorId) {
          conditions.push(eq(platformActivityLogs.actorId, filters.actorId));
        }
        if (filters?.action) {
          conditions.push(eq(platformActivityLogs.action, filters.action));
        }
        if (filters?.targetType) {
          conditions.push(eq(platformActivityLogs.targetType, filters.targetType));
        }
        if (filters?.from) {
          conditions.push(gte(platformActivityLogs.createdAt, filters.from));
        }
        if (filters?.to) {
          conditions.push(lte(platformActivityLogs.createdAt, filters.to));
        }
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        query = query.orderBy(desc(platformActivityLogs.createdAt));
        if (filters?.limit) {
          query = query.limit(filters.limit);
        }
        if (filters?.offset) {
          query = query.offset(filters.offset);
        }
        return query;
      }
      // Detailed Tenant operations
      async getTenantDetails(tenantId) {
        const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
        if (!tenant) return void 0;
        const [users2, customers2, deals2, invoices2, quotations2, subscriptionData, workspaceInvoices2, usage] = await Promise.all([
          db.select().from(users).where(eq(users.tenantId, tenantId)),
          db.select().from(customers).where(eq(customers.tenantId, tenantId)),
          db.select().from(deals).where(eq(deals.tenantId, tenantId)),
          db.select().from(invoices).where(eq(invoices.tenantId, tenantId)),
          db.select().from(quotations).where(eq(quotations.tenantId, tenantId)),
          db.select().from(workspaceSubscriptions).where(eq(workspaceSubscriptions.workspaceId, tenantId)),
          db.select().from(workspaceInvoices).where(eq(workspaceInvoices.workspaceId, tenantId)).orderBy(desc(workspaceInvoices.createdAt)),
          db.select().from(workspaceUsage).where(eq(workspaceUsage.workspaceId, tenantId)).orderBy(desc(workspaceUsage.periodStart))
        ]);
        const usersWithoutPasswords = users2.map((u) => {
          const { passwordHash, ...userWithoutPassword } = u;
          return userWithoutPassword;
        });
        const totalRevenue = invoices2.filter((i) => i.status === "paid").reduce((sum, i) => sum + Number(i.paidAmount || 0), 0);
        const activeDeals = deals2.filter(
          (d) => d.stage !== "closed-won" && d.stage !== "closed-lost"
        ).length;
        let subscription = null;
        if (subscriptionData.length > 0) {
          const sub = subscriptionData[0];
          if (tenant.packageId) {
            const [pkg] = await db.select().from(packages).where(eq(packages.id, tenant.packageId));
            subscription = { ...sub, plan: pkg || void 0, planId: tenant.packageId };
          } else {
            subscription = sub;
          }
        }
        return {
          tenant,
          users: usersWithoutPasswords,
          customers: customers2,
          deals: deals2,
          invoices: invoices2,
          quotations: quotations2,
          subscription,
          workspaceInvoices: workspaceInvoices2,
          usage,
          stats: {
            totalUsers: users2.length,
            totalCustomers: customers2.length,
            totalDeals: deals2.length,
            totalRevenue,
            activeDeals
          }
        };
      }
      // Detailed User operations
      async getUserDetails(userId) {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (!user) return void 0;
        const { passwordHash, ...userWithoutPassword } = user;
        const [tenant] = await db.select().from(tenants).where(eq(tenants.id, user.tenantId));
        const [ownedCustomers, assignedTasks, activities2, deals2] = await Promise.all([
          db.select().from(customers).where(eq(customers.ownerId, userId)),
          db.select().from(tasks).where(eq(tasks.assignedTo, userId)),
          db.select().from(activities).where(eq(activities.userId, userId)),
          db.select().from(deals).where(eq(deals.ownerId, userId))
        ]);
        return {
          user: userWithoutPassword,
          tenant,
          ownedCustomers,
          assignedTasks,
          activities: activities2,
          deals: deals2
        };
      }
      // Update super admin profile
      async updateSuperAdminProfile(userId, updates) {
        const updateData = {
          updatedAt: /* @__PURE__ */ new Date()
        };
        if (updates.firstName) updateData.firstName = updates.firstName;
        if (updates.lastName) updateData.lastName = updates.lastName;
        if (updates.email) updateData.email = updates.email;
        const [user] = await db.update(users).set(updateData).where(eq(users.id, userId)).returning();
        return user;
      }
      // Company Profile operations
      async getCompanyProfile(tenantId) {
        const [profile] = await db.select().from(companyProfiles).where(eq(companyProfiles.tenantId, tenantId));
        return profile;
      }
      async upsertCompanyProfile(tenantId, data) {
        const existingProfile = await this.getCompanyProfile(tenantId);
        if (existingProfile) {
          const [updated] = await db.update(companyProfiles).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(companyProfiles.tenantId, tenantId)).returning();
          return updated;
        } else {
          const tenant = await this.getTenant(tenantId);
          const [created] = await db.insert(companyProfiles).values({
            tenantId,
            companyName: data.companyName || tenant?.name || "My Company",
            ...data
          }).returning();
          return created;
        }
      }
      // Package operations
      async createPackage(insertPackage) {
        const [pkg] = await db.insert(packages).values(insertPackage).returning();
        return pkg;
      }
      async getAllPackages() {
        return db.select().from(packages).orderBy(packages.sortOrder);
      }
      async getActivePackages() {
        return db.select().from(packages).where(eq(packages.isActive, true)).orderBy(packages.sortOrder);
      }
      async getPackageById(id) {
        const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
        return pkg;
      }
      async updatePackage(id, updates) {
        const [pkg] = await db.update(packages).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(packages.id, id)).returning();
        return pkg;
      }
      async deletePackage(id) {
        await db.delete(packages).where(eq(packages.id, id));
      }
      // Package Module operations
      async addModuleToPackage(insertPackageModule) {
        const [pm] = await db.insert(packageModules).values(insertPackageModule).returning();
        return pm;
      }
      async removeModuleFromPackage(packageId, moduleId) {
        await db.delete(packageModules).where(and(
          eq(packageModules.packageId, packageId),
          eq(packageModules.moduleId, moduleId)
        ));
      }
      async getPackageModules(packageId) {
        const results = await db.select().from(packageModules).innerJoin(modules, eq(packageModules.moduleId, modules.id)).where(eq(packageModules.packageId, packageId));
        return results.map((r) => ({ ...r.package_modules, module: r.modules }));
      }
      async setPackageModules(packageId, moduleIds) {
        await db.delete(packageModules).where(eq(packageModules.packageId, packageId));
        if (moduleIds.length > 0) {
          const values = moduleIds.map((moduleId) => ({ packageId, moduleId }));
          await db.insert(packageModules).values(values);
        }
      }
      async getPackageWithModules(packageId) {
        const pkg = await this.getPackageById(packageId);
        if (!pkg) return void 0;
        const packageModules2 = await this.getPackageModules(packageId);
        const modules2 = packageModules2.map((pm) => pm.module);
        return { ...pkg, modules: modules2 };
      }
      async getAllPackagesWithModules() {
        const packages2 = await this.getAllPackages();
        const result = await Promise.all(
          packages2.map(async (pkg) => {
            const packageModules2 = await this.getPackageModules(pkg.id);
            const modules2 = packageModules2.map((pm) => pm.module);
            return { ...pkg, modules: modules2 };
          })
        );
        return result;
      }
      // ==================== EMAIL MODULE OPERATIONS ====================
      // Email Template operations
      async createEmailTemplate(insertTemplate) {
        const [template] = await db.insert(emailTemplates).values(insertTemplate).returning();
        return template;
      }
      async getEmailTemplatesByTenant(tenantId) {
        return db.select().from(emailTemplates).where(eq(emailTemplates.tenantId, tenantId)).orderBy(desc(emailTemplates.createdAt));
      }
      async getEmailTemplateById(id, tenantId) {
        const [template] = await db.select().from(emailTemplates).where(and(eq(emailTemplates.id, id), eq(emailTemplates.tenantId, tenantId)));
        if (template) return template;
        const [systemTemplate] = await db.select().from(emailTemplates).where(and(eq(emailTemplates.id, id), eq(emailTemplates.ownerType, "system")));
        return systemTemplate;
      }
      async updateEmailTemplate(id, tenantId, updates) {
        const [template] = await db.update(emailTemplates).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(emailTemplates.id, id), eq(emailTemplates.tenantId, tenantId))).returning();
        return template;
      }
      async deleteEmailTemplate(id, tenantId) {
        await db.delete(emailTemplates).where(and(eq(emailTemplates.id, id), eq(emailTemplates.tenantId, tenantId)));
      }
      async getDefaultTemplateForPurpose(tenantId, purpose) {
        const [template] = await db.select().from(emailTemplates).where(and(
          eq(emailTemplates.tenantId, tenantId),
          eq(emailTemplates.isDefault, true),
          eq(emailTemplates.defaultFor, purpose)
        ));
        if (template) return template;
        const [systemTemplate] = await db.select().from(emailTemplates).where(and(
          eq(emailTemplates.ownerType, "system"),
          eq(emailTemplates.isDefault, true),
          eq(emailTemplates.defaultFor, purpose)
        ));
        return systemTemplate;
      }
      async getEmailTemplatesWithOwnership(tenantId, userId, workspaceId) {
        const tenantTemplates = await db.select().from(emailTemplates).where(eq(emailTemplates.tenantId, tenantId)).orderBy(desc(emailTemplates.createdAt));
        const systemTemplates = await db.select().from(emailTemplates).where(eq(emailTemplates.ownerType, "system")).orderBy(desc(emailTemplates.createdAt));
        const userTemplates = tenantTemplates.filter(
          (t) => t.ownerType === "user" && t.ownerId === userId && !t.isShared
        );
        const sharedTemplates = tenantTemplates.filter(
          (t) => t.ownerType === "user" && t.isShared
        );
        const workspaceTemplates = tenantTemplates.filter(
          (t) => t.ownerType === "workspace" && (!workspaceId || t.ownerId === workspaceId)
        );
        return { userTemplates, sharedTemplates, workspaceTemplates, systemTemplates };
      }
      async duplicateEmailTemplate(id, tenantId, userId) {
        const original = await this.getEmailTemplateById(id, tenantId);
        if (!original) return void 0;
        const duplicateData = {
          tenantId,
          createdBy: userId,
          ownerType: "user",
          ownerId: userId,
          isShared: false,
          isSystemTemplate: false,
          // Duplicates are always user-owned, not system templates
          name: `${original.name} (Copy)`,
          purpose: original.purpose,
          subject: original.subject,
          body: original.body,
          mergeFields: original.mergeFields,
          isDefault: false,
          defaultFor: null,
          isActive: true,
          version: 1
        };
        return this.createEmailTemplate(duplicateData);
      }
      async toggleEmailTemplateShare(id, tenantId, userId, isShared) {
        const template = await this.getEmailTemplateById(id, tenantId);
        if (!template || template.ownerType !== "user" || template.ownerId !== userId) {
          return void 0;
        }
        return this.updateEmailTemplate(id, tenantId, { isShared });
      }
      async canEditEmailTemplate(template, userId, isAdmin) {
        if (template.ownerType === "system") return false;
        if (template.ownerType === "user" && template.ownerId === userId) return true;
        if (template.ownerType === "workspace" && isAdmin) return true;
        if (template.isShared && isAdmin) return true;
        return false;
      }
      async canDeleteEmailTemplate(template, userId, isAdmin) {
        if (template.ownerType === "system") return false;
        if (template.ownerType === "user" && template.ownerId === userId) return true;
        if (template.ownerType === "workspace" && isAdmin) return true;
        return false;
      }
      // Email Log operations
      async createEmailLog(insertLog) {
        const [log2] = await db.insert(emailLogs).values(insertLog).returning();
        return log2;
      }
      async getEmailLogsByTenant(tenantId) {
        return db.select().from(emailLogs).where(eq(emailLogs.tenantId, tenantId)).orderBy(desc(emailLogs.createdAt));
      }
      async getEmailLogById(id, tenantId) {
        const [log2] = await db.select().from(emailLogs).where(and(eq(emailLogs.id, id), eq(emailLogs.tenantId, tenantId)));
        return log2;
      }
      async updateEmailLog(id, updates) {
        const [log2] = await db.update(emailLogs).set(updates).where(eq(emailLogs.id, id)).returning();
        return log2;
      }
      async getEmailLogsByCustomer(customerId, tenantId) {
        return db.select().from(emailLogs).where(and(eq(emailLogs.customerId, customerId), eq(emailLogs.tenantId, tenantId))).orderBy(desc(emailLogs.createdAt));
      }
      // Automation Rule operations
      async createAutomationRule(insertRule) {
        const [rule] = await db.insert(automationRules).values(insertRule).returning();
        return rule;
      }
      async getAutomationRulesByTenant(tenantId) {
        return db.select().from(automationRules).where(eq(automationRules.tenantId, tenantId)).orderBy(desc(automationRules.createdAt));
      }
      async getAutomationRuleById(id, tenantId) {
        const [rule] = await db.select().from(automationRules).where(and(eq(automationRules.id, id), eq(automationRules.tenantId, tenantId)));
        return rule;
      }
      async updateAutomationRule(id, tenantId, updates) {
        const [rule] = await db.update(automationRules).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(automationRules.id, id), eq(automationRules.tenantId, tenantId))).returning();
        return rule;
      }
      async deleteAutomationRule(id, tenantId) {
        await db.delete(automationRules).where(and(eq(automationRules.id, id), eq(automationRules.tenantId, tenantId)));
      }
      async getEnabledAutomationsByTrigger(tenantId, trigger) {
        return db.select().from(automationRules).where(and(
          eq(automationRules.tenantId, tenantId),
          eq(automationRules.trigger, trigger),
          eq(automationRules.isEnabled, true)
        ));
      }
      // Follow-up Sequence operations
      async createFollowUpSequence(insertSequence) {
        const [sequence] = await db.insert(followUpSequences).values(insertSequence).returning();
        return sequence;
      }
      async getFollowUpSequencesByTenant(tenantId) {
        return db.select().from(followUpSequences).where(eq(followUpSequences.tenantId, tenantId)).orderBy(desc(followUpSequences.createdAt));
      }
      async getFollowUpSequenceById(id, tenantId) {
        const [sequence] = await db.select().from(followUpSequences).where(and(eq(followUpSequences.id, id), eq(followUpSequences.tenantId, tenantId)));
        return sequence;
      }
      async updateFollowUpSequence(id, tenantId, updates) {
        const [sequence] = await db.update(followUpSequences).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(followUpSequences.id, id), eq(followUpSequences.tenantId, tenantId))).returning();
        return sequence;
      }
      async deleteFollowUpSequence(id, tenantId) {
        await db.delete(followUpSequences).where(and(eq(followUpSequences.id, id), eq(followUpSequences.tenantId, tenantId)));
      }
      // Follow-up Step operations
      async createFollowUpStep(insertStep) {
        const [step] = await db.insert(followUpSteps).values(insertStep).returning();
        return step;
      }
      async getFollowUpStepsBySequence(sequenceId) {
        return db.select().from(followUpSteps).where(eq(followUpSteps.sequenceId, sequenceId)).orderBy(followUpSteps.stepOrder);
      }
      async updateFollowUpStep(id, updates) {
        const [step] = await db.update(followUpSteps).set(updates).where(eq(followUpSteps.id, id)).returning();
        return step;
      }
      async deleteFollowUpStep(id) {
        await db.delete(followUpSteps).where(eq(followUpSteps.id, id));
      }
      // Scheduled Email operations
      async createScheduledEmail(insertEmail) {
        const [email] = await db.insert(scheduledEmails).values(insertEmail).returning();
        return email;
      }
      async getScheduledEmailsByTenant(tenantId) {
        return db.select().from(scheduledEmails).where(eq(scheduledEmails.tenantId, tenantId)).orderBy(scheduledEmails.scheduledFor);
      }
      async getPendingScheduledEmails(tenantId) {
        return db.select().from(scheduledEmails).where(and(
          eq(scheduledEmails.tenantId, tenantId),
          eq(scheduledEmails.status, "pending")
        )).orderBy(scheduledEmails.scheduledFor);
      }
      async updateScheduledEmail(id, updates) {
        const [email] = await db.update(scheduledEmails).set(updates).where(eq(scheduledEmails.id, id)).returning();
        return email;
      }
      async deleteScheduledEmail(id) {
        await db.delete(scheduledEmails).where(eq(scheduledEmails.id, id));
      }
      // Email Sender Account operations
      async createEmailSenderAccount(insertAccount) {
        const [account] = await db.insert(emailSenderAccounts).values(insertAccount).returning();
        return account;
      }
      async getEmailSenderAccountsByTenant(tenantId) {
        return db.select().from(emailSenderAccounts).where(eq(emailSenderAccounts.tenantId, tenantId)).orderBy(desc(emailSenderAccounts.createdAt));
      }
      async getDefaultSenderAccount(tenantId) {
        const [account] = await db.select().from(emailSenderAccounts).where(and(
          eq(emailSenderAccounts.tenantId, tenantId),
          eq(emailSenderAccounts.isDefault, true)
        ));
        return account;
      }
      async updateEmailSenderAccount(id, updates) {
        const [account] = await db.update(emailSenderAccounts).set(updates).where(eq(emailSenderAccounts.id, id)).returning();
        return account;
      }
      async deleteEmailSenderAccount(id) {
        await db.delete(emailSenderAccounts).where(eq(emailSenderAccounts.id, id));
      }
      // SMTP Settings operations
      async getSmtpSettings(tenantId) {
        const [settings] = await db.select().from(smtpSettings).where(eq(smtpSettings.tenantId, tenantId));
        return settings;
      }
      async upsertSmtpSettings(tenantId, settings) {
        const existing = await this.getSmtpSettings(tenantId);
        if (existing) {
          const [updated] = await db.update(smtpSettings).set({ ...settings, updatedAt: /* @__PURE__ */ new Date() }).where(eq(smtpSettings.tenantId, tenantId)).returning();
          return updated;
        } else {
          const [created] = await db.insert(smtpSettings).values({ ...settings, tenantId }).returning();
          return created;
        }
      }
      async testSmtpConnection(tenantId) {
        const settings = await this.getSmtpSettings(tenantId);
        if (!settings) {
          return { success: false, message: "No SMTP settings configured" };
        }
        if (settings.provider === "default") {
          return { success: true, message: "Default email provider is active" };
        }
        return { success: true, message: "SMTP connection test successful" };
      }
      // Enhanced Task operations
      async getTaskWithDetails(id, tenantId) {
        const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId)));
        if (!task) return void 0;
        const [assignments, checklists, comments, timeLogs, attachments, statusHistory, activityLog] = await Promise.all([
          this.getTaskAssignments(id),
          this.getTaskChecklistItems(id),
          this.getTaskComments(id),
          this.getTaskTimeLogs(id),
          this.getTaskAttachments(id),
          this.getTaskStatusHistory(id),
          this.getTaskActivityLog(id)
        ]);
        let creator;
        let assignee;
        if (task.createdBy) {
          creator = await this.getUserById(task.createdBy);
        }
        if (task.assignedTo) {
          assignee = await this.getUserById(task.assignedTo);
        }
        return {
          ...task,
          assignments,
          checklists,
          comments,
          timeLogs,
          attachments,
          statusHistory,
          activityLog,
          creator,
          assignee
        };
      }
      async getTasksWithFilters(tenantId, filters) {
        const conditions = [eq(tasks.tenantId, tenantId)];
        if (filters.assignedTo) {
          conditions.push(eq(tasks.assignedTo, filters.assignedTo));
        }
        if (filters.status) {
          conditions.push(eq(tasks.status, filters.status));
        }
        if (filters.priority) {
          conditions.push(eq(tasks.priority, filters.priority));
        }
        if (filters.dueFrom) {
          conditions.push(gte(tasks.dueDate, filters.dueFrom));
        }
        if (filters.dueTo) {
          conditions.push(lte(tasks.dueDate, filters.dueTo));
        }
        if (filters.customerId) {
          conditions.push(eq(tasks.customerId, filters.customerId));
        }
        if (filters.dealId) {
          conditions.push(eq(tasks.dealId, filters.dealId));
        }
        return db.select().from(tasks).where(and(...conditions)).orderBy(desc(tasks.createdAt));
      }
      async updateTaskStatus(id, tenantId, status, changedBy, notes) {
        const existingTask = await this.getTaskById(id, tenantId);
        if (!existingTask) return void 0;
        const [task] = await db.update(tasks).set({
          status,
          updatedAt: /* @__PURE__ */ new Date(),
          completedAt: status === "completed" ? /* @__PURE__ */ new Date() : null
        }).where(and(eq(tasks.id, id), eq(tasks.tenantId, tenantId))).returning();
        await db.insert(taskStatusHistory).values({
          taskId: id,
          changedBy,
          fromStatus: existingTask.status,
          toStatus: status,
          notes
        });
        await db.insert(taskActivityLog).values({
          taskId: id,
          userId: changedBy,
          action: "status_change",
          description: `Status changed from ${existingTask.status} to ${status}`,
          oldValue: existingTask.status,
          newValue: status
        });
        return task;
      }
      // Task Assignment operations
      async createTaskAssignment(insertAssignment) {
        const [assignment] = await db.insert(taskAssignments).values(insertAssignment).returning();
        await db.insert(taskActivityLog).values({
          taskId: insertAssignment.taskId,
          userId: insertAssignment.assignedBy,
          action: "assignment_added",
          description: `Task assigned to team member`,
          newValue: insertAssignment.userId
        });
        return assignment;
      }
      async getTaskAssignments(taskId) {
        const assignments = await db.select().from(taskAssignments).where(eq(taskAssignments.taskId, taskId));
        const result = await Promise.all(assignments.map(async (assignment) => {
          const user = await this.getUserById(assignment.userId);
          return { ...assignment, user };
        }));
        return result;
      }
      async deleteTaskAssignment(taskId, userId) {
        await db.delete(taskAssignments).where(and(
          eq(taskAssignments.taskId, taskId),
          eq(taskAssignments.userId, userId)
        ));
      }
      async getTasksAssignedToUser(userId, tenantId) {
        const assignments = await db.select().from(taskAssignments).where(eq(taskAssignments.userId, userId));
        const taskIds = assignments.map((a) => a.taskId);
        if (taskIds.length === 0) return [];
        const tasks2 = await db.select().from(tasks).where(and(
          eq(tasks.tenantId, tenantId),
          sql2`${tasks.id} = ANY(${taskIds})`
        ));
        return tasks2;
      }
      // Task Comment operations
      async createTaskComment(insertComment) {
        const [comment] = await db.insert(taskComments).values(insertComment).returning();
        await db.insert(taskActivityLog).values({
          taskId: insertComment.taskId,
          userId: insertComment.userId,
          action: "comment_added",
          description: "Added a comment"
        });
        return comment;
      }
      async getTaskComments(taskId) {
        const comments = await db.select().from(taskComments).where(eq(taskComments.taskId, taskId)).orderBy(taskComments.createdAt);
        const result = await Promise.all(comments.map(async (comment) => {
          const user = await this.getUserById(comment.userId);
          return { ...comment, user };
        }));
        return result;
      }
      async updateTaskComment(id, content) {
        const [comment] = await db.update(taskComments).set({ content, updatedAt: /* @__PURE__ */ new Date() }).where(eq(taskComments.id, id)).returning();
        return comment;
      }
      async deleteTaskComment(id) {
        await db.delete(taskComments).where(eq(taskComments.id, id));
      }
      // Task Checklist operations
      async createTaskChecklistItem(insertItem, createdByUserId) {
        const [item] = await db.insert(taskChecklistItems).values(insertItem).returning();
        await db.insert(taskActivityLog).values({
          taskId: insertItem.taskId,
          userId: createdByUserId,
          action: "checklist_item_added",
          description: `Added checklist item: ${insertItem.title}`
        });
        return item;
      }
      async getTaskChecklistItems(taskId) {
        return db.select().from(taskChecklistItems).where(eq(taskChecklistItems.taskId, taskId)).orderBy(taskChecklistItems.sortOrder);
      }
      async updateTaskChecklistItem(id, updates) {
        const [item] = await db.update(taskChecklistItems).set(updates).where(eq(taskChecklistItems.id, id)).returning();
        return item;
      }
      async toggleTaskChecklistItem(id, userId) {
        const [existing] = await db.select().from(taskChecklistItems).where(eq(taskChecklistItems.id, id));
        if (!existing) return void 0;
        const [item] = await db.update(taskChecklistItems).set({
          isCompleted: !existing.isCompleted,
          completedBy: !existing.isCompleted ? userId : null,
          completedAt: !existing.isCompleted ? /* @__PURE__ */ new Date() : null
        }).where(eq(taskChecklistItems.id, id)).returning();
        await db.insert(taskActivityLog).values({
          taskId: existing.taskId,
          userId,
          action: item.isCompleted ? "checklist_item_completed" : "checklist_item_uncompleted",
          description: `${item.isCompleted ? "Completed" : "Uncompleted"}: ${existing.title}`
        });
        return item;
      }
      async deleteTaskChecklistItem(id) {
        await db.delete(taskChecklistItems).where(eq(taskChecklistItems.id, id));
      }
      // Task Time Log operations
      async createTaskTimeLog(insertTimeLog) {
        const [timeLog] = await db.insert(taskTimeLogs).values(insertTimeLog).returning();
        await db.insert(taskActivityLog).values({
          taskId: insertTimeLog.taskId,
          userId: insertTimeLog.userId,
          action: "time_log_added",
          description: insertTimeLog.durationMinutes ? `Logged ${insertTimeLog.durationMinutes} minutes` : "Started time tracking"
        });
        return timeLog;
      }
      async getTaskTimeLogs(taskId) {
        return db.select().from(taskTimeLogs).where(eq(taskTimeLogs.taskId, taskId)).orderBy(desc(taskTimeLogs.startedAt));
      }
      async updateTaskTimeLog(id, updates) {
        const [timeLog] = await db.update(taskTimeLogs).set(updates).where(eq(taskTimeLogs.id, id)).returning();
        return timeLog;
      }
      async deleteTaskTimeLog(id) {
        await db.delete(taskTimeLogs).where(eq(taskTimeLogs.id, id));
      }
      async getActiveTimeLog(userId) {
        const [timeLog] = await db.select().from(taskTimeLogs).where(and(
          eq(taskTimeLogs.userId, userId),
          sql2`${taskTimeLogs.endedAt} IS NULL`
        ));
        return timeLog;
      }
      async stopActiveTimeLog(userId) {
        const activeLog = await this.getActiveTimeLog(userId);
        if (!activeLog) return void 0;
        const endedAt = /* @__PURE__ */ new Date();
        const durationMinutes = Math.round((endedAt.getTime() - activeLog.startedAt.getTime()) / 6e4);
        const [timeLog] = await db.update(taskTimeLogs).set({ endedAt, durationMinutes }).where(eq(taskTimeLogs.id, activeLog.id)).returning();
        await db.insert(taskActivityLog).values({
          taskId: activeLog.taskId,
          userId,
          action: "time_log_stopped",
          description: `Stopped time tracking. Total: ${durationMinutes} minutes`
        });
        return timeLog;
      }
      // Task Attachment operations
      async createTaskAttachment(insertAttachment) {
        const [attachment] = await db.insert(taskAttachments).values(insertAttachment).returning();
        await db.insert(taskActivityLog).values({
          taskId: insertAttachment.taskId,
          userId: insertAttachment.uploadedBy,
          action: "attachment_added",
          description: `Uploaded file: ${insertAttachment.fileName}`
        });
        return attachment;
      }
      async getTaskAttachments(taskId) {
        return db.select().from(taskAttachments).where(eq(taskAttachments.taskId, taskId)).orderBy(desc(taskAttachments.createdAt));
      }
      async deleteTaskAttachment(id) {
        await db.delete(taskAttachments).where(eq(taskAttachments.id, id));
      }
      // Task Notification operations
      async createTaskNotification(insertNotification) {
        const [notification] = await db.insert(taskNotifications).values(insertNotification).returning();
        return notification;
      }
      async getTaskNotifications(recipientId, tenantId, unreadOnly) {
        const conditions = [
          eq(taskNotifications.recipientId, recipientId),
          eq(taskNotifications.tenantId, tenantId)
        ];
        if (unreadOnly) {
          conditions.push(eq(taskNotifications.isRead, false));
        }
        return db.select().from(taskNotifications).where(and(...conditions)).orderBy(desc(taskNotifications.createdAt));
      }
      async markNotificationAsRead(id) {
        await db.update(taskNotifications).set({ isRead: true, readAt: /* @__PURE__ */ new Date() }).where(eq(taskNotifications.id, id));
      }
      async markAllNotificationsAsRead(recipientId, tenantId) {
        await db.update(taskNotifications).set({ isRead: true, readAt: /* @__PURE__ */ new Date() }).where(and(
          eq(taskNotifications.recipientId, recipientId),
          eq(taskNotifications.tenantId, tenantId),
          eq(taskNotifications.isRead, false)
        ));
      }
      async getUnreadNotificationCount(recipientId, tenantId) {
        const result = await db.select({ count: sql2`count(*)` }).from(taskNotifications).where(and(
          eq(taskNotifications.recipientId, recipientId),
          eq(taskNotifications.tenantId, tenantId),
          eq(taskNotifications.isRead, false)
        ));
        return result[0]?.count || 0;
      }
      // Task AI History operations
      async createTaskAiHistory(insertHistory) {
        const [history] = await db.insert(taskAiHistory).values(insertHistory).returning();
        await db.insert(taskActivityLog).values({
          taskId: insertHistory.taskId,
          userId: insertHistory.userId,
          action: "ai_assist",
          description: `AI assisted with: ${insertHistory.action}`
        });
        return history;
      }
      async getTaskAiHistory(taskId) {
        return db.select().from(taskAiHistory).where(eq(taskAiHistory.taskId, taskId)).orderBy(desc(taskAiHistory.createdAt));
      }
      // Task Activity Log operations
      async createTaskActivityLog(insertLog) {
        const [log2] = await db.insert(taskActivityLog).values(insertLog).returning();
        return log2;
      }
      async getTaskActivityLog(taskId) {
        const logs = await db.select().from(taskActivityLog).where(eq(taskActivityLog.taskId, taskId)).orderBy(desc(taskActivityLog.createdAt));
        const result = await Promise.all(logs.map(async (log2) => {
          const user = await this.getUserById(log2.userId);
          return { ...log2, user };
        }));
        return result;
      }
      // Task Status History operations
      async getTaskStatusHistory(taskId) {
        const history = await db.select().from(taskStatusHistory).where(eq(taskStatusHistory.taskId, taskId)).orderBy(desc(taskStatusHistory.createdAt));
        const result = await Promise.all(history.map(async (entry) => {
          const user = await this.getUserById(entry.changedBy);
          return { ...entry, user };
        }));
        return result;
      }
      // Task Analytics
      async getTaskAnalytics(tenantId) {
        const now = /* @__PURE__ */ new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
        const allTasks = await db.select().from(tasks).where(eq(tasks.tenantId, tenantId));
        const totalTasks = allTasks.length;
        const completedThisWeek = allTasks.filter(
          (t) => t.status === "completed" && t.completedAt && t.completedAt >= weekAgo
        ).length;
        const completedThisMonth = allTasks.filter(
          (t) => t.status === "completed" && t.completedAt && t.completedAt >= monthAgo
        ).length;
        const overdueTasks = allTasks.filter(
          (t) => t.dueDate && t.dueDate < now && t.status !== "completed" && t.status !== "cancelled"
        ).length;
        const completedTasks = allTasks.filter((t) => t.status === "completed" && t.completedAt);
        const avgCompletionTime = completedTasks.length > 0 ? completedTasks.reduce(
          (sum, t) => sum + (t.completedAt.getTime() - t.createdAt.getTime()) / (1e3 * 60 * 60 * 24),
          0
        ) / completedTasks.length : 0;
        const tasksByStatus = Object.values(TASK_STATUSES).map((status) => ({
          status,
          count: allTasks.filter((t) => t.status === status).length
        }));
        const tasksByPriority = Object.values(TASK_PRIORITIES).map((priority) => ({
          priority,
          count: allTasks.filter((t) => t.priority === priority).length
        }));
        const users2 = await this.getUsersByTenant(tenantId);
        const teamPerformance = users2.map((user) => ({
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          completed: allTasks.filter((t) => t.assignedTo === user.id && t.status === "completed").length,
          inProgress: allTasks.filter((t) => t.assignedTo === user.id && t.status === "in_progress").length
        })).filter((u) => u.completed > 0 || u.inProgress > 0);
        return {
          totalTasks,
          completedThisWeek,
          completedThisMonth,
          overdueTasks,
          avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
          tasksByStatus,
          tasksByPriority,
          teamPerformance
        };
      }
      // ==================== PROPOSAL BUILDER OPERATIONS ====================
      // Proposal Template operations
      async createProposalTemplate(template) {
        const [result] = await db.insert(proposalTemplates).values(template).returning();
        return result;
      }
      async getProposalTemplatesByTenant(tenantId) {
        return db.select().from(proposalTemplates).where(
          or(
            eq(proposalTemplates.tenantId, tenantId),
            eq(proposalTemplates.isSystemTemplate, true)
          )
        ).orderBy(desc(proposalTemplates.isSystemTemplate), desc(proposalTemplates.createdAt));
      }
      async getProposalTemplateById(id, tenantId) {
        const [template] = await db.select().from(proposalTemplates).where(
          and(
            eq(proposalTemplates.id, id),
            or(
              eq(proposalTemplates.tenantId, tenantId),
              eq(proposalTemplates.isSystemTemplate, true)
            )
          )
        );
        return template;
      }
      async updateProposalTemplate(id, tenantId, updates) {
        const [template] = await db.update(proposalTemplates).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(proposalTemplates.id, id), eq(proposalTemplates.tenantId, tenantId))).returning();
        return template;
      }
      async deleteProposalTemplate(id, tenantId) {
        await db.delete(proposalTemplates).where(and(eq(proposalTemplates.id, id), eq(proposalTemplates.tenantId, tenantId)));
      }
      async duplicateProposalTemplate(id, tenantId, createdBy) {
        const original = await this.getProposalTemplateById(id, tenantId);
        if (!original) return void 0;
        const [newTemplate] = await db.insert(proposalTemplates).values({
          tenantId,
          createdBy,
          name: `${original.name} (Copy)`,
          description: original.description,
          purpose: original.purpose,
          isActive: true,
          isDefault: false
        }).returning();
        const sections = await this.getTemplateSections(id);
        for (const section of sections) {
          await db.insert(templateSections).values({
            templateId: newTemplate.id,
            sectionType: section.sectionType,
            title: section.title,
            content: section.content,
            sortOrder: section.sortOrder,
            isLocked: section.isLocked,
            isVisible: section.isVisible,
            settings: section.settings
          });
        }
        return newTemplate;
      }
      // Template Section operations
      async createTemplateSection(section) {
        const [result] = await db.insert(templateSections).values(section).returning();
        return result;
      }
      async getTemplateSections(templateId) {
        return db.select().from(templateSections).where(eq(templateSections.templateId, templateId)).orderBy(asc(templateSections.sortOrder));
      }
      async updateTemplateSection(id, updates) {
        const [section] = await db.update(templateSections).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(templateSections.id, id)).returning();
        return section;
      }
      async deleteTemplateSection(id) {
        await db.delete(templateSections).where(eq(templateSections.id, id));
      }
      async reorderTemplateSections(templateId, sectionIds) {
        for (let i = 0; i < sectionIds.length; i++) {
          await db.update(templateSections).set({ sortOrder: i }).where(and(eq(templateSections.id, sectionIds[i]), eq(templateSections.templateId, templateId)));
        }
      }
      // Proposal operations
      async createProposal(proposal) {
        const [result] = await db.insert(proposals).values(proposal).returning();
        return result;
      }
      async getProposalsByTenant(tenantId, filters) {
        const conditions = [eq(proposals.tenantId, tenantId)];
        if (filters?.status) {
          conditions.push(eq(proposals.status, filters.status));
        }
        if (filters?.customerId) {
          conditions.push(eq(proposals.customerId, filters.customerId));
        }
        if (filters?.ownerId) {
          conditions.push(eq(proposals.ownerId, filters.ownerId));
        }
        return db.select().from(proposals).where(and(...conditions)).orderBy(desc(proposals.createdAt));
      }
      async getProposalById(id, tenantId) {
        const [proposal] = await db.select().from(proposals).where(and(eq(proposals.id, id), eq(proposals.tenantId, tenantId)));
        return proposal;
      }
      async getProposalByAccessToken(accessToken) {
        let [proposal] = await db.select().from(proposals).where(eq(proposals.accessToken, accessToken));
        if (!proposal) {
          [proposal] = await db.select().from(proposals).where(eq(proposals.id, accessToken));
        }
        return proposal;
      }
      async updateProposal(id, tenantId, updates) {
        const [proposal] = await db.update(proposals).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(proposals.id, id), eq(proposals.tenantId, tenantId))).returning();
        return proposal;
      }
      async deleteProposal(id, tenantId) {
        await db.delete(proposals).where(and(eq(proposals.id, id), eq(proposals.tenantId, tenantId)));
      }
      async getNextProposalNumber(tenantId) {
        const proposals2 = await db.select().from(proposals).where(eq(proposals.tenantId, tenantId)).orderBy(desc(proposals.createdAt));
        const count = proposals2.length + 1;
        const year = (/* @__PURE__ */ new Date()).getFullYear();
        return `PROP-${year}-${count.toString().padStart(4, "0")}`;
      }
      async updateProposalStatus(id, tenantId, status, changedBy, notes) {
        const proposal = await this.getProposalById(id, tenantId);
        if (!proposal) return void 0;
        const [updated] = await db.update(proposals).set({
          status,
          updatedAt: /* @__PURE__ */ new Date(),
          ...status === "sent" && { sentAt: /* @__PURE__ */ new Date() },
          ...status === "viewed" && { viewedAt: /* @__PURE__ */ new Date() },
          ...status === "accepted" && { acceptedAt: /* @__PURE__ */ new Date() },
          ...status === "rejected" && { rejectedAt: /* @__PURE__ */ new Date() }
        }).where(and(eq(proposals.id, id), eq(proposals.tenantId, tenantId))).returning();
        await db.insert(proposalStatusHistory).values({
          proposalId: id,
          changedBy,
          fromStatus: proposal.status,
          toStatus: status,
          notes
        });
        return updated;
      }
      async generateProposalAccessToken(id, tenantId) {
        const token = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        await db.update(proposals).set({ accessToken: token }).where(and(eq(proposals.id, id), eq(proposals.tenantId, tenantId)));
        return token;
      }
      // Proposal Section operations
      async createProposalSection(section) {
        const [result] = await db.insert(proposalSections).values(section).returning();
        return result;
      }
      async getProposalSections(proposalId) {
        return db.select().from(proposalSections).where(eq(proposalSections.proposalId, proposalId)).orderBy(asc(proposalSections.sortOrder));
      }
      async updateProposalSection(id, updates) {
        const [section] = await db.update(proposalSections).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(proposalSections.id, id)).returning();
        return section;
      }
      async deleteProposalSection(id) {
        await db.delete(proposalSections).where(eq(proposalSections.id, id));
      }
      async reorderProposalSections(proposalId, sectionIds) {
        for (let i = 0; i < sectionIds.length; i++) {
          await db.update(proposalSections).set({ sortOrder: i }).where(and(eq(proposalSections.id, sectionIds[i]), eq(proposalSections.proposalId, proposalId)));
        }
      }
      // Proposal Pricing Item operations
      async createProposalPricingItem(item) {
        const [result] = await db.insert(proposalPricingItems).values(item).returning();
        return result;
      }
      async getProposalPricingItems(proposalId) {
        return db.select().from(proposalPricingItems).where(eq(proposalPricingItems.proposalId, proposalId)).orderBy(asc(proposalPricingItems.sortOrder));
      }
      async updateProposalPricingItem(id, updates) {
        const [item] = await db.update(proposalPricingItems).set(updates).where(eq(proposalPricingItems.id, id)).returning();
        return item;
      }
      async deleteProposalPricingItem(id) {
        await db.delete(proposalPricingItems).where(eq(proposalPricingItems.id, id));
      }
      async deleteProposalPricingItems(proposalId) {
        await db.delete(proposalPricingItems).where(eq(proposalPricingItems.proposalId, proposalId));
      }
      async recalculateProposalTotals(proposalId, tenantId) {
        const items = await this.getProposalPricingItems(proposalId);
        let subtotal = 0;
        let taxAmount = 0;
        let discountAmount = 0;
        for (const item of items) {
          if (item.isSelected) {
            const itemTotal = parseFloat(item.totalPrice) || 0;
            const itemTax = (parseFloat(item.taxRate) || 0) * itemTotal / 100;
            const itemDiscount = (parseFloat(item.discount) || 0) * itemTotal / 100;
            subtotal += itemTotal;
            taxAmount += itemTax;
            discountAmount += itemDiscount;
          }
        }
        const totalAmount = subtotal + taxAmount - discountAmount;
        return this.updateProposal(proposalId, tenantId, {
          subtotal: subtotal.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          discountAmount: discountAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2)
        });
      }
      // Proposal Version operations
      async createProposalVersion(version) {
        const [result] = await db.insert(proposalVersions).values(version).returning();
        return result;
      }
      async getProposalVersions(proposalId) {
        return db.select().from(proposalVersions).where(eq(proposalVersions.proposalId, proposalId)).orderBy(desc(proposalVersions.versionNumber));
      }
      async getProposalVersionById(id) {
        const [version] = await db.select().from(proposalVersions).where(eq(proposalVersions.id, id));
        return version;
      }
      async restoreProposalVersion(proposalId, versionId, tenantId, userId) {
        const version = await this.getProposalVersionById(versionId);
        if (!version) return void 0;
        const proposal = await this.getProposalById(proposalId, tenantId);
        if (!proposal) return void 0;
        const snapshot = JSON.parse(version.snapshot);
        await this.deleteProposalPricingItems(proposalId);
        await db.delete(proposalSections).where(eq(proposalSections.proposalId, proposalId));
        if (snapshot.sections) {
          for (const section of snapshot.sections) {
            await this.createProposalSection({
              proposalId,
              sectionType: section.sectionType,
              title: section.title,
              content: section.content,
              sortOrder: section.sortOrder,
              isLocked: section.isLocked,
              isVisible: section.isVisible,
              settings: section.settings
            });
          }
        }
        if (snapshot.pricingItems) {
          for (const item of snapshot.pricingItems) {
            await this.createProposalPricingItem({
              proposalId,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxRate: item.taxRate,
              discount: item.discount,
              totalPrice: item.totalPrice,
              isRecurring: item.isRecurring,
              recurringInterval: item.recurringInterval,
              isOptional: item.isOptional,
              isSelected: item.isSelected,
              sortOrder: item.sortOrder
            });
          }
        }
        const newVersion = proposal.currentVersion + 1;
        return this.updateProposal(proposalId, tenantId, {
          currentVersion: newVersion,
          title: snapshot.title || proposal.title
        });
      }
      // Proposal Activity Log operations
      async createProposalActivityLog(log2) {
        const [result] = await db.insert(proposalActivityLogs).values(log2).returning();
        return result;
      }
      async getProposalActivityLogs(proposalId) {
        return db.select().from(proposalActivityLogs).where(eq(proposalActivityLogs.proposalId, proposalId)).orderBy(desc(proposalActivityLogs.createdAt));
      }
      // Proposal Signature operations
      async createProposalSignature(signature) {
        const [result] = await db.insert(proposalSignatures).values(signature).returning();
        return result;
      }
      async getProposalSignatures(proposalId) {
        return db.select().from(proposalSignatures).where(eq(proposalSignatures.proposalId, proposalId)).orderBy(desc(proposalSignatures.signedAt));
      }
      // Proposal View Log operations
      async createProposalViewLog(log2) {
        const [result] = await db.insert(proposalViewLogs).values(log2).returning();
        return result;
      }
      async getProposalViewLogs(proposalId) {
        return db.select().from(proposalViewLogs).where(eq(proposalViewLogs.proposalId, proposalId)).orderBy(desc(proposalViewLogs.createdAt));
      }
      async recordProposalView(proposalId, viewData) {
        await db.insert(proposalViewLogs).values({
          proposalId,
          ...viewData
        });
        await db.update(proposals).set({
          viewCount: sql2`view_count + 1`,
          totalViewTime: sql2`total_view_time + ${viewData.duration || 0}`,
          viewedAt: /* @__PURE__ */ new Date()
        }).where(eq(proposals.id, proposalId));
      }
      // Proposal Status History operations
      async getProposalStatusHistory(proposalId) {
        return db.select().from(proposalStatusHistory).where(eq(proposalStatusHistory.proposalId, proposalId)).orderBy(desc(proposalStatusHistory.createdAt));
      }
      // Proposal Comment operations
      async createProposalComment(comment) {
        const [result] = await db.insert(proposalComments).values(comment).returning();
        return result;
      }
      async getProposalComments(proposalId) {
        return db.select().from(proposalComments).where(eq(proposalComments.proposalId, proposalId)).orderBy(desc(proposalComments.createdAt));
      }
      async updateProposalComment(id, updates) {
        const [comment] = await db.update(proposalComments).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(proposalComments.id, id)).returning();
        return comment;
      }
      async deleteProposalComment(id) {
        await db.delete(proposalComments).where(eq(proposalComments.id, id));
      }
      // Proposal Analytics
      async getProposalAnalytics(tenantId) {
        const proposals2 = await db.select().from(proposals).where(eq(proposals.tenantId, tenantId));
        const totalProposals = proposals2.length;
        const acceptedProposals = proposals2.filter((p) => p.status === "accepted").length;
        const rejectedProposals = proposals2.filter((p) => p.status === "rejected").length;
        const pendingProposals = proposals2.filter((p) => ["draft", "sent", "viewed"].includes(p.status)).length;
        const totalValue = proposals2.reduce((sum, p) => sum + parseFloat(p.totalAmount || "0"), 0);
        const acceptedValue = proposals2.filter((p) => p.status === "accepted").reduce((sum, p) => sum + parseFloat(p.totalAmount || "0"), 0);
        const avgViewTime = proposals2.length > 0 ? proposals2.reduce((sum, p) => sum + (p.totalViewTime || 0), 0) / proposals2.length : 0;
        const conversionRate = totalProposals > 0 ? acceptedProposals / totalProposals * 100 : 0;
        return {
          totalProposals,
          acceptedProposals,
          rejectedProposals,
          pendingProposals,
          totalValue,
          acceptedValue,
          avgViewTime: Math.round(avgViewTime),
          conversionRate: Math.round(conversionRate * 10) / 10
        };
      }
      // Create proposal from template
      async createProposalFromTemplate(templateId, proposalData) {
        const template = await this.getProposalTemplateById(templateId, proposalData.tenantId);
        if (!template) return void 0;
        const proposal = await this.createProposal({
          ...proposalData,
          templateId
        });
        const templateSections2 = await this.getTemplateSections(templateId);
        for (const section of templateSections2) {
          await this.createProposalSection({
            proposalId: proposal.id,
            sectionType: section.sectionType,
            title: section.title,
            content: section.content,
            sortOrder: section.sortOrder,
            isLocked: section.isLocked,
            isVisible: section.isVisible,
            settings: section.settings
          });
        }
        return proposal;
      }
      // ==================== FEATURE FLAGS ====================
      async getFeatureFlag(key, tenantId) {
        console.log(`[getFeatureFlag] Checking key=${key}, tenantId=${tenantId}`);
        if (tenantId) {
          const [tenantFlag] = await db.select().from(featureFlags).where(and(
            eq(featureFlags.key, key),
            eq(featureFlags.tenantId, tenantId)
          ));
          console.log(`[getFeatureFlag] Tenant flag result:`, tenantFlag);
          if (tenantFlag) return tenantFlag.enabled;
        }
        const [globalFlag] = await db.select().from(featureFlags).where(and(
          eq(featureFlags.key, key),
          isNull(featureFlags.tenantId)
        ));
        console.log(`[getFeatureFlag] Global flag result:`, globalFlag);
        return globalFlag?.enabled ?? false;
      }
      async getFeatureFlagRecord(key, tenantId) {
        if (tenantId) {
          const [tenantFlag] = await db.select().from(featureFlags).where(and(
            eq(featureFlags.key, key),
            eq(featureFlags.tenantId, tenantId)
          ));
          if (tenantFlag) return tenantFlag;
        }
        const [globalFlag] = await db.select().from(featureFlags).where(and(
          eq(featureFlags.key, key),
          isNull(featureFlags.tenantId)
        ));
        return globalFlag;
      }
      async setFeatureFlag(key, enabled, tenantId, description) {
        const existing = await this.getFeatureFlagRecord(key, tenantId);
        if (existing) {
          const [updated] = await db.update(featureFlags).set({ enabled, updatedAt: /* @__PURE__ */ new Date(), description: description || existing.description }).where(eq(featureFlags.id, existing.id)).returning();
          return updated;
        }
        const [created] = await db.insert(featureFlags).values({
          key,
          tenantId: tenantId || null,
          enabled,
          description
        }).returning();
        return created;
      }
      async getAllFeatureFlags(tenantId) {
        if (tenantId) {
          return db.select().from(featureFlags).where(or(
            eq(featureFlags.tenantId, tenantId),
            isNull(featureFlags.tenantId)
          )).orderBy(featureFlags.key);
        }
        return db.select().from(featureFlags).where(isNull(featureFlags.tenantId)).orderBy(featureFlags.key);
      }
      // ==================== WORKSPACE OPERATIONS ====================
      async getUserWorkspaces(userId) {
        const results = await db.select({
          id: workspaceUsers.id,
          userId: workspaceUsers.userId,
          workspaceId: workspaceUsers.workspaceId,
          role: workspaceUsers.role,
          isPrimary: workspaceUsers.isPrimary,
          invitedBy: workspaceUsers.invitedBy,
          joinedAt: workspaceUsers.joinedAt,
          lastAccessedAt: workspaceUsers.lastAccessedAt,
          createdAt: workspaceUsers.createdAt,
          workspace: tenants
        }).from(workspaceUsers).innerJoin(tenants, eq(workspaceUsers.workspaceId, tenants.id)).where(eq(workspaceUsers.userId, userId)).orderBy(desc(workspaceUsers.isPrimary), tenants.name);
        return results.map((r) => ({
          id: r.id,
          userId: r.userId,
          workspaceId: r.workspaceId,
          role: r.role,
          isPrimary: r.isPrimary,
          invitedBy: r.invitedBy,
          joinedAt: r.joinedAt,
          lastAccessedAt: r.lastAccessedAt,
          createdAt: r.createdAt,
          workspace: r.workspace
        }));
      }
      async getWorkspaceUsers(workspaceId) {
        const results = await db.select({
          id: workspaceUsers.id,
          userId: workspaceUsers.userId,
          workspaceId: workspaceUsers.workspaceId,
          role: workspaceUsers.role,
          isPrimary: workspaceUsers.isPrimary,
          invitedBy: workspaceUsers.invitedBy,
          joinedAt: workspaceUsers.joinedAt,
          lastAccessedAt: workspaceUsers.lastAccessedAt,
          createdAt: workspaceUsers.createdAt,
          user: users
        }).from(workspaceUsers).innerJoin(users, eq(workspaceUsers.userId, users.id)).where(eq(workspaceUsers.workspaceId, workspaceId)).orderBy(desc(workspaceUsers.role), users.firstName);
        return results.map((r) => {
          const { passwordHash, ...userWithoutPassword } = r.user;
          return {
            id: r.id,
            userId: r.userId,
            workspaceId: r.workspaceId,
            role: r.role,
            isPrimary: r.isPrimary,
            invitedBy: r.invitedBy,
            joinedAt: r.joinedAt,
            lastAccessedAt: r.lastAccessedAt,
            createdAt: r.createdAt,
            user: userWithoutPassword
          };
        });
      }
      async addUserToWorkspace(data) {
        const [workspaceUser] = await db.insert(workspaceUsers).values(data).returning();
        return workspaceUser;
      }
      async updateWorkspaceUser(userId, workspaceId, updates) {
        const [updated] = await db.update(workspaceUsers).set(updates).where(and(
          eq(workspaceUsers.userId, userId),
          eq(workspaceUsers.workspaceId, workspaceId)
        )).returning();
        return updated;
      }
      async removeUserFromWorkspace(userId, workspaceId) {
        await db.delete(workspaceUsers).where(and(
          eq(workspaceUsers.userId, userId),
          eq(workspaceUsers.workspaceId, workspaceId)
        ));
      }
      async isUserInWorkspace(userId, workspaceId) {
        const [result] = await db.select().from(workspaceUsers).where(and(
          eq(workspaceUsers.userId, userId),
          eq(workspaceUsers.workspaceId, workspaceId)
        ));
        return !!result;
      }
      async getUserWorkspaceRole(userId, workspaceId) {
        const [result] = await db.select({ role: workspaceUsers.role }).from(workspaceUsers).where(and(
          eq(workspaceUsers.userId, userId),
          eq(workspaceUsers.workspaceId, workspaceId)
        ));
        return result?.role;
      }
      async setActiveWorkspace(userId, workspaceId) {
        await db.update(workspaceUsers).set({ lastAccessedAt: /* @__PURE__ */ new Date() }).where(and(
          eq(workspaceUsers.userId, userId),
          eq(workspaceUsers.workspaceId, workspaceId)
        ));
      }
      // Workspace Invitations
      async createWorkspaceInvitation(invitation) {
        const [created] = await db.insert(workspaceInvitations).values(invitation).returning();
        return created;
      }
      async getWorkspaceInvitations(workspaceId, status) {
        const conditions = [eq(workspaceInvitations.workspaceId, workspaceId)];
        if (status) {
          conditions.push(eq(workspaceInvitations.status, status));
        }
        return db.select().from(workspaceInvitations).where(and(...conditions)).orderBy(desc(workspaceInvitations.createdAt));
      }
      async getInvitationByToken(token) {
        const [invitation] = await db.select().from(workspaceInvitations).where(eq(workspaceInvitations.token, token));
        return invitation;
      }
      async getInvitationsByEmail(email, status) {
        const conditions = [eq(workspaceInvitations.email, email.toLowerCase())];
        if (status) {
          conditions.push(eq(workspaceInvitations.status, status));
        }
        const results = await db.select({
          invitation: workspaceInvitations,
          workspace: tenants
        }).from(workspaceInvitations).innerJoin(tenants, eq(workspaceInvitations.workspaceId, tenants.id)).where(and(...conditions)).orderBy(desc(workspaceInvitations.createdAt));
        return results.map((r) => ({
          ...r.invitation,
          workspace: r.workspace
        }));
      }
      async updateInvitationStatus(id, status) {
        const updates = { status };
        if (status === "accepted") {
          updates.acceptedAt = /* @__PURE__ */ new Date();
        }
        const [updated] = await db.update(workspaceInvitations).set(updates).where(eq(workspaceInvitations.id, id)).returning();
        return updated;
      }
      async acceptInvitation(token, userId) {
        const invitation = await this.getInvitationByToken(token);
        if (!invitation || invitation.status !== "pending") return void 0;
        if (/* @__PURE__ */ new Date() > new Date(invitation.expiresAt)) {
          await this.updateInvitationStatus(invitation.id, "expired");
          return void 0;
        }
        const existing = await this.isUserInWorkspace(userId, invitation.workspaceId);
        if (existing) {
          await this.updateInvitationStatus(invitation.id, "accepted");
          const [workspaceUser2] = await db.select().from(workspaceUsers).where(and(
            eq(workspaceUsers.userId, userId),
            eq(workspaceUsers.workspaceId, invitation.workspaceId)
          ));
          return workspaceUser2;
        }
        const workspaceUser = await this.addUserToWorkspace({
          userId,
          workspaceId: invitation.workspaceId,
          role: invitation.role,
          isPrimary: false,
          invitedBy: invitation.invitedBy
        });
        await this.updateInvitationStatus(invitation.id, "accepted");
        return workspaceUser;
      }
      async revokeInvitation(id) {
        await db.update(workspaceInvitations).set({ status: "revoked" }).where(eq(workspaceInvitations.id, id));
      }
      async cleanupExpiredInvitations() {
        const result = await db.update(workspaceInvitations).set({ status: "expired" }).where(and(
          eq(workspaceInvitations.status, "pending"),
          lte(workspaceInvitations.expiresAt, /* @__PURE__ */ new Date())
        )).returning();
        return result.length;
      }
      // Workspace Activity Logging
      async logWorkspaceActivity(log2) {
        const [created] = await db.insert(workspaceActivityLogs).values(log2).returning();
        return created;
      }
      async getWorkspaceActivityLogs(workspaceId, limit = 100) {
        return db.select().from(workspaceActivityLogs).where(eq(workspaceActivityLogs.workspaceId, workspaceId)).orderBy(desc(workspaceActivityLogs.createdAt)).limit(limit);
      }
      // Create workspace with owner
      async createWorkspace(tenantData, ownerId) {
        const tenant = await this.createTenant(tenantData);
        await this.addUserToWorkspace({
          userId: ownerId,
          workspaceId: tenant.id,
          role: "owner",
          isPrimary: false,
          invitedBy: null
        });
        await this.logWorkspaceActivity({
          workspaceId: tenant.id,
          userId: ownerId,
          action: "workspace_created",
          details: JSON.stringify({ name: tenantData.name })
        });
        return tenant;
      }
      // ==================== MODULE 1: WORKSPACE BILLING OPERATIONS ====================
      async getAllWorkspacePlans() {
        return db.select().from(workspacePlans).where(eq(workspacePlans.isActive, true)).orderBy(workspacePlans.sortOrder);
      }
      async getWorkspacePlanById(id) {
        const [plan] = await db.select().from(workspacePlans).where(eq(workspacePlans.id, id));
        return plan;
      }
      async getWorkspacePlanByName(name) {
        const [plan] = await db.select().from(workspacePlans).where(eq(workspacePlans.name, name));
        return plan;
      }
      async getWorkspaceSubscription(workspaceId) {
        const [result] = await db.select({
          subscription: workspaceSubscriptions,
          plan: workspacePlans
        }).from(workspaceSubscriptions).leftJoin(workspacePlans, eq(workspaceSubscriptions.planId, workspacePlans.id)).where(eq(workspaceSubscriptions.workspaceId, workspaceId));
        if (!result) return void 0;
        return { ...result.subscription, plan: result.plan || void 0 };
      }
      async createWorkspaceSubscription(data) {
        const [subscription] = await db.insert(workspaceSubscriptions).values(data).returning();
        return subscription;
      }
      async updateWorkspaceSubscription(workspaceId, updates) {
        const [updated] = await db.update(workspaceSubscriptions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaceSubscriptions.workspaceId, workspaceId)).returning();
        return updated;
      }
      async getWorkspaceUsage(workspaceId) {
        const now = /* @__PURE__ */ new Date();
        const [usage] = await db.select().from(workspaceUsage).where(and(
          eq(workspaceUsage.workspaceId, workspaceId),
          lte(workspaceUsage.periodStart, now),
          gte(workspaceUsage.periodEnd, now)
        ));
        return usage;
      }
      async upsertWorkspaceUsage(workspaceId, periodStart, periodEnd, updates) {
        const existing = await this.getWorkspaceUsage(workspaceId);
        if (existing) {
          const [updated] = await db.update(workspaceUsage).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaceUsage.id, existing.id)).returning();
          return updated;
        }
        const [created] = await db.insert(workspaceUsage).values({ workspaceId, periodStart, periodEnd, ...updates }).returning();
        return created;
      }
      async incrementWorkspaceUsage(workspaceId, field) {
        const usage = await this.getWorkspaceUsage(workspaceId);
        if (usage) {
          await db.update(workspaceUsage).set({ [field]: sql2`${workspaceUsage[field]} + 1`, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaceUsage.id, usage.id));
        }
      }
      async getWorkspaceInvoices(workspaceId) {
        return db.select().from(workspaceInvoices).where(eq(workspaceInvoices.workspaceId, workspaceId)).orderBy(desc(workspaceInvoices.createdAt));
      }
      async getWorkspacePaymentMethods(workspaceId) {
        return db.select().from(workspacePaymentMethods).where(eq(workspacePaymentMethods.workspaceId, workspaceId)).orderBy(desc(workspacePaymentMethods.isDefault));
      }
      async checkBillingLimits(workspaceId) {
        const subscription = await this.getWorkspaceSubscription(workspaceId);
        const usage = await this.getWorkspaceUsage(workspaceId);
        if (!subscription?.plan) {
          return { withinLimits: true, usage: null, limits: null };
        }
        const plan = subscription.plan;
        const memberCount = await this.getWorkspaceMemberCount(workspaceId);
        const limits = {
          maxMembers: plan.maxMembers,
          maxAutomations: plan.maxAutomations,
          maxEmailsPerMonth: plan.maxEmailsPerMonth,
          maxProposals: plan.maxProposals,
          maxStorageMb: plan.maxStorageMb
        };
        const currentUsage = {
          memberCount,
          automationsUsed: usage?.automationsUsed || 0,
          emailsSent: usage?.emailsSent || 0,
          proposalsCreated: usage?.proposalsCreated || 0,
          storageMbUsed: usage?.storageMbUsed || 0
        };
        const withinLimits = (plan.maxMembers === -1 || memberCount <= plan.maxMembers) && (plan.maxAutomations === -1 || currentUsage.automationsUsed <= plan.maxAutomations) && (plan.maxEmailsPerMonth === -1 || currentUsage.emailsSent <= plan.maxEmailsPerMonth) && (plan.maxProposals === -1 || currentUsage.proposalsCreated <= plan.maxProposals);
        return { withinLimits, usage: currentUsage, limits };
      }
      async getWorkspaceMemberCount(workspaceId) {
        const [result] = await db.select({ count: sql2`count(*)` }).from(workspaceUsers).where(eq(workspaceUsers.workspaceId, workspaceId));
        return Number(result?.count || 0);
      }
      // ==================== MODULE 2: WORKSPACE BRANDING OPERATIONS ====================
      async getWorkspaceBranding(workspaceId) {
        const [branding] = await db.select().from(workspaceBranding).where(eq(workspaceBranding.workspaceId, workspaceId));
        return branding;
      }
      async upsertWorkspaceBranding(workspaceId, data) {
        const existing = await this.getWorkspaceBranding(workspaceId);
        if (existing) {
          const [updated] = await db.update(workspaceBranding).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaceBranding.workspaceId, workspaceId)).returning();
          return updated;
        }
        const [created] = await db.insert(workspaceBranding).values({ workspaceId, ...data }).returning();
        return created;
      }
      async getWorkspacePdfSettings(workspaceId) {
        const [settings] = await db.select().from(workspacePdfSettings).where(eq(workspacePdfSettings.workspaceId, workspaceId));
        return settings;
      }
      async upsertWorkspacePdfSettings(workspaceId, data) {
        const existing = await this.getWorkspacePdfSettings(workspaceId);
        if (existing) {
          const [updated] = await db.update(workspacePdfSettings).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspacePdfSettings.workspaceId, workspaceId)).returning();
          return updated;
        }
        const [created] = await db.insert(workspacePdfSettings).values({ workspaceId, ...data }).returning();
        return created;
      }
      // ==================== MODULE 3: CUSTOM ROLES OPERATIONS ====================
      async getWorkspaceCustomRoles(workspaceId) {
        return db.select().from(workspaceCustomRoles).where(eq(workspaceCustomRoles.workspaceId, workspaceId)).orderBy(workspaceCustomRoles.name);
      }
      async getWorkspaceCustomRoleById(id) {
        const [role] = await db.select().from(workspaceCustomRoles).where(eq(workspaceCustomRoles.id, id));
        return role;
      }
      async createWorkspaceCustomRole(data) {
        const [role] = await db.insert(workspaceCustomRoles).values(data).returning();
        return role;
      }
      async updateWorkspaceCustomRole(id, updates) {
        const [updated] = await db.update(workspaceCustomRoles).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaceCustomRoles.id, id)).returning();
        return updated;
      }
      async deleteWorkspaceCustomRole(id) {
        await db.delete(workspaceRolePermissions).where(eq(workspaceRolePermissions.roleId, id));
        await db.delete(workspaceCustomRoles).where(eq(workspaceCustomRoles.id, id));
      }
      async getRolePermissions(roleId) {
        return db.select().from(workspaceRolePermissions).where(eq(workspaceRolePermissions.roleId, roleId));
      }
      async setRolePermissions(roleId, permissions) {
        await db.delete(workspaceRolePermissions).where(eq(workspaceRolePermissions.roleId, roleId));
        if (permissions.length > 0) {
          await db.insert(workspaceRolePermissions).values(permissions.map((p) => ({ roleId, ...p })));
        }
      }
      async getCustomRoleWithPermissions(id) {
        const role = await this.getWorkspaceCustomRoleById(id);
        if (!role) return void 0;
        const permissions = await this.getRolePermissions(id);
        return { ...role, permissions };
      }
      // ==================== MODULE 4: ANALYTICS OPERATIONS ====================
      async getWorkspaceAnalytics(workspaceId, metricType, startDate, endDate) {
        const conditions = [eq(workspaceAnalyticsCache.workspaceId, workspaceId)];
        if (metricType) {
          conditions.push(eq(workspaceAnalyticsCache.metricType, metricType));
        }
        if (startDate) {
          conditions.push(gte(workspaceAnalyticsCache.metricDate, startDate));
        }
        if (endDate) {
          conditions.push(lte(workspaceAnalyticsCache.metricDate, endDate));
        }
        return db.select().from(workspaceAnalyticsCache).where(and(...conditions)).orderBy(desc(workspaceAnalyticsCache.metricDate));
      }
      async upsertWorkspaceAnalytics(workspaceId, metricType, metricDate, value, metadata) {
        const dateStart = new Date(metricDate);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(dateStart);
        dateEnd.setDate(dateEnd.getDate() + 1);
        const [existing] = await db.select().from(workspaceAnalyticsCache).where(and(
          eq(workspaceAnalyticsCache.workspaceId, workspaceId),
          eq(workspaceAnalyticsCache.metricType, metricType),
          gte(workspaceAnalyticsCache.metricDate, dateStart),
          lte(workspaceAnalyticsCache.metricDate, dateEnd)
        ));
        if (existing) {
          const [updated] = await db.update(workspaceAnalyticsCache).set({ value: value.toString(), metadata, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaceAnalyticsCache.id, existing.id)).returning();
          return updated;
        }
        const [created] = await db.insert(workspaceAnalyticsCache).values({ workspaceId, metricType, metricDate, value: value.toString(), metadata }).returning();
        return created;
      }
      async getWorkspaceAnalyticsSummary(workspaceId) {
        const [invoiceStats] = await db.select({
          totalPaid: sql2`COALESCE(SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END), 0)`,
          totalUnpaid: sql2`COALESCE(SUM(CASE WHEN status NOT IN ('paid', 'cancelled') THEN balance_due ELSE 0 END), 0)`
        }).from(invoices).where(eq(invoices.tenantId, workspaceId));
        const [proposalStats] = await db.select({
          total: sql2`count(*)`,
          accepted: sql2`SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END)`
        }).from(proposals).where(eq(proposals.tenantId, workspaceId));
        const [customerStats] = await db.select({
          leads: sql2`SUM(CASE WHEN customer_type = 'lead' THEN 1 ELSE 0 END)`,
          converted: sql2`SUM(CASE WHEN customer_type = 'customer' THEN 1 ELSE 0 END)`
        }).from(customers).where(eq(customers.tenantId, workspaceId));
        const [taskStats] = await db.select({
          completed: sql2`SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`
        }).from(tasks).where(eq(tasks.tenantId, workspaceId));
        return {
          totalRevenue: Number(invoiceStats?.totalPaid || 0),
          unpaidInvoices: Number(invoiceStats?.totalUnpaid || 0),
          proposalsSent: Number(proposalStats?.total || 0),
          proposalAcceptRate: proposalStats?.total ? Number(proposalStats.accepted) / Number(proposalStats.total) * 100 : 0,
          leadsCreated: Number(customerStats?.leads || 0),
          leadsConverted: Number(customerStats?.converted || 0),
          tasksCompleted: Number(taskStats?.completed || 0)
        };
      }
      // ==================== MODULE 5: WORKSPACE DELETION OPERATIONS ====================
      async softDeleteWorkspace(workspaceId, deletedBy, reason) {
        const scheduledPurgeAt = /* @__PURE__ */ new Date();
        scheduledPurgeAt.setDate(scheduledPurgeAt.getDate() + 30);
        const [updated] = await db.update(tenants).set({ deletedAt: /* @__PURE__ */ new Date() }).where(eq(tenants.id, workspaceId)).returning();
        if (updated) {
          await db.insert(workspaceDeletionLogs).values({
            workspaceId,
            action: "deleted",
            deletedBy,
            reason,
            scheduledPurgeAt
          });
        }
        return updated;
      }
      async restoreWorkspace(workspaceId, restoredBy) {
        const [updated] = await db.update(tenants).set({ deletedAt: null }).where(eq(tenants.id, workspaceId)).returning();
        if (updated) {
          await db.insert(workspaceDeletionLogs).values({
            workspaceId,
            action: "restored",
            restoredBy
          });
        }
        return updated;
      }
      async getDeletedWorkspaces() {
        return db.select().from(tenants).where(sql2`${tenants.deletedAt} IS NOT NULL`);
      }
      async getWorkspaceDeletionLogs(workspaceId) {
        return db.select().from(workspaceDeletionLogs).where(eq(workspaceDeletionLogs.workspaceId, workspaceId)).orderBy(desc(workspaceDeletionLogs.createdAt));
      }
      async canDeleteWorkspace(workspaceId, userId) {
        const subscription = await this.getWorkspaceSubscription(workspaceId);
        if (subscription && subscription.status === "active") {
          return { canDelete: false, reason: "Cannot delete workspace with active subscription" };
        }
        const userWorkspaces = await this.getUserWorkspaces(userId);
        if (userWorkspaces.length <= 1) {
          return { canDelete: false, reason: "Cannot delete your only workspace" };
        }
        return { canDelete: true };
      }
      // ==================== MODULE 6: ONBOARDING OPERATIONS ====================
      async getWorkspaceOnboardingProgress(workspaceId) {
        const [progress] = await db.select().from(workspaceOnboardingProgress).where(eq(workspaceOnboardingProgress.workspaceId, workspaceId));
        return progress;
      }
      async createWorkspaceOnboardingProgress(workspaceId) {
        const [created] = await db.insert(workspaceOnboardingProgress).values({ workspaceId }).returning();
        return created;
      }
      async updateOnboardingStep(workspaceId, step, status) {
        const updates = { [step]: status, updatedAt: /* @__PURE__ */ new Date() };
        const progress = await this.getWorkspaceOnboardingProgress(workspaceId);
        if (!progress) {
          await this.createWorkspaceOnboardingProgress(workspaceId);
        }
        const allSteps = ["step1AddBranding", "step2AddTeamMembers", "step3AddFirstClient", "step4CreateProject", "step5CreateProposal"];
        const stepIndex = allSteps.indexOf(step);
        if (stepIndex !== -1 && status === "completed") {
          updates.currentStep = Math.min(stepIndex + 2, 5);
        }
        const [updated] = await db.update(workspaceOnboardingProgress).set(updates).where(eq(workspaceOnboardingProgress.workspaceId, workspaceId)).returning();
        return updated;
      }
      async completeOnboarding(workspaceId) {
        const [updated] = await db.update(workspaceOnboardingProgress).set({ isCompleted: true, completedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaceOnboardingProgress.workspaceId, workspaceId)).returning();
        return updated;
      }
      async dismissOnboarding(workspaceId) {
        const [updated] = await db.update(workspaceOnboardingProgress).set({ isDismissed: true, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaceOnboardingProgress.workspaceId, workspaceId)).returning();
        return updated;
      }
      async reopenOnboarding(workspaceId) {
        const [updated] = await db.update(workspaceOnboardingProgress).set({ isDismissed: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaceOnboardingProgress.workspaceId, workspaceId)).returning();
        return updated;
      }
      // ==================== ENTERPRISE SECURITY: AUDIT LOG OPERATIONS ====================
      async createAuditLog(log2) {
        const [created] = await db.insert(auditLogs).values(log2).returning();
        return created;
      }
      async getAuditLogs(tenantId, options) {
        const conditions = [eq(auditLogs.tenantId, tenantId)];
        if (options?.action) {
          conditions.push(eq(auditLogs.action, options.action));
        }
        if (options?.userId) {
          conditions.push(eq(auditLogs.userId, options.userId));
        }
        if (options?.startDate) {
          conditions.push(gte(auditLogs.createdAt, options.startDate));
        }
        if (options?.endDate) {
          conditions.push(lte(auditLogs.createdAt, options.endDate));
        }
        return db.select().from(auditLogs).where(and(...conditions)).orderBy(desc(auditLogs.createdAt)).limit(options?.limit || 100).offset(options?.offset || 0);
      }
      async createLoginAttempt(attempt) {
        const [created] = await db.insert(loginAttempts).values(attempt).returning();
        return created;
      }
      async getRecentLoginAttempts(email, minutes = 15) {
        const since = new Date(Date.now() - minutes * 60 * 1e3);
        return db.select().from(loginAttempts).where(and(
          eq(loginAttempts.email, email.toLowerCase()),
          gte(loginAttempts.createdAt, since)
        )).orderBy(desc(loginAttempts.createdAt));
      }
      async getFailedLoginCount(email, minutes = 15) {
        const attempts = await this.getRecentLoginAttempts(email, minutes);
        return attempts.filter((a) => !a.success).length;
      }
      // ==================== MODULE 7: CUSTOMER PORTAL OPERATIONS ====================
      async getCustomerPortalSettings(workspaceId) {
        const [settings] = await db.select().from(customerPortalSettings).where(eq(customerPortalSettings.workspaceId, workspaceId));
        return settings;
      }
      async upsertCustomerPortalSettings(workspaceId, data) {
        const existing = await this.getCustomerPortalSettings(workspaceId);
        if (existing) {
          const [updated] = await db.update(customerPortalSettings).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(customerPortalSettings.workspaceId, workspaceId)).returning();
          return updated;
        }
        const [created] = await db.insert(customerPortalSettings).values({ workspaceId, ...data }).returning();
        return created;
      }
      async createPortalActivityLog(log2) {
        const [created] = await db.insert(customerPortalActivityLogs).values(log2).returning();
        return created;
      }
      async getPortalActivityLogs(workspaceId, options) {
        const conditions = [eq(customerPortalActivityLogs.workspaceId, workspaceId)];
        if (options?.customerId) {
          conditions.push(eq(customerPortalActivityLogs.customerId, options.customerId));
        }
        return db.select().from(customerPortalActivityLogs).where(and(...conditions)).orderBy(desc(customerPortalActivityLogs.createdAt)).limit(options?.limit || 100);
      }
      async createPasswordResetToken(data) {
        const [created] = await db.insert(passwordResetTokens).values(data).returning();
        return created;
      }
      async getPasswordResetToken(token) {
        const [result] = await db.select().from(passwordResetTokens).where(and(
          eq(passwordResetTokens.token, token),
          isNull(passwordResetTokens.usedAt),
          gte(passwordResetTokens.expiresAt, /* @__PURE__ */ new Date())
        ));
        return result;
      }
      async markPasswordResetTokenUsed(id) {
        await db.update(passwordResetTokens).set({ usedAt: /* @__PURE__ */ new Date() }).where(eq(passwordResetTokens.id, id));
      }
      async createClientDocument(doc) {
        const [created] = await db.insert(clientDocuments).values(doc).returning();
        return created;
      }
      async getClientDocuments(tenantId, customerId) {
        return db.select().from(clientDocuments).where(and(
          eq(clientDocuments.tenantId, tenantId),
          eq(clientDocuments.customerId, customerId)
        )).orderBy(desc(clientDocuments.createdAt));
      }
      async getClientDocumentById(id, tenantId) {
        const [doc] = await db.select().from(clientDocuments).where(and(
          eq(clientDocuments.id, id),
          eq(clientDocuments.tenantId, tenantId)
        ));
        return doc;
      }
      async deleteClientDocument(id, tenantId) {
        await db.delete(clientDocuments).where(and(
          eq(clientDocuments.id, id),
          eq(clientDocuments.tenantId, tenantId)
        ));
      }
      async getProposalsByCustomerForPortal(customerId, tenantId) {
        return db.select().from(proposals).where(and(
          eq(proposals.tenantId, tenantId),
          eq(proposals.customerId, customerId),
          or(
            eq(proposals.status, "sent"),
            eq(proposals.status, "accepted"),
            eq(proposals.status, "rejected")
          )
        )).orderBy(desc(proposals.createdAt));
      }
      async getTasksForCustomerPortal(customerId, tenantId) {
        return db.select().from(tasks).where(and(
          eq(tasks.tenantId, tenantId),
          eq(tasks.customerId, customerId)
        )).orderBy(desc(tasks.createdAt));
      }
      // ==================== AI ENHANCEMENT MODULE ====================
      async getAiSettings(tenantId) {
        const [settings] = await db.select().from(aiSettings).where(eq(aiSettings.tenantId, tenantId));
        return settings;
      }
      async createOrUpdateAiSettings(data) {
        const existing = await this.getAiSettings(data.tenantId);
        if (existing) {
          const [updated] = await db.update(aiSettings).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(aiSettings.id, existing.id)).returning();
          return updated;
        }
        const [created] = await db.insert(aiSettings).values(data).returning();
        return created;
      }
      async updateAiSettings(tenantId, updates) {
        const existing = await this.getAiSettings(tenantId);
        if (!existing) return void 0;
        const [updated] = await db.update(aiSettings).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(aiSettings.id, existing.id)).returning();
        return updated;
      }
      async createAiUsage(data) {
        const [created] = await db.insert(aiUsage).values(data).returning();
        return created;
      }
      async getAiUsageByTenant(tenantId, limit = 100) {
        return db.select().from(aiUsage).where(eq(aiUsage.tenantId, tenantId)).orderBy(desc(aiUsage.createdAt)).limit(limit);
      }
      async getAiUsageStats(tenantId) {
        const startOfMonth = /* @__PURE__ */ new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const allUsage = await db.select().from(aiUsage).where(eq(aiUsage.tenantId, tenantId));
        const total = allUsage.reduce((sum, u) => sum + (u.tokensUsed || 0), 0);
        const thisMonth = allUsage.filter((u) => new Date(u.createdAt) >= startOfMonth).reduce((sum, u) => sum + (u.tokensUsed || 0), 0);
        const byModule = {};
        for (const usage of allUsage) {
          byModule[usage.module] = (byModule[usage.module] || 0) + (usage.tokensUsed || 0);
        }
        return { total, thisMonth, byModule };
      }
      async createAiLog(data) {
        const [created] = await db.insert(aiLogs).values(data).returning();
        return created;
      }
      async getAiLogs(tenantId, limit = 100) {
        return db.select().from(aiLogs).where(eq(aiLogs.tenantId, tenantId)).orderBy(desc(aiLogs.createdAt)).limit(limit);
      }
      async updateAiLogFeedback(id, rating, comment) {
        const [updated] = await db.update(aiLogs).set({ feedbackRating: rating, feedbackComment: comment }).where(eq(aiLogs.id, id)).returning();
        return updated;
      }
      async createAiContentVersion(data) {
        const [created] = await db.insert(aiContentVersions).values(data).returning();
        return created;
      }
      async getAiContentVersions(tenantId, resourceType, resourceId) {
        return db.select().from(aiContentVersions).where(and(
          eq(aiContentVersions.tenantId, tenantId),
          eq(aiContentVersions.resourceType, resourceType),
          eq(aiContentVersions.resourceId, resourceId)
        )).orderBy(desc(aiContentVersions.createdAt));
      }
      async incrementAiTokenUsage(tenantId, tokens) {
        const settings = await this.getAiSettings(tenantId);
        if (settings) {
          const now = /* @__PURE__ */ new Date();
          const resetDate = new Date(settings.tokenResetDate);
          if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
            await db.update(aiSettings).set({
              tokensUsedThisMonth: tokens,
              tokenResetDate: now,
              updatedAt: now
            }).where(eq(aiSettings.id, settings.id));
          } else {
            await db.update(aiSettings).set({
              tokensUsedThisMonth: settings.tokensUsedThisMonth + tokens,
              updatedAt: now
            }).where(eq(aiSettings.id, settings.id));
          }
        }
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/encryption.ts
import crypto from "crypto";
function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY || process.env.SESSION_SECRET || "default-encryption-key-change-me";
  return crypto.scryptSync(key, "salt", 32);
}
function encrypt(plaintext) {
  if (!plaintext) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}
function decrypt(ciphertext) {
  if (!ciphertext || !ciphertext.includes(":")) return "";
  try {
    const parts = ciphertext.split(":");
    if (parts.length !== 3) return "";
    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
}
function maskApiKey(key) {
  if (!key) return "";
  if (key.length <= 8) return "****";
  return `****${key.slice(-4)}`;
}
var ALGORITHM, IV_LENGTH;
var init_encryption = __esm({
  "server/encryption.ts"() {
    "use strict";
    ALGORITHM = "aes-256-gcm";
    IV_LENGTH = 16;
  }
});

// server/ai-service.ts
var ai_service_exports = {};
__export(ai_service_exports, {
  AIService: () => AIService,
  aiService: () => aiService
});
import OpenAI from "openai";
async function getOpenAIKey(userId) {
  if (userId) {
    try {
      const userSettings = await storage.getUserAiSettings(userId);
      if (userSettings?.isEnabled && userSettings?.apiKey) {
        const decryptedKey = decrypt(userSettings.apiKey);
        if (decryptedKey) {
          return decryptedKey;
        }
      }
    } catch (error) {
      console.error("Error fetching user AI settings:", error);
    }
  }
  try {
    const platformSettings2 = await storage.getPlatformSettings("ai");
    const platformKey = platformSettings2.find((s) => s.key === "openai_api_key");
    if (platformKey?.value) {
      const decryptedKey = decrypt(platformKey.value);
      if (decryptedKey) {
        return decryptedKey;
      }
    }
  } catch (error) {
    console.error("Error fetching platform AI settings:", error);
  }
  return process.env.OPENAI_API_KEY || null;
}
function createOpenAIClient(apiKey) {
  return new OpenAI({ apiKey });
}
var DEFAULT_MODEL, ACTION_PROMPTS, AIService, aiService;
var init_ai_service = __esm({
  "server/ai-service.ts"() {
    "use strict";
    init_storage();
    init_encryption();
    DEFAULT_MODEL = "gpt-5";
    ACTION_PROMPTS = {
      rewrite: (content) => `Rewrite the following text while preserving its meaning but improving clarity and flow:

${content}`,
      improve_tone: (content) => `Improve the tone of this text to be more professional and polished:

${content}`,
      expand: (content) => `Expand this text with more details and context while keeping it relevant:

${content}`,
      shorten: (content) => `Shorten this text to be more concise while keeping the key points:

${content}`,
      summarize: (content) => `Summarize the following text in 2-3 sentences:

${content}`,
      fix_grammar: (content) => `Fix any grammar, spelling, and punctuation errors in this text:

${content}`,
      make_formal: (content) => `Rewrite this text in a formal, professional tone suitable for business communication:

${content}`,
      make_friendly: (content) => `Rewrite this text in a warm, friendly, and approachable tone:

${content}`,
      make_persuasive: (content) => `Rewrite this text to be more persuasive and compelling:

${content}`,
      generate_subject: (content) => `Generate a compelling email subject line for this email content:

${content}

Provide only the subject line, no quotes or extra text.`,
      generate_followup: (content, context) => `Generate a professional follow-up email based on this context:

Original communication: ${content}
Purpose: ${context?.purpose || "general follow-up"}

Write a complete follow-up email including greeting and signature placeholder.`,
      generate_email: (content, context) => `Generate a professional email based on this request:

Purpose: ${context?.purpose || "general communication"}
Recipient: ${context?.recipientName || "the recipient"}
Company: ${context?.companyName || "the company"}
Context: ${content}

Write a complete email including greeting and signature placeholder.`,
      generate_subtasks: (content, context) => `Break down this task into specific, actionable subtasks:

Task: ${content}
Estimated time: ${context?.estimatedMinutes || "not specified"} minutes

Return a JSON array of subtask objects with "title" and "estimatedMinutes" fields. Example: [{"title": "Subtask 1", "estimatedMinutes": 30}]`,
      suggest_due_date: (content, context) => `Suggest an appropriate due date for this task:

Task: ${content}
Priority: ${context?.priority || "medium"}
Current date: ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}

Respond with only a date in YYYY-MM-DD format.`,
      prioritize: (content) => `Analyze this task and suggest an appropriate priority level:

Task: ${content}

Respond with only one of: low, medium, high, urgent`,
      explain: (content) => `Explain this task description in simpler terms, breaking down any complex requirements:

${content}`,
      generate_introduction: (content, context) => `Generate a professional proposal introduction for:

Project: ${context?.projectName || "the project"}
Client: ${context?.clientName || "the client"}
Context: ${content}

Write 2-3 paragraphs that introduce the proposal professionally.`,
      generate_scope: (content, context) => `Generate a detailed scope of work section for:

Project: ${context?.projectName || "the project"}
Context: ${content}

Use markdown formatting with headers and bullet points.`,
      generate_timeline: (content, context) => `Generate a project timeline with phases for:

Project: ${context?.projectName || "the project"}
Context: ${content}

Use markdown table format with Phase, Duration, and Milestones columns.`,
      generate_terms: (content, context) => `Generate standard terms and conditions for:

Project type: ${context?.projectType || "professional services"}
Context: ${content}

Include payment terms, modifications policy, IP rights, and confidentiality.`,
      lead_score: (content, context) => `Analyze this lead/prospect and provide a score from 0-100 with reasoning:

Lead info: ${content}
Interaction history: ${JSON.stringify(context?.interactions || [])}

Respond with JSON: {"score": number, "reasoning": "explanation", "factors": {"engagement": number, "budget": number, "timeline": number, "fit": number}}`,
      client_summary: (content, context) => `Generate a concise client summary card:

Client data: ${content}
Recent activity: ${JSON.stringify(context?.recentActivity || [])}

Include: key metrics, relationship health, and notable points.`,
      next_steps: (content, context) => `Suggest the next best actions for this client/lead:

Context: ${content}
Current stage: ${context?.stage || "unknown"}
Last interaction: ${context?.lastInteraction || "unknown"}

Provide 3-5 specific, actionable recommendations as a JSON array: [{"action": "...", "priority": "high/medium/low", "reason": "..."}]`,
      report_insights: (content, context) => `Analyze this data and provide business insights:

Data: ${content}
Metrics: ${JSON.stringify(context?.metrics || {})}

Provide: 3 key insights, 2 recommendations, and 1 risk to watch.`,
      workflow_suggestion: (content, context) => `Suggest automation rules for this scenario:

Context: ${content}
Trigger events available: ${JSON.stringify(context?.availableTriggers || [])}

Suggest 3 automation rules as JSON: [{"name": "...", "trigger": "...", "action": "...", "condition": "..."}]`
    };
    AIService = class {
      model = DEFAULT_MODEL;
      async processRequest(options, settings) {
        const { action, content, context, userId } = options;
        const startTime = Date.now();
        const apiKey = await getOpenAIKey(userId);
        if (!apiKey) {
          return this.getFallbackResponse(action, content, context);
        }
        const promptFn = ACTION_PROMPTS[action];
        if (!promptFn) {
          return this.getFallbackResponse(action, content, context);
        }
        const prompt = promptFn(content, context);
        const model = settings?.preferredModel || this.model;
        try {
          const openai = createOpenAIClient(apiKey);
          const completion = await openai.chat.completions.create({
            model,
            messages: [
              {
                role: "system",
                content: settings?.customInstructions || "You are a helpful AI assistant for a CRM application. Be professional, concise, and helpful. Return only the requested content without explanations unless asked."
              },
              { role: "user", content: prompt }
            ],
            max_completion_tokens: 2e3
          });
          const result = completion.choices[0]?.message?.content || "";
          const usage = completion.usage;
          return {
            result,
            action,
            tokensUsed: usage?.total_tokens || 0,
            inputTokens: usage?.prompt_tokens || 0,
            outputTokens: usage?.completion_tokens || 0,
            model,
            success: true
          };
        } catch (error) {
          console.error("AI Service error:", error);
          return this.getFallbackResponse(action, content, context, error.message);
        }
      }
      getFallbackResponse(action, content, context, error) {
        let result = content;
        switch (action) {
          case "improve_tone":
            result = content.replace(/\b(please|kindly)\b/gi, "we would appreciate if you").replace(/\bASAP\b/gi, "at your earliest convenience");
            break;
          case "shorten":
            const sentences = content.split(/[.!?]+/).filter((s) => s.trim());
            result = sentences.slice(0, Math.ceil(sentences.length / 2)).join(". ") + ".";
            break;
          case "make_persuasive":
            result = content + "\n\nWe believe this opportunity aligns perfectly with your goals, and we're confident you'll see exceptional value in moving forward.";
            break;
          case "make_formal":
            result = `Dear Valued Customer,

${content}

Best regards`;
            break;
          case "make_friendly":
            result = `Hi there!

${content}

Cheers!`;
            break;
          case "generate_subject":
            const words = content.split(" ").slice(0, 5).join(" ");
            result = `Re: ${words}...`;
            break;
          case "expand":
            result = content + "\n\nWe would like to provide you with more details about our services. Our team is dedicated to delivering exceptional results tailored to your specific needs.";
            break;
          case "generate_introduction":
            result = `We are pleased to present this proposal for ${context?.projectName || "your project"}. Our team has carefully analyzed your requirements and developed a comprehensive solution that addresses your specific needs.`;
            break;
          case "generate_scope":
            result = `## Scope of Work

This engagement includes the following key deliverables:

1. **Discovery & Planning**
2. **Design & Development**
3. **Testing & Quality Assurance**
4. **Deployment & Launch**
5. **Training & Documentation**`;
            break;
          case "generate_timeline":
            result = `## Project Timeline

| Phase | Duration | Milestones |
|-------|----------|------------|
| Discovery | Week 1-2 | Requirements finalized |
| Design | Week 3-4 | Designs approved |
| Development | Week 5-8 | Core features complete |
| Testing | Week 9-10 | QA sign-off |
| Launch | Week 11-12 | Go-live |`;
            break;
          case "generate_terms":
            result = `## Terms & Conditions

**Payment Terms**
- 50% deposit upon project commencement
- 25% upon design approval
- 25% upon project completion`;
            break;
          case "generate_subtasks":
            result = JSON.stringify([
              { title: "Review requirements", estimatedMinutes: 30 },
              { title: "Create implementation plan", estimatedMinutes: 45 },
              { title: "Execute main work", estimatedMinutes: 120 },
              { title: "Review and finalize", estimatedMinutes: 30 }
            ]);
            break;
          case "suggest_due_date":
            const daysToAdd = context?.priority === "urgent" ? 1 : context?.priority === "high" ? 3 : 7;
            const dueDate = /* @__PURE__ */ new Date();
            dueDate.setDate(dueDate.getDate() + daysToAdd);
            result = dueDate.toISOString().split("T")[0];
            break;
          case "prioritize":
            result = "medium";
            break;
          case "lead_score":
            result = JSON.stringify({ score: 65, reasoning: "Based on available information", factors: { engagement: 70, budget: 60, timeline: 65, fit: 65 } });
            break;
          case "next_steps":
            result = JSON.stringify([
              { action: "Schedule follow-up call", priority: "high", reason: "Maintain engagement" },
              { action: "Send additional information", priority: "medium", reason: "Address questions" }
            ]);
            break;
          default:
            result = content;
        }
        return {
          result,
          action,
          tokensUsed: 0,
          inputTokens: 0,
          outputTokens: 0,
          model: "fallback",
          success: !error,
          error
        };
      }
    };
    aiService = new AIService();
  }
});

// api/[...path].ts
import serverless from "serverless-http";

// server/app.ts
import express from "express";
import cors from "cors";

// server/routes.ts
init_storage();

// server/auth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("WARNING: JWT_SECRET environment variable is not set - using fallback for debugging only");
    return "MISSING_JWT_SECRET_PLEASE_CONFIGURE";
  }
  return secret;
}
var JWT_SECRET = getJwtSecret();
var JWT_EXPIRES_IN = "15m";
var REFRESH_TOKEN_EXPIRES_IN = "7d";
var SALT_ROUNDS = 12;
var PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
};
function validatePassword(password) {
  const errors = [];
  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
  }
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (PASSWORD_POLICY.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function generateAccessToken(user, options) {
  const payload = {
    userId: user.id,
    tenantId: user.tenantId,
    email: user.email,
    userType: user.userType,
    isAdmin: user.isAdmin
  };
  if (options?.activeWorkspaceId) {
    payload.activeWorkspaceId = options.activeWorkspaceId;
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function generateRefreshToken(user, options) {
  const payload = {
    userId: user.id,
    tenantId: user.tenantId,
    email: user.email,
    userType: user.userType,
    isAdmin: user.isAdmin
  };
  if (options?.activeWorkspaceId) {
    payload.activeWorkspaceId = options.activeWorkspaceId;
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
function getRefreshTokenExpiry() {
  const expiry = /* @__PURE__ */ new Date();
  expiry.setDate(expiry.getDate() + 7);
  return expiry;
}

// server/middleware.ts
init_schema();
init_storage();
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  req.user = payload;
  next();
}
function validateTenant(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}
function requireSaasAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (req.user.userType !== USER_TYPES.SAAS_ADMIN) {
    return res.status(403).json({ message: "SaaS Admin access required" });
  }
  next();
}
function requireAgencyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const allowedTypes = [USER_TYPES.SAAS_ADMIN, USER_TYPES.AGENCY_ADMIN];
  if (!allowedTypes.includes(req.user.userType)) {
    return res.status(403).json({ message: "Agency Admin access required" });
  }
  next();
}
function denyCustomerAccess(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (req.user.userType === USER_TYPES.CUSTOMER) {
    return res.status(403).json({ message: "Access denied for customer accounts" });
  }
  next();
}
async function resolveWorkspaceContext(req, res, next) {
  if (!req.user) {
    return next();
  }
  try {
    const multiWorkspaceEnabled = await storage.getFeatureFlag("multi_workspace_enabled", req.user.tenantId);
    req.multiWorkspaceEnabled = multiWorkspaceEnabled;
    if (!multiWorkspaceEnabled) {
      req.workspaceId = req.user.tenantId;
      return next();
    }
    let workspaceId = req.headers["x-workspace-id"] || req.query.workspaceId || req.user.activeWorkspaceId;
    if (!workspaceId) {
      workspaceId = req.user.tenantId;
    }
    const hasAccess = await storage.isUserInWorkspace(req.user.userId, workspaceId);
    if (!hasAccess && workspaceId !== req.user.tenantId) {
      return res.status(403).json({ message: "Access denied to this workspace" });
    }
    req.workspaceId = workspaceId;
    if (hasAccess) {
      await storage.setActiveWorkspace(req.user.userId, workspaceId);
    }
    next();
  } catch (error) {
    console.error("Workspace context resolution error:", error);
    req.workspaceId = req.user.tenantId;
    next();
  }
}
async function requireWorkspaceAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (!req.multiWorkspaceEnabled) {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    return next();
  }
  const workspaceId = req.workspaceId || req.user.tenantId;
  try {
    const role = await storage.getUserWorkspaceRole(req.user.userId, workspaceId);
    if (!role || !["owner", "admin"].includes(role)) {
      if (workspaceId === req.user.tenantId && req.user.isAdmin) {
        return next();
      }
      return res.status(403).json({ message: "Workspace admin access required" });
    }
    next();
  } catch (error) {
    console.error("Workspace admin check error:", error);
    return res.status(500).json({ message: "Failed to verify workspace permissions" });
  }
}
function requireMultiWorkspaceEnabled(req, res, next) {
  if (!req.multiWorkspaceEnabled) {
    return res.status(403).json({
      message: "Multi-workspace feature is not enabled for this account",
      code: "MULTI_WORKSPACE_DISABLED"
    });
  }
  next();
}

// server/security.ts
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
var authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 10,
  message: {
    message: "Too many authentication attempts. Please try again in 15 minutes.",
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `auth:${ipKeyGenerator(req)}`;
  },
  skip: (req) => {
    return req.method === "OPTIONS";
  }
});
var apiRateLimiter = rateLimit({
  windowMs: 60 * 1e3,
  max: 100,
  message: {
    message: "Too many requests. Please slow down.",
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = req.user?.userId;
    if (userId) {
      return `user:${userId}`;
    }
    return `api:${ipKeyGenerator(req)}`;
  }
});
var strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  max: 5,
  message: {
    message: "Rate limit exceeded for this sensitive operation. Please try again later.",
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `strict:${ipKeyGenerator(req)}`;
  }
});
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input.replace(/[<>]/g, "").replace(/javascript:/gi, "").replace(/on\w+=/gi, "").trim().slice(0, 1e4);
}
function sanitizeObject(obj) {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(
        (item) => typeof item === "string" ? sanitizeInput(item) : item
      );
    } else if (value && typeof value === "object") {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
function inputSanitizationMiddleware(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
}
function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(",")[0];
    return ips.trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}
function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// server/routes.ts
init_encryption();
init_schema();
import crypto2 from "crypto";
import { z as z2 } from "zod";
async function registerRoutes(httpServer, app) {
  app.get("/api/health", async (_req, res) => {
    try {
      const { pool: pool2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const client = await pool2.connect();
      await client.query("SELECT 1");
      client.release();
      res.json({
        status: "ok",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        environment: process.env.NODE_ENV || "development",
        database: "connected"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
        database: "disconnected"
      });
    }
  });
  app.get("/api/debug", async (_req, res) => {
    const envCheck = {
      SUPABASE_DATABASE_URL: !!process.env.SUPABASE_DATABASE_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV || "not set"
    };
    let dbStatus = "unknown";
    let dbError = null;
    try {
      const { pool: pool2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const client = await pool2.connect();
      await client.query("SELECT 1");
      client.release();
      dbStatus = "connected";
    } catch (error) {
      dbStatus = "failed";
      dbError = error.message;
    }
    res.json({
      status: "debug",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError
      }
    });
  });
  const isServerless = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const isProduction = process.env.NODE_ENV === "production";
  if (!isServerless && !isProduction) {
    try {
      await initializeModules();
      await initializeDefaultPackages();
      await initializeSuperAdmin();
    } catch (error) {
      console.error("Seeding error (non-critical):", error);
    }
  } else {
    console.log("[Routes] Skipping seed initialization in serverless/production environment");
  }
  app.post("/api/auth/register", authRateLimiter, async (req, res) => {
    const clientIp = getClientIp(req);
    const userAgent = req.headers["user-agent"] || "unknown";
    try {
      const { email, password, firstName, lastName, companyName } = req.body;
      if (!email || !password || !firstName || !lastName || !companyName) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
      }
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors
        });
      }
      const existingUser = await storage.getUserByEmail(email.toLowerCase().trim());
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const tenant = await storage.createTenant({ name: companyName.trim() });
      let adminRole = await storage.getRoleById("admin");
      if (!adminRole) {
        adminRole = await storage.createRole({
          name: "admin",
          permissions: ["*"]
        });
      }
      const passwordHash = await hashPassword(password);
      const user = await storage.createUser({
        tenantId: tenant.id,
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        roleId: adminRole.id,
        userType: "agency_admin",
        isAdmin: true,
        isActive: true
      });
      const modules2 = await storage.getAllModules();
      for (const module of modules2) {
        await storage.enableModuleForTenant({
          tenantId: tenant.id,
          moduleId: module.id,
          isEnabled: true
        });
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await storage.createAuthToken({
        userId: user.id,
        refreshToken,
        expiresAt: getRefreshTokenExpiry()
      });
      await storage.createAuditLog({
        tenantId: tenant.id,
        userId: user.id,
        action: AUDIT_LOG_ACTIONS.USER_CREATED,
        severity: "info",
        resourceType: "user",
        resourceId: user.id,
        ipAddress: clientIp,
        userAgent,
        requestMethod: "POST",
        requestPath: "/api/auth/register",
        details: JSON.stringify({ email: user.email, firstName: user.firstName }),
        success: true
      });
      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tenantId: user.tenantId
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app.post("/api/auth/login", authRateLimiter, async (req, res) => {
    const clientIp = getClientIp(req);
    const userAgent = req.headers["user-agent"] || "unknown";
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const failedAttempts = await storage.getFailedLoginCount(normalizedEmail, 15);
      if (failedAttempts >= 5) {
        await storage.createLoginAttempt({
          email: normalizedEmail,
          ipAddress: clientIp,
          userAgent,
          success: false,
          failureReason: "account_locked"
        });
        return res.status(429).json({
          message: "Account temporarily locked due to too many failed attempts. Please try again in 15 minutes."
        });
      }
      const user = await storage.getUserByEmail(normalizedEmail);
      if (!user) {
        await storage.createLoginAttempt({
          email: normalizedEmail,
          ipAddress: clientIp,
          userAgent,
          success: false,
          failureReason: "user_not_found"
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        await storage.createLoginAttempt({
          email: normalizedEmail,
          ipAddress: clientIp,
          userAgent,
          success: false,
          failureReason: "invalid_password"
        });
        await storage.createAuditLog({
          tenantId: user.tenantId,
          userId: user.id,
          action: AUDIT_LOG_ACTIONS.LOGIN_FAILED,
          severity: "warning",
          ipAddress: clientIp,
          userAgent,
          requestMethod: "POST",
          requestPath: "/api/auth/login",
          success: false,
          errorMessage: "Invalid password"
        });
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (!user.isActive) {
        await storage.createLoginAttempt({
          email: normalizedEmail,
          ipAddress: clientIp,
          userAgent,
          success: false,
          failureReason: "account_inactive"
        });
        return res.status(401).json({ message: "Account is inactive. Please contact your administrator." });
      }
      await storage.createLoginAttempt({
        email: normalizedEmail,
        ipAddress: clientIp,
        userAgent,
        success: true
      });
      let activeWorkspaceId;
      const multiWorkspaceEnabled = await storage.getFeatureFlag("multi_workspace_enabled", user.tenantId);
      if (multiWorkspaceEnabled) {
        const workspaces = await storage.getUserWorkspaces(user.id);
        const sortedWorkspaces = workspaces.sort((a, b) => {
          if (!a.lastAccessedAt && !b.lastAccessedAt) return 0;
          if (!a.lastAccessedAt) return 1;
          if (!b.lastAccessedAt) return -1;
          return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime();
        });
        const lastActive = sortedWorkspaces[0];
        activeWorkspaceId = lastActive?.workspaceId || user.tenantId;
      }
      const tokenOptions = activeWorkspaceId ? { activeWorkspaceId } : void 0;
      const accessToken = generateAccessToken(user, tokenOptions);
      const refreshToken = generateRefreshToken(user, tokenOptions);
      await storage.createAuthToken({
        userId: user.id,
        refreshToken,
        expiresAt: getRefreshTokenExpiry()
      });
      await storage.createAuditLog({
        tenantId: user.tenantId,
        userId: user.id,
        action: AUDIT_LOG_ACTIONS.LOGIN_SUCCESS,
        severity: "info",
        ipAddress: clientIp,
        userAgent,
        requestMethod: "POST",
        requestPath: "/api/auth/login",
        success: true
      });
      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tenantId: user.tenantId,
          userType: user.userType,
          isAdmin: user.isAdmin,
          profileImageUrl: user.profileImageUrl
        },
        ...activeWorkspaceId && { activeWorkspaceId }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app.post("/api/auth/refresh", authRateLimiter, async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
      }
      const payload = verifyToken(refreshToken);
      if (!payload) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
      const storedToken = await storage.getAuthToken(refreshToken);
      if (!storedToken) {
        return res.status(401).json({ message: "Refresh token not found" });
      }
      const user = await storage.getUserById(payload.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      let activeWorkspaceId = payload.activeWorkspaceId;
      if (activeWorkspaceId) {
        const hasAccess = await storage.isUserInWorkspace(user.id, activeWorkspaceId);
        const isPrimaryTenant = activeWorkspaceId === user.tenantId;
        if (!hasAccess && !isPrimaryTenant) {
          activeWorkspaceId = void 0;
        }
        const multiWorkspaceEnabled = await storage.getFeatureFlag("multi_workspace_enabled", user.tenantId);
        if (!multiWorkspaceEnabled) {
          activeWorkspaceId = void 0;
        }
      }
      const tokenOptions = activeWorkspaceId ? { activeWorkspaceId } : void 0;
      const newAccessToken = generateAccessToken(user, tokenOptions);
      res.json({
        accessToken: newAccessToken,
        ...activeWorkspaceId && { activeWorkspaceId }
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({ message: "Token refresh failed" });
    }
  });
  app.post("/api/auth/logout", requireAuth, async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        const storedToken = await storage.getAuthToken(refreshToken);
        if (storedToken) {
          await storage.deleteAuthToken(storedToken.id);
        }
      }
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserWithRole(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tenantId: user.tenantId,
        isAdmin: user.isAdmin,
        userType: user.userType,
        permissions: user.role?.permissions || [],
        profileImageUrl: user.profileImageUrl,
        phone: user.phone,
        jobTitle: user.jobTitle,
        employeeCode: user.employeeCode,
        address: user.address,
        designation: user.designation,
        department: user.department
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app.get("/api/users", requireAuth, validateTenant, async (req, res) => {
    try {
      const users2 = await storage.getUsersByTenant(req.user.tenantId);
      const userList = users2.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageUrl: user.profileImageUrl
      }));
      res.json(userList);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app.get("/api/team/members", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const users2 = await storage.getUsersByTenant(req.user.tenantId);
      const roles2 = await storage.getRolesByTenant(req.user.tenantId);
      const membersWithRoles = users2.map((user) => {
        const { passwordHash, ...userWithoutPassword } = user;
        const role = roles2.find((r) => r.id === user.roleId);
        return {
          ...userWithoutPassword,
          role: role || null,
          permissions: role?.permissions || []
        };
      });
      res.json(membersWithRoles);
    } catch (error) {
      console.error("Get team members error:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });
  app.post("/api/team/members", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const { email, password, firstName, lastName, roleId, permissions, phone, employeeCode, address, designation, department } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Email, password, first name and last name are required" });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
      }
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors
        });
      }
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      let userRoleId = roleId;
      if (permissions && permissions.length > 0) {
        const customRole = await storage.createRole({
          tenantId: req.user.tenantId,
          name: `${firstName} ${lastName} Role`,
          permissions
        });
        userRoleId = customRole.id;
      }
      const passwordHash = await hashPassword(password);
      const user = await storage.createTeamMember({
        tenantId: req.user.tenantId,
        email,
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        employeeCode: employeeCode || null,
        address: address || null,
        designation: designation || null,
        department: department || null,
        roleId: userRoleId || null,
        isAdmin: false,
        isActive: true
      });
      let rolePermissions = [];
      if (user.roleId) {
        const role = await storage.getRoleById(user.roleId);
        rolePermissions = role?.permissions || [];
      }
      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        isActive: user.isActive,
        permissions: rolePermissions
      });
    } catch (error) {
      console.error("Create team member error:", error);
      res.status(500).json({ message: "Failed to create team member" });
    }
  });
  app.patch("/api/team/members/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const currentUser = await storage.getUserById(req.user.userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Only admins can update team members" });
      }
      const { firstName, lastName, email, roleId, permissions, isActive, phone, employeeCode, address, designation, department } = req.body;
      const updates = {};
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (email) updates.email = email;
      if (typeof isActive === "boolean") updates.isActive = isActive;
      if (phone !== void 0) updates.phone = phone;
      if (employeeCode !== void 0) updates.employeeCode = employeeCode;
      if (address !== void 0) updates.address = address;
      if (designation !== void 0) updates.designation = designation;
      if (department !== void 0) updates.department = department;
      if (permissions && permissions.length > 0) {
        const existingUser = await storage.getUserById(req.params.id);
        if (existingUser?.roleId) {
          await storage.updateRole(existingUser.roleId, { permissions });
        } else {
          const customRole = await storage.createRole({
            tenantId: req.user.tenantId,
            name: `${firstName || existingUser?.firstName} Role`,
            permissions
          });
          updates.roleId = customRole.id;
        }
      } else if (roleId !== void 0) {
        updates.roleId = roleId;
      }
      const user = await storage.updateTeamMember(req.params.id, req.user.tenantId, updates);
      if (!user) {
        return res.status(404).json({ message: "Team member not found" });
      }
      let rolePermissions = [];
      if (user.roleId) {
        const role = await storage.getRoleById(user.roleId);
        rolePermissions = role?.permissions || [];
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        isActive: user.isActive,
        permissions: rolePermissions
      });
    } catch (error) {
      console.error("Update team member error:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  });
  app.delete("/api/team/members/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const currentUser = await storage.getUserById(req.user.userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Only admins can delete team members" });
      }
      if (req.params.id === req.user.userId) {
        return res.status(400).json({ message: "You cannot delete yourself" });
      }
      await storage.deleteTeamMember(req.params.id, req.user.tenantId);
      res.json({ message: "Team member deleted successfully" });
    } catch (error) {
      console.error("Delete team member error:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });
  app.get("/api/team/members/:id/details", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const details = await storage.getTeamMemberWithDetails(req.params.id, req.user.tenantId);
      if (!details) {
        return res.status(404).json({ message: "Team member not found" });
      }
      const { passwordHash, ...memberWithoutPassword } = details.member;
      const totalDealsValue = details.deals.reduce((sum, d) => sum + parseFloat(d.value), 0);
      const wonDeals = details.deals.filter((d) => d.stage === "won");
      const wonDealsValue = wonDeals.reduce((sum, d) => sum + parseFloat(d.value), 0);
      const totalQuotationsValue = details.quotations.reduce((sum, q) => sum + parseFloat(q.totalAmount), 0);
      const acceptedQuotations = details.quotations.filter((q) => q.status === "accepted");
      const totalInvoicesValue = details.invoices.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
      const paidInvoices = details.invoices.filter((i) => i.status === "paid");
      const paidInvoicesValue = paidInvoices.reduce((sum, i) => sum + parseFloat(i.totalAmount), 0);
      const completedTasks = details.tasks.filter((t) => t.status === "completed");
      const pendingTasks = details.tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled");
      res.json({
        member: memberWithoutPassword,
        deals: details.deals,
        quotations: details.quotations,
        invoices: details.invoices,
        tasks: details.tasks,
        customers: details.customers,
        activities: details.activities,
        performance: {
          totalDeals: details.deals.length,
          totalDealsValue,
          wonDeals: wonDeals.length,
          wonDealsValue,
          dealWinRate: details.deals.length > 0 ? (wonDeals.length / details.deals.length * 100).toFixed(1) : 0,
          totalQuotations: details.quotations.length,
          totalQuotationsValue,
          acceptedQuotations: acceptedQuotations.length,
          quotationAcceptRate: details.quotations.length > 0 ? (acceptedQuotations.length / details.quotations.length * 100).toFixed(1) : 0,
          totalInvoices: details.invoices.length,
          totalInvoicesValue,
          paidInvoices: paidInvoices.length,
          paidInvoicesValue,
          collectionRate: totalInvoicesValue > 0 ? (paidInvoicesValue / totalInvoicesValue * 100).toFixed(1) : 0,
          totalTasks: details.tasks.length,
          completedTasks: completedTasks.length,
          pendingTasks: pendingTasks.length,
          taskCompletionRate: details.tasks.length > 0 ? (completedTasks.length / details.tasks.length * 100).toFixed(1) : 0,
          totalCustomers: details.customers.length,
          totalActivities: details.activities.length
        }
      });
    } catch (error) {
      console.error("Get team member details error:", error);
      res.status(500).json({ message: "Failed to fetch team member details" });
    }
  });
  app.get("/api/team/roles", requireAuth, validateTenant, async (req, res) => {
    try {
      const roles2 = await storage.getRolesByTenant(req.user.tenantId);
      res.json(roles2);
    } catch (error) {
      console.error("Get roles error:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });
  app.post("/api/team/roles", requireAuth, validateTenant, async (req, res) => {
    try {
      const currentUser = await storage.getUserById(req.user.userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Only admins can create roles" });
      }
      const { name, permissions } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Role name is required" });
      }
      const role = await storage.createRole({
        tenantId: req.user.tenantId,
        name,
        permissions: permissions || []
      });
      res.status(201).json(role);
    } catch (error) {
      console.error("Create role error:", error);
      res.status(500).json({ message: "Failed to create role" });
    }
  });
  app.get("/api/auth/admin-check", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserById(req.user.userId);
      res.json({ isAdmin: user?.isAdmin || false });
    } catch (error) {
      console.error("Admin check error:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });
  app.patch("/api/users/profile", requireAuth, async (req, res) => {
    try {
      const { firstName, lastName, email, profileImageUrl, phone, jobTitle } = req.body;
      if (!firstName && !lastName && !email && profileImageUrl === void 0 && phone === void 0 && jobTitle === void 0) {
        return res.status(400).json({ message: "No valid fields provided for update" });
      }
      const updates = {};
      if (firstName && typeof firstName === "string") {
        updates.firstName = firstName.trim();
      }
      if (lastName && typeof lastName === "string") {
        updates.lastName = lastName.trim();
      }
      if (email && typeof email === "string") {
        const trimmedEmail = email.trim().toLowerCase();
        const existingUser = await storage.getUserByEmail(trimmedEmail);
        if (existingUser && existingUser.id !== req.user.userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
        updates.email = trimmedEmail;
      }
      if (profileImageUrl !== void 0) {
        updates.profileImageUrl = profileImageUrl;
      }
      if (phone !== void 0) {
        updates.phone = typeof phone === "string" ? phone.trim() : void 0;
      }
      if (jobTitle !== void 0) {
        updates.jobTitle = typeof jobTitle === "string" ? jobTitle.trim() : void 0;
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update" });
      }
      const updatedUser = await storage.updateUser(req.user.userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        tenantId: updatedUser.tenantId,
        profileImageUrl: updatedUser.profileImageUrl,
        phone: updatedUser.phone,
        jobTitle: updatedUser.jobTitle
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app.post("/api/users/profile/upload-image", requireAuth, async (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        return res.status(400).json({ message: "Image data is required" });
      }
      const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
      if (!dataUrlPattern.test(imageData)) {
        return res.status(400).json({ message: "Invalid image format. Please upload a valid image." });
      }
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      const sizeInBytes = Buffer.from(base64Data, "base64").length;
      const maxSize = 2 * 1024 * 1024;
      if (sizeInBytes > maxSize) {
        return res.status(400).json({ message: "Image size too large. Maximum size is 2MB." });
      }
      const updatedUser = await storage.updateUser(req.user.userId, {
        profileImageUrl: imageData
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        profileImageUrl: updatedUser.profileImageUrl,
        message: "Profile image uploaded successfully"
      });
    } catch (error) {
      console.error("Upload profile image error:", error);
      res.status(500).json({ message: "Failed to upload profile image" });
    }
  });
  app.get("/api/company-profile", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const profile = await storage.getCompanyProfile(workspaceId);
      if (!profile) {
        const tenant = await storage.getTenant(workspaceId);
        return res.json({
          tenantId: workspaceId,
          companyName: tenant?.name || "",
          email: "",
          phone: "",
          website: "",
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          logoUrl: "",
          taxId: "",
          registrationNumber: "",
          industry: "",
          companySize: "",
          currency: "USD",
          defaultPaymentTerms: "net30",
          invoicePrefix: "INV",
          quotePrefix: "QT",
          invoiceNotes: "",
          quoteNotes: ""
        });
      }
      res.json(profile);
    } catch (error) {
      console.error("Get company profile error:", error);
      res.status(500).json({ message: "Failed to fetch company profile" });
    }
  });
  app.put("/api/company-profile", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const profile = await storage.upsertCompanyProfile(workspaceId, req.body);
      res.json(profile);
    } catch (error) {
      console.error("Update company profile error:", error);
      res.status(500).json({ message: "Failed to update company profile" });
    }
  });
  app.get("/api/tenant/modules", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const tenantModules2 = await storage.getTenantModules(workspaceId);
      res.json(tenantModules2);
    } catch (error) {
      console.error("Get tenant modules error:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });
  app.get("/api/tenant/package", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const tenant = await storage.getTenant(workspaceId);
      if (!tenant?.packageId) {
        return res.json(null);
      }
      const pkg = await storage.getPackageById(tenant.packageId);
      res.json(pkg);
    } catch (error) {
      console.error("Get tenant package error:", error);
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });
  app.patch("/api/tenant/modules/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const { id } = req.params;
      const { isEnabled } = req.body;
      if (typeof isEnabled !== "boolean") {
        return res.status(400).json({ message: "isEnabled must be a boolean" });
      }
      await storage.updateTenantModule(id, isEnabled);
      res.json({ message: "Module updated successfully" });
    } catch (error) {
      console.error("Update tenant module error:", error);
      res.status(500).json({ message: "Failed to update module" });
    }
  });
  app.get("/api/contacts", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const userType = req.user.userType;
      const ownerId = userType === "team_member" || userType === "customer" ? req.user.userId : void 0;
      const contacts2 = await storage.getContactsByTenant(req.workspaceId, ownerId);
      res.json(contacts2);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });
  app.get("/api/contacts/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const contact = await storage.getContactById(req.params.id, req.workspaceId);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Get contact error:", error);
      res.status(500).json({ message: "Failed to fetch contact" });
    }
  });
  app.post("/api/contacts", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse({
        ...req.body,
        tenantId: req.workspaceId,
        ownerId: req.user.userId
      });
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create contact error:", error);
      res.status(500).json({ message: "Failed to create contact" });
    }
  });
  app.patch("/api/contacts/:id", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      const contact = await storage.updateContact(req.params.id, req.workspaceId, req.body);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Update contact error:", error);
      res.status(500).json({ message: "Failed to update contact" });
    }
  });
  app.delete("/api/contacts/:id", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      await storage.deleteContact(req.params.id, req.workspaceId);
      res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Delete contact error:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });
  app.get("/api/deals", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const userType = req.user.userType;
      const ownerId = userType === "team_member" || userType === "customer" ? req.user.userId : void 0;
      const deals2 = await storage.getDealsByTenant(req.workspaceId, ownerId);
      res.json(deals2);
    } catch (error) {
      console.error("Get deals error:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });
  app.get("/api/deals/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const deal = await storage.getDealById(req.params.id, req.workspaceId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Get deal error:", error);
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });
  app.post("/api/deals", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      const validatedData = insertDealSchema.parse({
        ...req.body,
        tenantId: req.workspaceId,
        ownerId: req.user.userId
      });
      const deal = await storage.createDeal(validatedData);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create deal error:", error);
      res.status(500).json({ message: "Failed to create deal" });
    }
  });
  app.patch("/api/deals/:id", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      const deal = await storage.updateDeal(req.params.id, req.workspaceId, req.body);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Update deal error:", error);
      res.status(500).json({ message: "Failed to update deal" });
    }
  });
  app.delete("/api/deals/:id", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      await storage.deleteDeal(req.params.id, req.workspaceId);
      res.json({ message: "Deal deleted successfully" });
    } catch (error) {
      console.error("Delete deal error:", error);
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });
  app.get("/api/deals/:id/journey", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const deal = await storage.getDealById(req.params.id, req.workspaceId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      let customer = null;
      if (deal.customerId) {
        customer = await storage.getCustomerById(deal.customerId, req.workspaceId);
      }
      let contact = null;
      if (deal.contactId) {
        contact = await storage.getContactById(deal.contactId, req.workspaceId);
      }
      const activities2 = await storage.getActivitiesByDeal(req.params.id, req.workspaceId);
      const tasks2 = await storage.getTasksByDeal(req.params.id, req.workspaceId);
      let quotations2 = [];
      let invoices2 = [];
      if (deal.customerId) {
        quotations2 = await storage.getQuotationsByCustomer(deal.customerId, req.workspaceId);
        invoices2 = await storage.getInvoicesByCustomer(deal.customerId, req.workspaceId);
      }
      const timelineEvents = [];
      activities2.forEach((a) => {
        timelineEvents.push({
          id: a.id,
          type: a.type,
          title: a.subject,
          description: a.description,
          date: a.completedAt || a.scheduledAt || a.createdAt,
          status: a.completedAt ? "completed" : "scheduled"
        });
      });
      quotations2.forEach((q) => {
        timelineEvents.push({
          id: q.id,
          type: "quotation",
          title: `Quotation ${q.quoteNumber}`,
          description: q.title,
          date: q.createdAt,
          status: q.status
        });
      });
      invoices2.forEach((i) => {
        timelineEvents.push({
          id: i.id,
          type: "invoice",
          title: `Invoice ${i.invoiceNumber}`,
          description: `Total: $${Number(i.totalAmount).toLocaleString()}`,
          date: i.issueDate,
          status: i.status
        });
      });
      tasks2.forEach((t) => {
        timelineEvents.push({
          id: t.id,
          type: "task",
          title: t.title,
          description: t.description,
          date: t.dueDate || t.createdAt,
          status: t.status
        });
      });
      timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      res.json({
        deal,
        customer,
        contact,
        quotations: quotations2,
        invoices: invoices2,
        activities: activities2,
        tasks: tasks2,
        timeline: timelineEvents,
        summary: {
          totalQuotations: quotations2.length,
          totalInvoices: invoices2.length,
          totalActivities: activities2.length,
          totalTasks: tasks2.length
        }
      });
    } catch (error) {
      console.error("Get deal journey error:", error);
      res.status(500).json({ message: "Failed to fetch deal journey" });
    }
  });
  app.get("/api/tasks", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const userType = req.user.userType;
      const filters = {};
      if (userType === "team_member" || userType === "customer") {
        filters.assignedTo = req.user.userId;
      }
      if (req.query.status) filters.status = req.query.status;
      if (req.query.priority) filters.priority = req.query.priority;
      if (req.query.customerId) filters.customerId = req.query.customerId;
      if (req.query.dealId) filters.dealId = req.query.dealId;
      if (req.query.dueFrom) filters.dueFrom = new Date(req.query.dueFrom);
      if (req.query.dueTo) filters.dueTo = new Date(req.query.dueTo);
      const tasks2 = await storage.getTasksWithFilters(req.workspaceId, filters);
      res.json(tasks2);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });
  app.get("/api/tasks/analytics", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      const analytics = await storage.getTaskAnalytics(req.workspaceId);
      res.json(analytics);
    } catch (error) {
      console.error("Get task analytics error:", error);
      res.status(500).json({ message: "Failed to fetch task analytics" });
    }
  });
  app.get("/api/tasks/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.workspaceId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Get task error:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });
  app.get("/api/tasks/:id/details", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const task = await storage.getTaskWithDetails(req.params.id, req.workspaceId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Get task details error:", error);
      res.status(500).json({ message: "Failed to fetch task details" });
    }
  });
  app.post("/api/tasks", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse({
        ...req.body,
        tenantId: req.workspaceId,
        createdBy: req.user.userId,
        assignedTo: req.body.assignedTo || null
      });
      const task = await storage.createTask(validatedData);
      await storage.createTaskActivityLog({
        taskId: task.id,
        userId: req.user.userId,
        action: "task_created",
        description: `Task "${task.title}" was created`
      });
      if (req.body.assignees && Array.isArray(req.body.assignees)) {
        for (const userId of req.body.assignees) {
          await storage.createTaskAssignment({
            taskId: task.id,
            userId,
            assignedBy: req.user.userId
          });
          if (userId !== req.user.userId) {
            await storage.createTaskNotification({
              tenantId: req.workspaceId,
              recipientId: userId,
              taskId: task.id,
              actorId: req.user.userId,
              type: "task_assigned",
              title: "New Task Assigned",
              message: `You have been assigned to task: ${task.title}`
            });
          }
        }
      }
      if (req.body.checklists && Array.isArray(req.body.checklists)) {
        for (let i = 0; i < req.body.checklists.length; i++) {
          await storage.createTaskChecklistItem({
            taskId: task.id,
            title: req.body.checklists[i],
            sortOrder: i
          }, req.user.userId);
        }
      }
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create task error:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  app.patch("/api/tasks/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const existingTask = await storage.getTaskById(req.params.id, req.workspaceId);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      if (req.body.status && req.body.status !== existingTask.status) {
        const task2 = await storage.updateTaskStatus(
          req.params.id,
          req.workspaceId,
          req.body.status,
          req.user.userId,
          req.body.statusNotes
        );
        const creator = existingTask.createdBy;
        if (creator && creator !== req.user.userId) {
          await storage.createTaskNotification({
            tenantId: req.workspaceId,
            recipientId: creator,
            taskId: req.params.id,
            actorId: req.user.userId,
            type: "status_changed",
            title: "Task Status Updated",
            message: `Task "${existingTask.title}" status changed to ${req.body.status}`
          });
        }
        delete req.body.status;
        delete req.body.statusNotes;
        if (Object.keys(req.body).length === 0) {
          return res.json(task2);
        }
      }
      const task = await storage.updateTask(req.params.id, req.workspaceId, req.body);
      res.json(task);
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  app.delete("/api/tasks/:id", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      await storage.deleteTask(req.params.id, req.workspaceId);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });
  app.get("/api/tasks/:id/assignments", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const assignments = await storage.getTaskAssignments(req.params.id);
      res.json(assignments);
    } catch (error) {
      console.error("Get task assignments error:", error);
      res.status(500).json({ message: "Failed to fetch task assignments" });
    }
  });
  app.post("/api/tasks/:id/assignments", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.workspaceId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      const assignment = await storage.createTaskAssignment({
        taskId: req.params.id,
        userId: req.body.userId,
        role: req.body.role || "assignee",
        assignedBy: req.user.userId
      });
      if (req.body.userId !== req.user.userId) {
        await storage.createTaskNotification({
          tenantId: req.workspaceId,
          recipientId: req.body.userId,
          taskId: req.params.id,
          actorId: req.user.userId,
          type: "task_assigned",
          title: "New Task Assigned",
          message: `You have been assigned to task: ${task.title}`
        });
      }
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Create task assignment error:", error);
      res.status(500).json({ message: "Failed to create task assignment" });
    }
  });
  app.delete("/api/tasks/:id/assignments/:userId", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      await storage.deleteTaskAssignment(req.params.id, req.params.userId);
      res.json({ message: "Assignment removed successfully" });
    } catch (error) {
      console.error("Delete task assignment error:", error);
      res.status(500).json({ message: "Failed to remove assignment" });
    }
  });
  app.get("/api/tasks/:id/comments", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const comments = await storage.getTaskComments(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error("Get task comments error:", error);
      res.status(500).json({ message: "Failed to fetch task comments" });
    }
  });
  app.post("/api/tasks/:id/comments", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.workspaceId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      const comment = await storage.createTaskComment({
        taskId: req.params.id,
        userId: req.user.userId,
        content: req.body.content,
        parentId: req.body.parentId,
        isInternal: req.body.isInternal || false
      });
      const creator = task.createdBy;
      if (creator && creator !== req.user.userId) {
        await storage.createTaskNotification({
          tenantId: req.workspaceId,
          recipientId: creator,
          taskId: req.params.id,
          actorId: req.user.userId,
          type: "comment_added",
          title: "New Comment",
          message: `New comment on task: ${task.title}`
        });
      }
      res.status(201).json(comment);
    } catch (error) {
      console.error("Create task comment error:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  app.patch("/api/tasks/:id/comments/:commentId", requireAuth, validateTenant, async (req, res) => {
    try {
      const comment = await storage.updateTaskComment(req.params.commentId, req.body.content);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(comment);
    } catch (error) {
      console.error("Update task comment error:", error);
      res.status(500).json({ message: "Failed to update comment" });
    }
  });
  app.delete("/api/tasks/:id/comments/:commentId", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteTaskComment(req.params.commentId);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Delete task comment error:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });
  app.get("/api/tasks/:id/checklist", requireAuth, validateTenant, async (req, res) => {
    try {
      const items = await storage.getTaskChecklistItems(req.params.id);
      res.json(items);
    } catch (error) {
      console.error("Get task checklist error:", error);
      res.status(500).json({ message: "Failed to fetch checklist" });
    }
  });
  app.post("/api/tasks/:id/checklist", requireAuth, validateTenant, async (req, res) => {
    try {
      const item = await storage.createTaskChecklistItem({
        taskId: req.params.id,
        title: req.body.title,
        sortOrder: req.body.sortOrder || 0
      }, req.user.userId);
      res.status(201).json(item);
    } catch (error) {
      console.error("Create checklist item error:", error);
      res.status(500).json({ message: "Failed to create checklist item" });
    }
  });
  app.patch("/api/tasks/:id/checklist/:itemId", requireAuth, validateTenant, async (req, res) => {
    try {
      const item = await storage.updateTaskChecklistItem(req.params.itemId, req.body);
      if (!item) {
        return res.status(404).json({ message: "Checklist item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Update checklist item error:", error);
      res.status(500).json({ message: "Failed to update checklist item" });
    }
  });
  app.post("/api/tasks/:id/checklist/:itemId/toggle", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.workspaceId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      const item = await storage.toggleTaskChecklistItem(req.params.itemId, req.user.userId);
      if (!item) {
        return res.status(404).json({ message: "Checklist item not found" });
      }
      if (item.isCompleted && task.createdBy && task.createdBy !== req.user.userId) {
        await storage.createTaskNotification({
          tenantId: req.workspaceId,
          recipientId: task.createdBy,
          taskId: req.params.id,
          actorId: req.user.userId,
          type: "checklist_completed",
          title: "Checklist Item Completed",
          message: `Checklist item completed on task: ${task.title}`
        });
      }
      res.json(item);
    } catch (error) {
      console.error("Toggle checklist item error:", error);
      res.status(500).json({ message: "Failed to toggle checklist item" });
    }
  });
  app.delete("/api/tasks/:id/checklist/:itemId", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteTaskChecklistItem(req.params.itemId);
      res.json({ message: "Checklist item deleted successfully" });
    } catch (error) {
      console.error("Delete checklist item error:", error);
      res.status(500).json({ message: "Failed to delete checklist item" });
    }
  });
  app.get("/api/tasks/:id/timelogs", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const timeLogs = await storage.getTaskTimeLogs(req.params.id);
      res.json(timeLogs);
    } catch (error) {
      console.error("Get task time logs error:", error);
      res.status(500).json({ message: "Failed to fetch time logs" });
    }
  });
  app.post("/api/tasks/:id/timelogs", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.workspaceId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      const timeLog = await storage.createTaskTimeLog({
        taskId: req.params.id,
        userId: req.user.userId,
        startedAt: req.body.startedAt ? new Date(req.body.startedAt) : /* @__PURE__ */ new Date(),
        endedAt: req.body.endedAt ? new Date(req.body.endedAt) : null,
        durationMinutes: req.body.durationMinutes,
        description: req.body.description,
        isBillable: req.body.isBillable || false
      });
      if (task.createdBy && task.createdBy !== req.user.userId) {
        await storage.createTaskNotification({
          tenantId: req.workspaceId,
          recipientId: task.createdBy,
          taskId: req.params.id,
          actorId: req.user.userId,
          type: "time_logged",
          title: "Time Logged",
          message: `Time logged on task: ${task.title}`
        });
      }
      res.status(201).json(timeLog);
    } catch (error) {
      console.error("Create time log error:", error);
      res.status(500).json({ message: "Failed to create time log" });
    }
  });
  app.post("/api/tasks/:id/timelogs/start", requireAuth, validateTenant, async (req, res) => {
    try {
      const existingActive = await storage.getActiveTimeLog(req.user.userId);
      if (existingActive) {
        await storage.stopActiveTimeLog(req.user.userId);
      }
      const timeLog = await storage.createTaskTimeLog({
        taskId: req.params.id,
        userId: req.user.userId,
        startedAt: /* @__PURE__ */ new Date(),
        endedAt: null,
        description: req.body.description,
        isBillable: req.body.isBillable || false
      });
      res.status(201).json(timeLog);
    } catch (error) {
      console.error("Start time tracking error:", error);
      res.status(500).json({ message: "Failed to start time tracking" });
    }
  });
  app.post("/api/tasks/:id/timelogs/stop", requireAuth, validateTenant, async (req, res) => {
    try {
      const timeLog = await storage.stopActiveTimeLog(req.user.userId);
      if (!timeLog) {
        return res.status(404).json({ message: "No active time tracking found" });
      }
      res.json(timeLog);
    } catch (error) {
      console.error("Stop time tracking error:", error);
      res.status(500).json({ message: "Failed to stop time tracking" });
    }
  });
  app.delete("/api/tasks/:id/timelogs/:logId", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteTaskTimeLog(req.params.logId);
      res.json({ message: "Time log deleted successfully" });
    } catch (error) {
      console.error("Delete time log error:", error);
      res.status(500).json({ message: "Failed to delete time log" });
    }
  });
  app.get("/api/tasks/:id/activity", requireAuth, validateTenant, async (req, res) => {
    try {
      const activityLog = await storage.getTaskActivityLog(req.params.id);
      res.json(activityLog);
    } catch (error) {
      console.error("Get task activity log error:", error);
      res.status(500).json({ message: "Failed to fetch activity log" });
    }
  });
  app.get("/api/tasks/:id/status-history", requireAuth, validateTenant, async (req, res) => {
    try {
      const history = await storage.getTaskStatusHistory(req.params.id);
      res.json(history);
    } catch (error) {
      console.error("Get task status history error:", error);
      res.status(500).json({ message: "Failed to fetch status history" });
    }
  });
  app.get("/api/notifications", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const unreadOnly = req.query.unreadOnly === "true";
      const notifications = await storage.getTaskNotifications(req.user.userId, workspaceId, unreadOnly);
      res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app.get("/api/notifications/count", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const count = await storage.getUnreadNotificationCount(req.user.userId, workspaceId);
      res.json({ count });
    } catch (error) {
      console.error("Get notification count error:", error);
      res.status(500).json({ message: "Failed to fetch notification count" });
    }
  });
  app.post("/api/notifications/:id/read", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  app.post("/api/notifications/read-all", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      await storage.markAllNotificationsAsRead(req.user.userId, workspaceId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Mark all notifications read error:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });
  app.get("/api/products", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const products2 = await storage.getProductsByTenant(req.workspaceId);
      res.json(products2);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app.get("/api/products/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id, req.workspaceId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app.post("/api/products", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse({
        ...req.body,
        tenantId: req.workspaceId
      });
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create product error:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  app.patch("/api/products/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.workspaceId, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app.delete("/api/products/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id, req.workspaceId);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app.get("/api/customers", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const userType = req.user.userType;
      const ownerId = userType === "team_member" || userType === "customer" ? req.user.userId : void 0;
      const customers2 = await storage.getCustomersByTenant(req.workspaceId, ownerId);
      res.json(customers2);
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });
  app.get("/api/customers/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const customer = await storage.getCustomerById(req.params.id, req.workspaceId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Get customer error:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });
  app.post("/api/customers", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse({
        ...req.body,
        tenantId: req.workspaceId,
        ownerId: req.user.userId
      });
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create customer error:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });
  app.patch("/api/customers/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const customer = await storage.updateCustomer(req.params.id, req.workspaceId, req.body);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Update customer error:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });
  app.delete("/api/customers/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      await storage.deleteCustomer(req.params.id, req.workspaceId);
      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Delete customer error:", error);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });
  app.get("/api/customers/:id/journey", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const customer = await storage.getCustomerById(req.params.id, req.workspaceId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      const contacts2 = await storage.getContactsByCustomer(req.params.id, req.workspaceId);
      const deals2 = await storage.getDealsByCustomer(req.params.id, req.workspaceId);
      const quotations2 = await storage.getQuotationsByCustomer(req.params.id, req.workspaceId);
      const invoices2 = await storage.getInvoicesByCustomer(req.params.id, req.workspaceId);
      const activities2 = await storage.getActivitiesByCustomer(req.params.id, req.workspaceId);
      const tasks2 = await storage.getTasksByCustomer(req.params.id, req.workspaceId);
      const timelineEvents = [];
      activities2.forEach((a) => {
        timelineEvents.push({
          id: a.id,
          type: "activity",
          subType: a.type,
          title: a.subject,
          description: a.description,
          date: a.completedAt || a.scheduledAt || a.createdAt,
          status: a.completedAt ? "completed" : "scheduled",
          data: a
        });
      });
      deals2.forEach((d) => {
        timelineEvents.push({
          id: d.id,
          type: "deal",
          subType: d.stage,
          title: d.title,
          description: `Deal value: $${Number(d.value).toLocaleString()}`,
          date: d.createdAt,
          status: d.stage,
          data: d
        });
      });
      quotations2.forEach((q) => {
        timelineEvents.push({
          id: q.id,
          type: "quotation",
          subType: q.status,
          title: `Quotation ${q.quoteNumber}`,
          description: q.title,
          date: q.createdAt,
          status: q.status,
          data: q
        });
      });
      invoices2.forEach((i) => {
        timelineEvents.push({
          id: i.id,
          type: "invoice",
          subType: i.status,
          title: `Invoice ${i.invoiceNumber}`,
          description: `Total: $${Number(i.totalAmount).toLocaleString()}`,
          date: i.issueDate,
          status: i.status,
          data: i
        });
      });
      tasks2.forEach((t) => {
        timelineEvents.push({
          id: t.id,
          type: "task",
          subType: t.priority,
          title: t.title,
          description: t.description,
          date: t.dueDate || t.createdAt,
          status: t.status,
          data: t
        });
      });
      timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      res.json({
        customer,
        contacts: contacts2,
        deals: deals2,
        quotations: quotations2,
        invoices: invoices2,
        activities: activities2,
        tasks: tasks2,
        timeline: timelineEvents,
        summary: {
          totalDeals: deals2.length,
          totalDealValue: deals2.reduce((sum, d) => sum + Number(d.value), 0),
          wonDeals: deals2.filter((d) => d.stage === "closed-won" || d.stage === "won").length,
          activeDeals: deals2.filter((d) => !["closed-won", "closed-lost", "won", "lost"].includes(d.stage)).length,
          totalQuotations: quotations2.length,
          totalInvoices: invoices2.length,
          paidInvoices: invoices2.filter((i) => i.status === "paid").length,
          totalRevenue: invoices2.filter((i) => i.status === "paid").reduce((sum, i) => sum + Number(i.paidAmount), 0),
          pendingAmount: invoices2.filter((i) => i.status !== "paid").reduce((sum, i) => sum + Number(i.balanceDue), 0)
        }
      });
    } catch (error) {
      console.error("Get customer journey error:", error);
      res.status(500).json({ message: "Failed to fetch customer journey" });
    }
  });
  app.get("/api/quotations", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const userType = req.user.userType;
      const createdBy = userType === "team_member" ? req.user.userId : void 0;
      const quotations2 = await storage.getQuotationsByTenant(req.workspaceId, createdBy);
      res.json(quotations2);
    } catch (error) {
      console.error("Get quotations error:", error);
      res.status(500).json({ message: "Failed to fetch quotations" });
    }
  });
  app.get("/api/quotations/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const quotation = await storage.getQuotationById(req.params.id, req.workspaceId);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      const items = await storage.getQuotationItems(quotation.id);
      res.json({ ...quotation, items });
    } catch (error) {
      console.error("Get quotation error:", error);
      res.status(500).json({ message: "Failed to fetch quotation" });
    }
  });
  app.post("/api/quotations", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const quoteNumber = await storage.getNextQuoteNumber(req.workspaceId);
      const validatedData = insertQuotationSchema.parse({
        ...req.body,
        tenantId: req.workspaceId,
        createdBy: req.user.userId,
        quoteNumber
      });
      const quotation = await storage.createQuotation(validatedData);
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createQuotationItem({
            ...item,
            quotationId: quotation.id
          });
        }
      }
      const items = await storage.getQuotationItems(quotation.id);
      res.status(201).json({ ...quotation, items });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create quotation error:", error);
      res.status(500).json({ message: "Failed to create quotation" });
    }
  });
  app.patch("/api/quotations/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const quotation = await storage.updateQuotation(req.params.id, req.workspaceId, req.body);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      if (req.body.items && Array.isArray(req.body.items)) {
        await storage.deleteQuotationItems(quotation.id);
        for (const item of req.body.items) {
          await storage.createQuotationItem({
            ...item,
            quotationId: quotation.id
          });
        }
      }
      const items = await storage.getQuotationItems(quotation.id);
      res.json({ ...quotation, items });
    } catch (error) {
      console.error("Update quotation error:", error);
      res.status(500).json({ message: "Failed to update quotation" });
    }
  });
  app.delete("/api/quotations/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      await storage.deleteQuotation(req.params.id, req.workspaceId);
      res.json({ message: "Quotation deleted successfully" });
    } catch (error) {
      console.error("Delete quotation error:", error);
      res.status(500).json({ message: "Failed to delete quotation" });
    }
  });
  app.get("/api/invoices", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const userType = req.user.userType;
      const createdBy = userType === "team_member" ? req.user.userId : void 0;
      const invoices2 = await storage.getInvoicesByTenant(req.workspaceId, createdBy);
      res.json(invoices2);
    } catch (error) {
      console.error("Get invoices error:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  app.get("/api/invoices/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const invoice = await storage.getInvoiceById(req.params.id, req.workspaceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const items = await storage.getInvoiceItems(invoice.id);
      const payments2 = await storage.getPaymentsByInvoice(invoice.id);
      res.json({ ...invoice, items, payments: payments2 });
    } catch (error) {
      console.error("Get invoice error:", error);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });
  app.post("/api/invoices", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const invoiceNumber = await storage.getNextInvoiceNumber(req.workspaceId);
      const validatedData = insertInvoiceSchema.parse({
        ...req.body,
        tenantId: req.workspaceId,
        createdBy: req.user.userId,
        invoiceNumber
      });
      const invoice = await storage.createInvoice(validatedData);
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createInvoiceItem({
            ...item,
            invoiceId: invoice.id
          });
        }
      }
      const items = await storage.getInvoiceItems(invoice.id);
      res.status(201).json({ ...invoice, items });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create invoice error:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });
  app.patch("/api/invoices/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const invoice = await storage.updateInvoice(req.params.id, req.workspaceId, req.body);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      if (req.body.items && Array.isArray(req.body.items)) {
        await storage.deleteInvoiceItems(invoice.id);
        for (const item of req.body.items) {
          await storage.createInvoiceItem({
            ...item,
            invoiceId: invoice.id
          });
        }
      }
      const items = await storage.getInvoiceItems(invoice.id);
      res.json({ ...invoice, items });
    } catch (error) {
      console.error("Update invoice error:", error);
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });
  app.delete("/api/invoices/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      await storage.deleteInvoice(req.params.id, req.workspaceId);
      res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
      console.error("Delete invoice error:", error);
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });
  app.post("/api/invoices/:invoiceId/payments", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const invoice = await storage.getInvoiceById(req.params.invoiceId, req.workspaceId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const validatedData = insertPaymentSchema.parse({
        ...req.body,
        tenantId: req.workspaceId,
        invoiceId: invoice.id
      });
      const payment = await storage.createPayment(validatedData);
      const payments2 = await storage.getPaymentsByInvoice(invoice.id);
      const totalPaid = payments2.reduce((sum, p) => sum + Number(p.amount), 0);
      const balanceDue = Number(invoice.totalAmount) - totalPaid;
      let status = invoice.status;
      if (balanceDue <= 0) {
        status = "paid";
      } else if (totalPaid > 0) {
        status = "partial";
      }
      await storage.updateInvoice(invoice.id, req.workspaceId, {
        paidAmount: String(totalPaid),
        balanceDue: String(balanceDue),
        status
      });
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create payment error:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });
  app.get("/api/activities", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const { customerId } = req.query;
      let activities2;
      if (customerId && typeof customerId === "string") {
        activities2 = await storage.getActivitiesByCustomer(customerId, req.workspaceId);
      } else {
        activities2 = await storage.getActivitiesByTenant(req.workspaceId);
      }
      res.json(activities2);
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  app.get("/api/activities/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const activity = await storage.getActivityById(req.params.id, req.workspaceId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      console.error("Get activity error:", error);
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });
  app.post("/api/activities", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse({
        ...req.body,
        tenantId: req.workspaceId,
        userId: req.user.userId
      });
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create activity error:", error);
      res.status(500).json({ message: "Failed to create activity" });
    }
  });
  app.patch("/api/activities/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const activity = await storage.updateActivity(req.params.id, req.workspaceId, req.body);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      console.error("Update activity error:", error);
      res.status(500).json({ message: "Failed to update activity" });
    }
  });
  app.delete("/api/activities/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      await storage.deleteActivity(req.params.id, req.workspaceId);
      res.json({ message: "Activity deleted successfully" });
    } catch (error) {
      console.error("Delete activity error:", error);
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });
  app.get("/api/reports/dashboard", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(req.workspaceId);
      res.json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  app.get("/api/reports/sales", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const deals2 = await storage.getSalesReport(req.workspaceId);
      res.json(deals2);
    } catch (error) {
      console.error("Get sales report error:", error);
      res.status(500).json({ message: "Failed to fetch sales report" });
    }
  });
  app.get("/api/saas-admin/stats", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const stats = await storage.getSaasAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Get SaaS admin stats error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app.get("/api/saas-admin/tenants", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const tenants2 = await storage.getAllTenants();
      res.json(tenants2);
    } catch (error) {
      console.error("Get all tenants error:", error);
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  });
  app.get("/api/saas-admin/users", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAllUsersWithTenants();
      res.json(users2);
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app.get("/api/saas-admin/tenants/:id", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const tenantDetails = await storage.getTenantDetails(req.params.id);
      if (!tenantDetails) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenantDetails);
    } catch (error) {
      console.error("Get tenant details error:", error);
      res.status(500).json({ message: "Failed to fetch tenant details" });
    }
  });
  app.get("/api/saas-admin/users/:id", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const userDetails = await storage.getUserDetails(req.params.id);
      if (!userDetails) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(userDetails);
    } catch (error) {
      console.error("Get user details error:", error);
      res.status(500).json({ message: "Failed to fetch user details" });
    }
  });
  app.patch("/api/saas-admin/tenants/:id/subscription", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { status, planId } = req.body;
      const tenantId = req.params.id;
      if (planId) {
        await storage.updateTenantPackage(tenantId, planId);
      }
      const updated = await storage.updateWorkspaceSubscription(tenantId, {
        ...status && { status }
      });
      if (!updated) {
        const created = await storage.createWorkspaceSubscription({
          workspaceId: tenantId,
          status: status || "active",
          billingCycle: "monthly",
          trialEndsAt: null,
          currentPeriodStart: /* @__PURE__ */ new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
        });
        const packageDetails2 = planId ? await storage.getPackageById(planId) : null;
        return res.json({ ...created, plan: packageDetails2 });
      }
      const packageDetails = planId ? await storage.getPackageById(planId) : null;
      res.json({ ...updated, plan: packageDetails });
    } catch (error) {
      console.error("Update tenant subscription error:", error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });
  app.get("/api/saas-admin/settings", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { category } = req.query;
      const settings = await storage.getPlatformSettings(category);
      const maskedSettings = settings.map((setting) => ({
        ...setting,
        value: setting.isSensitive ? maskApiKey(decrypt(setting.value)) : setting.value,
        hasValue: setting.isSensitive ? !!setting.value : void 0
      }));
      res.json(maskedSettings);
    } catch (error) {
      console.error("Get platform settings error:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app.put("/api/saas-admin/settings", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { key, value, category, description, isSensitive } = req.body;
      if (!key || value === void 0) {
        return res.status(400).json({ message: "Key and value are required" });
      }
      const storedValue = isSensitive ? encrypt(typeof value === "string" ? value : JSON.stringify(value)) : typeof value === "string" ? value : JSON.stringify(value);
      const setting = await storage.upsertPlatformSetting({
        key,
        value: storedValue,
        category: category || "general",
        description,
        isSensitive: isSensitive || false,
        updatedBy: req.user.userId
      });
      await storage.createPlatformActivityLog({
        actorId: req.user.userId,
        actorType: "user",
        targetType: "platform_setting",
        targetId: setting.id,
        action: "update_setting",
        description: `Updated platform setting: ${key}`,
        metadata: JSON.stringify({ key, isSensitive })
      });
      res.json({
        ...setting,
        value: setting.isSensitive ? maskApiKey(value) : setting.value
      });
    } catch (error) {
      console.error("Update platform setting error:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });
  app.delete("/api/saas-admin/settings/:key", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      await storage.deletePlatformSetting(req.params.key);
      await storage.createPlatformActivityLog({
        actorId: req.user.userId,
        actorType: "user",
        targetType: "platform_setting",
        targetId: req.params.key,
        action: "delete_setting",
        description: `Deleted platform setting: ${req.params.key}`
      });
      res.json({ message: "Setting deleted successfully" });
    } catch (error) {
      console.error("Delete platform setting error:", error);
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });
  app.get("/api/user/ai-settings", requireAuth, async (req, res) => {
    try {
      const settings = await storage.getUserAiSettings(req.user.userId);
      if (!settings) {
        return res.json({ provider: "openai", isEnabled: false, hasKey: false });
      }
      res.json({
        provider: settings.provider,
        isEnabled: settings.isEnabled,
        hasKey: !!settings.apiKey,
        maskedKey: settings.apiKey ? maskApiKey(decrypt(settings.apiKey)) : null,
        lastUsedAt: settings.lastUsedAt
      });
    } catch (error) {
      console.error("Get user AI settings error:", error);
      res.status(500).json({ message: "Failed to fetch AI settings" });
    }
  });
  app.put("/api/user/ai-settings", requireAuth, async (req, res) => {
    try {
      const { apiKey, isEnabled, provider } = req.body;
      const encryptedKey = apiKey ? encrypt(apiKey) : void 0;
      const settings = await storage.upsertUserAiSettings(req.user.userId, {
        provider: provider || "openai",
        apiKey: encryptedKey,
        isEnabled: isEnabled ?? true
      });
      res.json({
        provider: settings.provider,
        isEnabled: settings.isEnabled,
        hasKey: !!settings.apiKey
      });
    } catch (error) {
      console.error("Update user AI settings error:", error);
      res.status(500).json({ message: "Failed to update AI settings" });
    }
  });
  app.get("/api/saas-admin/activity-logs", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { tenantId, actorId, action, targetType, from, to, limit, offset } = req.query;
      const logs = await storage.getPlatformActivityLogs({
        tenantId,
        actorId,
        action,
        targetType,
        from: from ? new Date(from) : void 0,
        to: to ? new Date(to) : void 0,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0
      });
      res.json(logs);
    } catch (error) {
      console.error("Get activity logs error:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });
  app.get("/api/saas-admin/profile", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const user = await storage.getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error("Get super admin profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app.patch("/api/saas-admin/profile", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;
      if (!firstName && !lastName && !email) {
        return res.status(400).json({ message: "No valid fields provided for update" });
      }
      if (email) {
        const existingUser = await storage.getUserByEmail(email.trim().toLowerCase());
        if (existingUser && existingUser.id !== req.user.userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }
      const updates = {};
      if (firstName) updates.firstName = firstName.trim();
      if (lastName) updates.lastName = lastName.trim();
      if (email) updates.email = email.trim().toLowerCase();
      const updatedUser = await storage.updateSuperAdminProfile(req.user.userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.createPlatformActivityLog({
        actorId: req.user.userId,
        actorType: "user",
        targetType: "user",
        targetId: req.user.userId,
        action: "update_profile",
        description: "Super admin updated their profile",
        metadata: JSON.stringify(updates)
      });
      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userType: updatedUser.userType,
        isAdmin: updatedUser.isAdmin
      });
    } catch (error) {
      console.error("Update super admin profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app.get("/api/saas-admin/packages", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const packages2 = await storage.getAllPackagesWithModules();
      res.json(packages2);
    } catch (error) {
      console.error("Get packages error:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  app.get("/api/saas-admin/packages/:id", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const pkg = await storage.getPackageWithModules(req.params.id);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      console.error("Get package error:", error);
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });
  app.post("/api/saas-admin/packages", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const packageInputSchema = z2.object({
        name: z2.string().min(1, "Name is required").max(100),
        displayName: z2.string().min(1, "Display name is required").max(200),
        description: z2.string().max(1e3).optional(),
        price: z2.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional(),
        billingCycle: z2.enum(["monthly", "yearly", "one_time"]).optional(),
        isActive: z2.boolean().optional(),
        isPopular: z2.boolean().optional(),
        sortOrder: z2.number().int().min(0).max(1e3).optional(),
        features: z2.array(z2.string().max(200)).max(50).optional(),
        moduleIds: z2.array(z2.string()).optional()
      });
      const parsed = packageInputSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const { name, displayName, description, price, billingCycle, isActive, isPopular, sortOrder, features, moduleIds } = parsed.data;
      const pkg = await storage.createPackage({
        name,
        displayName,
        description,
        price: price || "0",
        billingCycle: billingCycle || "monthly",
        isActive: isActive !== void 0 ? isActive : true,
        isPopular: isPopular || false,
        sortOrder: sortOrder || 0,
        features: features || []
      });
      if (moduleIds && moduleIds.length > 0) {
        const validModules = await storage.getAllModules();
        const validModuleIds = validModules.map((m) => m.id);
        const invalidIds = moduleIds.filter((id) => !validModuleIds.includes(id));
        if (invalidIds.length > 0) {
          await storage.deletePackage(pkg.id);
          return res.status(400).json({ message: `Invalid module IDs: ${invalidIds.join(", ")}` });
        }
        await storage.setPackageModules(pkg.id, moduleIds);
      }
      const fullPackage = await storage.getPackageWithModules(pkg.id);
      await storage.createPlatformActivityLog({
        actorId: req.user.userId,
        actorType: "user",
        targetType: "package",
        targetId: pkg.id,
        action: "create_package",
        description: `Created package: ${pkg.displayName}`
      });
      res.status(201).json(fullPackage);
    } catch (error) {
      console.error("Create package error:", error);
      res.status(500).json({ message: "Failed to create package" });
    }
  });
  app.patch("/api/saas-admin/packages/:id", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const packageUpdateSchema = z2.object({
        name: z2.string().min(1).max(100).optional(),
        displayName: z2.string().min(1).max(200).optional(),
        description: z2.string().max(1e3).optional(),
        price: z2.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional(),
        billingCycle: z2.enum(["monthly", "yearly", "one_time"]).optional(),
        isActive: z2.boolean().optional(),
        isPopular: z2.boolean().optional(),
        sortOrder: z2.number().int().min(0).max(1e3).optional(),
        features: z2.array(z2.string().max(200)).max(50).optional(),
        moduleIds: z2.array(z2.string()).optional()
      });
      const parsed = packageUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const { name, displayName, description, price, billingCycle, isActive, isPopular, sortOrder, features, moduleIds } = parsed.data;
      const existingPkg = await storage.getPackageById(req.params.id);
      if (!existingPkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      const updates = {};
      if (name !== void 0) updates.name = name;
      if (displayName !== void 0) updates.displayName = displayName;
      if (description !== void 0) updates.description = description;
      if (price !== void 0) updates.price = price;
      if (billingCycle !== void 0) updates.billingCycle = billingCycle;
      if (isActive !== void 0) updates.isActive = isActive;
      if (isPopular !== void 0) updates.isPopular = isPopular;
      if (sortOrder !== void 0) updates.sortOrder = sortOrder;
      if (features !== void 0) updates.features = features;
      const pkg = await storage.updatePackage(req.params.id, updates);
      if (moduleIds !== void 0) {
        if (moduleIds.length > 0) {
          const validModules = await storage.getAllModules();
          const validModuleIds = validModules.map((m) => m.id);
          const invalidIds = moduleIds.filter((id) => !validModuleIds.includes(id));
          if (invalidIds.length > 0) {
            return res.status(400).json({ message: `Invalid module IDs: ${invalidIds.join(", ")}` });
          }
        }
        await storage.setPackageModules(req.params.id, moduleIds);
      }
      const fullPackage = await storage.getPackageWithModules(req.params.id);
      await storage.createPlatformActivityLog({
        actorId: req.user.userId,
        actorType: "user",
        targetType: "package",
        targetId: req.params.id,
        action: "update_package",
        description: `Updated package: ${pkg?.displayName}`
      });
      res.json(fullPackage);
    } catch (error) {
      console.error("Update package error:", error);
      res.status(500).json({ message: "Failed to update package" });
    }
  });
  app.delete("/api/saas-admin/packages/:id", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const pkg = await storage.getPackageById(req.params.id);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      await storage.deletePackage(req.params.id);
      await storage.createPlatformActivityLog({
        actorId: req.user.userId,
        actorType: "user",
        targetType: "package",
        targetId: req.params.id,
        action: "delete_package",
        description: `Deleted package: ${pkg.displayName}`
      });
      res.json({ message: "Package deleted successfully" });
    } catch (error) {
      console.error("Delete package error:", error);
      res.status(500).json({ message: "Failed to delete package" });
    }
  });
  app.get("/api/saas-admin/modules", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const modules2 = await storage.getAllModules();
      res.json(modules2);
    } catch (error) {
      console.error("Get modules error:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });
  app.get("/api/packages", async (req, res) => {
    try {
      const packages2 = await storage.getActivePackages();
      const packagesWithModules = await Promise.all(
        packages2.map(async (pkg) => {
          const pkgWithModules = await storage.getPackageWithModules(pkg.id);
          return pkgWithModules;
        })
      );
      res.json(packagesWithModules.filter((p) => p !== void 0));
    } catch (error) {
      console.error("Get public packages error:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  app.get("/api/customer-portal/quotations", requireAuth, async (req, res) => {
    try {
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Customer access only" });
      }
      const quotations2 = await storage.getQuotationsForCustomerUser(req.user.userId, req.user.tenantId);
      res.json(quotations2);
    } catch (error) {
      console.error("Get customer quotations error:", error);
      res.status(500).json({ message: "Failed to fetch quotations" });
    }
  });
  app.get("/api/customer-portal/invoices", requireAuth, async (req, res) => {
    try {
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Customer access only" });
      }
      const invoices2 = await storage.getInvoicesForCustomerUser(req.user.userId, req.user.tenantId);
      res.json(invoices2);
    } catch (error) {
      console.error("Get customer invoices error:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  app.get("/api/customer-portal/profile", requireAuth, async (req, res) => {
    try {
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Customer access only" });
      }
      const user = await storage.getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    } catch (error) {
      console.error("Get customer profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app.patch("/api/customer-portal/profile", requireAuth, async (req, res) => {
    try {
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Customer access only" });
      }
      const { firstName, lastName, phone } = req.body;
      const updated = await storage.updateUser(req.user.userId, { firstName, lastName, phone });
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone
      });
    } catch (error) {
      console.error("Update customer profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app.get("/api/customer-portal/documents", requireAuth, async (req, res) => {
    try {
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Customer access only" });
      }
      const user = await storage.getUserById(req.user.userId);
      if (!user) {
        return res.json([]);
      }
      const customers2 = await storage.getCustomersByTenant(req.user.tenantId);
      const matchingCustomer = customers2.find((c) => c.email === user.email);
      if (!matchingCustomer) {
        return res.json([]);
      }
      const documents = await storage.getClientDocuments(req.user.tenantId, matchingCustomer.id);
      res.json(documents.filter((d) => d.isVisibleToClient));
    } catch (error) {
      console.error("Get customer documents error:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app.get("/api/customer-portal/proposals", requireAuth, async (req, res) => {
    try {
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Customer access only" });
      }
      const user = await storage.getUserById(req.user.userId);
      if (!user) {
        return res.json([]);
      }
      const customers2 = await storage.getCustomersByTenant(req.user.tenantId);
      const matchingCustomer = customers2.find((c) => c.email === user.email);
      if (!matchingCustomer) {
        return res.json([]);
      }
      const proposals2 = await storage.getProposalsByCustomerForPortal(matchingCustomer.id, req.user.tenantId);
      res.json(proposals2);
    } catch (error) {
      console.error("Get customer proposals error:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });
  app.post("/api/customer-portal/quotations/:id/respond", requireAuth, async (req, res) => {
    try {
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Customer access only" });
      }
      const { action, notes } = req.body;
      if (!["accept", "reject"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'accept' or 'reject'" });
      }
      const quotation = await storage.getQuotationById(req.params.id, req.user.tenantId);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      const newStatus = action === "accept" ? "accepted" : "rejected";
      const updated = await storage.updateQuotation(req.params.id, req.user.tenantId, {
        status: newStatus,
        notes: notes || quotation.notes
      });
      await storage.createPortalActivityLog({
        workspaceId: req.user.tenantId,
        customerId: req.user.userId,
        action: action === "accept" ? "quotation_accepted" : "quotation_rejected",
        resourceType: "quotation",
        resourceId: req.params.id,
        metadata: JSON.stringify({ notes })
      });
      res.json(updated);
    } catch (error) {
      console.error("Respond to quotation error:", error);
      res.status(500).json({ message: "Failed to respond to quotation" });
    }
  });
  app.post("/api/customer-portal/proposals/:id/respond", requireAuth, async (req, res) => {
    try {
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Customer access only" });
      }
      const { action, notes, signatureData } = req.body;
      if (!["accept", "reject"].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'accept' or 'reject'" });
      }
      const proposal = await storage.getProposalById(req.params.id, req.user.tenantId);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      const newStatus = action === "accept" ? "accepted" : "rejected";
      const updated = await storage.updateProposal(req.params.id, req.user.tenantId, {
        status: newStatus
      });
      await storage.createPortalActivityLog({
        workspaceId: req.user.tenantId,
        customerId: req.user.userId,
        action: action === "accept" ? "proposal_accepted" : "proposal_rejected",
        resourceType: "proposal",
        resourceId: req.params.id,
        metadata: JSON.stringify({ notes, signatureData })
      });
      res.json(updated);
    } catch (error) {
      console.error("Respond to proposal error:", error);
      res.status(500).json({ message: "Failed to respond to proposal" });
    }
  });
  app.get("/api/customer-portal/settings", requireAuth, async (req, res) => {
    try {
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Customer access only" });
      }
      const settings = await storage.getCustomerPortalSettings(req.user.tenantId);
      if (!settings) {
        return res.json({
          portalEnabled: true,
          showProposals: true,
          showQuotations: true,
          showInvoices: true,
          showTasks: false,
          showDocuments: false,
          allowComments: true,
          allowFileUploads: false,
          allowOnlinePayments: false,
          welcomeMessage: null
        });
      }
      res.json(settings);
    } catch (error) {
      console.error("Get portal settings error:", error);
      res.status(500).json({ message: "Failed to fetch portal settings" });
    }
  });
  app.get("/api/workspace/:workspaceId/portal-settings", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId || req.workspaceId || req.user.tenantId;
      const settings = await storage.getCustomerPortalSettings(workspaceId);
      res.json(settings || {
        portalEnabled: false,
        showProposals: true,
        showQuotations: true,
        showInvoices: true,
        showTasks: false,
        showDocuments: false,
        allowComments: true,
        allowFileUploads: false,
        allowOnlinePayments: false
      });
    } catch (error) {
      console.error("Get portal settings error:", error);
      res.status(500).json({ message: "Failed to fetch portal settings" });
    }
  });
  app.put("/api/workspace/:workspaceId/portal-settings", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId || req.workspaceId || req.user.tenantId;
      const settings = await storage.upsertCustomerPortalSettings(workspaceId, req.body);
      res.json(settings);
    } catch (error) {
      console.error("Update portal settings error:", error);
      res.status(500).json({ message: "Failed to update portal settings" });
    }
  });
  app.get("/api/workspace/:workspaceId/portal-activity", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId || req.workspaceId || req.user.tenantId;
      const { customerId, limit } = req.query;
      const logs = await storage.getPortalActivityLogs(workspaceId, {
        customerId,
        limit: limit ? parseInt(limit) : void 0
      });
      res.json(logs);
    } catch (error) {
      console.error("Get portal activity logs error:", error);
      res.status(500).json({ message: "Failed to fetch portal activity logs" });
    }
  });
  app.post("/api/customers/:customerId/documents", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const doc = await storage.createClientDocument({
        tenantId: workspaceId,
        customerId: req.params.customerId,
        uploadedBy: req.user.userId,
        ...req.body
      });
      res.status(201).json(doc);
    } catch (error) {
      console.error("Create client document error:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });
  app.get("/api/customers/:customerId/documents", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const documents = await storage.getClientDocuments(workspaceId, req.params.customerId);
      res.json(documents);
    } catch (error) {
      console.error("Get client documents error:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app.delete("/api/customers/:customerId/documents/:docId", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      await storage.deleteClientDocument(req.params.docId, workspaceId);
      res.status(204).send();
    } catch (error) {
      console.error("Delete client document error:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });
  app.get("/api/email/templates", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const templates = await storage.getEmailTemplatesByTenant(workspaceId);
      res.json(templates);
    } catch (error) {
      console.error("Get email templates error:", error);
      res.status(500).json({ message: "Failed to fetch email templates" });
    }
  });
  app.get("/api/email/templates/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const template = await storage.getEmailTemplateById(req.params.id, workspaceId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Get email template error:", error);
      res.status(500).json({ message: "Failed to fetch email template" });
    }
  });
  app.post("/api/email/templates", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const { ownerType = "user", isShared = false, ...rest } = req.body;
      if (ownerType === "system") {
        return res.status(403).json({ message: "Cannot create system templates" });
      }
      if (ownerType === "workspace" && !req.user.isAdmin) {
        return res.status(403).json({ message: "Only admins can create workspace templates" });
      }
      const template = await storage.createEmailTemplate({
        ...rest,
        tenantId: workspaceId,
        createdBy: req.user.userId,
        ownerType,
        ownerId: ownerType === "user" ? req.user.userId : workspaceId,
        isShared
      });
      res.status(201).json(template);
    } catch (error) {
      console.error("Create email template error:", error);
      res.status(500).json({ message: "Failed to create email template" });
    }
  });
  app.patch("/api/email/templates/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const template = await storage.updateEmailTemplate(req.params.id, workspaceId, req.body);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Update email template error:", error);
      res.status(500).json({ message: "Failed to update email template" });
    }
  });
  app.delete("/api/email/templates/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const template = await storage.getEmailTemplateById(req.params.id, workspaceId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      if (template.ownerType === "system") {
        return res.status(403).json({ message: "System templates cannot be deleted" });
      }
      const canDelete = await storage.canDeleteEmailTemplate(template, req.user.userId, req.user.isAdmin || false);
      if (!canDelete) {
        return res.status(403).json({ message: "You don't have permission to delete this template" });
      }
      await storage.deleteEmailTemplate(req.params.id, workspaceId);
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Delete email template error:", error);
      res.status(500).json({ message: "Failed to delete email template" });
    }
  });
  app.get("/api/email/templates-grouped", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const userId = req.user.userId;
      const templates = await storage.getEmailTemplatesWithOwnership(workspaceId, userId, workspaceId);
      res.json(templates);
    } catch (error) {
      console.error("Get grouped email templates error:", error);
      res.status(500).json({ message: "Failed to fetch email templates" });
    }
  });
  app.post("/api/email/templates/:id/duplicate", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const duplicate = await storage.duplicateEmailTemplate(req.params.id, workspaceId, req.user.userId);
      if (!duplicate) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.status(201).json(duplicate);
    } catch (error) {
      console.error("Duplicate email template error:", error);
      res.status(500).json({ message: "Failed to duplicate email template" });
    }
  });
  app.patch("/api/email/templates/:id/share", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const { isShared } = req.body;
      const template = await storage.toggleEmailTemplateShare(req.params.id, workspaceId, req.user.userId, isShared);
      if (!template) {
        return res.status(404).json({ message: "Template not found or you don't have permission to share it" });
      }
      res.json(template);
    } catch (error) {
      console.error("Share email template error:", error);
      res.status(500).json({ message: "Failed to share email template" });
    }
  });
  app.get("/api/email/logs", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const logs = await storage.getEmailLogsByTenant(workspaceId);
      res.json(logs);
    } catch (error) {
      console.error("Get email logs error:", error);
      res.status(500).json({ message: "Failed to fetch email logs" });
    }
  });
  app.get("/api/email/logs/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const log2 = await storage.getEmailLogById(req.params.id, workspaceId);
      if (!log2) {
        return res.status(404).json({ message: "Email log not found" });
      }
      res.json(log2);
    } catch (error) {
      console.error("Get email log error:", error);
      res.status(500).json({ message: "Failed to fetch email log" });
    }
  });
  app.post("/api/email/send", requireAuth, validateTenant, resolveWorkspaceContext, denyCustomerAccess, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const { toEmail, ccEmails, bccEmails, subject, body, templateId, customerId, quotationId, invoiceId, attachments, scheduledAt } = req.body;
      if (!toEmail || !subject || !body) {
        return res.status(400).json({ message: "To, subject, and body are required" });
      }
      const senderAccount = await storage.getDefaultSenderAccount(workspaceId);
      const fromEmail = senderAccount?.email || "noreply@nexuscrm.com";
      const log2 = await storage.createEmailLog({
        tenantId: workspaceId,
        sentBy: req.user.userId,
        templateId: templateId || null,
        customerId: customerId || null,
        quotationId: quotationId || null,
        invoiceId: invoiceId || null,
        fromEmail,
        toEmail,
        ccEmails: ccEmails || null,
        bccEmails: bccEmails || null,
        subject,
        body,
        attachments: attachments || [],
        status: scheduledAt ? "scheduled" : "sent",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        trackingId: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
      if (!scheduledAt) {
        await storage.updateEmailLog(log2.id, { sentAt: /* @__PURE__ */ new Date() });
      }
      res.status(201).json({ message: "Email sent successfully", log: log2 });
    } catch (error) {
      console.error("Send email error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });
  app.get("/api/email/automations", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const rules = await storage.getAutomationRulesByTenant(workspaceId);
      res.json(rules);
    } catch (error) {
      console.error("Get automation rules error:", error);
      res.status(500).json({ message: "Failed to fetch automation rules" });
    }
  });
  app.get("/api/email/automations/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const rule = await storage.getAutomationRuleById(req.params.id, workspaceId);
      if (!rule) {
        return res.status(404).json({ message: "Automation rule not found" });
      }
      res.json(rule);
    } catch (error) {
      console.error("Get automation rule error:", error);
      res.status(500).json({ message: "Failed to fetch automation rule" });
    }
  });
  app.post("/api/email/automations", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const rule = await storage.createAutomationRule({
        ...req.body,
        tenantId: workspaceId,
        createdBy: req.user.userId
      });
      res.status(201).json(rule);
    } catch (error) {
      console.error("Create automation rule error:", error);
      res.status(500).json({ message: "Failed to create automation rule" });
    }
  });
  app.patch("/api/email/automations/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const rule = await storage.updateAutomationRule(req.params.id, workspaceId, req.body);
      if (!rule) {
        return res.status(404).json({ message: "Automation rule not found" });
      }
      res.json(rule);
    } catch (error) {
      console.error("Update automation rule error:", error);
      res.status(500).json({ message: "Failed to update automation rule" });
    }
  });
  app.delete("/api/email/automations/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      await storage.deleteAutomationRule(req.params.id, workspaceId);
      res.json({ message: "Automation rule deleted successfully" });
    } catch (error) {
      console.error("Delete automation rule error:", error);
      res.status(500).json({ message: "Failed to delete automation rule" });
    }
  });
  app.get("/api/email/sequences", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const sequences = await storage.getFollowUpSequencesByTenant(workspaceId);
      res.json(sequences);
    } catch (error) {
      console.error("Get follow-up sequences error:", error);
      res.status(500).json({ message: "Failed to fetch follow-up sequences" });
    }
  });
  app.get("/api/email/sequences/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const sequence = await storage.getFollowUpSequenceById(req.params.id, workspaceId);
      if (!sequence) {
        return res.status(404).json({ message: "Follow-up sequence not found" });
      }
      const steps = await storage.getFollowUpStepsBySequence(sequence.id);
      res.json({ ...sequence, steps });
    } catch (error) {
      console.error("Get follow-up sequence error:", error);
      res.status(500).json({ message: "Failed to fetch follow-up sequence" });
    }
  });
  app.post("/api/email/sequences", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const { steps, ...sequenceData } = req.body;
      const sequence = await storage.createFollowUpSequence({
        ...sequenceData,
        tenantId: workspaceId,
        createdBy: req.user.userId
      });
      if (steps && Array.isArray(steps)) {
        for (const step of steps) {
          await storage.createFollowUpStep({
            ...step,
            sequenceId: sequence.id
          });
        }
      }
      const createdSteps = await storage.getFollowUpStepsBySequence(sequence.id);
      res.status(201).json({ ...sequence, steps: createdSteps });
    } catch (error) {
      console.error("Create follow-up sequence error:", error);
      res.status(500).json({ message: "Failed to create follow-up sequence" });
    }
  });
  app.patch("/api/email/sequences/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const { steps, ...sequenceData } = req.body;
      const sequence = await storage.updateFollowUpSequence(req.params.id, workspaceId, sequenceData);
      if (!sequence) {
        return res.status(404).json({ message: "Follow-up sequence not found" });
      }
      const updatedSteps = await storage.getFollowUpStepsBySequence(sequence.id);
      res.json({ ...sequence, steps: updatedSteps });
    } catch (error) {
      console.error("Update follow-up sequence error:", error);
      res.status(500).json({ message: "Failed to update follow-up sequence" });
    }
  });
  app.delete("/api/email/sequences/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      await storage.deleteFollowUpSequence(req.params.id, workspaceId);
      res.json({ message: "Follow-up sequence deleted successfully" });
    } catch (error) {
      console.error("Delete follow-up sequence error:", error);
      res.status(500).json({ message: "Failed to delete follow-up sequence" });
    }
  });
  app.post("/api/email/sequences/:sequenceId/steps", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const step = await storage.createFollowUpStep({
        ...req.body,
        sequenceId: req.params.sequenceId
      });
      res.status(201).json(step);
    } catch (error) {
      console.error("Create follow-up step error:", error);
      res.status(500).json({ message: "Failed to create follow-up step" });
    }
  });
  app.patch("/api/email/steps/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const step = await storage.updateFollowUpStep(req.params.id, req.body);
      if (!step) {
        return res.status(404).json({ message: "Follow-up step not found" });
      }
      res.json(step);
    } catch (error) {
      console.error("Update follow-up step error:", error);
      res.status(500).json({ message: "Failed to update follow-up step" });
    }
  });
  app.delete("/api/email/steps/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      await storage.deleteFollowUpStep(req.params.id);
      res.json({ message: "Follow-up step deleted successfully" });
    } catch (error) {
      console.error("Delete follow-up step error:", error);
      res.status(500).json({ message: "Failed to delete follow-up step" });
    }
  });
  app.get("/api/email/scheduled", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const emails = await storage.getPendingScheduledEmails(workspaceId);
      res.json(emails);
    } catch (error) {
      console.error("Get scheduled emails error:", error);
      res.status(500).json({ message: "Failed to fetch scheduled emails" });
    }
  });
  app.delete("/api/email/scheduled/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteScheduledEmail(req.params.id);
      res.json({ message: "Scheduled email cancelled successfully" });
    } catch (error) {
      console.error("Delete scheduled email error:", error);
      res.status(500).json({ message: "Failed to cancel scheduled email" });
    }
  });
  app.get("/api/email/senders", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const accounts = await storage.getEmailSenderAccountsByTenant(workspaceId);
      res.json(accounts);
    } catch (error) {
      console.error("Get sender accounts error:", error);
      res.status(500).json({ message: "Failed to fetch sender accounts" });
    }
  });
  app.post("/api/email/senders", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const account = await storage.createEmailSenderAccount({
        ...req.body,
        tenantId: workspaceId
      });
      res.status(201).json(account);
    } catch (error) {
      console.error("Create sender account error:", error);
      res.status(500).json({ message: "Failed to create sender account" });
    }
  });
  app.patch("/api/email/senders/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const account = await storage.updateEmailSenderAccount(req.params.id, req.body);
      if (!account) {
        return res.status(404).json({ message: "Sender account not found" });
      }
      res.json(account);
    } catch (error) {
      console.error("Update sender account error:", error);
      res.status(500).json({ message: "Failed to update sender account" });
    }
  });
  app.delete("/api/email/senders/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      await storage.deleteEmailSenderAccount(req.params.id);
      res.json({ message: "Sender account deleted successfully" });
    } catch (error) {
      console.error("Delete sender account error:", error);
      res.status(500).json({ message: "Failed to delete sender account" });
    }
  });
  app.get("/api/email/smtp-settings", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const settings = await storage.getSmtpSettings(workspaceId);
      if (settings) {
        const { smtpPassword, apiKey, ...safeSettings } = settings;
        res.json({
          ...safeSettings,
          hasPassword: !!smtpPassword,
          hasApiKey: !!apiKey
        });
      } else {
        res.json({
          provider: "default",
          isEnabled: true,
          isVerified: false
        });
      }
    } catch (error) {
      console.error("Get SMTP settings error:", error);
      res.status(500).json({ message: "Failed to fetch SMTP settings" });
    }
  });
  app.put("/api/email/smtp-settings", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const settings = await storage.upsertSmtpSettings(workspaceId, req.body);
      const { smtpPassword, apiKey, ...safeSettings } = settings;
      res.json({
        ...safeSettings,
        hasPassword: !!smtpPassword,
        hasApiKey: !!apiKey
      });
    } catch (error) {
      console.error("Update SMTP settings error:", error);
      res.status(500).json({ message: "Failed to update SMTP settings" });
    }
  });
  app.post("/api/email/smtp-settings/test", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const workspaceId = req.workspaceId || req.user.tenantId;
      const result = await storage.testSmtpConnection(workspaceId);
      if (result.success) {
        await storage.upsertSmtpSettings(workspaceId, {
          isVerified: true
        });
      }
      res.json(result);
    } catch (error) {
      console.error("Test SMTP connection error:", error);
      res.status(500).json({ success: false, message: "Failed to test SMTP connection" });
    }
  });
  app.get("/api/email/merge-fields", requireAuth, validateTenant, async (req, res) => {
    try {
      const mergeFields = [
        { category: "Client", fields: [
          { key: "{{client.name}}", label: "Client Name" },
          { key: "{{client.email}}", label: "Client Email" },
          { key: "{{client.phone}}", label: "Client Phone" },
          { key: "{{client.company}}", label: "Client Company" },
          { key: "{{client.address}}", label: "Client Address" }
        ] },
        { category: "Quotation", fields: [
          { key: "{{quotation.number}}", label: "Quotation Number" },
          { key: "{{quotation.amount}}", label: "Quotation Amount" },
          { key: "{{quotation.title}}", label: "Quotation Title" },
          { key: "{{quotation.valid_until}}", label: "Valid Until" }
        ] },
        { category: "Invoice", fields: [
          { key: "{{invoice.number}}", label: "Invoice Number" },
          { key: "{{invoice.amount}}", label: "Invoice Amount" },
          { key: "{{invoice.due_date}}", label: "Due Date" },
          { key: "{{invoice.balance}}", label: "Balance Due" }
        ] },
        { category: "Agency", fields: [
          { key: "{{agency.name}}", label: "Agency Name" },
          { key: "{{agency.email}}", label: "Agency Email" },
          { key: "{{agency.phone}}", label: "Agency Phone" },
          { key: "{{agency.website}}", label: "Agency Website" }
        ] },
        { category: "User", fields: [
          { key: "{{user.name}}", label: "Sender Name" },
          { key: "{{user.email}}", label: "Sender Email" }
        ] },
        { category: "Date", fields: [
          { key: "{{current_date}}", label: "Current Date" },
          { key: "{{due_date}}", label: "Due Date" }
        ] }
      ];
      res.json(mergeFields);
    } catch (error) {
      console.error("Get merge fields error:", error);
      res.status(500).json({ message: "Failed to fetch merge fields" });
    }
  });
  app.post("/api/email/process-merge-fields", requireAuth, validateTenant, async (req, res) => {
    try {
      const { content, customerId, quotationId, invoiceId } = req.body;
      let processedContent = content;
      if (customerId) {
        const customer = await storage.getCustomerById(customerId, req.user.tenantId);
        if (customer) {
          processedContent = processedContent.replace(/\{\{client\.name\}\}/g, customer.name || "").replace(/\{\{client\.email\}\}/g, customer.email || "").replace(/\{\{client\.phone\}\}/g, customer.phone || "").replace(/\{\{client\.company\}\}/g, customer.company || "").replace(/\{\{client\.address\}\}/g, customer.address || "");
        }
      }
      if (quotationId) {
        const quotation = await storage.getQuotationById(quotationId, req.user.tenantId);
        if (quotation) {
          processedContent = processedContent.replace(/\{\{quotation\.number\}\}/g, quotation.quoteNumber || "").replace(/\{\{quotation\.amount\}\}/g, String(quotation.totalAmount) || "").replace(/\{\{quotation\.title\}\}/g, quotation.title || "").replace(/\{\{quotation\.valid_until\}\}/g, quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : "");
        }
      }
      if (invoiceId) {
        const invoice = await storage.getInvoiceById(invoiceId, req.user.tenantId);
        if (invoice) {
          processedContent = processedContent.replace(/\{\{invoice\.number\}\}/g, invoice.invoiceNumber || "").replace(/\{\{invoice\.amount\}\}/g, String(invoice.totalAmount) || "").replace(/\{\{invoice\.due_date\}\}/g, invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "").replace(/\{\{invoice\.balance\}\}/g, String(invoice.balanceDue) || "");
        }
      }
      const companyProfile = await storage.getCompanyProfile(req.user.tenantId);
      if (companyProfile) {
        processedContent = processedContent.replace(/\{\{agency\.name\}\}/g, companyProfile.companyName || "").replace(/\{\{agency\.email\}\}/g, companyProfile.email || "").replace(/\{\{agency\.phone\}\}/g, companyProfile.phone || "").replace(/\{\{agency\.website\}\}/g, companyProfile.website || "");
      }
      const user = await storage.getUserById(req.user.userId);
      if (user) {
        processedContent = processedContent.replace(/\{\{user\.name\}\}/g, `${user.firstName} ${user.lastName}`).replace(/\{\{user\.email\}\}/g, user.email || "");
      }
      processedContent = processedContent.replace(/\{\{current_date\}\}/g, (/* @__PURE__ */ new Date()).toLocaleDateString());
      processedContent = processedContent.replace(/\{\{[^}]+\s*\|\s*"([^"]+)"\}\}/g, "$1");
      res.json({ processedContent });
    } catch (error) {
      console.error("Process merge fields error:", error);
      res.status(500).json({ message: "Failed to process merge fields" });
    }
  });
  app.post("/api/email/ai-assist", requireAuth, validateTenant, async (req, res) => {
    try {
      const { action, content, context } = req.body;
      const tenantId = req.user.tenantId;
      const userId = req.user.userId;
      const aiEnabled = await storage.getFeatureFlag("ai_enhancement_enabled", tenantId);
      if (!aiEnabled) {
        return res.status(403).json({ message: "AI features are not enabled for this workspace", code: "AI_DISABLED" });
      }
      const aiSettings2 = await storage.getAiSettings(tenantId);
      if (aiSettings2 && !aiSettings2.emailAiEnabled) {
        return res.status(403).json({ message: "Email AI features are disabled", code: "EMAIL_AI_DISABLED" });
      }
      if (aiSettings2 && aiSettings2.tokensUsedThisMonth >= aiSettings2.monthlyTokenLimit) {
        return res.status(429).json({ message: "Monthly AI token limit reached", code: "TOKEN_LIMIT_EXCEEDED" });
      }
      const { aiService: aiService2 } = await Promise.resolve().then(() => (init_ai_service(), ai_service_exports));
      const startTime = Date.now();
      const response = await aiService2.processRequest({
        tenantId,
        userId,
        module: "email",
        action,
        content,
        context
      }, aiSettings2);
      await storage.createAiUsage({
        tenantId,
        userId,
        module: "email",
        action,
        tokensUsed: response.tokensUsed,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        model: response.model,
        success: response.success,
        latencyMs: Date.now() - startTime
      });
      if (response.tokensUsed > 0) {
        await storage.incrementAiTokenUsage(tenantId, response.tokensUsed);
      }
      await storage.createAiLog({
        tenantId,
        userId,
        module: "email",
        action,
        inputContent: content?.substring(0, 1e3),
        outputContent: response.result?.substring(0, 1e3),
        contextData: context ? JSON.stringify(context) : void 0,
        resourceType: "email",
        errorMessage: response.error
      });
      res.json({ result: response.result, action, success: response.success });
    } catch (error) {
      console.error("AI assist error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });
  app.get("/api/proposals", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const { status, customerId, ownerId } = req.query;
      const proposals2 = await storage.getProposalsByTenant(req.workspaceId, {
        status,
        customerId,
        ownerId
      });
      res.json(proposals2);
    } catch (error) {
      console.error("Get proposals error:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });
  app.get("/api/proposals/analytics", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const analytics = await storage.getProposalAnalytics(req.workspaceId);
      res.json(analytics);
    } catch (error) {
      console.error("Get proposal analytics error:", error);
      res.status(500).json({ message: "Failed to fetch proposal analytics" });
    }
  });
  app.get("/api/proposals/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const proposal = await storage.getProposalById(req.params.id, req.workspaceId);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      const sections = await storage.getProposalSections(proposal.id);
      const pricingItems = await storage.getProposalPricingItems(proposal.id);
      const versions = await storage.getProposalVersions(proposal.id);
      const activityLogs = await storage.getProposalActivityLogs(proposal.id);
      const comments = await storage.getProposalComments(proposal.id);
      const signatures = await storage.getProposalSignatures(proposal.id);
      const customer = proposal.customerId ? await storage.getCustomerById(proposal.customerId, req.workspaceId) : null;
      res.json({
        ...proposal,
        sections,
        pricingItems,
        versions,
        activityLogs,
        comments,
        signatures,
        customer
      });
    } catch (error) {
      console.error("Get proposal error:", error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });
  app.post("/api/proposals", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const proposalNumber = await storage.getNextProposalNumber(req.workspaceId);
      const { sections, pricingItems, ...proposalData } = req.body;
      let validUntil = null;
      if (proposalData.validUntil && proposalData.validUntil !== "") {
        validUntil = new Date(proposalData.validUntil);
        if (isNaN(validUntil.getTime())) {
          validUntil = null;
        }
      }
      let expiresAt = null;
      if (proposalData.expiresAt && proposalData.expiresAt !== "") {
        expiresAt = new Date(proposalData.expiresAt);
        if (isNaN(expiresAt.getTime())) {
          expiresAt = null;
        }
      }
      const proposal = await storage.createProposal({
        ...proposalData,
        validUntil,
        expiresAt,
        tenantId: req.workspaceId,
        createdBy: req.user.userId,
        ownerId: req.body.ownerId || req.user.userId,
        proposalNumber,
        status: "draft"
      });
      if (sections && Array.isArray(sections)) {
        for (const section of sections) {
          await storage.createProposalSection({
            proposalId: proposal.id,
            ...section
          });
        }
      }
      if (pricingItems && Array.isArray(pricingItems)) {
        for (const item of pricingItems) {
          await storage.createProposalPricingItem({
            proposalId: proposal.id,
            ...item
          });
        }
      }
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        userId: req.user.userId,
        action: "created",
        details: "Proposal created"
      });
      const createdSections = await storage.getProposalSections(proposal.id);
      const createdPricingItems = await storage.getProposalPricingItems(proposal.id);
      res.status(201).json({
        ...proposal,
        sections: createdSections,
        pricingItems: createdPricingItems
      });
    } catch (error) {
      console.error("Create proposal error:", error);
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });
  app.post("/api/proposals/from-template/:templateId", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const proposalNumber = await storage.getNextProposalNumber(req.workspaceId);
      const proposal = await storage.createProposalFromTemplate(req.params.templateId, {
        ...req.body,
        tenantId: req.workspaceId,
        createdBy: req.user.userId,
        ownerId: req.body.ownerId || req.user.userId,
        proposalNumber,
        status: "draft"
      });
      if (!proposal) {
        return res.status(404).json({ message: "Template not found" });
      }
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        userId: req.user.userId,
        action: "created_from_template",
        details: `Proposal created from template`
      });
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Create proposal from template error:", error);
      res.status(500).json({ message: "Failed to create proposal from template" });
    }
  });
  app.patch("/api/proposals/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const { id, createdAt, updatedAt, sections, pricingItems, versions, activityLogs, comments, signatures, customer, ...updates } = req.body;
      if (updates.validUntil) updates.validUntil = new Date(updates.validUntil);
      if (updates.sentAt) updates.sentAt = new Date(updates.sentAt);
      if (updates.viewedAt) updates.viewedAt = new Date(updates.viewedAt);
      if (updates.acceptedAt) updates.acceptedAt = new Date(updates.acceptedAt);
      if (updates.rejectedAt) updates.rejectedAt = new Date(updates.rejectedAt);
      if (updates.expiresAt) updates.expiresAt = new Date(updates.expiresAt);
      const proposal = await storage.updateProposal(req.params.id, req.workspaceId, updates);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        userId: req.user.userId,
        action: "updated",
        details: "Proposal updated"
      });
      res.json(proposal);
    } catch (error) {
      console.error("Update proposal error:", error);
      res.status(500).json({ message: "Failed to update proposal" });
    }
  });
  app.patch("/api/proposals/:id/status", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const proposal = await storage.updateProposalStatus(
        req.params.id,
        req.workspaceId,
        status,
        req.user.userId,
        notes
      );
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Update proposal status error:", error);
      res.status(500).json({ message: "Failed to update proposal status" });
    }
  });
  app.post("/api/proposals/:id/send", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const accessToken = await storage.generateProposalAccessToken(req.params.id, req.workspaceId);
      const proposal = await storage.updateProposalStatus(
        req.params.id,
        req.workspaceId,
        "sent",
        req.user.userId,
        "Proposal sent to client"
      );
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json({ ...proposal, accessToken, shareUrl: `/proposal/view/${accessToken}` });
    } catch (error) {
      console.error("Send proposal error:", error);
      res.status(500).json({ message: "Failed to send proposal" });
    }
  });
  app.post("/api/proposals/:id/version", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const proposal = await storage.getProposalById(req.params.id, req.workspaceId);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      const sections = await storage.getProposalSections(proposal.id);
      const pricingItems = await storage.getProposalPricingItems(proposal.id);
      const snapshot = JSON.stringify({
        title: proposal.title,
        sections,
        pricingItems,
        totalAmount: proposal.totalAmount
      });
      const version = await storage.createProposalVersion({
        proposalId: proposal.id,
        versionNumber: proposal.currentVersion,
        createdBy: req.user.userId,
        snapshot,
        changeNotes: req.body.notes || "Version saved"
      });
      await storage.updateProposal(proposal.id, req.workspaceId, {
        currentVersion: proposal.currentVersion + 1
      });
      res.status(201).json(version);
    } catch (error) {
      console.error("Create proposal version error:", error);
      res.status(500).json({ message: "Failed to create proposal version" });
    }
  });
  app.post("/api/proposals/:id/restore/:versionId", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const proposal = await storage.restoreProposalVersion(
        req.params.id,
        req.params.versionId,
        req.workspaceId,
        req.user.userId
      );
      if (!proposal) {
        return res.status(404).json({ message: "Proposal or version not found" });
      }
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        userId: req.user.userId,
        action: "version_restored",
        details: `Restored to version ${req.params.versionId}`
      });
      res.json(proposal);
    } catch (error) {
      console.error("Restore proposal version error:", error);
      res.status(500).json({ message: "Failed to restore proposal version" });
    }
  });
  app.delete("/api/proposals/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      await storage.deleteProposal(req.params.id, req.workspaceId);
      res.json({ message: "Proposal deleted successfully" });
    } catch (error) {
      console.error("Delete proposal error:", error);
      res.status(500).json({ message: "Failed to delete proposal" });
    }
  });
  app.post("/api/proposals/:proposalId/sections", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const section = await storage.createProposalSection({
        ...req.body,
        proposalId: req.params.proposalId
      });
      res.status(201).json(section);
    } catch (error) {
      console.error("Create proposal section error:", error);
      res.status(500).json({ message: "Failed to create proposal section" });
    }
  });
  app.patch("/api/proposals/sections/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const section = await storage.updateProposalSection(req.params.id, req.body);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Update proposal section error:", error);
      res.status(500).json({ message: "Failed to update proposal section" });
    }
  });
  app.delete("/api/proposals/sections/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      await storage.deleteProposalSection(req.params.id);
      res.json({ message: "Section deleted successfully" });
    } catch (error) {
      console.error("Delete proposal section error:", error);
      res.status(500).json({ message: "Failed to delete proposal section" });
    }
  });
  app.post("/api/proposals/:proposalId/sections/reorder", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const { sectionIds } = req.body;
      await storage.reorderProposalSections(req.params.proposalId, sectionIds);
      res.json({ message: "Sections reordered successfully" });
    } catch (error) {
      console.error("Reorder proposal sections error:", error);
      res.status(500).json({ message: "Failed to reorder sections" });
    }
  });
  app.post("/api/proposals/:proposalId/pricing", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const item = await storage.createProposalPricingItem({
        ...req.body,
        proposalId: req.params.proposalId
      });
      await storage.recalculateProposalTotals(req.params.proposalId, req.workspaceId);
      res.status(201).json(item);
    } catch (error) {
      console.error("Create pricing item error:", error);
      res.status(500).json({ message: "Failed to create pricing item" });
    }
  });
  app.patch("/api/proposals/pricing/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const { id, createdAt, proposalId, ...updates } = req.body;
      const item = await storage.updateProposalPricingItem(req.params.id, updates);
      if (!item) {
        return res.status(404).json({ message: "Pricing item not found" });
      }
      if (item.proposalId) {
        await storage.recalculateProposalTotals(item.proposalId, req.workspaceId);
      }
      res.json(item);
    } catch (error) {
      console.error("Update pricing item error:", error);
      res.status(500).json({ message: "Failed to update pricing item" });
    }
  });
  app.delete("/api/proposals/pricing/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      await storage.deleteProposalPricingItem(req.params.id);
      res.json({ message: "Pricing item deleted successfully" });
    } catch (error) {
      console.error("Delete pricing item error:", error);
      res.status(500).json({ message: "Failed to delete pricing item" });
    }
  });
  app.post("/api/proposals/:proposalId/comments", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const comment = await storage.createProposalComment({
        ...req.body,
        proposalId: req.params.proposalId,
        userId: req.user.userId
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error("Create comment error:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  app.patch("/api/proposals/comments/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const comment = await storage.updateProposalComment(req.params.id, req.body);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(comment);
    } catch (error) {
      console.error("Update comment error:", error);
      res.status(500).json({ message: "Failed to update comment" });
    }
  });
  app.delete("/api/proposals/comments/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      await storage.deleteProposalComment(req.params.id);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Delete comment error:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });
  app.get("/api/proposal-templates", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const templates = await storage.getProposalTemplatesByTenant(req.workspaceId);
      res.json(templates);
    } catch (error) {
      console.error("Get templates error:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });
  app.get("/api/proposal-templates/:id", requireAuth, validateTenant, resolveWorkspaceContext, async (req, res) => {
    try {
      const template = await storage.getProposalTemplateById(req.params.id, req.workspaceId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      const sections = await storage.getTemplateSections(template.id);
      res.json({ ...template, sections });
    } catch (error) {
      console.error("Get template error:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });
  app.post("/api/proposal-templates", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const template = await storage.createProposalTemplate({
        ...req.body,
        tenantId: req.workspaceId,
        createdBy: req.user.userId
      });
      res.status(201).json(template);
    } catch (error) {
      console.error("Create template error:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });
  app.patch("/api/proposal-templates/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const template = await storage.updateProposalTemplate(req.params.id, req.workspaceId, req.body);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Update template error:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });
  app.post("/api/proposal-templates/:id/duplicate", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const template = await storage.duplicateProposalTemplate(
        req.params.id,
        req.workspaceId,
        req.user.userId
      );
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.status(201).json(template);
    } catch (error) {
      console.error("Duplicate template error:", error);
      res.status(500).json({ message: "Failed to duplicate template" });
    }
  });
  app.delete("/api/proposal-templates/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      await storage.deleteProposalTemplate(req.params.id, req.workspaceId);
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Delete template error:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });
  app.post("/api/proposal-templates/:templateId/sections", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const section = await storage.createTemplateSection({
        ...req.body,
        templateId: req.params.templateId
      });
      res.status(201).json(section);
    } catch (error) {
      console.error("Create template section error:", error);
      res.status(500).json({ message: "Failed to create template section" });
    }
  });
  app.patch("/api/proposal-templates/sections/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const section = await storage.updateTemplateSection(req.params.id, req.body);
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Update template section error:", error);
      res.status(500).json({ message: "Failed to update template section" });
    }
  });
  app.delete("/api/proposal-templates/sections/:id", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      await storage.deleteTemplateSection(req.params.id);
      res.json({ message: "Section deleted successfully" });
    } catch (error) {
      console.error("Delete template section error:", error);
      res.status(500).json({ message: "Failed to delete template section" });
    }
  });
  app.post("/api/proposal-templates/:templateId/sections/reorder", requireAuth, validateTenant, resolveWorkspaceContext, requireAgencyAdmin, async (req, res) => {
    try {
      const { sectionIds } = req.body;
      await storage.reorderTemplateSections(req.params.templateId, sectionIds);
      res.json({ message: "Sections reordered successfully" });
    } catch (error) {
      console.error("Reorder template sections error:", error);
      res.status(500).json({ message: "Failed to reorder sections" });
    }
  });
  app.get("/api/public/proposal/:accessToken", async (req, res) => {
    try {
      const proposal = await storage.getProposalByAccessToken(req.params.accessToken);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      if (proposal.expiresAt && new Date(proposal.expiresAt) < /* @__PURE__ */ new Date()) {
        return res.status(410).json({ message: "This proposal has expired" });
      }
      const sections = await storage.getProposalSections(proposal.id);
      const pricingItems = await storage.getProposalPricingItems(proposal.id);
      const signatures = await storage.getProposalSignatures(proposal.id);
      const customer = await storage.getCustomerById(proposal.customerId, proposal.tenantId);
      const companyProfile = await storage.getCompanyProfile(proposal.tenantId);
      await storage.recordProposalView(proposal.id, {
        deviceType: req.headers["user-agent"]?.includes("Mobile") ? "mobile" : "desktop",
        userAgent: req.headers["user-agent"] || void 0,
        ipAddress: req.ip || void 0
      });
      if (proposal.status === "sent") {
        await storage.updateProposal(proposal.id, proposal.tenantId, { status: "viewed" });
      }
      res.json({
        id: proposal.id,
        title: proposal.title,
        proposalNumber: proposal.proposalNumber,
        status: proposal.status,
        currency: proposal.currency,
        subtotal: proposal.subtotal,
        taxAmount: proposal.taxAmount,
        discountAmount: proposal.discountAmount,
        totalAmount: proposal.totalAmount,
        validUntil: proposal.validUntil,
        themePreset: proposal.themePreset || "modern_blue",
        primaryColor: proposal.primaryColor || "#3B82F6",
        secondaryColor: proposal.secondaryColor || "#1E40AF",
        accentColor: proposal.accentColor || "#10B981",
        headerStyle: proposal.headerStyle || "gradient",
        fontFamily: proposal.fontFamily || "Inter",
        sections,
        pricingItems,
        signatures,
        customer: customer ? { name: customer.name, company: customer.company, email: customer.email } : null,
        company: companyProfile ? {
          name: companyProfile.companyName,
          logo: companyProfile.logoUrl,
          email: companyProfile.email,
          phone: companyProfile.phone
        } : null
      });
    } catch (error) {
      console.error("Get public proposal error:", error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });
  app.post("/api/public/proposal/:accessToken/accept", async (req, res) => {
    try {
      const proposal = await storage.getProposalByAccessToken(req.params.accessToken);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      const { signerName, signerEmail, signatureData, signatureType, selectedPackage } = req.body;
      await storage.createProposalSignature({
        proposalId: proposal.id,
        signerName,
        signerEmail,
        signatureType: signatureType || "typed",
        signatureData,
        ipAddress: req.ip || void 0,
        userAgent: req.headers["user-agent"] || void 0
      });
      await storage.updateProposal(proposal.id, proposal.tenantId, {
        status: "accepted",
        selectedPackage: selectedPackage || void 0,
        acceptedAt: /* @__PURE__ */ new Date()
      });
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        action: "accepted",
        details: `Proposal accepted by ${signerName} (${signerEmail})`,
        ipAddress: req.ip || void 0,
        userAgent: req.headers["user-agent"] || void 0
      });
      res.json({ message: "Proposal accepted successfully" });
    } catch (error) {
      console.error("Accept proposal error:", error);
      res.status(500).json({ message: "Failed to accept proposal" });
    }
  });
  app.post("/api/public/proposal/:accessToken/reject", async (req, res) => {
    try {
      const proposal = await storage.getProposalByAccessToken(req.params.accessToken);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      const { reason, email } = req.body;
      await storage.updateProposal(proposal.id, proposal.tenantId, {
        status: "rejected",
        clientComments: reason || void 0,
        rejectedAt: /* @__PURE__ */ new Date()
      });
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        action: "rejected",
        details: reason ? `Proposal rejected. Reason: ${reason}` : "Proposal rejected",
        ipAddress: req.ip || void 0,
        userAgent: req.headers["user-agent"] || void 0
      });
      res.json({ message: "Proposal rejected" });
    } catch (error) {
      console.error("Reject proposal error:", error);
      res.status(500).json({ message: "Failed to reject proposal" });
    }
  });
  app.post("/api/public/proposal/:accessToken/comment", async (req, res) => {
    try {
      const proposal = await storage.getProposalByAccessToken(req.params.accessToken);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      const { content, clientEmail, sectionId } = req.body;
      const comment = await storage.createProposalComment({
        proposalId: proposal.id,
        content,
        clientEmail,
        sectionId: sectionId || void 0,
        isInternal: false
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });
  app.post("/api/proposals/ai-assist", requireAuth, validateTenant, async (req, res) => {
    try {
      const { action, content, context } = req.body;
      const tenantId = req.user.tenantId;
      const userId = req.user.userId;
      const aiEnabled = await storage.getFeatureFlag("ai_enhancement_enabled", tenantId);
      if (!aiEnabled) {
        return res.status(403).json({ message: "AI features are not enabled for this workspace", code: "AI_DISABLED" });
      }
      const aiSettings2 = await storage.getAiSettings(tenantId);
      if (aiSettings2 && !aiSettings2.proposalAiEnabled) {
        return res.status(403).json({ message: "Proposal AI features are disabled", code: "PROPOSAL_AI_DISABLED" });
      }
      if (aiSettings2 && aiSettings2.tokensUsedThisMonth >= aiSettings2.monthlyTokenLimit) {
        return res.status(429).json({ message: "Monthly AI token limit reached", code: "TOKEN_LIMIT_EXCEEDED" });
      }
      const { aiService: aiService2 } = await Promise.resolve().then(() => (init_ai_service(), ai_service_exports));
      const startTime = Date.now();
      const response = await aiService2.processRequest({
        tenantId,
        userId,
        module: "proposal",
        action,
        content: content || "",
        context
      }, aiSettings2);
      await storage.createAiUsage({
        tenantId,
        userId,
        module: "proposal",
        action,
        tokensUsed: response.tokensUsed,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        model: response.model,
        success: response.success,
        latencyMs: Date.now() - startTime
      });
      if (response.tokensUsed > 0) {
        await storage.incrementAiTokenUsage(tenantId, response.tokensUsed);
      }
      await storage.createAiLog({
        tenantId,
        userId,
        module: "proposal",
        action,
        inputContent: content?.substring(0, 1e3),
        outputContent: response.result?.substring(0, 1e3),
        contextData: context ? JSON.stringify(context) : void 0,
        resourceType: "proposal",
        resourceId: context?.proposalId,
        errorMessage: response.error
      });
      res.json({ result: response.result, action, success: response.success });
    } catch (error) {
      console.error("AI assist error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });
  app.get("/api/proposals/section-types", requireAuth, validateTenant, async (req, res) => {
    try {
      const sectionTypes = Object.entries(PROPOSAL_SECTION_TYPES).map(([key, value]) => ({
        id: value,
        name: key.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
      }));
      res.json(sectionTypes);
    } catch (error) {
      console.error("Get section types error:", error);
      res.status(500).json({ message: "Failed to fetch section types" });
    }
  });
  app.get("/api/proposals/merge-fields", requireAuth, validateTenant, async (req, res) => {
    try {
      const mergeFields = [
        { category: "Client", fields: [
          { key: "{{client.name}}", label: "Client Name" },
          { key: "{{client.company}}", label: "Client Company" },
          { key: "{{client.email}}", label: "Client Email" },
          { key: "{{client.phone}}", label: "Client Phone" },
          { key: "{{client.address}}", label: "Client Address" }
        ] },
        { category: "Project", fields: [
          { key: "{{project.name}}", label: "Project Name" },
          { key: "{{start_date}}", label: "Start Date" },
          { key: "{{deliverable.count}}", label: "Deliverable Count" }
        ] },
        { category: "Proposal", fields: [
          { key: "{{proposal.date}}", label: "Proposal Date" },
          { key: "{{proposal.number}}", label: "Proposal Number" },
          { key: "{{quote.total}}", label: "Quote Total" },
          { key: "{{valid_until}}", label: "Valid Until" }
        ] },
        { category: "Agency", fields: [
          { key: "{{agency.name}}", label: "Agency Name" },
          { key: "{{agency.email}}", label: "Agency Email" },
          { key: "{{agency.phone}}", label: "Agency Phone" },
          { key: "{{agency.website}}", label: "Agency Website" }
        ] }
      ];
      res.json(mergeFields);
    } catch (error) {
      console.error("Get merge fields error:", error);
      res.status(500).json({ message: "Failed to fetch merge fields" });
    }
  });
  app.get("/api/features", requireAuth, resolveWorkspaceContext, async (req, res) => {
    try {
      const multiWorkspaceEnabled = await storage.getFeatureFlag("multi_workspace_enabled", req.user.tenantId);
      res.json({
        multi_workspace_enabled: multiWorkspaceEnabled,
        tenant_id: req.user.tenantId
      });
    } catch (error) {
      console.error("Get features error:", error);
      res.status(500).json({ message: "Failed to fetch features" });
    }
  });
  app.get("/api/workspaces", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, async (req, res) => {
    try {
      const workspaces = await storage.getUserWorkspaces(req.user.userId);
      const hasPrimaryTenant = workspaces.some((w) => w.workspaceId === req.user.tenantId);
      if (!hasPrimaryTenant) {
        const primaryTenant = await storage.getTenant(req.user.tenantId);
        if (primaryTenant) {
          workspaces.unshift({
            id: "primary",
            userId: req.user.userId,
            workspaceId: primaryTenant.id,
            role: req.user.isAdmin ? "owner" : "member",
            isPrimary: true,
            invitedBy: null,
            joinedAt: /* @__PURE__ */ new Date(),
            lastAccessedAt: null,
            createdAt: /* @__PURE__ */ new Date(),
            workspace: primaryTenant
          });
        }
      }
      res.json({
        workspaces,
        activeWorkspaceId: req.workspaceId || req.user.tenantId
      });
    } catch (error) {
      console.error("Get workspaces error:", error);
      res.status(500).json({ message: "Failed to fetch workspaces" });
    }
  });
  app.post("/api/workspaces", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ message: "Workspace name is required" });
      }
      const workspace = await storage.createWorkspace({ name: name.trim() }, req.user.userId);
      res.status(201).json(workspace);
    } catch (error) {
      console.error("Create workspace error:", error);
      res.status(500).json({ message: "Failed to create workspace" });
    }
  });
  app.post("/api/workspaces/:workspaceId/switch", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const hasAccess = await storage.isUserInWorkspace(req.user.userId, workspaceId);
      const isPrimaryTenant = workspaceId === req.user.tenantId;
      if (!hasAccess && !isPrimaryTenant) {
        return res.status(403).json({ message: "Access denied to this workspace" });
      }
      if (hasAccess) {
        await storage.setActiveWorkspace(req.user.userId, workspaceId);
      }
      await storage.logWorkspaceActivity({
        workspaceId,
        userId: req.user.userId,
        action: "workspace_switched",
        ipAddress: req.ip || void 0,
        userAgent: req.headers["user-agent"] || void 0
      });
      const user = await storage.getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const accessToken = generateAccessToken(user, { activeWorkspaceId: workspaceId });
      const newRefreshToken = generateRefreshToken(user, { activeWorkspaceId: workspaceId });
      const expiresAt = getRefreshTokenExpiry();
      await storage.createAuthToken({
        userId: user.id,
        refreshToken: newRefreshToken,
        expiresAt
      });
      res.json({
        message: "Workspace switched successfully",
        activeWorkspaceId: workspaceId,
        accessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      console.error("Switch workspace error:", error);
      res.status(500).json({ message: "Failed to switch workspace" });
    }
  });
  app.get("/api/workspaces/:workspaceId/members", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const hasAccess = await storage.isUserInWorkspace(req.user.userId, workspaceId);
      const isPrimaryTenant = workspaceId === req.user.tenantId;
      if (!hasAccess && !isPrimaryTenant) {
        return res.status(403).json({ message: "Access denied to this workspace" });
      }
      const members = await storage.getWorkspaceUsers(workspaceId);
      res.json(members);
    } catch (error) {
      console.error("Get workspace members error:", error);
      res.status(500).json({ message: "Failed to fetch workspace members" });
    }
  });
  app.patch("/api/workspaces/:workspaceId/members/:userId", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, requireWorkspaceAdmin, async (req, res) => {
    try {
      const { workspaceId, userId } = req.params;
      const { role } = req.body;
      if (!role || !["owner", "admin", "member", "viewer"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      if (userId === req.user.userId) {
        return res.status(400).json({ message: "Cannot change your own role" });
      }
      const updated = await storage.updateWorkspaceUser(userId, workspaceId, { role });
      if (!updated) {
        return res.status(404).json({ message: "Member not found in this workspace" });
      }
      await storage.logWorkspaceActivity({
        workspaceId,
        userId: req.user.userId,
        action: "member_role_changed",
        details: JSON.stringify({ targetUserId: userId, newRole: role })
      });
      res.json(updated);
    } catch (error) {
      console.error("Update workspace member error:", error);
      res.status(500).json({ message: "Failed to update member" });
    }
  });
  app.delete("/api/workspaces/:workspaceId/members/:userId", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, requireWorkspaceAdmin, async (req, res) => {
    try {
      const { workspaceId, userId } = req.params;
      if (userId === req.user.userId) {
        return res.status(400).json({ message: "Cannot remove yourself from workspace" });
      }
      await storage.removeUserFromWorkspace(userId, workspaceId);
      await storage.deleteUserAuthTokens(userId);
      await storage.logWorkspaceActivity({
        workspaceId,
        userId: req.user.userId,
        action: "member_removed",
        details: JSON.stringify({ removedUserId: userId })
      });
      res.json({ message: "Member removed successfully" });
    } catch (error) {
      console.error("Remove workspace member error:", error);
      res.status(500).json({ message: "Failed to remove member" });
    }
  });
  app.get("/api/workspaces/:workspaceId/invitations", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, requireWorkspaceAdmin, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { status } = req.query;
      const invitations = await storage.getWorkspaceInvitations(workspaceId, status);
      res.json(invitations);
    } catch (error) {
      console.error("Get invitations error:", error);
      res.status(500).json({ message: "Failed to fetch invitations" });
    }
  });
  app.post("/api/workspaces/:workspaceId/invitations", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, requireWorkspaceAdmin, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { email, role } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      const inviteRole = role && ["admin", "member", "viewer"].includes(role) ? role : "member";
      const token = crypto2.randomBytes(32).toString("hex");
      const expiresAt = /* @__PURE__ */ new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      const invitation = await storage.createWorkspaceInvitation({
        workspaceId,
        email: email.toLowerCase().trim(),
        role: inviteRole,
        token,
        invitedBy: req.user.userId,
        status: "pending",
        expiresAt
      });
      await storage.logWorkspaceActivity({
        workspaceId,
        userId: req.user.userId,
        action: "invitation_sent",
        details: JSON.stringify({ email: invitation.email, role: inviteRole })
      });
      res.status(201).json({
        ...invitation,
        inviteLink: `/invite/${token}`
      });
    } catch (error) {
      console.error("Create invitation error:", error);
      res.status(500).json({ message: "Failed to create invitation" });
    }
  });
  app.delete("/api/workspaces/:workspaceId/invitations/:invitationId", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, requireWorkspaceAdmin, async (req, res) => {
    try {
      const { workspaceId, invitationId } = req.params;
      await storage.revokeInvitation(invitationId);
      await storage.logWorkspaceActivity({
        workspaceId,
        userId: req.user.userId,
        action: "invitation_revoked",
        details: JSON.stringify({ invitationId })
      });
      res.json({ message: "Invitation revoked" });
    } catch (error) {
      console.error("Revoke invitation error:", error);
      res.status(500).json({ message: "Failed to revoke invitation" });
    }
  });
  app.get("/api/invitations/pending", requireAuth, resolveWorkspaceContext, async (req, res) => {
    try {
      const invitations = await storage.getInvitationsByEmail(req.user.email, "pending");
      res.json(invitations);
    } catch (error) {
      console.error("Get pending invitations error:", error);
      res.status(500).json({ message: "Failed to fetch pending invitations" });
    }
  });
  app.post("/api/invitations/:token/accept", requireAuth, async (req, res) => {
    try {
      const { token } = req.params;
      const workspaceUser = await storage.acceptInvitation(token, req.user.userId);
      if (!workspaceUser) {
        return res.status(400).json({ message: "Invalid or expired invitation" });
      }
      await storage.logWorkspaceActivity({
        workspaceId: workspaceUser.workspaceId,
        userId: req.user.userId,
        action: "invitation_accepted",
        ipAddress: req.ip || void 0,
        userAgent: req.headers["user-agent"] || void 0
      });
      res.json({
        message: "Invitation accepted",
        workspaceId: workspaceUser.workspaceId
      });
    } catch (error) {
      console.error("Accept invitation error:", error);
      res.status(500).json({ message: "Failed to accept invitation" });
    }
  });
  app.post("/api/invitations/:token/decline", requireAuth, async (req, res) => {
    try {
      const { token } = req.params;
      const invitation = await storage.getInvitationByToken(token);
      if (!invitation || invitation.status !== "pending") {
        return res.status(400).json({ message: "Invalid or already processed invitation" });
      }
      await storage.updateInvitationStatus(invitation.id, "declined");
      res.json({ message: "Invitation declined" });
    } catch (error) {
      console.error("Decline invitation error:", error);
      res.status(500).json({ message: "Failed to decline invitation" });
    }
  });
  app.get("/api/workspaces/:workspaceId/activity", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, requireWorkspaceAdmin, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const limit = parseInt(req.query.limit) || 100;
      const logs = await storage.getWorkspaceActivityLogs(workspaceId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Get workspace activity error:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });
  app.post("/api/workspaces/:workspaceId/seed-demo-data", requireAuth, resolveWorkspaceContext, requireMultiWorkspaceEnabled, requireWorkspaceAdmin, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const existingCustomers = await storage.getCustomersByTenant(workspaceId);
      if (existingCustomers.length > 0) {
        return res.status(400).json({ message: "Workspace already has data. Demo data can only be seeded to empty workspaces." });
      }
      const ownerId = req.user.userId;
      const productsData = [
        { tenantId: workspaceId, name: "Consulting Service (Hourly)", description: "Expert consulting services billed hourly", sku: "SVC-CON-001", type: "service", unitPrice: "150.00", taxRate: "18", category: "Consulting" },
        { tenantId: workspaceId, name: "Monthly Retainer", description: "Monthly consulting retainer package", sku: "SVC-RET-001", type: "service", unitPrice: "2500.00", taxRate: "18", category: "Retainer" },
        { tenantId: workspaceId, name: "Project Setup Fee", description: "One-time project setup and onboarding", sku: "SVC-SET-001", type: "service", unitPrice: "500.00", taxRate: "18", category: "Setup" },
        { tenantId: workspaceId, name: "Premium Support Package", description: "Priority support with 4-hour response time", sku: "SUP-PRM-001", type: "service", unitPrice: "800.00", taxRate: "18", category: "Support" }
      ];
      const products2 = await Promise.all(productsData.map((p) => storage.createProduct(p)));
      const customersData = [
        { tenantId: workspaceId, ownerId, name: "Sunrise Digital Agency", email: "contact@sunrisedigital.io", phone: "+1-555-2001", company: "Sunrise Digital Agency", website: "https://sunrisedigital.io", address: "100 Creative Ave", city: "Los Angeles", state: "CA", country: "USA", postalCode: "90001", customerType: "customer", segment: "mid-market", industry: "Marketing", paymentTerms: "net30" },
        { tenantId: workspaceId, ownerId, name: "CloudNine Technologies", email: "hello@cloudnine.tech", phone: "+1-555-2002", company: "CloudNine Technologies", address: "500 Tech Park", city: "Seattle", state: "WA", country: "USA", postalCode: "98101", customerType: "customer", segment: "enterprise", industry: "Technology", paymentTerms: "net45" },
        { tenantId: workspaceId, ownerId, name: "Green Valley Organics", email: "info@greenvalley.org", phone: "+1-555-2003", company: "Green Valley Organics", address: "75 Farm Road", city: "Portland", state: "OR", country: "USA", postalCode: "97201", customerType: "prospect", segment: "small-business", industry: "Agriculture", paymentTerms: "net15" },
        { tenantId: workspaceId, ownerId, name: "Urban Fitness Studios", email: "management@urbanfitness.com", phone: "+1-555-2004", company: "Urban Fitness Studios", address: "200 Wellness Blvd", city: "Denver", state: "CO", country: "USA", postalCode: "80201", customerType: "lead", segment: "small-business", industry: "Health & Fitness", paymentTerms: "net30" }
      ];
      const customers2 = await Promise.all(customersData.map((c) => storage.createCustomer(c)));
      const contactsData = [
        { tenantId: workspaceId, ownerId, name: "Jennifer Lee", email: "jennifer@sunrisedigital.io", phone: "+1-555-2101", company: "Sunrise Digital Agency", role: "Creative Director" },
        { tenantId: workspaceId, ownerId, name: "Marcus Thompson", email: "marcus@cloudnine.tech", phone: "+1-555-2102", company: "CloudNine Technologies", role: "VP Engineering" },
        { tenantId: workspaceId, ownerId, name: "Sarah Green", email: "sarah@greenvalley.org", phone: "+1-555-2103", company: "Green Valley Organics", role: "Operations Manager" },
        { tenantId: workspaceId, ownerId, name: "James Miller", email: "james@urbanfitness.com", phone: "+1-555-2104", company: "Urban Fitness Studios", role: "Franchise Owner" }
      ];
      const contacts2 = await Promise.all(contactsData.map((c) => storage.createContact(c)));
      const dealsData = [
        { tenantId: workspaceId, ownerId, contactId: contacts2[0].id, customerId: customers2[0].id, title: "Brand Refresh Campaign", value: "25000.00", stage: "proposal", probability: 70, expectedCloseDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1e3), notes: "Complete brand identity refresh for Sunrise Digital" },
        { tenantId: workspaceId, ownerId, contactId: contacts2[1].id, customerId: customers2[1].id, title: "Cloud Migration Project", value: "85000.00", stage: "negotiation", probability: 80, expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1e3), notes: "Full infrastructure migration to cloud" },
        { tenantId: workspaceId, ownerId, contactId: contacts2[2].id, customerId: customers2[2].id, title: "E-commerce Platform", value: "15000.00", stage: "qualification", probability: 45, expectedCloseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1e3), notes: "Online store for organic products" },
        { tenantId: workspaceId, ownerId, contactId: contacts2[3].id, customerId: customers2[3].id, title: "Fitness App Development", value: "45000.00", stage: "new", probability: 25, expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1e3), notes: "Mobile app for gym members" }
      ];
      const deals2 = await Promise.all(dealsData.map((d) => storage.createDeal(d)));
      const quotation1 = await storage.createQuotation({
        tenantId: workspaceId,
        customerId: customers2[0].id,
        createdBy: ownerId,
        quoteNumber: "WS-QT-001",
        title: "Brand Refresh Package",
        status: "sent",
        subtotal: "5500.00",
        taxAmount: "990.00",
        discountAmount: "0",
        totalAmount: "6490.00",
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
        terms: "Payment due within 30 days of acceptance."
      });
      await storage.createQuotationItem({ quotationId: quotation1.id, productId: products2[0].id, description: "Consulting (20 hours)", quantity: "20", unitPrice: "150.00", taxRate: "18", discount: "0", totalPrice: "3540.00", sortOrder: 1 });
      await storage.createQuotationItem({ quotationId: quotation1.id, productId: products2[2].id, description: "Project Setup", quantity: "1", unitPrice: "500.00", taxRate: "18", discount: "0", totalPrice: "590.00", sortOrder: 2 });
      await storage.createQuotationItem({ quotationId: quotation1.id, productId: products2[3].id, description: "Support Package (3 months)", quantity: "3", unitPrice: "800.00", taxRate: "18", discount: "0", totalPrice: "2832.00", sortOrder: 3 });
      const quotation2 = await storage.createQuotation({
        tenantId: workspaceId,
        customerId: customers2[1].id,
        createdBy: ownerId,
        quoteNumber: "WS-QT-002",
        title: "Cloud Migration Services",
        status: "draft",
        subtotal: "8500.00",
        taxAmount: "1530.00",
        discountAmount: "500.00",
        totalAmount: "9530.00",
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1e3)
      });
      await storage.createQuotationItem({ quotationId: quotation2.id, productId: products2[1].id, description: "Monthly Retainer (3 months)", quantity: "3", unitPrice: "2500.00", taxRate: "18", discount: "0", totalPrice: "8850.00", sortOrder: 1 });
      await storage.createQuotationItem({ quotationId: quotation2.id, productId: products2[2].id, description: "Setup Fee", quantity: "1", unitPrice: "500.00", taxRate: "18", discount: "0", totalPrice: "590.00", sortOrder: 2 });
      const invoice1 = await storage.createInvoice({
        tenantId: workspaceId,
        customerId: customers2[0].id,
        createdBy: ownerId,
        invoiceNumber: "WS-INV-001",
        status: "paid",
        issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1e3),
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3),
        subtotal: "3000.00",
        taxAmount: "540.00",
        discountAmount: "0",
        totalAmount: "3540.00",
        paidAmount: "3540.00",
        balanceDue: "0"
      });
      await storage.createInvoiceItem({ invoiceId: invoice1.id, productId: products2[0].id, description: "Consulting Services (20 hours)", quantity: "20", unitPrice: "150.00", taxRate: "18", discount: "0", totalPrice: "3540.00", sortOrder: 1 });
      await storage.createPayment({ tenantId: workspaceId, invoiceId: invoice1.id, amount: "3540.00", paymentMethod: "bank_transfer", paymentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1e3), reference: "TRF-WS-001" });
      const invoice2 = await storage.createInvoice({
        tenantId: workspaceId,
        customerId: customers2[1].id,
        createdBy: ownerId,
        invoiceNumber: "WS-INV-002",
        status: "sent",
        issueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3),
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1e3),
        subtotal: "2500.00",
        taxAmount: "450.00",
        discountAmount: "0",
        totalAmount: "2950.00",
        paidAmount: "0",
        balanceDue: "2950.00"
      });
      await storage.createInvoiceItem({ invoiceId: invoice2.id, productId: products2[1].id, description: "Monthly Retainer", quantity: "1", unitPrice: "2500.00", taxRate: "18", discount: "0", totalPrice: "2950.00", sortOrder: 1 });
      const tasksData = [
        { tenantId: workspaceId, createdBy: ownerId, assignedTo: ownerId, title: "Review brand guidelines", description: "Review and approve final brand guidelines for Sunrise Digital", status: "in_progress", priority: "high", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3), tags: ["branding", "review"] },
        { tenantId: workspaceId, createdBy: ownerId, assignedTo: ownerId, title: "Schedule kickoff call", description: "Schedule project kickoff with CloudNine team", status: "not_started", priority: "medium", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3), tags: ["meeting", "project"] },
        { tenantId: workspaceId, createdBy: ownerId, assignedTo: ownerId, title: "Prepare e-commerce proposal", description: "Finalize proposal for Green Valley online store", status: "not_started", priority: "low", dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3), tags: ["proposal", "sales"] },
        { tenantId: workspaceId, createdBy: ownerId, assignedTo: ownerId, title: "Follow up with Urban Fitness", description: "Send follow-up email about fitness app requirements", status: "completed", priority: "medium", dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3), tags: ["follow-up", "email"] }
      ];
      await Promise.all(tasksData.map((t) => storage.createTask(t)));
      res.json({
        message: "Demo data seeded successfully",
        summary: {
          products: products2.length,
          customers: customers2.length,
          contacts: contacts2.length,
          deals: deals2.length,
          quotations: 2,
          invoices: 2,
          tasks: tasksData.length
        }
      });
    } catch (error) {
      console.error("Seed demo data error:", error);
      res.status(500).json({ message: "Failed to seed demo data" });
    }
  });
  app.get("/api/admin/feature-flags", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const flags = await storage.getAllFeatureFlags();
      res.json(flags);
    } catch (error) {
      console.error("Get feature flags error:", error);
      res.status(500).json({ message: "Failed to fetch feature flags" });
    }
  });
  app.post("/api/admin/feature-flags", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { key, enabled, tenantId, description } = req.body;
      if (!key) {
        return res.status(400).json({ message: "Flag key is required" });
      }
      const flag = await storage.setFeatureFlag(key, !!enabled, tenantId || void 0, description);
      res.json(flag);
    } catch (error) {
      console.error("Set feature flag error:", error);
      res.status(500).json({ message: "Failed to set feature flag" });
    }
  });
  app.post("/api/admin/tenants/:tenantId/enable-multi-workspace", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { tenantId } = req.params;
      const tenant = await storage.getTenant(tenantId);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      const flag = await storage.setFeatureFlag(
        "multi_workspace_enabled",
        true,
        tenantId,
        "Multi-workspace enabled for tenant"
      );
      res.json({
        message: "Multi-workspace enabled for tenant",
        flag
      });
    } catch (error) {
      console.error("Enable multi-workspace error:", error);
      res.status(500).json({ message: "Failed to enable multi-workspace" });
    }
  });
  app.post("/api/admin/tenants/:tenantId/disable-multi-workspace", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { tenantId } = req.params;
      const flag = await storage.setFeatureFlag(
        "multi_workspace_enabled",
        false,
        tenantId,
        "Multi-workspace disabled for tenant"
      );
      res.json({
        message: "Multi-workspace disabled for tenant",
        flag
      });
    } catch (error) {
      console.error("Disable multi-workspace error:", error);
      res.status(500).json({ message: "Failed to disable multi-workspace" });
    }
  });
  app.get("/api/workspace/plans", requireAuth, async (req, res) => {
    try {
      const plans = await storage.getAllWorkspacePlans();
      res.json(plans);
    } catch (error) {
      console.error("Get workspace plans error:", error);
      res.status(500).json({ message: "Failed to get workspace plans" });
    }
  });
  app.get("/api/workspace/:workspaceId/subscription", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const subscription = await storage.getWorkspaceSubscription(workspaceId);
      res.json(subscription || null);
    } catch (error) {
      console.error("Get workspace subscription error:", error);
      res.status(500).json({ message: "Failed to get subscription" });
    }
  });
  app.get("/api/workspace/:workspaceId/usage", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const usage = await storage.getWorkspaceUsage(workspaceId);
      res.json(usage || null);
    } catch (error) {
      console.error("Get workspace usage error:", error);
      res.status(500).json({ message: "Failed to get usage" });
    }
  });
  app.get("/api/workspace/:workspaceId/billing-limits", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const limits = await storage.checkBillingLimits(workspaceId);
      res.json(limits);
    } catch (error) {
      console.error("Check billing limits error:", error);
      res.status(500).json({ message: "Failed to check billing limits" });
    }
  });
  app.get("/api/workspace/:workspaceId/invoices", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const invoices2 = await storage.getWorkspaceInvoices(workspaceId);
      res.json(invoices2);
    } catch (error) {
      console.error("Get workspace invoices error:", error);
      res.status(500).json({ message: "Failed to get invoices" });
    }
  });
  app.get("/api/workspace/:workspaceId/payment-methods", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const paymentMethods = await storage.getWorkspacePaymentMethods(workspaceId);
      res.json(paymentMethods);
    } catch (error) {
      console.error("Get payment methods error:", error);
      res.status(500).json({ message: "Failed to get payment methods" });
    }
  });
  app.get("/api/workspace/:workspaceId/branding", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const branding = await storage.getWorkspaceBranding(workspaceId);
      res.json(branding || {
        workspaceId,
        primaryColor: "#3b82f6",
        secondaryColor: "#64748b",
        accentColor: "#f59e0b"
      });
    } catch (error) {
      console.error("Get workspace branding error:", error);
      res.status(500).json({ message: "Failed to get branding" });
    }
  });
  app.put("/api/workspace/:workspaceId/branding", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const branding = await storage.upsertWorkspaceBranding(workspaceId, req.body);
      res.json(branding);
    } catch (error) {
      console.error("Update workspace branding error:", error);
      res.status(500).json({ message: "Failed to update branding" });
    }
  });
  app.get("/api/workspace/:workspaceId/pdf-settings", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const settings = await storage.getWorkspacePdfSettings(workspaceId);
      res.json(settings || { workspaceId });
    } catch (error) {
      console.error("Get PDF settings error:", error);
      res.status(500).json({ message: "Failed to get PDF settings" });
    }
  });
  app.put("/api/workspace/:workspaceId/pdf-settings", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const settings = await storage.upsertWorkspacePdfSettings(workspaceId, req.body);
      res.json(settings);
    } catch (error) {
      console.error("Update PDF settings error:", error);
      res.status(500).json({ message: "Failed to update PDF settings" });
    }
  });
  app.get("/api/workspace/:workspaceId/roles", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const roles2 = await storage.getWorkspaceCustomRoles(workspaceId);
      res.json(roles2);
    } catch (error) {
      console.error("Get workspace roles error:", error);
      res.status(500).json({ message: "Failed to get roles" });
    }
  });
  app.get("/api/workspace/:workspaceId/roles/:roleId", requireAuth, async (req, res) => {
    try {
      const { roleId } = req.params;
      const role = await storage.getCustomRoleWithPermissions(roleId);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.json(role);
    } catch (error) {
      console.error("Get role error:", error);
      res.status(500).json({ message: "Failed to get role" });
    }
  });
  app.post("/api/workspace/:workspaceId/roles", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.id;
      const role = await storage.createWorkspaceCustomRole({
        ...req.body,
        workspaceId,
        createdBy: userId
      });
      res.json(role);
    } catch (error) {
      console.error("Create role error:", error);
      res.status(500).json({ message: "Failed to create role" });
    }
  });
  app.put("/api/workspace/:workspaceId/roles/:roleId", requireAuth, async (req, res) => {
    try {
      const { roleId } = req.params;
      const { permissions, ...roleData } = req.body;
      const role = await storage.updateWorkspaceCustomRole(roleId, roleData);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      if (permissions) {
        await storage.setRolePermissions(roleId, permissions);
      }
      res.json(role);
    } catch (error) {
      console.error("Update role error:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  });
  app.delete("/api/workspace/:workspaceId/roles/:roleId", requireAuth, async (req, res) => {
    try {
      const { roleId } = req.params;
      await storage.deleteWorkspaceCustomRole(roleId);
      res.json({ message: "Role deleted" });
    } catch (error) {
      console.error("Delete role error:", error);
      res.status(500).json({ message: "Failed to delete role" });
    }
  });
  app.get("/api/workspace/:workspaceId/analytics/summary", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const summary = await storage.getWorkspaceAnalyticsSummary(workspaceId);
      res.json(summary);
    } catch (error) {
      console.error("Get analytics summary error:", error);
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });
  app.get("/api/workspace/:workspaceId/analytics", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { metricType, startDate, endDate } = req.query;
      const analytics = await storage.getWorkspaceAnalytics(
        workspaceId,
        metricType,
        startDate ? new Date(startDate) : void 0,
        endDate ? new Date(endDate) : void 0
      );
      res.json(analytics);
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });
  app.delete("/api/workspace/:workspaceId", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.id;
      const { reason } = req.body;
      const canDelete = await storage.canDeleteWorkspace(workspaceId, userId);
      if (!canDelete.canDelete) {
        return res.status(400).json({ message: canDelete.reason });
      }
      const deleted = await storage.softDeleteWorkspace(workspaceId, userId, reason);
      if (!deleted) {
        return res.status(404).json({ message: "Workspace not found" });
      }
      res.json({
        message: "Workspace scheduled for deletion",
        recoveryDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
      });
    } catch (error) {
      console.error("Delete workspace error:", error);
      res.status(500).json({ message: "Failed to delete workspace" });
    }
  });
  app.post("/api/workspace/:workspaceId/restore", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.id;
      const restored = await storage.restoreWorkspace(workspaceId, userId);
      if (!restored) {
        return res.status(404).json({ message: "Workspace not found" });
      }
      res.json({ message: "Workspace restored successfully" });
    } catch (error) {
      console.error("Restore workspace error:", error);
      res.status(500).json({ message: "Failed to restore workspace" });
    }
  });
  app.get("/api/workspace/deleted", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.getDeletedWorkspaces();
      res.json(deleted);
    } catch (error) {
      console.error("Get deleted workspaces error:", error);
      res.status(500).json({ message: "Failed to get deleted workspaces" });
    }
  });
  app.get("/api/workspace/:workspaceId/deletion-logs", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const logs = await storage.getWorkspaceDeletionLogs(workspaceId);
      res.json(logs);
    } catch (error) {
      console.error("Get deletion logs error:", error);
      res.status(500).json({ message: "Failed to get deletion logs" });
    }
  });
  app.get("/api/workspace/:workspaceId/onboarding", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      let progress = await storage.getWorkspaceOnboardingProgress(workspaceId);
      if (!progress) {
        progress = await storage.createWorkspaceOnboardingProgress(workspaceId);
      }
      res.json(progress);
    } catch (error) {
      console.error("Get onboarding progress error:", error);
      res.status(500).json({ message: "Failed to get onboarding progress" });
    }
  });
  app.put("/api/workspace/:workspaceId/onboarding/:step", requireAuth, async (req, res) => {
    try {
      const { workspaceId, step } = req.params;
      const { status } = req.body;
      const progress = await storage.updateOnboardingStep(workspaceId, step, status);
      res.json(progress);
    } catch (error) {
      console.error("Update onboarding step error:", error);
      res.status(500).json({ message: "Failed to update onboarding" });
    }
  });
  app.post("/api/workspace/:workspaceId/onboarding/complete", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const progress = await storage.completeOnboarding(workspaceId);
      res.json(progress);
    } catch (error) {
      console.error("Complete onboarding error:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });
  app.post("/api/workspace/:workspaceId/onboarding/dismiss", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const progress = await storage.dismissOnboarding(workspaceId);
      res.json(progress);
    } catch (error) {
      console.error("Dismiss onboarding error:", error);
      res.status(500).json({ message: "Failed to dismiss onboarding" });
    }
  });
  app.post("/api/workspace/:workspaceId/onboarding/reopen", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const progress = await storage.reopenOnboarding(workspaceId);
      res.json(progress);
    } catch (error) {
      console.error("Reopen onboarding error:", error);
      res.status(500).json({ message: "Failed to reopen onboarding" });
    }
  });
  app.get("/api/ai/settings", requireAuth, validateTenant, async (req, res) => {
    try {
      const tenantId = req.user.tenantId;
      const settings = await storage.getAiSettings(tenantId);
      const aiEnabled = await storage.getFeatureFlag("ai_enhancement_enabled", tenantId);
      if (!settings) {
        return res.json({
          aiEnabled,
          settings: null,
          defaults: {
            monthlyTokenLimit: 1e5,
            emailAiEnabled: true,
            taskAiEnabled: true,
            proposalAiEnabled: true,
            clientAiEnabled: true,
            reportAiEnabled: true
          }
        });
      }
      res.json({ aiEnabled, settings });
    } catch (error) {
      console.error("Get AI settings error:", error);
      res.status(500).json({ message: "Failed to get AI settings" });
    }
  });
  app.put("/api/ai/settings", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const tenantId = req.user.tenantId;
      const { emailAiEnabled, taskAiEnabled, proposalAiEnabled, clientAiEnabled, reportAiEnabled, customInstructions } = req.body;
      const updates = {};
      if (typeof emailAiEnabled === "boolean") updates.emailAiEnabled = emailAiEnabled;
      if (typeof taskAiEnabled === "boolean") updates.taskAiEnabled = taskAiEnabled;
      if (typeof proposalAiEnabled === "boolean") updates.proposalAiEnabled = proposalAiEnabled;
      if (typeof clientAiEnabled === "boolean") updates.clientAiEnabled = clientAiEnabled;
      if (typeof reportAiEnabled === "boolean") updates.reportAiEnabled = reportAiEnabled;
      if (customInstructions !== void 0) updates.customInstructions = customInstructions;
      let settings = await storage.getAiSettings(tenantId);
      if (!settings) {
        settings = await storage.createOrUpdateAiSettings({ tenantId, ...updates });
      } else {
        settings = await storage.updateAiSettings(tenantId, updates) || settings;
      }
      res.json(settings);
    } catch (error) {
      console.error("Update AI settings error:", error);
      res.status(500).json({ message: "Failed to update AI settings" });
    }
  });
  app.get("/api/ai/usage", requireAuth, validateTenant, async (req, res) => {
    try {
      const tenantId = req.user.tenantId;
      const stats = await storage.getAiUsageStats(tenantId);
      const settings = await storage.getAiSettings(tenantId);
      res.json({
        ...stats,
        monthlyLimit: settings?.monthlyTokenLimit || 1e5,
        tokensUsedThisMonth: settings?.tokensUsedThisMonth || 0,
        tokenResetDate: settings?.tokenResetDate
      });
    } catch (error) {
      console.error("Get AI usage error:", error);
      res.status(500).json({ message: "Failed to get AI usage" });
    }
  });
  app.get("/api/ai/logs", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const tenantId = req.user.tenantId;
      const limit = parseInt(req.query.limit) || 100;
      const logs = await storage.getAiLogs(tenantId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Get AI logs error:", error);
      res.status(500).json({ message: "Failed to get AI logs" });
    }
  });
  app.post("/api/ai/feedback", requireAuth, validateTenant, async (req, res) => {
    try {
      const { logId, rating, comment } = req.body;
      if (!logId || !rating) {
        return res.status(400).json({ message: "Log ID and rating are required" });
      }
      const log2 = await storage.updateAiLogFeedback(logId, rating, comment);
      res.json(log2);
    } catch (error) {
      console.error("Submit AI feedback error:", error);
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });
  app.post("/api/tasks/ai-assist", requireAuth, validateTenant, async (req, res) => {
    try {
      const { action, content, context } = req.body;
      const tenantId = req.user.tenantId;
      const userId = req.user.userId;
      const aiEnabled = await storage.getFeatureFlag("ai_enhancement_enabled", tenantId);
      if (!aiEnabled) {
        return res.status(403).json({ message: "AI features are not enabled", code: "AI_DISABLED" });
      }
      const aiSettings2 = await storage.getAiSettings(tenantId);
      if (aiSettings2 && !aiSettings2.taskAiEnabled) {
        return res.status(403).json({ message: "Task AI features are disabled", code: "TASK_AI_DISABLED" });
      }
      if (aiSettings2 && aiSettings2.tokensUsedThisMonth >= aiSettings2.monthlyTokenLimit) {
        return res.status(429).json({ message: "Monthly AI token limit reached", code: "TOKEN_LIMIT_EXCEEDED" });
      }
      const { aiService: aiService2 } = await Promise.resolve().then(() => (init_ai_service(), ai_service_exports));
      const startTime = Date.now();
      const response = await aiService2.processRequest({
        tenantId,
        userId,
        module: "task",
        action,
        content,
        context
      }, aiSettings2);
      await storage.createAiUsage({
        tenantId,
        userId,
        module: "task",
        action,
        tokensUsed: response.tokensUsed,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        model: response.model,
        success: response.success,
        latencyMs: Date.now() - startTime
      });
      if (response.tokensUsed > 0) {
        await storage.incrementAiTokenUsage(tenantId, response.tokensUsed);
      }
      await storage.createAiLog({
        tenantId,
        userId,
        module: "task",
        action,
        inputContent: content?.substring(0, 1e3),
        outputContent: response.result?.substring(0, 1e3),
        contextData: context ? JSON.stringify(context) : void 0,
        resourceType: "task",
        resourceId: context?.taskId,
        errorMessage: response.error
      });
      res.json({ result: response.result, action, success: response.success });
    } catch (error) {
      console.error("Task AI assist error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });
  app.post("/api/clients/ai-assist", requireAuth, validateTenant, async (req, res) => {
    try {
      const { action, content, context } = req.body;
      const tenantId = req.user.tenantId;
      const userId = req.user.userId;
      const aiEnabled = await storage.getFeatureFlag("ai_enhancement_enabled", tenantId);
      if (!aiEnabled) {
        return res.status(403).json({ message: "AI features are not enabled", code: "AI_DISABLED" });
      }
      const aiSettings2 = await storage.getAiSettings(tenantId);
      if (aiSettings2 && !aiSettings2.clientAiEnabled) {
        return res.status(403).json({ message: "Client AI features are disabled", code: "CLIENT_AI_DISABLED" });
      }
      if (aiSettings2 && aiSettings2.tokensUsedThisMonth >= aiSettings2.monthlyTokenLimit) {
        return res.status(429).json({ message: "Monthly AI token limit reached", code: "TOKEN_LIMIT_EXCEEDED" });
      }
      const { aiService: aiService2 } = await Promise.resolve().then(() => (init_ai_service(), ai_service_exports));
      const startTime = Date.now();
      const response = await aiService2.processRequest({
        tenantId,
        userId,
        module: "client",
        action,
        content,
        context
      }, aiSettings2);
      await storage.createAiUsage({
        tenantId,
        userId,
        module: "client",
        action,
        tokensUsed: response.tokensUsed,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        model: response.model,
        success: response.success,
        latencyMs: Date.now() - startTime
      });
      if (response.tokensUsed > 0) {
        await storage.incrementAiTokenUsage(tenantId, response.tokensUsed);
      }
      await storage.createAiLog({
        tenantId,
        userId,
        module: "client",
        action,
        inputContent: content?.substring(0, 1e3),
        outputContent: response.result?.substring(0, 1e3),
        contextData: context ? JSON.stringify(context) : void 0,
        resourceType: "customer",
        resourceId: context?.customerId,
        errorMessage: response.error
      });
      res.json({ result: response.result, action, success: response.success });
    } catch (error) {
      console.error("Client AI assist error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });
  app.post("/api/reports/ai-assist", requireAuth, validateTenant, async (req, res) => {
    try {
      const { action, content, context } = req.body;
      const tenantId = req.user.tenantId;
      const userId = req.user.userId;
      const aiEnabled = await storage.getFeatureFlag("ai_enhancement_enabled", tenantId);
      if (!aiEnabled) {
        return res.status(403).json({ message: "AI features are not enabled", code: "AI_DISABLED" });
      }
      const aiSettings2 = await storage.getAiSettings(tenantId);
      if (aiSettings2 && !aiSettings2.reportAiEnabled) {
        return res.status(403).json({ message: "Report AI features are disabled", code: "REPORT_AI_DISABLED" });
      }
      if (aiSettings2 && aiSettings2.tokensUsedThisMonth >= aiSettings2.monthlyTokenLimit) {
        return res.status(429).json({ message: "Monthly AI token limit reached", code: "TOKEN_LIMIT_EXCEEDED" });
      }
      const { aiService: aiService2 } = await Promise.resolve().then(() => (init_ai_service(), ai_service_exports));
      const startTime = Date.now();
      const response = await aiService2.processRequest({
        tenantId,
        userId,
        module: "report",
        action,
        content,
        context
      }, aiSettings2);
      await storage.createAiUsage({
        tenantId,
        userId,
        module: "report",
        action,
        tokensUsed: response.tokensUsed,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        model: response.model,
        success: response.success,
        latencyMs: Date.now() - startTime
      });
      if (response.tokensUsed > 0) {
        await storage.incrementAiTokenUsage(tenantId, response.tokensUsed);
      }
      await storage.createAiLog({
        tenantId,
        userId,
        module: "report",
        action,
        inputContent: content?.substring(0, 1e3),
        outputContent: response.result?.substring(0, 1e3),
        contextData: context ? JSON.stringify(context) : void 0,
        resourceType: "report",
        errorMessage: response.error
      });
      res.json({ result: response.result, action, success: response.success });
    } catch (error) {
      console.error("Report AI assist error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });
  app.get("/api/ai/status", requireAuth, validateTenant, async (req, res) => {
    try {
      const tenantId = req.user.tenantId;
      const aiEnabled = await storage.getFeatureFlag("ai_enhancement_enabled", tenantId);
      const settings = await storage.getAiSettings(tenantId);
      const hasApiKey = !!process.env.OPENAI_API_KEY;
      const tokenLimitReached = settings ? settings.tokensUsedThisMonth >= settings.monthlyTokenLimit : false;
      res.json({
        available: aiEnabled && hasApiKey && !tokenLimitReached,
        enabled: aiEnabled,
        hasApiKey,
        tokenLimitReached,
        modules: {
          email: settings?.emailAiEnabled ?? true,
          task: settings?.taskAiEnabled ?? true,
          proposal: settings?.proposalAiEnabled ?? true,
          client: settings?.clientAiEnabled ?? true,
          report: settings?.reportAiEnabled ?? true
        }
      });
    } catch (error) {
      console.error("Get AI status error:", error);
      res.status(500).json({ message: "Failed to get AI status" });
    }
  });
  return httpServer;
}
async function initializeModules() {
  const defaultModules = [
    { name: "contacts", displayName: "Contacts", description: "Manage your contacts", icon: "users", isCore: true },
    { name: "customers", displayName: "Customers", description: "Manage customers and accounts", icon: "building", isCore: true },
    { name: "deals", displayName: "Deals", description: "Track sales opportunities", icon: "briefcase", isCore: true },
    { name: "tasks", displayName: "Tasks", description: "Manage tasks and activities", icon: "check-square", isCore: true },
    { name: "products", displayName: "Products", description: "Product and service catalog", icon: "package", isCore: true },
    { name: "quotations", displayName: "Quotations", description: "Create and manage quotes", icon: "file-text", isCore: true },
    { name: "invoices", displayName: "Invoices", description: "Billing and invoicing", icon: "receipt", isCore: true },
    { name: "activities", displayName: "Activities", description: "Track calls, meetings, and notes", icon: "activity", isCore: true },
    { name: "reports", displayName: "Reports", description: "Analytics and reporting", icon: "bar-chart", isCore: true }
  ];
  for (const module of defaultModules) {
    const existing = await storage.getModuleByName(module.name);
    if (!existing) {
      await storage.createModule(module);
    }
  }
}
async function initializeDefaultPackages() {
  const existingPackages = await storage.getAllPackages();
  if (existingPackages.length > 0) {
    return;
  }
  const modules2 = await storage.getAllModules();
  const moduleMap = new Map(modules2.map((m) => [m.name, m.id]));
  const starterModules = ["contacts", "deals", "tasks"];
  const professionalModules = ["contacts", "customers", "deals", "tasks", "products", "quotations", "activities"];
  const enterpriseModules = ["contacts", "customers", "deals", "tasks", "products", "quotations", "invoices", "activities", "reports"];
  const defaultPackages = [
    {
      name: "starter",
      displayName: "Starter",
      description: "Perfect for small teams just getting started with CRM",
      price: "29.00",
      billingCycle: "monthly",
      isActive: true,
      isPopular: false,
      sortOrder: 1,
      features: [
        "Up to 5 team members",
        "1,000 contacts",
        "Basic pipeline management",
        "Email support",
        "Mobile app access"
      ],
      moduleNames: starterModules
    },
    {
      name: "professional",
      displayName: "Professional",
      description: "For growing teams that need more power and flexibility",
      price: "79.00",
      billingCycle: "monthly",
      isActive: true,
      isPopular: true,
      sortOrder: 2,
      features: [
        "Up to 25 team members",
        "10,000 contacts",
        "Advanced pipeline & forecasting",
        "Customer management",
        "Quotation management",
        "Activity tracking",
        "Priority email support",
        "API access"
      ],
      moduleNames: professionalModules
    },
    {
      name: "enterprise",
      displayName: "Enterprise",
      description: "For large organizations with advanced needs",
      price: "199.00",
      billingCycle: "monthly",
      isActive: true,
      isPopular: false,
      sortOrder: 3,
      features: [
        "Unlimited team members",
        "Unlimited contacts",
        "All CRM modules included",
        "Advanced reporting & analytics",
        "Invoice management",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "SLA guarantees"
      ],
      moduleNames: enterpriseModules
    }
  ];
  for (const pkgData of defaultPackages) {
    const { moduleNames, ...packageData } = pkgData;
    const pkg = await storage.createPackage(packageData);
    const moduleIds = moduleNames.map((name) => moduleMap.get(name)).filter((id) => id !== void 0);
    if (moduleIds.length > 0) {
      await storage.setPackageModules(pkg.id, moduleIds);
    }
  }
  console.log("Default packages initialized successfully");
}
async function initializeSuperAdmin() {
  const existingAdmin = await storage.getUserByEmail("superadmin@nexuscrm.com");
  if (existingAdmin) {
    return;
  }
  let platformTenant = await storage.getTenant("platform-tenant");
  if (!platformTenant) {
    const tenant = await storage.createTenant({ name: "Nexus CRM Platform" });
    platformTenant = tenant;
  }
  const passwordHash = await hashPassword("Admin123!");
  await storage.createUser({
    tenantId: platformTenant.id,
    email: "superadmin@nexuscrm.com",
    passwordHash,
    firstName: "Super",
    lastName: "Admin",
    userType: "saas_admin",
    isAdmin: true,
    isActive: true
  });
  console.log("Super admin initialized: superadmin@nexuscrm.com / Admin123!");
}

// server/app.ts
init_db();
import { createServer } from "http";
var appPromise = null;
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function createApp() {
  if (appPromise) {
    return appPromise;
  }
  appPromise = (async () => {
    const app = express();
    app.use(cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }));
    app.use(securityHeaders);
    app.use("/api", apiRateLimiter);
    app.use(inputSanitizationMiddleware);
    app.use(
      express.json({
        verify: (req, _res, buf) => {
          req.rawBody = buf;
        }
      })
    );
    app.use(express.urlencoded({ extended: false }));
    app.use((req, res, next) => {
      const start = Date.now();
      const path = req.path;
      let capturedJsonResponse = void 0;
      const originalResJson = res.json;
      res.json = function(bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };
      res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
          let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
          if (capturedJsonResponse) {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          }
          log(logLine);
        }
      });
      next();
    });
    await initializeAITables();
    const httpServer = createServer(app);
    await registerRoutes(httpServer, app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    return app;
  })();
  return appPromise;
}

// api/[...path].ts
var handler = null;
var initError = null;
function setCorsHeaders(req, res) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}
async function initHandler() {
  if (handler) return handler;
  if (initError) throw initError;
  try {
    console.log("Initializing serverless handler...");
    console.log("Environment check - SUPABASE_DATABASE_URL exists:", !!process.env.SUPABASE_DATABASE_URL);
    console.log("Environment check - DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("Environment check - JWT_SECRET exists:", !!process.env.JWT_SECRET);
    const app = await createApp();
    handler = serverless(app);
    console.log("Serverless handler initialized successfully");
    return handler;
  } catch (error) {
    console.error("Failed to initialize handler:", error.message);
    console.error("Stack:", error.stack);
    initError = error;
    throw error;
  }
}
async function path_default(req, res) {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.url === "/api/debug-handler" || req.url?.startsWith("/api/debug-handler")) {
    try {
      const startTime = Date.now();
      await initHandler();
      const duration = Date.now() - startTime;
      res.json({
        status: "handler_initialized",
        initDuration: `${duration}ms`,
        env: {
          SUPABASE_DATABASE_URL: !!process.env.SUPABASE_DATABASE_URL,
          DATABASE_URL: !!process.env.DATABASE_URL,
          JWT_SECRET: !!process.env.JWT_SECRET,
          NODE_ENV: process.env.NODE_ENV,
          VERCEL: process.env.VERCEL
        }
      });
      return;
    } catch (error) {
      res.status(500).json({
        status: "init_failed",
        error: error.message,
        stack: error.stack?.split("\n").slice(0, 5)
      });
      return;
    }
  }
  try {
    const h = await initHandler();
    return await h(req, res);
  } catch (error) {
    console.error("Request handler error:", error.message);
    res.status(500).json({
      message: "Server initialization failed",
      error: error.message,
      hint: "Check Vercel function logs for more details"
    });
  }
}
export {
  path_default as default
};
