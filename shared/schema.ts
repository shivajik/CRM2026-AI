import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tenants table - represents each organization using the CRM
export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  packageId: varchar("package_id"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTenantSchema = createInsertSchema(tenants).omit({ id: true, createdAt: true, deletedAt: true });
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;

// Roles table - defines user roles within a tenant
export const roles = pgTable("roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  permissions: text("permissions").array().notNull().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoleSchema = createInsertSchema(roles).omit({ id: true, createdAt: true });
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;

// User types for enterprise-grade access control
export const USER_TYPES = {
  SAAS_ADMIN: 'saas_admin',      // Super admin - manages all agencies/tenants
  AGENCY_ADMIN: 'agency_admin',   // Admin within a specific tenant/agency
  TEAM_MEMBER: 'team_member',     // Regular team member with specific permissions
  CUSTOMER: 'customer',           // External customer - can only see their own data
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

// Users table - application users
export const users = pgTable("users", {
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
  userType: text("user_type").notNull().default("team_member"), // saas_admin, agency_admin, team_member, customer
  isAdmin: boolean("is_admin").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  employeeCode: text("employee_code"),
  address: text("address"),
  designation: text("designation"),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Auth tokens table - for JWT refresh tokens
export const authTokens = pgTable("auth_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuthTokenSchema = createInsertSchema(authTokens).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertAuthToken = z.infer<typeof insertAuthTokenSchema>;
export type AuthToken = typeof authTokens.$inferSelect;

// Modules table - master list of available CRM modules
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  icon: text("icon"),
  isCore: boolean("is_core").default(false).notNull(),
});

export const insertModuleSchema = createInsertSchema(modules).omit({ id: true });
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

// Tenant modules - tracks which modules are enabled for each tenant
export const tenantModules = pgTable("tenant_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  moduleId: varchar("module_id").references(() => modules.id, { onDelete: "cascade" }).notNull(),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  enabledAt: timestamp("enabled_at").defaultNow().notNull(),
});

export const insertTenantModuleSchema = createInsertSchema(tenantModules).omit({ 
  id: true, 
  enabledAt: true 
});
export type InsertTenantModule = z.infer<typeof insertTenantModuleSchema>;
export type TenantModule = typeof tenantModules.$inferSelect;

// ==================== PRODUCTS/SERVICES ====================
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  sku: text("sku"),
  type: text("type").notNull().default("product"), // product, service
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
  category: text("category"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// ==================== CUSTOMERS (Enhanced Contacts) ====================
export const customers = pgTable("customers", {
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
  customerType: text("customer_type").notNull().default("lead"), // lead, prospect, customer, partner
  segment: text("segment"), // enterprise, mid-market, small-business
  industry: text("industry"),
  taxId: text("tax_id"),
  paymentTerms: text("payment_terms").default("net30"),
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// ==================== QUOTATIONS/PROPOSALS ====================
export const quotations = pgTable("quotations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  quoteNumber: text("quote_number").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"), // draft, sent, accepted, rejected, expired
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuotationSchema = createInsertSchema(quotations, {
  validUntil: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  sentAt: true,
  acceptedAt: true,
});
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type Quotation = typeof quotations.$inferSelect;

// Quotation line items
export const quotationItems = pgTable("quotation_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quotationId: varchar("quotation_id").references(() => quotations.id, { onDelete: "cascade" }).notNull(),
  productId: varchar("product_id").references(() => products.id),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const insertQuotationItemSchema = createInsertSchema(quotationItems).omit({ id: true });
export type InsertQuotationItem = z.infer<typeof insertQuotationItemSchema>;
export type QuotationItem = typeof quotationItems.$inferSelect;

// ==================== INVOICES ====================
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }).notNull(),
  quotationId: varchar("quotation_id").references(() => quotations.id),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  invoiceNumber: text("invoice_number").notNull(),
  status: text("status").notNull().default("draft"), // draft, sent, paid, partial, overdue, cancelled
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices, {
  issueDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
  dueDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  sentAt: true,
  paidAt: true,
});
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Invoice line items
export const invoiceItems = pgTable("invoice_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
  productId: varchar("product_id").references(() => products.id),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({ id: true });
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;
export type InvoiceItem = typeof invoiceItems.$inferSelect;

// Payments
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  invoiceId: varchar("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull().default("bank_transfer"), // bank_transfer, credit_card, cash, check, other
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  reference: text("reference"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments, {
  paymentDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ id: true, createdAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// ==================== ACTIVITIES ====================
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  customerId: varchar("customer_id").references(() => customers.id, { onDelete: "cascade" }),
  dealId: varchar("deal_id").references(() => deals.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // call, email, meeting, note, task
  subject: text("subject").notNull(),
  description: text("description"),
  outcome: text("outcome"),
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities, {
  scheduledAt: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
  completedAt: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// ==================== CONTACTS (Legacy - kept for compatibility) ====================
export const contacts = pgTable("contacts", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// ==================== DEALS ====================
export const deals = pgTable("deals", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDealSchema = createInsertSchema(deals, {
  expectedCloseDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;

// ==================== TASKS (Enhanced) ====================
export const TASK_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  UNDER_REVIEW: 'under_review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const RELATED_MODULES = {
  CUSTOMER: 'customer',
  DEAL: 'deal',
  QUOTATION: 'quotation',
  INVOICE: 'invoice',
  PROJECT: 'project',
} as const;

export type TaskStatus = typeof TASK_STATUSES[keyof typeof TASK_STATUSES];
export type TaskPriority = typeof TASK_PRIORITIES[keyof typeof TASK_PRIORITIES];
export type RelatedModule = typeof RELATED_MODULES[keyof typeof RELATED_MODULES];

export const tasks = pgTable("tasks", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks, {
  dueDate: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
  tags: z.array(z.string()).optional().default([]),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  completedAt: true,
});
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Task Assignments - supports multiple assignees per task
export const taskAssignments = pgTable("task_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role").default("assignee"),
  assignedBy: varchar("assigned_by").references(() => users.id).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

export const insertTaskAssignmentSchema = createInsertSchema(taskAssignments).omit({ 
  id: true, 
  assignedAt: true 
});
export type InsertTaskAssignment = z.infer<typeof insertTaskAssignmentSchema>;
export type TaskAssignment = typeof taskAssignments.$inferSelect;

// Task Comments - threaded comments on tasks
export const taskComments = pgTable("task_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  parentId: varchar("parent_id"),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTaskCommentSchema = createInsertSchema(taskComments).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
});
export type InsertTaskComment = z.infer<typeof insertTaskCommentSchema>;
export type TaskComment = typeof taskComments.$inferSelect;

// Task Status History - audit log for status changes
export const taskStatusHistory = pgTable("task_status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  changedBy: varchar("changed_by").references(() => users.id, { onDelete: "cascade" }).notNull(),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskStatusHistorySchema = createInsertSchema(taskStatusHistory).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertTaskStatusHistory = z.infer<typeof insertTaskStatusHistorySchema>;
export type TaskStatusHistory = typeof taskStatusHistory.$inferSelect;

// Task Checklist Items - subtasks/checklist
export const taskChecklistItems = pgTable("task_checklist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedBy: varchar("completed_by").references(() => users.id),
  completedAt: timestamp("completed_at"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskChecklistItemSchema = createInsertSchema(taskChecklistItems).omit({ 
  id: true, 
  createdAt: true,
  completedAt: true,
});
export type InsertTaskChecklistItem = z.infer<typeof insertTaskChecklistItemSchema>;
export type TaskChecklistItem = typeof taskChecklistItems.$inferSelect;

// Task Time Logs - time tracking
export const taskTimeLogs = pgTable("task_time_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  durationMinutes: integer("duration_minutes"),
  description: text("description"),
  isBillable: boolean("is_billable").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskTimeLogSchema = createInsertSchema(taskTimeLogs, {
  startedAt: z.union([z.string(), z.date()]).transform(val => {
    if (val instanceof Date) return val;
    return new Date(val);
  }),
  endedAt: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertTaskTimeLog = z.infer<typeof insertTaskTimeLogSchema>;
export type TaskTimeLog = typeof taskTimeLogs.$inferSelect;

// Task Attachments - file attachments
export const taskAttachments = pgTable("task_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id, { onDelete: "cascade" }).notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: text("file_type").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskAttachmentSchema = createInsertSchema(taskAttachments).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertTaskAttachment = z.infer<typeof insertTaskAttachmentSchema>;
export type TaskAttachment = typeof taskAttachments.$inferSelect;

// Task Notifications - in-app notifications
export const taskNotifications = pgTable("task_notifications", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskNotificationSchema = createInsertSchema(taskNotifications).omit({ 
  id: true, 
  createdAt: true,
  readAt: true,
});
export type InsertTaskNotification = z.infer<typeof insertTaskNotificationSchema>;
export type TaskNotification = typeof taskNotifications.$inferSelect;

// Task AI History - tracks AI-generated content
export const taskAiHistory = pgTable("task_ai_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  action: text("action").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  model: text("model"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskAiHistorySchema = createInsertSchema(taskAiHistory).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertTaskAiHistory = z.infer<typeof insertTaskAiHistorySchema>;
export type TaskAiHistory = typeof taskAiHistory.$inferSelect;

// Task Activity Timeline - comprehensive activity log
export const taskActivityLog = pgTable("task_activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskActivityLogSchema = createInsertSchema(taskActivityLog).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertTaskActivityLog = z.infer<typeof insertTaskActivityLogSchema>;
export type TaskActivityLog = typeof taskActivityLog.$inferSelect;

// ==================== PLATFORM SETTINGS (SaaS Admin) ====================
export const platformSettings = pgTable("platform_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  category: text("category").notNull().default("general"),
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPlatformSettingSchema = createInsertSchema(platformSettings).omit({ 
  id: true, 
  updatedAt: true 
});
export type InsertPlatformSetting = z.infer<typeof insertPlatformSettingSchema>;
export type PlatformSetting = typeof platformSettings.$inferSelect;

// ==================== COMPANY PROFILES (Agency/Tenant Extended Profile) ====================
export const companyProfiles = pgTable("company_profiles", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCompanyProfileSchema = createInsertSchema(companyProfiles).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertCompanyProfile = z.infer<typeof insertCompanyProfileSchema>;
export type CompanyProfile = typeof companyProfiles.$inferSelect;

// ==================== PLATFORM ACTIVITY LOGS (SaaS Admin) ====================
export const platformActivityLogs = pgTable("platform_activity_logs", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlatformActivityLogSchema = createInsertSchema(platformActivityLogs).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertPlatformActivityLog = z.infer<typeof insertPlatformActivityLogSchema>;
export type PlatformActivityLog = typeof platformActivityLogs.$inferSelect;

// ==================== PACKAGES (SaaS Admin) ====================
export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull().default("0"),
  billingCycle: text("billing_cycle").notNull().default("monthly"), // monthly, yearly, one_time
  isActive: boolean("is_active").default(true).notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  sortOrder: integer("sort_order").default(0),
  features: text("features").array().default(sql`'{}'::text[]`),
  // Package limits
  contactLimit: integer("contact_limit").default(-1), // -1 = unlimited
  teamMemberLimit: integer("team_member_limit").default(-1),
  storageLimit: integer("storage_limit_mb").default(-1), // in MB
  projectLimit: integer("project_limit").default(-1),
  apiCallsLimit: integer("api_calls_limit").default(-1), // per month
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

// Package Modules - links packages to modules
export const packageModules = pgTable("package_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: varchar("package_id").references(() => packages.id, { onDelete: "cascade" }).notNull(),
  moduleId: varchar("module_id").references(() => modules.id, { onDelete: "cascade" }).notNull(),
});

export const insertPackageModuleSchema = createInsertSchema(packageModules).omit({ id: true });
export type InsertPackageModule = z.infer<typeof insertPackageModuleSchema>;
export type PackageModule = typeof packageModules.$inferSelect;

// ==================== EMAIL COMMUNICATION MODULE ====================

// Email Templates - reusable email templates with ownership model
// ownerType: 'system' (global, locked), 'workspace' (shared in workspace), 'user' (private unless shared)
export const emailTemplates = pgTable("email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }), // nullable for system templates
  createdBy: varchar("created_by").references(() => users.id), // nullable for system templates
  ownerType: text("owner_type").notNull().default("user"), // system, workspace, user
  ownerId: varchar("owner_id"), // user id for 'user' type, workspace id for 'workspace', null for 'system'
  isShared: boolean("is_shared").default(false).notNull(), // user templates can be shared to workspace
  isSystemTemplate: boolean("is_system_template").default(false).notNull(), // true for global system templates
  name: text("name").notNull(),
  purpose: text("purpose").notNull().default("custom"), // quotation, invoice, follow_up, meeting, payment_reminder, welcome, renewal, feedback, custom
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  mergeFields: text("merge_fields").array().default(sql`'{}'::text[]`),
  isDefault: boolean("is_default").default(false).notNull(),
  defaultFor: text("default_for"), // quotation, invoice, payment_reminder, etc.
  isActive: boolean("is_active").default(true).notNull(),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;

// Email Logs - tracks all sent emails
export const emailLogs = pgTable("email_logs", {
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
  status: text("status").notNull().default("pending"), // pending, scheduled, sent, delivered, opened, clicked, failed, bounced
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  errorMessage: text("error_message"),
  trackingId: text("tracking_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailLogSchema = createInsertSchema(emailLogs, {
  scheduledAt: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ 
  id: true, 
  createdAt: true,
  sentAt: true,
  openedAt: true,
  clickedAt: true,
});
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;

// Automation Rules - configures automatic email sending
export const automationRules = pgTable("automation_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  trigger: text("trigger").notNull(), // quotation_created, invoice_created, quotation_sent, invoice_sent, invoice_overdue, customer_status_change, quotation_not_accepted
  templateId: varchar("template_id").references(() => emailTemplates.id).notNull(),
  delayValue: integer("delay_value").default(0),
  delayUnit: text("delay_unit").default("minutes"), // minutes, hours, days
  conditions: text("conditions"), // JSON string for conditional filters
  isEnabled: boolean("is_enabled").default(true).notNull(),
  lastTriggered: timestamp("last_triggered"),
  triggerCount: integer("trigger_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  lastTriggered: true,
  triggerCount: true,
});
export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
export type AutomationRule = typeof automationRules.$inferSelect;

// Follow-up Sequences - multi-step email sequences
export const followUpSequences = pgTable("follow_up_sequences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  purpose: text("purpose").notNull().default("general"), // payment, quotation, onboarding, renewal, feedback, general
  isEnabled: boolean("is_enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFollowUpSequenceSchema = createInsertSchema(followUpSequences).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertFollowUpSequence = z.infer<typeof insertFollowUpSequenceSchema>;
export type FollowUpSequence = typeof followUpSequences.$inferSelect;

// Follow-up Steps - individual steps in a sequence
export const followUpSteps = pgTable("follow_up_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sequenceId: varchar("sequence_id").references(() => followUpSequences.id, { onDelete: "cascade" }).notNull(),
  templateId: varchar("template_id").references(() => emailTemplates.id).notNull(),
  stepOrder: integer("step_order").notNull().default(1),
  delayDays: integer("delay_days").notNull().default(1),
  conditions: text("conditions"), // JSON string for skip conditions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFollowUpStepSchema = createInsertSchema(followUpSteps).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertFollowUpStep = z.infer<typeof insertFollowUpStepSchema>;
export type FollowUpStep = typeof followUpSteps.$inferSelect;

// Scheduled Emails - queue for pending/scheduled emails
export const scheduledEmails = pgTable("scheduled_emails", {
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
  status: text("status").notNull().default("pending"), // pending, sent, skipped, cancelled, failed
  skipReason: text("skip_reason"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScheduledEmailSchema = createInsertSchema(scheduledEmails, {
  scheduledFor: z.union([z.string(), z.date()]).transform(val => {
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ 
  id: true, 
  createdAt: true,
  processedAt: true,
});
export type InsertScheduledEmail = z.infer<typeof insertScheduledEmailSchema>;
export type ScheduledEmail = typeof scheduledEmails.$inferSelect;

// Email Sender Accounts - configurable sender emails
export const emailSenderAccounts = pgTable("email_sender_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailSenderAccountSchema = createInsertSchema(emailSenderAccounts).omit({ 
  id: true, 
  createdAt: true,
  isVerified: true,
});
export type InsertEmailSenderAccount = z.infer<typeof insertEmailSenderAccountSchema>;
export type EmailSenderAccount = typeof emailSenderAccounts.$inferSelect;

// SMTP Settings - tenant-specific email sending configuration
export const smtpSettings = pgTable("smtp_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
  provider: text("provider").notNull().default("default"), // default, smtp, sendgrid, mailgun, ses
  // SMTP Settings
  smtpHost: text("smtp_host"),
  smtpPort: integer("smtp_port").default(587),
  smtpSecure: boolean("smtp_secure").default(false), // true for 465, false for other ports
  smtpUser: text("smtp_user"),
  smtpPassword: text("smtp_password"), // encrypted in production
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSmtpSettingsSchema = createInsertSchema(smtpSettings).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
  isVerified: true,
  lastTestedAt: true,
});
export type InsertSmtpSettings = z.infer<typeof insertSmtpSettingsSchema>;
export type SmtpSettings = typeof smtpSettings.$inferSelect;

// ==================== PROPOSAL BUILDER MODULE ====================

// Proposal statuses
export const PROPOSAL_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

export type ProposalStatus = typeof PROPOSAL_STATUSES[keyof typeof PROPOSAL_STATUSES];

// Proposal section types
export const PROPOSAL_SECTION_TYPES = {
  COVER: 'cover',
  INTRODUCTION: 'introduction',
  ABOUT_US: 'about_us',
  SCOPE_OF_WORK: 'scope_of_work',
  DELIVERABLES: 'deliverables',
  TIMELINE: 'timeline',
  PRICING_TABLE: 'pricing_table',
  TERMS_CONDITIONS: 'terms_conditions',
  SIGNATURE: 'signature',
  ATTACHMENTS: 'attachments',
  CUSTOM: 'custom',
} as const;

export type ProposalSectionType = typeof PROPOSAL_SECTION_TYPES[keyof typeof PROPOSAL_SECTION_TYPES];

// Template purposes
export const TEMPLATE_PURPOSES = {
  WEB_DESIGN: 'web_design',
  SEO: 'seo',
  MAINTENANCE: 'maintenance',
  BRANDING: 'branding',
  MARKETING: 'marketing',
  CONSULTING: 'consulting',
  CUSTOM: 'custom',
} as const;

export type TemplatePurpose = typeof TEMPLATE_PURPOSES[keyof typeof TEMPLATE_PURPOSES];

// Proposal theme presets
export const PROPOSAL_THEMES = {
  MODERN_BLUE: 'modern_blue',
  CORPORATE_DARK: 'corporate_dark',
  ELEGANT_GOLD: 'elegant_gold',
  FRESH_GREEN: 'fresh_green',
  BOLD_RED: 'bold_red',
  MINIMAL_GRAY: 'minimal_gray',
  CUSTOM: 'custom',
} as const;

export type ProposalTheme = typeof PROPOSAL_THEMES[keyof typeof PROPOSAL_THEMES];

// Proposal Templates - reusable proposal structures
export const proposalTemplates = pgTable("proposal_templates", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProposalTemplateSchema = createInsertSchema(proposalTemplates).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
  version: true,
});
export type InsertProposalTemplate = z.infer<typeof insertProposalTemplateSchema>;
export type ProposalTemplate = typeof proposalTemplates.$inferSelect;

// Main Proposals table
export const proposals = pgTable("proposals", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProposalSchema = createInsertSchema(proposals, {
  validUntil: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
  expiresAt: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
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
  currentVersion: true,
});
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

// Proposal Sections - content blocks within proposals/templates
export const proposalSections = pgTable("proposal_sections", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProposalSectionSchema = createInsertSchema(proposalSections).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
});
export type InsertProposalSection = z.infer<typeof insertProposalSectionSchema>;
export type ProposalSection = typeof proposalSections.$inferSelect;

// Proposal Pricing Items - line items in pricing tables
export const proposalPricingItems = pgTable("proposal_pricing_items", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProposalPricingItemSchema = createInsertSchema(proposalPricingItems).omit({ 
  id: true, 
  createdAt: true,
});
export type InsertProposalPricingItem = z.infer<typeof insertProposalPricingItemSchema>;
export type ProposalPricingItem = typeof proposalPricingItems.$inferSelect;

// Proposal Versions - snapshot history
export const proposalVersions = pgTable("proposal_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
  versionNumber: integer("version_number").notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  snapshot: text("snapshot").notNull(),
  changeNotes: text("change_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProposalVersionSchema = createInsertSchema(proposalVersions).omit({ 
  id: true, 
  createdAt: true,
});
export type InsertProposalVersion = z.infer<typeof insertProposalVersionSchema>;
export type ProposalVersion = typeof proposalVersions.$inferSelect;

// Proposal Activity Log - all activities on proposals
export const proposalActivityLogs = pgTable("proposal_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  details: text("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProposalActivityLogSchema = createInsertSchema(proposalActivityLogs).omit({ 
  id: true, 
  createdAt: true,
});
export type InsertProposalActivityLog = z.infer<typeof insertProposalActivityLogSchema>;
export type ProposalActivityLog = typeof proposalActivityLogs.$inferSelect;

// Proposal Signatures - e-signature records
export const proposalSignatures = pgTable("proposal_signatures", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProposalSignatureSchema = createInsertSchema(proposalSignatures).omit({ 
  id: true, 
  createdAt: true,
  signedAt: true,
});
export type InsertProposalSignature = z.infer<typeof insertProposalSignatureSchema>;
export type ProposalSignature = typeof proposalSignatures.$inferSelect;

// Proposal View Logs - tracking when proposals are viewed
export const proposalViewLogs = pgTable("proposal_view_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
  viewerEmail: text("viewer_email"),
  deviceType: text("device_type"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  duration: integer("duration").default(0).notNull(),
  sectionsViewed: text("sections_viewed").array().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProposalViewLogSchema = createInsertSchema(proposalViewLogs, {
  sectionsViewed: z.array(z.string()).optional().default([]),
}).omit({ 
  id: true, 
  createdAt: true,
});
export type InsertProposalViewLog = z.infer<typeof insertProposalViewLogSchema>;
export type ProposalViewLog = typeof proposalViewLogs.$inferSelect;

// Proposal Status History - audit trail for status changes
export const proposalStatusHistory = pgTable("proposal_status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
  changedBy: varchar("changed_by").references(() => users.id, { onDelete: "set null" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProposalStatusHistorySchema = createInsertSchema(proposalStatusHistory).omit({ 
  id: true, 
  createdAt: true,
});
export type InsertProposalStatusHistory = z.infer<typeof insertProposalStatusHistorySchema>;
export type ProposalStatusHistory = typeof proposalStatusHistory.$inferSelect;

// Template Sections - sections for templates (reusable)
export const templateSections = pgTable("template_sections", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTemplateSectionSchema = createInsertSchema(templateSections).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
});
export type InsertTemplateSection = z.infer<typeof insertTemplateSectionSchema>;
export type TemplateSection = typeof templateSections.$inferSelect;

// Proposal Comments - internal/client comments on proposals
export const proposalComments = pgTable("proposal_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").references(() => proposals.id, { onDelete: "cascade" }).notNull(),
  sectionId: varchar("section_id").references(() => proposalSections.id, { onDelete: "cascade" }),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  clientEmail: text("client_email"),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(true).notNull(),
  isResolved: boolean("is_resolved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProposalCommentSchema = createInsertSchema(proposalComments).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
});
export type InsertProposalComment = z.infer<typeof insertProposalCommentSchema>;
export type ProposalComment = typeof proposalComments.$inferSelect;

// ==================== FEATURE FLAGS (Multi-Workspace Support) ====================

// Feature Flags table - global and per-tenant feature toggles
export const featureFlags = pgTable("feature_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull(),
  tenantId: varchar("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  enabled: boolean("enabled").default(false).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
});
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;

// ==================== MULTI-WORKSPACE SUPPORT ====================

// Workspace roles for multi-workspace access control
export const WORKSPACE_ROLES = {
  OWNER: 'owner',         // Full control, can delete workspace
  ADMIN: 'admin',         // Can manage members and settings
  MEMBER: 'member',       // Standard access
  VIEWER: 'viewer',       // Read-only access
} as const;

export type WorkspaceRole = typeof WORKSPACE_ROLES[keyof typeof WORKSPACE_ROLES];

// Workspace Users - links users to workspaces (tenants) they can access
// This enables multi-workspace support without breaking existing tenantId logic
export const workspaceUsers = pgTable("workspace_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull().default("member"), // owner, admin, member, viewer
  isPrimary: boolean("is_primary").default(false).notNull(), // User's primary/default workspace
  invitedBy: varchar("invited_by").references(() => users.id, { onDelete: "set null" }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkspaceUserSchema = createInsertSchema(workspaceUsers).omit({ 
  id: true, 
  createdAt: true,
  joinedAt: true,
});
export type InsertWorkspaceUser = z.infer<typeof insertWorkspaceUserSchema>;
export type WorkspaceUser = typeof workspaceUsers.$inferSelect;

// Workspace invitation statuses
export const INVITATION_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
} as const;

export type InvitationStatus = typeof INVITATION_STATUSES[keyof typeof INVITATION_STATUSES];

// Workspace Invitations - pending invitations to join a workspace
export const workspaceInvitations = pgTable("workspace_invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  token: text("token").notNull().unique(), // Unique invitation token
  invitedBy: varchar("invited_by").references(() => users.id, { onDelete: "set null" }).notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, declined, expired, revoked
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkspaceInvitationSchema = createInsertSchema(workspaceInvitations, {
  expiresAt: z.union([z.string(), z.date()]).transform(val => {
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ 
  id: true, 
  createdAt: true,
  acceptedAt: true,
});
export type InsertWorkspaceInvitation = z.infer<typeof insertWorkspaceInvitationSchema>;
export type WorkspaceInvitation = typeof workspaceInvitations.$inferSelect;

// Workspace Activity Log - audit trail for workspace events (only when multi-workspace enabled)
export const workspaceActivityLogs = pgTable("workspace_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(), // created, updated, member_added, member_removed, switched_to, etc.
  details: text("details"), // JSON string with additional context
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkspaceActivityLogSchema = createInsertSchema(workspaceActivityLogs).omit({ 
  id: true, 
  createdAt: true,
});
export type InsertWorkspaceActivityLog = z.infer<typeof insertWorkspaceActivityLogSchema>;
export type WorkspaceActivityLog = typeof workspaceActivityLogs.$inferSelect;

// ==================== MODULE 1: WORKSPACE BILLING SYSTEM ====================

// Workspace Plan Types
export const WORKSPACE_PLAN_TYPES = {
  FREE: 'free',
  PRO: 'pro',
  AGENCY: 'agency',
} as const;

export type WorkspacePlanType = typeof WORKSPACE_PLAN_TYPES[keyof typeof WORKSPACE_PLAN_TYPES];

// Subscription Status
export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  TRIAL: 'trial',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUSES[keyof typeof SUBSCRIPTION_STATUSES];

// Workspace Plans - defines available subscription plans
export const workspacePlans = pgTable("workspace_plans", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspacePlanSchema = createInsertSchema(workspacePlans, {
  features: z.array(z.string()).optional().default([]),
}).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkspacePlan = z.infer<typeof insertWorkspacePlanSchema>;
export type WorkspacePlan = typeof workspacePlans.$inferSelect;

// Workspace Subscriptions - tracks each workspace's subscription
export const workspaceSubscriptions = pgTable("workspace_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
  planId: varchar("plan_id").references(() => workspacePlans.id, { onDelete: "set null" }),
  status: text("status").notNull().default("trial"),
  billingCycle: text("billing_cycle").notNull().default("monthly"), // monthly, yearly
  trialEndsAt: timestamp("trial_ends_at"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelledAt: timestamp("cancelled_at"),
  cancelReason: text("cancel_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspaceSubscriptionSchema = createInsertSchema(workspaceSubscriptions, {
  trialEndsAt: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
  currentPeriodStart: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
  currentPeriodEnd: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkspaceSubscription = z.infer<typeof insertWorkspaceSubscriptionSchema>;
export type WorkspaceSubscription = typeof workspaceSubscriptions.$inferSelect;

// Workspace Usage - tracks resource usage per workspace
export const workspaceUsage = pgTable("workspace_usage", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspaceUsageSchema = createInsertSchema(workspaceUsage, {
  periodStart: z.union([z.string(), z.date()]).transform(val => {
    if (val instanceof Date) return val;
    return new Date(val);
  }),
  periodEnd: z.union([z.string(), z.date()]).transform(val => {
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkspaceUsage = z.infer<typeof insertWorkspaceUsageSchema>;
export type WorkspaceUsage = typeof workspaceUsage.$inferSelect;

// Workspace Invoices (placeholder) - billing invoices
export const workspaceInvoices = pgTable("workspace_invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  subscriptionId: varchar("subscription_id").references(() => workspaceSubscriptions.id, { onDelete: "set null" }),
  invoiceNumber: text("invoice_number").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, failed, refunded
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  paidAt: timestamp("paid_at"),
  dueDate: timestamp("due_date"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkspaceInvoiceSchema = createInsertSchema(workspaceInvoices).omit({ id: true, createdAt: true });
export type InsertWorkspaceInvoice = z.infer<typeof insertWorkspaceInvoiceSchema>;
export type WorkspaceInvoice = typeof workspaceInvoices.$inferSelect;

// Workspace Payment Methods (placeholder) - stored payment methods
export const workspacePaymentMethods = pgTable("workspace_payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull().default("card"), // card, bank_account
  last4: text("last4"),
  brand: text("brand"),
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspacePaymentMethodSchema = createInsertSchema(workspacePaymentMethods).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkspacePaymentMethod = z.infer<typeof insertWorkspacePaymentMethodSchema>;
export type WorkspacePaymentMethod = typeof workspacePaymentMethods.$inferSelect;

// ==================== MODULE 2: WHITE-LABEL BRANDING SYSTEM ====================

// Workspace Branding - custom branding settings
export const workspaceBranding = pgTable("workspace_branding", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspaceBrandingSchema = createInsertSchema(workspaceBranding).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkspaceBranding = z.infer<typeof insertWorkspaceBrandingSchema>;
export type WorkspaceBranding = typeof workspaceBranding.$inferSelect;

// Workspace PDF Settings - branding for PDFs
export const workspacePdfSettings = pgTable("workspace_pdf_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull().unique(),
  headerLogoUrl: text("header_logo_url"),
  footerText: text("footer_text"),
  showCompanyAddress: boolean("show_company_address").default(true).notNull(),
  showCompanyPhone: boolean("show_company_phone").default(true).notNull(),
  showCompanyEmail: boolean("show_company_email").default(true).notNull(),
  proposalTemplate: text("proposal_template"), // JSON template settings
  invoiceTemplate: text("invoice_template"), // JSON template settings
  quotationTemplate: text("quotation_template"), // JSON template settings
  termsAndConditions: text("terms_and_conditions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspacePdfSettingsSchema = createInsertSchema(workspacePdfSettings).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkspacePdfSettings = z.infer<typeof insertWorkspacePdfSettingsSchema>;
export type WorkspacePdfSettings = typeof workspacePdfSettings.$inferSelect;

// ==================== MODULE 3: CUSTOM ROLE & PERMISSION BUILDER ====================

// Module permission types
export const PERMISSION_MODULES = [
  'clients', 'projects', 'tasks', 'invoices', 'proposals', 
  'automations', 'email', 'billing', 'reports', 'settings', 'team'
] as const;

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete', 'manage'] as const;

export type PermissionModule = typeof PERMISSION_MODULES[number];
export type PermissionAction = typeof PERMISSION_ACTIONS[number];

// Workspace Custom Roles - user-defined roles
export const workspaceCustomRoles = pgTable("workspace_custom_roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#6b7280"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdBy: varchar("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspaceCustomRoleSchema = createInsertSchema(workspaceCustomRoles).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkspaceCustomRole = z.infer<typeof insertWorkspaceCustomRoleSchema>;
export type WorkspaceCustomRole = typeof workspaceCustomRoles.$inferSelect;

// Workspace Role Permissions - permissions for custom roles
export const workspaceRolePermissions = pgTable("workspace_role_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roleId: varchar("role_id").references(() => workspaceCustomRoles.id, { onDelete: "cascade" }).notNull(),
  module: text("module").notNull(),
  action: text("action").notNull(),
  allowed: boolean("allowed").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkspaceRolePermissionSchema = createInsertSchema(workspaceRolePermissions).omit({ id: true, createdAt: true });
export type InsertWorkspaceRolePermission = z.infer<typeof insertWorkspaceRolePermissionSchema>;
export type WorkspaceRolePermission = typeof workspaceRolePermissions.$inferSelect;

// ==================== MODULE 4: WORKSPACE ANALYTICS DASHBOARD ====================

// Workspace Analytics Cache - cached analytics data
export const workspaceAnalyticsCache = pgTable("workspace_analytics_cache", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  metricType: text("metric_type").notNull(), // revenue, invoices, proposals, leads, tasks, etc.
  metricDate: timestamp("metric_date").notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull().default("0"),
  metadata: text("metadata"), // JSON for additional context
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspaceAnalyticsCacheSchema = createInsertSchema(workspaceAnalyticsCache, {
  metricDate: z.union([z.string(), z.date()]).transform(val => {
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWorkspaceAnalyticsCache = z.infer<typeof insertWorkspaceAnalyticsCacheSchema>;
export type WorkspaceAnalyticsCache = typeof workspaceAnalyticsCache.$inferSelect;

// ==================== MODULE 5: WORKSPACE DELETION & RESTORE ====================

// Workspace Deletion Logs - audit trail for deletion/restore events
export const workspaceDeletionLogs = pgTable("workspace_deletion_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  action: text("action").notNull(), // deleted, restored, purged
  deletedBy: varchar("deleted_by").references(() => users.id, { onDelete: "set null" }),
  restoredBy: varchar("restored_by").references(() => users.id, { onDelete: "set null" }),
  reason: text("reason"),
  scheduledPurgeAt: timestamp("scheduled_purge_at"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkspaceDeletionLogSchema = createInsertSchema(workspaceDeletionLogs, {
  scheduledPurgeAt: z.union([z.string(), z.date(), z.null()]).optional().transform(val => {
    if (!val) return null;
    if (val instanceof Date) return val;
    return new Date(val);
  }),
}).omit({ id: true, createdAt: true });
export type InsertWorkspaceDeletionLog = z.infer<typeof insertWorkspaceDeletionLogSchema>;
export type WorkspaceDeletionLog = typeof workspaceDeletionLogs.$inferSelect;

// ==================== MODULE 6: WORKSPACE ONBOARDING WIZARD ====================

// Onboarding step statuses
export const ONBOARDING_STEP_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
} as const;

export type OnboardingStepStatus = typeof ONBOARDING_STEP_STATUSES[keyof typeof ONBOARDING_STEP_STATUSES];

// Workspace Onboarding Progress - tracks onboarding wizard progress
export const workspaceOnboardingProgress = pgTable("workspace_onboarding_progress", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspaceOnboardingProgressSchema = createInsertSchema(workspaceOnboardingProgress).omit({ id: true, createdAt: true, updatedAt: true, completedAt: true });
export type InsertWorkspaceOnboardingProgress = z.infer<typeof insertWorkspaceOnboardingProgressSchema>;
export type WorkspaceOnboardingProgress = typeof workspaceOnboardingProgress.$inferSelect;

// ==================== ENTERPRISE SECURITY: AUDIT LOGS ====================

export const AUDIT_LOG_ACTIONS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  PASSWORD_RESET_REQUEST: 'password_reset_request',
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  ROLE_CHANGED: 'role_changed',
  PERMISSION_CHANGED: 'permission_changed',
  DATA_EXPORT: 'data_export',
  DATA_DELETE: 'data_delete',
  SETTINGS_CHANGED: 'settings_changed',
  API_KEY_CREATED: 'api_key_created',
  API_KEY_REVOKED: 'api_key_revoked',
  TENANT_CREATED: 'tenant_created',
  TENANT_UPDATED: 'tenant_updated',
  WORKSPACE_JOINED: 'workspace_joined',
  WORKSPACE_LEFT: 'workspace_left',
  ADMIN_ACTION: 'admin_action',
} as const;

export type AuditLogAction = typeof AUDIT_LOG_ACTIONS[keyof typeof AUDIT_LOG_ACTIONS];

export const AUDIT_LOG_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
} as const;

export type AuditLogSeverity = typeof AUDIT_LOG_SEVERITY[keyof typeof AUDIT_LOG_SEVERITY];

export const auditLogs = pgTable("audit_logs", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// ==================== ENTERPRISE SECURITY: LOGIN ATTEMPTS ====================

export const loginAttempts = pgTable("login_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  success: boolean("success").default(false).notNull(),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLoginAttemptSchema = createInsertSchema(loginAttempts).omit({ id: true, createdAt: true });
export type InsertLoginAttempt = z.infer<typeof insertLoginAttemptSchema>;
export type LoginAttempt = typeof loginAttempts.$inferSelect;

// ==================== MODULE 7: CUSTOMER PORTAL ====================

// Customer Portal Settings - workspace-level settings for client portal
export const customerPortalSettings = pgTable("customer_portal_settings", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomerPortalSettingsSchema = createInsertSchema(customerPortalSettings).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCustomerPortalSettings = z.infer<typeof insertCustomerPortalSettingsSchema>;
export type CustomerPortalSettings = typeof customerPortalSettings.$inferSelect;

// Customer Portal Activity Logs - track client portal activities
export const customerPortalActivityLogs = pgTable("customer_portal_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  customerId: varchar("customer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  action: text("action").notNull(), // login, proposal_viewed, invoice_viewed, quotation_viewed, document_downloaded, comment_added, proposal_accepted, invoice_paid
  resourceType: text("resource_type"), // proposal, invoice, quotation, document
  resourceId: varchar("resource_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: text("metadata"), // JSON for additional context
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerPortalActivityLogSchema = createInsertSchema(customerPortalActivityLogs).omit({ id: true, createdAt: true });
export type InsertCustomerPortalActivityLog = z.infer<typeof insertCustomerPortalActivityLogSchema>;
export type CustomerPortalActivityLog = typeof customerPortalActivityLogs.$inferSelect;

// Password Reset Tokens - for forgot password flow
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({ id: true, createdAt: true });
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

// Client Documents - shared files between agency and client
export const clientDocuments = pgTable("client_documents", {
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClientDocumentSchema = createInsertSchema(clientDocuments).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertClientDocument = z.infer<typeof insertClientDocumentSchema>;
export type ClientDocument = typeof clientDocuments.$inferSelect;
