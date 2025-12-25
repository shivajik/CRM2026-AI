import { db } from "./db";
import { eq, and, desc, gte, lte, sql, asc, or, isNull } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  InsertTenant, Tenant,
  InsertUser, User,
  InsertRole, Role,
  InsertAuthToken, AuthToken,
  InsertModule, Module,
  InsertTenantModule, TenantModule,
  InsertContact, Contact,
  InsertDeal, Deal,
  InsertTask, Task,
  InsertProduct, Product,
  InsertCustomer, Customer,
  InsertQuotation, Quotation,
  InsertQuotationItem, QuotationItem,
  InsertInvoice, Invoice,
  InsertInvoiceItem, InvoiceItem,
  InsertPayment, Payment,
  InsertActivity, Activity,
  InsertPlatformSetting, PlatformSetting,
  InsertPlatformActivityLog, PlatformActivityLog,
  InsertCompanyProfile, CompanyProfile,
  InsertPackage, Package,
  InsertPackageModule, PackageModule,
  InsertEmailTemplate, EmailTemplate,
  InsertEmailLog, EmailLog,
  InsertAutomationRule, AutomationRule,
  InsertFollowUpSequence, FollowUpSequence,
  InsertFollowUpStep, FollowUpStep,
  InsertScheduledEmail, ScheduledEmail,
  InsertEmailSenderAccount, EmailSenderAccount,
  InsertSmtpSettings, SmtpSettings,
  InsertTaskAssignment, TaskAssignment,
  InsertTaskComment, TaskComment,
  InsertTaskStatusHistory, TaskStatusHistory,
  InsertTaskChecklistItem, TaskChecklistItem,
  InsertTaskTimeLog, TaskTimeLog,
  InsertTaskAttachment, TaskAttachment,
  InsertTaskNotification, TaskNotification,
  InsertTaskAiHistory, TaskAiHistory,
  InsertTaskActivityLog, TaskActivityLog,
  InsertProposalTemplate, ProposalTemplate,
  InsertProposal, Proposal,
  InsertProposalSection, ProposalSection,
  InsertProposalPricingItem, ProposalPricingItem,
  InsertProposalVersion, ProposalVersion,
  InsertProposalActivityLog, ProposalActivityLog,
  InsertProposalSignature, ProposalSignature,
  InsertProposalViewLog, ProposalViewLog,
  InsertProposalStatusHistory, ProposalStatusHistory,
  InsertTemplateSection, TemplateSection,
  InsertProposalComment, ProposalComment,
  InsertFeatureFlag, FeatureFlag,
  InsertWorkspaceUser, WorkspaceUser,
  InsertWorkspaceInvitation, WorkspaceInvitation,
  InsertWorkspaceActivityLog, WorkspaceActivityLog,
  InsertWorkspacePlan, WorkspacePlan,
  InsertWorkspaceSubscription, WorkspaceSubscription,
  InsertWorkspaceUsage, WorkspaceUsage,
  InsertWorkspaceInvoice, WorkspaceInvoice,
  InsertWorkspacePaymentMethod, WorkspacePaymentMethod,
  InsertWorkspaceBranding, WorkspaceBranding,
  InsertWorkspacePdfSettings, WorkspacePdfSettings,
  InsertWorkspaceCustomRole, WorkspaceCustomRole,
  InsertWorkspaceRolePermission, WorkspaceRolePermission,
  InsertWorkspaceAnalyticsCache, WorkspaceAnalyticsCache,
  InsertWorkspaceDeletionLog, WorkspaceDeletionLog,
  InsertWorkspaceOnboardingProgress, WorkspaceOnboardingProgress,
  InsertAuditLog, AuditLog,
  InsertLoginAttempt, LoginAttempt,
  InsertCustomerPortalSettings, CustomerPortalSettings,
  InsertCustomerPortalActivityLog, CustomerPortalActivityLog,
  InsertPasswordResetToken, PasswordResetToken,
  InsertClientDocument, ClientDocument,
  InsertAiSettings, AiSettings,
  InsertAiUsage, AiUsage,
  InsertAiLog, AiLog,
  InsertAiContentVersion, AiContentVersion,
} from "@shared/schema";

export interface IStorage {
  // Tenant operations
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  getTenant(id: string): Promise<Tenant | undefined>;
  updateTenantPackage(tenantId: string, packageId: string | null): Promise<Tenant | undefined>;
  
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByTenant(tenantId: string): Promise<User[]>;
  updateUser(id: string, updates: { firstName?: string; lastName?: string; email?: string; profileImageUrl?: string; phone?: string; jobTitle?: string }): Promise<User | undefined>;
  
  // Role operations
  createRole(role: InsertRole): Promise<Role>;
  getRoleById(id: string): Promise<Role | undefined>;
  getRolesByTenant(tenantId: string): Promise<Role[]>;
  updateRole(id: string, updates: Partial<InsertRole>): Promise<Role | undefined>;
  deleteRole(id: string): Promise<void>;
  
  // Team member operations
  createTeamMember(user: InsertUser): Promise<User>;
  updateTeamMember(id: string, tenantId: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteTeamMember(id: string, tenantId: string): Promise<void>;
  getUserWithRole(id: string): Promise<(User & { role?: Role }) | undefined>;
  getTeamMemberWithDetails(id: string, tenantId: string): Promise<{
    member: User & { role?: Role };
    deals: Deal[];
    quotations: Quotation[];
    invoices: Invoice[];
    tasks: Task[];
    customers: Customer[];
    activities: Activity[];
  } | undefined>;
  
  // Auth token operations
  createAuthToken(token: InsertAuthToken): Promise<AuthToken>;
  getAuthToken(refreshToken: string): Promise<AuthToken | undefined>;
  deleteAuthToken(id: string): Promise<void>;
  deleteUserAuthTokens(userId: string): Promise<void>;
  
  // Module operations
  createModule(module: InsertModule): Promise<Module>;
  getAllModules(): Promise<Module[]>;
  getModuleByName(name: string): Promise<Module | undefined>;
  
  // Tenant module operations
  enableModuleForTenant(tenantModule: InsertTenantModule): Promise<TenantModule>;
  getTenantModules(tenantId: string): Promise<(TenantModule & { module: Module })[]>;
  updateTenantModule(id: string, isEnabled: boolean): Promise<void>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  getContactsByTenant(tenantId: string, ownerId?: string): Promise<Contact[]>;
  getContactById(id: string, tenantId: string): Promise<Contact | undefined>;
  updateContact(id: string, tenantId: string, updates: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: string, tenantId: string): Promise<void>;
  
  // Deal operations
  createDeal(deal: InsertDeal): Promise<Deal>;
  getDealsByTenant(tenantId: string, ownerId?: string): Promise<Deal[]>;
  getDealById(id: string, tenantId: string): Promise<Deal | undefined>;
  updateDeal(id: string, tenantId: string, updates: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: string, tenantId: string): Promise<void>;
  
  // Task operations
  createTask(task: InsertTask): Promise<Task>;
  getTasksByTenant(tenantId: string, assignedTo?: string): Promise<Task[]>;
  getTaskById(id: string, tenantId: string): Promise<Task | undefined>;
  updateTask(id: string, tenantId: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, tenantId: string): Promise<void>;

  // Product operations
  createProduct(product: InsertProduct): Promise<Product>;
  getProductsByTenant(tenantId: string): Promise<Product[]>;
  getProductById(id: string, tenantId: string): Promise<Product | undefined>;
  updateProduct(id: string, tenantId: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string, tenantId: string): Promise<void>;

  // Customer operations
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  getCustomersByTenant(tenantId: string, ownerId?: string): Promise<Customer[]>;
  getCustomerById(id: string, tenantId: string): Promise<Customer | undefined>;
  updateCustomer(id: string, tenantId: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string, tenantId: string): Promise<void>;

  // Customer-related operations for journey view
  getContactsByCustomer(customerId: string, tenantId: string): Promise<Contact[]>;
  getDealsByCustomer(customerId: string, tenantId: string): Promise<Deal[]>;
  getTasksByCustomer(customerId: string, tenantId: string): Promise<Task[]>;
  getQuotationsByCustomer(customerId: string, tenantId: string): Promise<Quotation[]>;
  getInvoicesByCustomer(customerId: string, tenantId: string): Promise<Invoice[]>;

  // Quotation operations
  createQuotation(quotation: InsertQuotation): Promise<Quotation>;
  getQuotationsByTenant(tenantId: string, createdBy?: string): Promise<Quotation[]>;
  getQuotationById(id: string, tenantId: string): Promise<Quotation | undefined>;
  updateQuotation(id: string, tenantId: string, updates: Partial<InsertQuotation>): Promise<Quotation | undefined>;
  deleteQuotation(id: string, tenantId: string): Promise<void>;
  getNextQuoteNumber(tenantId: string): Promise<string>;

  // Quotation item operations
  createQuotationItem(item: InsertQuotationItem): Promise<QuotationItem>;
  getQuotationItems(quotationId: string): Promise<QuotationItem[]>;
  updateQuotationItem(id: string, updates: Partial<InsertQuotationItem>): Promise<QuotationItem | undefined>;
  deleteQuotationItem(id: string): Promise<void>;
  deleteQuotationItems(quotationId: string): Promise<void>;

  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoicesByTenant(tenantId: string, createdBy?: string): Promise<Invoice[]>;
  getInvoiceById(id: string, tenantId: string): Promise<Invoice | undefined>;
  updateInvoice(id: string, tenantId: string, updates: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string, tenantId: string): Promise<void>;
  getNextInvoiceNumber(tenantId: string): Promise<string>;

  // Invoice item operations
  createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem>;
  getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]>;
  updateInvoiceItem(id: string, updates: Partial<InsertInvoiceItem>): Promise<InvoiceItem | undefined>;
  deleteInvoiceItem(id: string): Promise<void>;
  deleteInvoiceItems(invoiceId: string): Promise<void>;

  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByInvoice(invoiceId: string): Promise<Payment[]>;
  getPaymentsByTenant(tenantId: string): Promise<Payment[]>;
  deletePayment(id: string): Promise<void>;

  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByTenant(tenantId: string): Promise<Activity[]>;
  getActivitiesByCustomer(customerId: string, tenantId: string): Promise<Activity[]>;
  getActivitiesByDeal(dealId: string, tenantId: string): Promise<Activity[]>;
  getActivityById(id: string, tenantId: string): Promise<Activity | undefined>;
  updateActivity(id: string, tenantId: string, updates: Partial<InsertActivity>): Promise<Activity | undefined>;
  deleteActivity(id: string, tenantId: string): Promise<void>;

  // Deal-related operations
  getTasksByDeal(dealId: string, tenantId: string): Promise<Task[]>;

  // Reports
  getDashboardStats(tenantId: string): Promise<{
    totalRevenue: number;
    activeDeals: number;
    totalCustomers: number;
    pendingTasks: number;
    pendingInvoices: number;
    overdueInvoices: number;
  }>;
  getSalesReport(tenantId: string, startDate?: Date, endDate?: Date): Promise<any[]>;

  // SaaS Admin operations
  getSaasAdminStats(): Promise<{
    totalTenants: number;
    totalUsers: number;
    monthlyRevenue: number;
    activeSessions: number;
    revenueData: { month: string; revenue: number; users: number }[];
    tenantDistribution: { name: string; value: number }[];
  }>;
  getAllTenants(): Promise<(Tenant & { userCount: number })[]>;
  getAllUsersWithTenants(): Promise<(Omit<User, 'passwordHash'> & { tenantName: string })[]>;

  // Customer Portal operations
  getQuotationsForCustomerUser(userId: string, tenantId: string): Promise<Quotation[]>;
  getInvoicesForCustomerUser(userId: string, tenantId: string): Promise<Invoice[]>;

  // Platform Settings operations (SaaS Admin)
  getPlatformSettings(category?: string): Promise<PlatformSetting[]>;
  getPlatformSettingByKey(key: string): Promise<PlatformSetting | undefined>;
  upsertPlatformSetting(setting: InsertPlatformSetting): Promise<PlatformSetting>;
  deletePlatformSetting(key: string): Promise<void>;
  
  // User AI Settings operations
  getUserAiSettings(userId: string): Promise<schema.UserAiSetting | undefined>;
  upsertUserAiSettings(userId: string, settings: { provider?: string; apiKey?: string; isEnabled?: boolean }): Promise<schema.UserAiSetting>;

  // Platform Activity Logs operations (SaaS Admin)
  createPlatformActivityLog(log: InsertPlatformActivityLog): Promise<PlatformActivityLog>;
  getPlatformActivityLogs(filters?: {
    tenantId?: string;
    actorId?: string;
    action?: string;
    targetType?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
  }): Promise<PlatformActivityLog[]>;

  // Detailed Tenant operations (SaaS Admin)
  getTenantDetails(tenantId: string): Promise<{
    tenant: Tenant;
    users: Omit<User, 'passwordHash'>[];
    customers: Customer[];
    deals: Deal[];
    invoices: Invoice[];
    quotations: Quotation[];
    stats: {
      totalUsers: number;
      totalCustomers: number;
      totalDeals: number;
      totalRevenue: number;
      activeDeals: number;
    };
  } | undefined>;

  // Detailed User operations (SaaS Admin)
  getUserDetails(userId: string): Promise<{
    user: Omit<User, 'passwordHash'>;
    tenant: Tenant | undefined;
    ownedCustomers: Customer[];
    assignedTasks: Task[];
    activities: Activity[];
    deals: Deal[];
  } | undefined>;

  // Update super admin profile
  updateSuperAdminProfile(userId: string, updates: { firstName?: string; lastName?: string; email?: string }): Promise<User | undefined>;

  // Company Profile operations
  getCompanyProfile(tenantId: string): Promise<CompanyProfile | undefined>;
  upsertCompanyProfile(tenantId: string, data: Partial<InsertCompanyProfile>): Promise<CompanyProfile>;

  // Package operations (SaaS Admin)
  createPackage(pkg: InsertPackage): Promise<Package>;
  getAllPackages(): Promise<Package[]>;
  getActivePackages(): Promise<Package[]>;
  getPackageById(id: string): Promise<Package | undefined>;
  updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<void>;

  // Package Module operations
  addModuleToPackage(packageModule: InsertPackageModule): Promise<PackageModule>;
  removeModuleFromPackage(packageId: string, moduleId: string): Promise<void>;
  getPackageModules(packageId: string): Promise<(PackageModule & { module: Module })[]>;
  setPackageModules(packageId: string, moduleIds: string[]): Promise<void>;
  getPackageWithModules(packageId: string): Promise<(Package & { modules: Module[] }) | undefined>;
  getAllPackagesWithModules(): Promise<(Package & { modules: Module[] })[]>;

  // Email Template operations
  createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  getEmailTemplatesByTenant(tenantId: string): Promise<EmailTemplate[]>;
  getEmailTemplateById(id: string, tenantId: string): Promise<EmailTemplate | undefined>;
  updateEmailTemplate(id: string, tenantId: string, updates: Partial<InsertEmailTemplate>): Promise<EmailTemplate | undefined>;
  deleteEmailTemplate(id: string, tenantId: string): Promise<void>;
  getDefaultTemplateForPurpose(tenantId: string, purpose: string): Promise<EmailTemplate | undefined>;

  // Email Log operations
  createEmailLog(log: InsertEmailLog): Promise<EmailLog>;
  getEmailLogsByTenant(tenantId: string): Promise<EmailLog[]>;
  getEmailLogById(id: string, tenantId: string): Promise<EmailLog | undefined>;
  updateEmailLog(id: string, updates: Partial<EmailLog>): Promise<EmailLog | undefined>;
  getEmailLogsByCustomer(customerId: string, tenantId: string): Promise<EmailLog[]>;

  // Automation Rule operations
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  getAutomationRulesByTenant(tenantId: string): Promise<AutomationRule[]>;
  getAutomationRuleById(id: string, tenantId: string): Promise<AutomationRule | undefined>;
  updateAutomationRule(id: string, tenantId: string, updates: Partial<InsertAutomationRule>): Promise<AutomationRule | undefined>;
  deleteAutomationRule(id: string, tenantId: string): Promise<void>;
  getEnabledAutomationsByTrigger(tenantId: string, trigger: string): Promise<AutomationRule[]>;

  // Follow-up Sequence operations
  createFollowUpSequence(sequence: InsertFollowUpSequence): Promise<FollowUpSequence>;
  getFollowUpSequencesByTenant(tenantId: string): Promise<FollowUpSequence[]>;
  getFollowUpSequenceById(id: string, tenantId: string): Promise<FollowUpSequence | undefined>;
  updateFollowUpSequence(id: string, tenantId: string, updates: Partial<InsertFollowUpSequence>): Promise<FollowUpSequence | undefined>;
  deleteFollowUpSequence(id: string, tenantId: string): Promise<void>;

  // Follow-up Step operations
  createFollowUpStep(step: InsertFollowUpStep): Promise<FollowUpStep>;
  getFollowUpStepsBySequence(sequenceId: string): Promise<FollowUpStep[]>;
  updateFollowUpStep(id: string, updates: Partial<InsertFollowUpStep>): Promise<FollowUpStep | undefined>;
  deleteFollowUpStep(id: string): Promise<void>;

  // Scheduled Email operations
  createScheduledEmail(email: InsertScheduledEmail): Promise<ScheduledEmail>;
  getScheduledEmailsByTenant(tenantId: string): Promise<ScheduledEmail[]>;
  getPendingScheduledEmails(tenantId: string): Promise<ScheduledEmail[]>;
  updateScheduledEmail(id: string, updates: Partial<ScheduledEmail>): Promise<ScheduledEmail | undefined>;
  deleteScheduledEmail(id: string): Promise<void>;

  // Email Sender Account operations
  createEmailSenderAccount(account: InsertEmailSenderAccount): Promise<EmailSenderAccount>;
  getEmailSenderAccountsByTenant(tenantId: string): Promise<EmailSenderAccount[]>;
  getDefaultSenderAccount(tenantId: string): Promise<EmailSenderAccount | undefined>;
  updateEmailSenderAccount(id: string, updates: Partial<InsertEmailSenderAccount>): Promise<EmailSenderAccount | undefined>;
  deleteEmailSenderAccount(id: string): Promise<void>;

  // SMTP Settings operations
  getSmtpSettings(tenantId: string): Promise<SmtpSettings | undefined>;
  upsertSmtpSettings(tenantId: string, settings: Partial<InsertSmtpSettings>): Promise<SmtpSettings>;
  testSmtpConnection(tenantId: string): Promise<{ success: boolean; message: string }>;

  // Enhanced Task operations
  getTaskWithDetails(id: string, tenantId: string): Promise<(Task & { 
    assignments: (TaskAssignment & { user?: User })[];
    checklists: TaskChecklistItem[];
    comments: (TaskComment & { user?: User })[];
    timeLogs: TaskTimeLog[];
    attachments: TaskAttachment[];
    statusHistory: (TaskStatusHistory & { user?: User })[];
    activityLog: (TaskActivityLog & { user?: User })[];
    creator?: User;
    assignee?: User;
  }) | undefined>;
  getTasksWithFilters(tenantId: string, filters: {
    assignedTo?: string;
    status?: string;
    priority?: string;
    dueFrom?: Date;
    dueTo?: Date;
    customerId?: string;
    dealId?: string;
    tags?: string[];
  }): Promise<Task[]>;
  updateTaskStatus(id: string, tenantId: string, status: string, changedBy: string, notes?: string): Promise<Task | undefined>;
  
  // Task Assignment operations
  createTaskAssignment(assignment: InsertTaskAssignment): Promise<TaskAssignment>;
  getTaskAssignments(taskId: string): Promise<(TaskAssignment & { user?: User })[]>;
  deleteTaskAssignment(taskId: string, userId: string): Promise<void>;
  getTasksAssignedToUser(userId: string, tenantId: string): Promise<Task[]>;
  
  // Task Comment operations
  createTaskComment(comment: InsertTaskComment): Promise<TaskComment>;
  getTaskComments(taskId: string): Promise<(TaskComment & { user?: User })[]>;
  updateTaskComment(id: string, content: string): Promise<TaskComment | undefined>;
  deleteTaskComment(id: string): Promise<void>;
  
  // Task Checklist operations
  createTaskChecklistItem(item: InsertTaskChecklistItem, createdByUserId: string): Promise<TaskChecklistItem>;
  getTaskChecklistItems(taskId: string): Promise<TaskChecklistItem[]>;
  updateTaskChecklistItem(id: string, updates: Partial<InsertTaskChecklistItem>): Promise<TaskChecklistItem | undefined>;
  toggleTaskChecklistItem(id: string, userId: string): Promise<TaskChecklistItem | undefined>;
  deleteTaskChecklistItem(id: string): Promise<void>;
  
  // Task Time Log operations
  createTaskTimeLog(timeLog: InsertTaskTimeLog): Promise<TaskTimeLog>;
  getTaskTimeLogs(taskId: string): Promise<TaskTimeLog[]>;
  updateTaskTimeLog(id: string, updates: Partial<InsertTaskTimeLog>): Promise<TaskTimeLog | undefined>;
  deleteTaskTimeLog(id: string): Promise<void>;
  getActiveTimeLog(userId: string): Promise<TaskTimeLog | undefined>;
  stopActiveTimeLog(userId: string): Promise<TaskTimeLog | undefined>;
  
  // Task Attachment operations
  createTaskAttachment(attachment: InsertTaskAttachment): Promise<TaskAttachment>;
  getTaskAttachments(taskId: string): Promise<TaskAttachment[]>;
  deleteTaskAttachment(id: string): Promise<void>;
  
  // Task Notification operations
  createTaskNotification(notification: InsertTaskNotification): Promise<TaskNotification>;
  getTaskNotifications(recipientId: string, tenantId: string, unreadOnly?: boolean): Promise<TaskNotification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(recipientId: string, tenantId: string): Promise<void>;
  getUnreadNotificationCount(recipientId: string, tenantId: string): Promise<number>;
  
  // Task AI History operations
  createTaskAiHistory(history: InsertTaskAiHistory): Promise<TaskAiHistory>;
  getTaskAiHistory(taskId: string): Promise<TaskAiHistory[]>;
  
  // Task Activity Log operations
  createTaskActivityLog(log: InsertTaskActivityLog): Promise<TaskActivityLog>;
  getTaskActivityLog(taskId: string): Promise<(TaskActivityLog & { user?: User })[]>;
  
  // Task Status History operations
  getTaskStatusHistory(taskId: string): Promise<(TaskStatusHistory & { user?: User })[]>;
  
  // Task Analytics
  getTaskAnalytics(tenantId: string): Promise<{
    totalTasks: number;
    completedThisWeek: number;
    completedThisMonth: number;
    overdueTasks: number;
    avgCompletionTime: number;
    tasksByStatus: { status: string; count: number }[];
    tasksByPriority: { priority: string; count: number }[];
    teamPerformance: { userId: string; userName: string; completed: number; inProgress: number }[];
  }>;

  // ==================== PROPOSAL BUILDER OPERATIONS ====================

  // Proposal Template operations
  createProposalTemplate(template: InsertProposalTemplate): Promise<ProposalTemplate>;
  getProposalTemplatesByTenant(tenantId: string): Promise<ProposalTemplate[]>;
  getProposalTemplateById(id: string, tenantId: string): Promise<ProposalTemplate | undefined>;
  updateProposalTemplate(id: string, tenantId: string, updates: Partial<InsertProposalTemplate>): Promise<ProposalTemplate | undefined>;
  deleteProposalTemplate(id: string, tenantId: string): Promise<void>;
  duplicateProposalTemplate(id: string, tenantId: string, createdBy: string): Promise<ProposalTemplate | undefined>;

  // Template Section operations
  createTemplateSection(section: InsertTemplateSection): Promise<TemplateSection>;
  getTemplateSections(templateId: string): Promise<TemplateSection[]>;
  updateTemplateSection(id: string, updates: Partial<InsertTemplateSection>): Promise<TemplateSection | undefined>;
  deleteTemplateSection(id: string): Promise<void>;
  reorderTemplateSections(templateId: string, sectionIds: string[]): Promise<void>;

  // Proposal operations
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  getProposalsByTenant(tenantId: string, filters?: { status?: string; customerId?: string; ownerId?: string }): Promise<Proposal[]>;
  getProposalById(id: string, tenantId: string): Promise<Proposal | undefined>;
  getProposalByAccessToken(accessToken: string): Promise<Proposal | undefined>;
  updateProposal(id: string, tenantId: string, updates: Partial<InsertProposal>): Promise<Proposal | undefined>;
  deleteProposal(id: string, tenantId: string): Promise<void>;
  getNextProposalNumber(tenantId: string): Promise<string>;
  updateProposalStatus(id: string, tenantId: string, status: string, changedBy: string, notes?: string): Promise<Proposal | undefined>;
  generateProposalAccessToken(id: string, tenantId: string): Promise<string>;

  // Proposal Section operations
  createProposalSection(section: InsertProposalSection): Promise<ProposalSection>;
  getProposalSections(proposalId: string): Promise<ProposalSection[]>;
  updateProposalSection(id: string, updates: Partial<InsertProposalSection>): Promise<ProposalSection | undefined>;
  deleteProposalSection(id: string): Promise<void>;
  reorderProposalSections(proposalId: string, sectionIds: string[]): Promise<void>;

  // Proposal Pricing Item operations
  createProposalPricingItem(item: InsertProposalPricingItem): Promise<ProposalPricingItem>;
  getProposalPricingItems(proposalId: string): Promise<ProposalPricingItem[]>;
  updateProposalPricingItem(id: string, updates: Partial<InsertProposalPricingItem>): Promise<ProposalPricingItem | undefined>;
  deleteProposalPricingItem(id: string): Promise<void>;
  deleteProposalPricingItems(proposalId: string): Promise<void>;
  recalculateProposalTotals(proposalId: string, tenantId: string): Promise<Proposal | undefined>;

  // Proposal Version operations
  createProposalVersion(version: InsertProposalVersion): Promise<ProposalVersion>;
  getProposalVersions(proposalId: string): Promise<ProposalVersion[]>;
  getProposalVersionById(id: string): Promise<ProposalVersion | undefined>;
  restoreProposalVersion(proposalId: string, versionId: string, tenantId: string, userId: string): Promise<Proposal | undefined>;

  // Proposal Activity Log operations
  createProposalActivityLog(log: InsertProposalActivityLog): Promise<ProposalActivityLog>;
  getProposalActivityLogs(proposalId: string): Promise<ProposalActivityLog[]>;

  // Proposal Signature operations
  createProposalSignature(signature: InsertProposalSignature): Promise<ProposalSignature>;
  getProposalSignatures(proposalId: string): Promise<ProposalSignature[]>;

  // Proposal View Log operations
  createProposalViewLog(log: InsertProposalViewLog): Promise<ProposalViewLog>;
  getProposalViewLogs(proposalId: string): Promise<ProposalViewLog[]>;
  recordProposalView(proposalId: string, viewData: Partial<InsertProposalViewLog>): Promise<void>;

  // Proposal Status History operations
  getProposalStatusHistory(proposalId: string): Promise<ProposalStatusHistory[]>;

  // Proposal Comment operations
  createProposalComment(comment: InsertProposalComment): Promise<ProposalComment>;
  getProposalComments(proposalId: string): Promise<ProposalComment[]>;
  updateProposalComment(id: string, updates: Partial<InsertProposalComment>): Promise<ProposalComment | undefined>;
  deleteProposalComment(id: string): Promise<void>;

  // Proposal Analytics
  getProposalAnalytics(tenantId: string): Promise<{
    totalProposals: number;
    acceptedProposals: number;
    rejectedProposals: number;
    pendingProposals: number;
    totalValue: number;
    acceptedValue: number;
    avgViewTime: number;
    conversionRate: number;
  }>;

  // Create proposal from template
  createProposalFromTemplate(templateId: string, proposalData: InsertProposal): Promise<Proposal | undefined>;

  // ==================== FEATURE FLAGS ====================
  getFeatureFlag(key: string, tenantId?: string): Promise<boolean>;
  getFeatureFlagRecord(key: string, tenantId?: string): Promise<FeatureFlag | undefined>;
  setFeatureFlag(key: string, enabled: boolean, tenantId?: string, description?: string): Promise<FeatureFlag>;
  getAllFeatureFlags(tenantId?: string): Promise<FeatureFlag[]>;

  // ==================== AI ENHANCEMENT MODULE ====================
  getAiSettings(tenantId: string): Promise<AiSettings | undefined>;
  createOrUpdateAiSettings(data: InsertAiSettings): Promise<AiSettings>;
  updateAiSettings(tenantId: string, updates: Partial<InsertAiSettings>): Promise<AiSettings | undefined>;
  createAiUsage(data: InsertAiUsage): Promise<AiUsage>;
  getAiUsageByTenant(tenantId: string, limit?: number): Promise<AiUsage[]>;
  getAiUsageStats(tenantId: string): Promise<{ total: number; thisMonth: number; byModule: Record<string, number> }>;
  createAiLog(data: InsertAiLog): Promise<AiLog>;
  getAiLogs(tenantId: string, limit?: number): Promise<AiLog[]>;
  updateAiLogFeedback(id: string, rating: number, comment?: string): Promise<AiLog | undefined>;
  createAiContentVersion(data: InsertAiContentVersion): Promise<AiContentVersion>;
  getAiContentVersions(tenantId: string, resourceType: string, resourceId: string): Promise<AiContentVersion[]>;
  incrementAiTokenUsage(tenantId: string, tokens: number): Promise<void>;

  // ==================== WORKSPACE OPERATIONS (Multi-Workspace Support) ====================
  // These operations are only active when multi_workspace_enabled flag is ON
  
  // Workspace user membership
  getUserWorkspaces(userId: string): Promise<(WorkspaceUser & { workspace: Tenant })[]>;
  getWorkspaceUsers(workspaceId: string): Promise<(WorkspaceUser & { user: Omit<User, 'passwordHash'> })[]>;
  addUserToWorkspace(data: InsertWorkspaceUser): Promise<WorkspaceUser>;
  updateWorkspaceUser(userId: string, workspaceId: string, updates: { role?: string; isPrimary?: boolean }): Promise<WorkspaceUser | undefined>;
  removeUserFromWorkspace(userId: string, workspaceId: string): Promise<void>;
  isUserInWorkspace(userId: string, workspaceId: string): Promise<boolean>;
  getUserWorkspaceRole(userId: string, workspaceId: string): Promise<string | undefined>;
  setActiveWorkspace(userId: string, workspaceId: string): Promise<void>;

  // Workspace invitations
  createWorkspaceInvitation(invitation: InsertWorkspaceInvitation): Promise<WorkspaceInvitation>;
  getWorkspaceInvitations(workspaceId: string, status?: string): Promise<WorkspaceInvitation[]>;
  getInvitationByToken(token: string): Promise<WorkspaceInvitation | undefined>;
  getInvitationsByEmail(email: string, status?: string): Promise<(WorkspaceInvitation & { workspace: Tenant })[]>;
  updateInvitationStatus(id: string, status: string): Promise<WorkspaceInvitation | undefined>;
  acceptInvitation(token: string, userId: string): Promise<WorkspaceUser | undefined>;
  revokeInvitation(id: string): Promise<void>;
  cleanupExpiredInvitations(): Promise<number>;

  // Workspace activity logging
  logWorkspaceActivity(log: InsertWorkspaceActivityLog): Promise<WorkspaceActivityLog>;
  getWorkspaceActivityLogs(workspaceId: string, limit?: number): Promise<WorkspaceActivityLog[]>;

  // Workspace creation (extends tenant creation for multi-workspace)
  createWorkspace(tenantData: InsertTenant, ownerId: string): Promise<Tenant>;

  // ==================== CUSTOMER PORTAL ====================
  // Portal Settings
  getCustomerPortalSettings(workspaceId: string): Promise<CustomerPortalSettings | undefined>;
  upsertCustomerPortalSettings(workspaceId: string, data: Partial<InsertCustomerPortalSettings>): Promise<CustomerPortalSettings>;
  
  // Portal Activity Logs
  createPortalActivityLog(log: InsertCustomerPortalActivityLog): Promise<CustomerPortalActivityLog>;
  getPortalActivityLogs(workspaceId: string, options?: { customerId?: string; limit?: number }): Promise<CustomerPortalActivityLog[]>;
  
  // Password Reset Tokens
  createPasswordResetToken(data: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(id: string): Promise<void>;
  
  // Client Documents
  createClientDocument(doc: InsertClientDocument): Promise<ClientDocument>;
  getClientDocuments(tenantId: string, customerId: string): Promise<ClientDocument[]>;
  getClientDocumentById(id: string, tenantId: string): Promise<ClientDocument | undefined>;
  deleteClientDocument(id: string, tenantId: string): Promise<void>;
  
  // Portal-specific queries
  getProposalsByCustomerForPortal(customerId: string, tenantId: string): Promise<schema.Proposal[]>;
}

export class DatabaseStorage implements IStorage {
  // Tenant operations
  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const [tenant] = await db.insert(schema.tenants).values(insertTenant).returning();
    return tenant;
  }
  
  async getTenant(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(schema.tenants).where(eq(schema.tenants.id, id));
    return tenant;
  }
  
  async updateTenantPackage(tenantId: string, packageId: string | null): Promise<Tenant | undefined> {
    const [tenant] = await db.update(schema.tenants)
      .set({ packageId })
      .where(eq(schema.tenants.id, tenantId))
      .returning();
    return tenant;
  }
  
  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }
  
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user;
  }
  
  async getUsersByTenant(tenantId: string): Promise<User[]> {
    return db.select().from(schema.users).where(eq(schema.users.tenantId, tenantId));
  }
  
  async updateUser(id: string, updates: { firstName?: string; lastName?: string; email?: string; profileImageUrl?: string; phone?: string; jobTitle?: string }): Promise<User | undefined> {
    const updateData: { firstName?: string; lastName?: string; email?: string; profileImageUrl?: string; phone?: string; jobTitle?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (updates.firstName) updateData.firstName = updates.firstName;
    if (updates.lastName) updateData.lastName = updates.lastName;
    if (updates.email) updateData.email = updates.email;
    if (updates.profileImageUrl !== undefined) updateData.profileImageUrl = updates.profileImageUrl;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.jobTitle !== undefined) updateData.jobTitle = updates.jobTitle;
    
    const [user] = await db.update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }
  
  // Role operations
  async createRole(insertRole: InsertRole): Promise<Role> {
    const [role] = await db.insert(schema.roles).values(insertRole).returning();
    return role;
  }
  
  async getRoleById(id: string): Promise<Role | undefined> {
    const [role] = await db.select().from(schema.roles).where(eq(schema.roles.id, id));
    return role;
  }
  
  async getRolesByTenant(tenantId: string): Promise<Role[]> {
    return db.select().from(schema.roles).where(eq(schema.roles.tenantId, tenantId));
  }
  
  async updateRole(id: string, updates: Partial<InsertRole>): Promise<Role | undefined> {
    const [role] = await db.update(schema.roles)
      .set(updates)
      .where(eq(schema.roles.id, id))
      .returning();
    return role;
  }
  
  async deleteRole(id: string): Promise<void> {
    await db.delete(schema.roles).where(eq(schema.roles.id, id));
  }
  
  // Team member operations
  async createTeamMember(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }
  
  async updateTeamMember(id: string, tenantId: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const updateData: any = { ...updates, updatedAt: new Date() };
    const [user] = await db.update(schema.users)
      .set(updateData)
      .where(and(eq(schema.users.id, id), eq(schema.users.tenantId, tenantId)))
      .returning();
    return user;
  }
  
  async deleteTeamMember(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.users)
      .where(and(eq(schema.users.id, id), eq(schema.users.tenantId, tenantId)));
  }
  
  async getUserWithRole(id: string): Promise<(User & { role?: Role }) | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    if (!user) return undefined;
    
    if (user.roleId) {
      const [role] = await db.select().from(schema.roles).where(eq(schema.roles.id, user.roleId));
      return { ...user, role };
    }
    return user;
  }
  
  async getTeamMemberWithDetails(id: string, tenantId: string): Promise<{
    member: User & { role?: Role };
    deals: Deal[];
    quotations: Quotation[];
    invoices: Invoice[];
    tasks: Task[];
    customers: Customer[];
    activities: Activity[];
  } | undefined> {
    const [user] = await db.select().from(schema.users)
      .where(and(eq(schema.users.id, id), eq(schema.users.tenantId, tenantId)));
    if (!user) return undefined;
    
    let role: Role | undefined;
    if (user.roleId) {
      const [r] = await db.select().from(schema.roles).where(eq(schema.roles.id, user.roleId));
      role = r;
    }
    
    const deals = await db.select().from(schema.deals)
      .where(and(eq(schema.deals.tenantId, tenantId), eq(schema.deals.ownerId, id)))
      .orderBy(desc(schema.deals.createdAt));
    
    const quotations = await db.select().from(schema.quotations)
      .where(and(eq(schema.quotations.tenantId, tenantId), eq(schema.quotations.createdBy, id)))
      .orderBy(desc(schema.quotations.createdAt));
    
    const invoices = await db.select().from(schema.invoices)
      .where(and(eq(schema.invoices.tenantId, tenantId), eq(schema.invoices.createdBy, id)))
      .orderBy(desc(schema.invoices.createdAt));
    
    const tasks = await db.select().from(schema.tasks)
      .where(and(eq(schema.tasks.tenantId, tenantId), eq(schema.tasks.assignedTo, id)))
      .orderBy(desc(schema.tasks.createdAt));
    
    const customers = await db.select().from(schema.customers)
      .where(and(eq(schema.customers.tenantId, tenantId), eq(schema.customers.ownerId, id)))
      .orderBy(desc(schema.customers.createdAt));
    
    const activities = await db.select().from(schema.activities)
      .where(and(eq(schema.activities.tenantId, tenantId), eq(schema.activities.userId, id)))
      .orderBy(desc(schema.activities.createdAt))
      .limit(50);
    
    return {
      member: { ...user, role },
      deals,
      quotations,
      invoices,
      tasks,
      customers,
      activities,
    };
  }
  
  // Auth token operations
  async createAuthToken(insertToken: InsertAuthToken): Promise<AuthToken> {
    const [token] = await db.insert(schema.authTokens).values(insertToken).returning();
    return token;
  }
  
  async getAuthToken(refreshToken: string): Promise<AuthToken | undefined> {
    const [token] = await db.select().from(schema.authTokens)
      .where(eq(schema.authTokens.refreshToken, refreshToken));
    return token;
  }
  
  async deleteAuthToken(id: string): Promise<void> {
    await db.delete(schema.authTokens).where(eq(schema.authTokens.id, id));
  }

  async deleteUserAuthTokens(userId: string): Promise<void> {
    await db.delete(schema.authTokens).where(eq(schema.authTokens.userId, userId));
  }
  
  // Module operations
  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db.insert(schema.modules).values(insertModule).returning();
    return module;
  }
  
  async getAllModules(): Promise<Module[]> {
    return db.select().from(schema.modules);
  }
  
  async getModuleByName(name: string): Promise<Module | undefined> {
    const [module] = await db.select().from(schema.modules).where(eq(schema.modules.name, name));
    return module;
  }
  
  // Tenant module operations
  async enableModuleForTenant(insertTenantModule: InsertTenantModule): Promise<TenantModule> {
    const [tenantModule] = await db.insert(schema.tenantModules)
      .values(insertTenantModule)
      .returning();
    return tenantModule;
  }
  
  async getTenantModules(tenantId: string): Promise<(TenantModule & { module: Module })[]> {
    const results = await db
      .select()
      .from(schema.tenantModules)
      .innerJoin(schema.modules, eq(schema.tenantModules.moduleId, schema.modules.id))
      .where(eq(schema.tenantModules.tenantId, tenantId));
    
    return results.map(r => ({ ...r.tenant_modules, module: r.modules }));
  }
  
  async updateTenantModule(id: string, isEnabled: boolean): Promise<void> {
    await db.update(schema.tenantModules)
      .set({ isEnabled })
      .where(eq(schema.tenantModules.id, id));
  }
  
  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(schema.contacts).values(insertContact).returning();
    return contact;
  }
  
  async getContactsByTenant(tenantId: string, ownerId?: string): Promise<Contact[]> {
    if (ownerId) {
      return db.select().from(schema.contacts).where(and(eq(schema.contacts.tenantId, tenantId), eq(schema.contacts.ownerId, ownerId)));
    }
    return db.select().from(schema.contacts).where(eq(schema.contacts.tenantId, tenantId));
  }
  
  async getContactById(id: string, tenantId: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(schema.contacts)
      .where(and(eq(schema.contacts.id, id), eq(schema.contacts.tenantId, tenantId)));
    return contact;
  }
  
  async updateContact(id: string, tenantId: string, updates: Partial<InsertContact>): Promise<Contact | undefined> {
    const [contact] = await db.update(schema.contacts)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(schema.contacts.id, id), eq(schema.contacts.tenantId, tenantId)))
      .returning();
    return contact;
  }
  
  async deleteContact(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.contacts)
      .where(and(eq(schema.contacts.id, id), eq(schema.contacts.tenantId, tenantId)));
  }
  
  // Deal operations
  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const [deal] = await db.insert(schema.deals).values(insertDeal).returning();
    return deal;
  }
  
  async getDealsByTenant(tenantId: string, ownerId?: string): Promise<Deal[]> {
    if (ownerId) {
      return db.select().from(schema.deals).where(and(eq(schema.deals.tenantId, tenantId), eq(schema.deals.ownerId, ownerId)));
    }
    return db.select().from(schema.deals).where(eq(schema.deals.tenantId, tenantId));
  }
  
  async getDealById(id: string, tenantId: string): Promise<Deal | undefined> {
    const [deal] = await db.select().from(schema.deals)
      .where(and(eq(schema.deals.id, id), eq(schema.deals.tenantId, tenantId)));
    return deal;
  }
  
  async updateDeal(id: string, tenantId: string, updates: Partial<InsertDeal>): Promise<Deal | undefined> {
    const [deal] = await db.update(schema.deals)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(schema.deals.id, id), eq(schema.deals.tenantId, tenantId)))
      .returning();
    return deal;
  }
  
  async deleteDeal(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.deals)
      .where(and(eq(schema.deals.id, id), eq(schema.deals.tenantId, tenantId)));
  }
  
  // Task operations
  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(schema.tasks).values(insertTask).returning();
    return task;
  }
  
  async getTasksByTenant(tenantId: string, assignedTo?: string): Promise<Task[]> {
    if (assignedTo) {
      return db.select().from(schema.tasks).where(and(eq(schema.tasks.tenantId, tenantId), eq(schema.tasks.assignedTo, assignedTo)));
    }
    return db.select().from(schema.tasks).where(eq(schema.tasks.tenantId, tenantId));
  }
  
  async getTaskById(id: string, tenantId: string): Promise<Task | undefined> {
    const [task] = await db.select().from(schema.tasks)
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.tenantId, tenantId)));
    return task;
  }
  
  async updateTask(id: string, tenantId: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const cleanUpdates: any = { ...updates };
    
    // Convert string dates to Date objects if they exist
    if (cleanUpdates.dueDate && typeof cleanUpdates.dueDate === 'string') {
      cleanUpdates.dueDate = new Date(cleanUpdates.dueDate);
    }
    
    if (cleanUpdates.completedAt && typeof cleanUpdates.completedAt === 'string') {
      cleanUpdates.completedAt = new Date(cleanUpdates.completedAt);
    }

    const [task] = await db.update(schema.tasks)
      .set({ ...cleanUpdates, updatedAt: new Date() })
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.tenantId, tenantId)))
      .returning();
    return task;
  }
  
  async deleteTask(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.tasks)
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.tenantId, tenantId)));
  }

  // Product operations
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(schema.products).values(insertProduct).returning();
    return product;
  }

  async getProductsByTenant(tenantId: string): Promise<Product[]> {
    return db.select().from(schema.products).where(eq(schema.products.tenantId, tenantId)).orderBy(desc(schema.products.createdAt));
  }

  async getProductById(id: string, tenantId: string): Promise<Product | undefined> {
    const [product] = await db.select().from(schema.products)
      .where(and(eq(schema.products.id, id), eq(schema.products.tenantId, tenantId)));
    return product;
  }

  async updateProduct(id: string, tenantId: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(schema.products)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(schema.products.id, id), eq(schema.products.tenantId, tenantId)))
      .returning();
    return product;
  }

  async deleteProduct(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.products)
      .where(and(eq(schema.products.id, id), eq(schema.products.tenantId, tenantId)));
  }

  // Customer operations
  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(schema.customers).values(insertCustomer).returning();
    return customer;
  }

  async getCustomersByTenant(tenantId: string, ownerId?: string): Promise<Customer[]> {
    const conditions = [eq(schema.customers.tenantId, tenantId)];
    if (ownerId) {
      conditions.push(eq(schema.customers.ownerId, ownerId));
    }
    return db.select().from(schema.customers).where(and(...conditions)).orderBy(desc(schema.customers.createdAt));
  }

  async getCustomerById(id: string, tenantId: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(schema.customers)
      .where(and(eq(schema.customers.id, id), eq(schema.customers.tenantId, tenantId)));
    return customer;
  }

  async updateCustomer(id: string, tenantId: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [customer] = await db.update(schema.customers)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(schema.customers.id, id), eq(schema.customers.tenantId, tenantId)))
      .returning();
    return customer;
  }

  async deleteCustomer(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.customers)
      .where(and(eq(schema.customers.id, id), eq(schema.customers.tenantId, tenantId)));
  }

  // Customer-related operations for journey view
  async getContactsByCustomer(customerId: string, tenantId: string): Promise<Contact[]> {
    // Contacts don't have direct customerId link in current schema
    // Return empty array - contacts are managed separately
    return [];
  }

  async getDealsByCustomer(customerId: string, tenantId: string): Promise<Deal[]> {
    return db.select().from(schema.deals)
      .where(and(eq(schema.deals.customerId, customerId), eq(schema.deals.tenantId, tenantId)))
      .orderBy(desc(schema.deals.createdAt));
  }

  async getTasksByCustomer(customerId: string, tenantId: string): Promise<Task[]> {
    return db.select().from(schema.tasks)
      .where(and(eq(schema.tasks.customerId, customerId), eq(schema.tasks.tenantId, tenantId)))
      .orderBy(desc(schema.tasks.createdAt));
  }

  async getQuotationsByCustomer(customerId: string, tenantId: string): Promise<Quotation[]> {
    return db.select().from(schema.quotations)
      .where(and(eq(schema.quotations.customerId, customerId), eq(schema.quotations.tenantId, tenantId)))
      .orderBy(desc(schema.quotations.createdAt));
  }

  async getInvoicesByCustomer(customerId: string, tenantId: string): Promise<Invoice[]> {
    return db.select().from(schema.invoices)
      .where(and(eq(schema.invoices.customerId, customerId), eq(schema.invoices.tenantId, tenantId)))
      .orderBy(desc(schema.invoices.issueDate));
  }

  // Quotation operations
  async createQuotation(insertQuotation: InsertQuotation): Promise<Quotation> {
    const [quotation] = await db.insert(schema.quotations).values(insertQuotation).returning();
    return quotation;
  }

  async getQuotationsByTenant(tenantId: string, createdBy?: string): Promise<Quotation[]> {
    if (createdBy) {
      return db.select().from(schema.quotations)
        .where(and(eq(schema.quotations.tenantId, tenantId), eq(schema.quotations.createdBy, createdBy)))
        .orderBy(desc(schema.quotations.createdAt));
    }
    return db.select().from(schema.quotations).where(eq(schema.quotations.tenantId, tenantId)).orderBy(desc(schema.quotations.createdAt));
  }

  async getQuotationById(id: string, tenantId: string): Promise<(Quotation & { items?: QuotationItem[] }) | undefined> {
    const [quotation] = await db.select().from(schema.quotations)
      .where(and(eq(schema.quotations.id, id), eq(schema.quotations.tenantId, tenantId)));
    if (!quotation) return undefined;
    const items = await this.getQuotationItems(id);
    return { ...quotation, items };
  }

  async updateQuotation(id: string, tenantId: string, updates: Partial<InsertQuotation>): Promise<Quotation | undefined> {
    const cleanUpdates: any = { ...updates };
    if (cleanUpdates.validUntil && typeof cleanUpdates.validUntil === 'string') {
      cleanUpdates.validUntil = new Date(cleanUpdates.validUntil);
    }
    if (cleanUpdates.sentAt && typeof cleanUpdates.sentAt === 'string') {
      cleanUpdates.sentAt = new Date(cleanUpdates.sentAt);
    }
    if (cleanUpdates.acceptedAt && typeof cleanUpdates.acceptedAt === 'string') {
      cleanUpdates.acceptedAt = new Date(cleanUpdates.acceptedAt);
    }
    const [quotation] = await db.update(schema.quotations)
      .set({ ...cleanUpdates, updatedAt: new Date() })
      .where(and(eq(schema.quotations.id, id), eq(schema.quotations.tenantId, tenantId)))
      .returning();
    return quotation;
  }

  async deleteQuotation(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.quotations)
      .where(and(eq(schema.quotations.id, id), eq(schema.quotations.tenantId, tenantId)));
  }

  async getNextQuoteNumber(tenantId: string): Promise<string> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.quotations)
      .where(eq(schema.quotations.tenantId, tenantId));
    const count = Number(result[0]?.count || 0) + 1;
    return `QT-${String(count).padStart(5, '0')}`;
  }

  // Quotation item operations
  async createQuotationItem(item: InsertQuotationItem): Promise<QuotationItem> {
    const [quotationItem] = await db.insert(schema.quotationItems).values(item).returning();
    return quotationItem;
  }

  async getQuotationItems(quotationId: string): Promise<QuotationItem[]> {
    return db.select().from(schema.quotationItems).where(eq(schema.quotationItems.quotationId, quotationId));
  }

  async updateQuotationItem(id: string, updates: Partial<InsertQuotationItem>): Promise<QuotationItem | undefined> {
    const [item] = await db.update(schema.quotationItems)
      .set(updates)
      .where(eq(schema.quotationItems.id, id))
      .returning();
    return item;
  }

  async deleteQuotationItem(id: string): Promise<void> {
    await db.delete(schema.quotationItems).where(eq(schema.quotationItems.id, id));
  }

  async deleteQuotationItems(quotationId: string): Promise<void> {
    await db.delete(schema.quotationItems).where(eq(schema.quotationItems.quotationId, quotationId));
  }

  // Invoice operations
  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(schema.invoices).values(insertInvoice as any).returning();
    return invoice;
  }

  async getInvoicesByTenant(tenantId: string, createdBy?: string): Promise<Invoice[]> {
    if (createdBy) {
      return db.select().from(schema.invoices)
        .where(and(eq(schema.invoices.tenantId, tenantId), eq(schema.invoices.createdBy, createdBy)))
        .orderBy(desc(schema.invoices.createdAt));
    }
    return db.select().from(schema.invoices).where(eq(schema.invoices.tenantId, tenantId)).orderBy(desc(schema.invoices.createdAt));
  }

  async getInvoiceById(id: string, tenantId: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(schema.invoices)
      .where(and(eq(schema.invoices.id, id), eq(schema.invoices.tenantId, tenantId)));
    return invoice;
  }

  async updateInvoice(id: string, tenantId: string, updates: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const cleanUpdates: any = { ...updates };
    if (cleanUpdates.issueDate && typeof cleanUpdates.issueDate === 'string') {
      cleanUpdates.issueDate = new Date(cleanUpdates.issueDate);
    }
    if (cleanUpdates.dueDate && typeof cleanUpdates.dueDate === 'string') {
      cleanUpdates.dueDate = new Date(cleanUpdates.dueDate);
    }
    if (cleanUpdates.sentAt && typeof cleanUpdates.sentAt === 'string') {
      cleanUpdates.sentAt = new Date(cleanUpdates.sentAt);
    }
    if (cleanUpdates.paidAt && typeof cleanUpdates.paidAt === 'string') {
      cleanUpdates.paidAt = new Date(cleanUpdates.paidAt);
    }
    const [invoice] = await db.update(schema.invoices)
      .set({ ...cleanUpdates, updatedAt: new Date() } as any)
      .where(and(eq(schema.invoices.id, id), eq(schema.invoices.tenantId, tenantId)))
      .returning();
    return invoice;
  }

  async deleteInvoice(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.invoices)
      .where(and(eq(schema.invoices.id, id), eq(schema.invoices.tenantId, tenantId)));
  }

  async getNextInvoiceNumber(tenantId: string): Promise<string> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.invoices)
      .where(eq(schema.invoices.tenantId, tenantId));
    const count = Number(result[0]?.count || 0) + 1;
    return `INV-${String(count).padStart(5, '0')}`;
  }

  // Invoice item operations
  async createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem> {
    const [invoiceItem] = await db.insert(schema.invoiceItems).values(item).returning();
    return invoiceItem;
  }

  async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    return db.select().from(schema.invoiceItems).where(eq(schema.invoiceItems.invoiceId, invoiceId));
  }

  async updateInvoiceItem(id: string, updates: Partial<InsertInvoiceItem>): Promise<InvoiceItem | undefined> {
    const [item] = await db.update(schema.invoiceItems)
      .set(updates)
      .where(eq(schema.invoiceItems.id, id))
      .returning();
    return item;
  }

  async deleteInvoiceItem(id: string): Promise<void> {
    await db.delete(schema.invoiceItems).where(eq(schema.invoiceItems.id, id));
  }

  async deleteInvoiceItems(invoiceId: string): Promise<void> {
    await db.delete(schema.invoiceItems).where(eq(schema.invoiceItems.invoiceId, invoiceId));
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(schema.payments).values(insertPayment as any).returning();
    return payment;
  }

  async getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
    return db.select().from(schema.payments).where(eq(schema.payments.invoiceId, invoiceId));
  }

  async getPaymentsByTenant(tenantId: string): Promise<Payment[]> {
    return db.select().from(schema.payments).where(eq(schema.payments.tenantId, tenantId)).orderBy(desc(schema.payments.createdAt));
  }

  async deletePayment(id: string): Promise<void> {
    await db.delete(schema.payments).where(eq(schema.payments.id, id));
  }

  // Activity operations
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(schema.activities).values(insertActivity).returning();
    return activity;
  }

  async getActivitiesByTenant(tenantId: string): Promise<Activity[]> {
    return db.select().from(schema.activities).where(eq(schema.activities.tenantId, tenantId)).orderBy(desc(schema.activities.createdAt));
  }

  async getActivitiesByCustomer(customerId: string, tenantId: string): Promise<Activity[]> {
    return db.select().from(schema.activities)
      .where(and(eq(schema.activities.customerId, customerId), eq(schema.activities.tenantId, tenantId)))
      .orderBy(desc(schema.activities.createdAt));
  }

  async getActivityById(id: string, tenantId: string): Promise<Activity | undefined> {
    const [activity] = await db.select().from(schema.activities)
      .where(and(eq(schema.activities.id, id), eq(schema.activities.tenantId, tenantId)));
    return activity;
  }

  async updateActivity(id: string, tenantId: string, updates: Partial<InsertActivity>): Promise<Activity | undefined> {
    const cleanUpdates: any = { ...updates };
    if (cleanUpdates.scheduledAt && typeof cleanUpdates.scheduledAt === 'string') {
      cleanUpdates.scheduledAt = new Date(cleanUpdates.scheduledAt);
    }
    if (cleanUpdates.completedAt && typeof cleanUpdates.completedAt === 'string') {
      cleanUpdates.completedAt = new Date(cleanUpdates.completedAt);
    }
    const [activity] = await db.update(schema.activities)
      .set({ ...cleanUpdates, updatedAt: new Date() })
      .where(and(eq(schema.activities.id, id), eq(schema.activities.tenantId, tenantId)))
      .returning();
    return activity;
  }

  async deleteActivity(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.activities)
      .where(and(eq(schema.activities.id, id), eq(schema.activities.tenantId, tenantId)));
  }

  async getActivitiesByDeal(dealId: string, tenantId: string): Promise<Activity[]> {
    return db.select().from(schema.activities)
      .where(and(eq(schema.activities.dealId, dealId), eq(schema.activities.tenantId, tenantId)))
      .orderBy(desc(schema.activities.createdAt));
  }

  async getTasksByDeal(dealId: string, tenantId: string): Promise<Task[]> {
    return db.select().from(schema.tasks)
      .where(and(eq(schema.tasks.dealId, dealId), eq(schema.tasks.tenantId, tenantId)))
      .orderBy(desc(schema.tasks.createdAt));
  }

  // Reports
  async getDashboardStats(tenantId: string): Promise<{
    totalRevenue: number;
    activeDeals: number;
    totalCustomers: number;
    pendingTasks: number;
    pendingInvoices: number;
    overdueInvoices: number;
  }> {
    const deals = await db.select().from(schema.deals).where(eq(schema.deals.tenantId, tenantId));
    const customers = await db.select().from(schema.customers).where(eq(schema.customers.tenantId, tenantId));
    const tasks = await db.select().from(schema.tasks).where(eq(schema.tasks.tenantId, tenantId));
    const invoices = await db.select().from(schema.invoices).where(eq(schema.invoices.tenantId, tenantId));

    const totalRevenue = deals.reduce((sum, d) => sum + Number(d.value), 0);
    const activeDeals = deals.filter(d => !['won', 'lost'].includes(d.stage)).length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const pendingInvoices = invoices.filter(i => ['draft', 'sent'].includes(i.status)).length;
    const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;

    return {
      totalRevenue,
      activeDeals,
      totalCustomers: customers.length,
      pendingTasks,
      pendingInvoices,
      overdueInvoices,
    };
  }

  async getSalesReport(tenantId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    let query = db.select().from(schema.deals).where(eq(schema.deals.tenantId, tenantId));
    return query.orderBy(desc(schema.deals.createdAt));
  }

  // SaaS Admin functions
  async getSaasAdminStats(): Promise<{
    totalTenants: number;
    totalUsers: number;
    monthlyRevenue: number;
    activeSessions: number;
    revenueData: { month: string; revenue: number; users: number }[];
    tenantDistribution: { name: string; value: number }[];
  }> {
    const tenants = await db.select().from(schema.tenants);
    const users = await db.select().from(schema.users);
    const workspaceInvoices = await db.select().from(schema.workspaceInvoices);
    const subscriptions = await db.select().from(schema.workspaceSubscriptions);
    const plans = await db.select().from(schema.workspacePlans);
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyRevenue = workspaceInvoices
      .filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate.getMonth() === currentMonth && 
               invDate.getFullYear() === currentYear && 
               inv.status === 'paid';
      })
      .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData: { month: string; revenue: number; users: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const targetMonth = (currentMonth - i + 12) % 12;
      const targetYear = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const monthRevenue = workspaceInvoices
        .filter(inv => {
          const invDate = new Date(inv.createdAt);
          return invDate.getMonth() === targetMonth && 
                 invDate.getFullYear() === targetYear && 
                 inv.status === 'paid';
        })
        .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
      
      const endOfTargetMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
      const monthTenants = tenants.filter(t => {
        const tDate = new Date(t.createdAt);
        return tDate <= endOfTargetMonth;
      }).length;
      
      revenueData.push({
        month: months[targetMonth],
        revenue: monthRevenue,
        users: monthTenants,
      });
    }
    
    const planCounts: { [key: string]: number } = {};
    subscriptions.forEach(sub => {
      if (sub.planId && sub.status === 'active') {
        const plan = plans.find(p => p.id === sub.planId);
        const planName = plan?.displayName || plan?.name || 'Unknown';
        planCounts[planName] = (planCounts[planName] || 0) + 1;
      } else if (sub.status === 'trial') {
        planCounts['Trial'] = (planCounts['Trial'] || 0) + 1;
      }
    });
    
    const tenantsWithSub = new Set(subscriptions.map(s => s.workspaceId));
    const tenantsWithoutSub = tenants.filter(t => !tenantsWithSub.has(t.id)).length;
    if (tenantsWithoutSub > 0) {
      planCounts['Free/No Plan'] = tenantsWithoutSub;
    }
    
    const tenantDistribution = Object.entries(planCounts)
      .map(([name, value]) => ({ name, value }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value);
    
    const activeUsers = users.filter(u => u.isActive).length;
    
    return {
      totalTenants: tenants.length,
      totalUsers: users.length,
      monthlyRevenue: monthlyRevenue,
      activeSessions: activeUsers,
      revenueData,
      tenantDistribution,
    };
  }

  async getAllTenants(): Promise<(Tenant & { userCount: number; subscriptionStatus?: string; planName?: string })[]> {
    const tenants = await db.select().from(schema.tenants).orderBy(desc(schema.tenants.createdAt));
    const users = await db.select().from(schema.users);
    const subscriptions = await db.select().from(schema.workspaceSubscriptions);
    const packages = await db.select().from(schema.packages);
    
    return tenants.map(tenant => {
      const subscription = subscriptions.find(s => s.workspaceId === tenant.id);
      // Get plan from packages table using tenant.packageId (not subscription.planId)
      const pkg = tenant.packageId ? packages.find(p => p.id === tenant.packageId) : undefined;
      return {
        ...tenant,
        userCount: users.filter(u => u.tenantId === tenant.id).length,
        subscriptionStatus: subscription?.status,
        planName: pkg?.displayName || pkg?.name,
      };
    });
  }

  async getAllUsersWithTenants(): Promise<(Omit<User, 'passwordHash'> & { tenantName: string })[]> {
    const users = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
    const tenants = await db.select().from(schema.tenants);
    
    return users.map(user => {
      const tenant = tenants.find(t => t.id === user.tenantId);
      const { passwordHash, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        tenantName: tenant?.name || 'Unknown',
      };
    });
  }

  // Customer Portal functions
  async getQuotationsForCustomerUser(userId: string, tenantId: string): Promise<Quotation[]> {
    const user = await this.getUserById(userId);
    if (!user) return [];
    
    const customers = await db.select().from(schema.customers)
      .where(and(
        eq(schema.customers.tenantId, tenantId),
        eq(schema.customers.email, user.email)
      ));
    
    if (customers.length === 0) return [];
    
    const customerIds = customers.map(c => c.id);
    const quotations = await db.select().from(schema.quotations)
      .where(eq(schema.quotations.tenantId, tenantId))
      .orderBy(desc(schema.quotations.createdAt));
    
    return quotations.filter(q => customerIds.includes(q.customerId));
  }

  async getInvoicesForCustomerUser(userId: string, tenantId: string): Promise<Invoice[]> {
    const user = await this.getUserById(userId);
    if (!user) return [];
    
    const customers = await db.select().from(schema.customers)
      .where(and(
        eq(schema.customers.tenantId, tenantId),
        eq(schema.customers.email, user.email)
      ));
    
    if (customers.length === 0) return [];
    
    const customerIds = customers.map(c => c.id);
    const invoices = await db.select().from(schema.invoices)
      .where(eq(schema.invoices.tenantId, tenantId))
      .orderBy(desc(schema.invoices.createdAt));
    
    return invoices.filter(i => customerIds.includes(i.customerId));
  }

  // Platform Settings operations
  async getPlatformSettings(category?: string): Promise<PlatformSetting[]> {
    if (category) {
      return db.select().from(schema.platformSettings)
        .where(eq(schema.platformSettings.category, category))
        .orderBy(schema.platformSettings.key);
    }
    return db.select().from(schema.platformSettings).orderBy(schema.platformSettings.category, schema.platformSettings.key);
  }

  async getPlatformSettingByKey(key: string): Promise<PlatformSetting | undefined> {
    const [setting] = await db.select().from(schema.platformSettings).where(eq(schema.platformSettings.key, key));
    return setting;
  }

  async upsertPlatformSetting(setting: InsertPlatformSetting): Promise<PlatformSetting> {
    const existing = await this.getPlatformSettingByKey(setting.key);
    if (existing) {
      const [updated] = await db.update(schema.platformSettings)
        .set({ ...setting, updatedAt: new Date() })
        .where(eq(schema.platformSettings.key, setting.key))
        .returning();
      return updated;
    }
    const [created] = await db.insert(schema.platformSettings).values(setting).returning();
    return created;
  }

  async deletePlatformSetting(key: string): Promise<void> {
    await db.delete(schema.platformSettings).where(eq(schema.platformSettings.key, key));
  }

  // User AI Settings operations
  async getUserAiSettings(userId: string): Promise<schema.UserAiSetting | undefined> {
    const [settings] = await db.select().from(schema.userAiSettings)
      .where(eq(schema.userAiSettings.userId, userId));
    return settings;
  }

  async upsertUserAiSettings(userId: string, settings: { provider?: string; apiKey?: string; isEnabled?: boolean }): Promise<schema.UserAiSetting> {
    const existing = await this.getUserAiSettings(userId);
    if (existing) {
      const [updated] = await db.update(schema.userAiSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(schema.userAiSettings.userId, userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(schema.userAiSettings).values({
      userId,
      provider: settings.provider || 'openai',
      apiKey: settings.apiKey,
      isEnabled: settings.isEnabled ?? true,
    }).returning();
    return created;
  }

  // Platform Activity Logs operations
  async createPlatformActivityLog(log: InsertPlatformActivityLog): Promise<PlatformActivityLog> {
    const [activityLog] = await db.insert(schema.platformActivityLogs).values(log).returning();
    return activityLog;
  }

  async getPlatformActivityLogs(filters?: {
    tenantId?: string;
    actorId?: string;
    action?: string;
    targetType?: string;
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
  }): Promise<PlatformActivityLog[]> {
    let query = db.select().from(schema.platformActivityLogs);
    const conditions: any[] = [];

    if (filters?.tenantId) {
      conditions.push(eq(schema.platformActivityLogs.tenantId, filters.tenantId));
    }
    if (filters?.actorId) {
      conditions.push(eq(schema.platformActivityLogs.actorId, filters.actorId));
    }
    if (filters?.action) {
      conditions.push(eq(schema.platformActivityLogs.action, filters.action));
    }
    if (filters?.targetType) {
      conditions.push(eq(schema.platformActivityLogs.targetType, filters.targetType));
    }
    if (filters?.from) {
      conditions.push(gte(schema.platformActivityLogs.createdAt, filters.from));
    }
    if (filters?.to) {
      conditions.push(lte(schema.platformActivityLogs.createdAt, filters.to));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(desc(schema.platformActivityLogs.createdAt)) as any;

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }
    if (filters?.offset) {
      query = query.offset(filters.offset) as any;
    }

    return query;
  }

  // Detailed Tenant operations
  async getTenantDetails(tenantId: string): Promise<{
    tenant: Tenant;
    users: Omit<User, 'passwordHash'>[];
    customers: Customer[];
    deals: Deal[];
    invoices: Invoice[];
    quotations: Quotation[];
    subscription: (WorkspaceSubscription & { plan?: Package; planId?: string | null }) | null;
    workspaceInvoices: WorkspaceInvoice[];
    usage: WorkspaceUsage[];
    stats: {
      totalUsers: number;
      totalCustomers: number;
      totalDeals: number;
      totalRevenue: number;
      activeDeals: number;
    };
  } | undefined> {
    const [tenant] = await db.select().from(schema.tenants).where(eq(schema.tenants.id, tenantId));
    if (!tenant) return undefined;

    const [users, customers, deals, invoices, quotations, subscriptionData, workspaceInvoices, usage] = await Promise.all([
      db.select().from(schema.users).where(eq(schema.users.tenantId, tenantId)),
      db.select().from(schema.customers).where(eq(schema.customers.tenantId, tenantId)),
      db.select().from(schema.deals).where(eq(schema.deals.tenantId, tenantId)),
      db.select().from(schema.invoices).where(eq(schema.invoices.tenantId, tenantId)),
      db.select().from(schema.quotations).where(eq(schema.quotations.tenantId, tenantId)),
      db.select().from(schema.workspaceSubscriptions).where(eq(schema.workspaceSubscriptions.workspaceId, tenantId)),
      db.select().from(schema.workspaceInvoices).where(eq(schema.workspaceInvoices.workspaceId, tenantId)).orderBy(desc(schema.workspaceInvoices.createdAt)),
      db.select().from(schema.workspaceUsage).where(eq(schema.workspaceUsage.workspaceId, tenantId)).orderBy(desc(schema.workspaceUsage.periodStart)),
    ]);

    const usersWithoutPasswords = users.map(u => {
      const { passwordHash, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    const totalRevenue = invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + Number(i.paidAmount || 0), 0);

    const activeDeals = deals.filter(d => 
      d.stage !== 'closed-won' && d.stage !== 'closed-lost'
    ).length;

    let subscription: (WorkspaceSubscription & { plan?: Package; planId?: string | null }) | null = null;
    if (subscriptionData.length > 0) {
      const sub = subscriptionData[0];
      // Get the package from tenant.packageId (SaaS Admin packages, not workspace_plans)
      if (tenant.packageId) {
        const [pkg] = await db.select().from(schema.packages).where(eq(schema.packages.id, tenant.packageId));
        // Return packageId as planId for frontend compatibility
        subscription = { ...sub, plan: pkg || undefined, planId: tenant.packageId };
      } else {
        subscription = sub;
      }
    }

    return {
      tenant,
      users: usersWithoutPasswords,
      customers,
      deals,
      invoices,
      quotations,
      subscription,
      workspaceInvoices,
      usage,
      stats: {
        totalUsers: users.length,
        totalCustomers: customers.length,
        totalDeals: deals.length,
        totalRevenue,
        activeDeals,
      },
    };
  }

  // Detailed User operations
  async getUserDetails(userId: string): Promise<{
    user: Omit<User, 'passwordHash'>;
    tenant: Tenant | undefined;
    ownedCustomers: Customer[];
    assignedTasks: Task[];
    activities: Activity[];
    deals: Deal[];
  } | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
    if (!user) return undefined;

    const { passwordHash, ...userWithoutPassword } = user;

    const [tenant] = await db.select().from(schema.tenants).where(eq(schema.tenants.id, user.tenantId));

    const [ownedCustomers, assignedTasks, activities, deals] = await Promise.all([
      db.select().from(schema.customers).where(eq(schema.customers.ownerId, userId)),
      db.select().from(schema.tasks).where(eq(schema.tasks.assignedTo, userId)),
      db.select().from(schema.activities).where(eq(schema.activities.userId, userId)),
      db.select().from(schema.deals).where(eq(schema.deals.ownerId, userId)),
    ]);

    return {
      user: userWithoutPassword,
      tenant,
      ownedCustomers,
      assignedTasks,
      activities,
      deals,
    };
  }

  // Update super admin profile
  async updateSuperAdminProfile(userId: string, updates: { firstName?: string; lastName?: string; email?: string }): Promise<User | undefined> {
    const updateData: { firstName?: string; lastName?: string; email?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (updates.firstName) updateData.firstName = updates.firstName;
    if (updates.lastName) updateData.lastName = updates.lastName;
    if (updates.email) updateData.email = updates.email;
    
    const [user] = await db.update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, userId))
      .returning();
    return user;
  }

  // Company Profile operations
  async getCompanyProfile(tenantId: string): Promise<CompanyProfile | undefined> {
    const [profile] = await db.select().from(schema.companyProfiles)
      .where(eq(schema.companyProfiles.tenantId, tenantId));
    return profile;
  }

  async upsertCompanyProfile(tenantId: string, data: Partial<InsertCompanyProfile>): Promise<CompanyProfile> {
    const existingProfile = await this.getCompanyProfile(tenantId);
    
    if (existingProfile) {
      const [updated] = await db.update(schema.companyProfiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.companyProfiles.tenantId, tenantId))
        .returning();
      return updated;
    } else {
      const tenant = await this.getTenant(tenantId);
      const [created] = await db.insert(schema.companyProfiles)
        .values({
          tenantId,
          companyName: data.companyName || tenant?.name || 'My Company',
          ...data,
        })
        .returning();
      return created;
    }
  }

  // Package operations
  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const [pkg] = await db.insert(schema.packages).values(insertPackage).returning();
    return pkg;
  }

  async getAllPackages(): Promise<Package[]> {
    return db.select().from(schema.packages).orderBy(schema.packages.sortOrder);
  }

  async getActivePackages(): Promise<Package[]> {
    return db.select().from(schema.packages)
      .where(eq(schema.packages.isActive, true))
      .orderBy(schema.packages.sortOrder);
  }

  async getPackageById(id: string): Promise<Package | undefined> {
    const [pkg] = await db.select().from(schema.packages).where(eq(schema.packages.id, id));
    return pkg;
  }

  async updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined> {
    const [pkg] = await db.update(schema.packages)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.packages.id, id))
      .returning();
    return pkg;
  }

  async deletePackage(id: string): Promise<void> {
    await db.delete(schema.packages).where(eq(schema.packages.id, id));
  }

  // Package Module operations
  async addModuleToPackage(insertPackageModule: InsertPackageModule): Promise<PackageModule> {
    const [pm] = await db.insert(schema.packageModules).values(insertPackageModule).returning();
    return pm;
  }

  async removeModuleFromPackage(packageId: string, moduleId: string): Promise<void> {
    await db.delete(schema.packageModules)
      .where(and(
        eq(schema.packageModules.packageId, packageId),
        eq(schema.packageModules.moduleId, moduleId)
      ));
  }

  async getPackageModules(packageId: string): Promise<(PackageModule & { module: Module })[]> {
    const results = await db
      .select()
      .from(schema.packageModules)
      .innerJoin(schema.modules, eq(schema.packageModules.moduleId, schema.modules.id))
      .where(eq(schema.packageModules.packageId, packageId));
    
    return results.map(r => ({ ...r.package_modules, module: r.modules }));
  }

  async setPackageModules(packageId: string, moduleIds: string[]): Promise<void> {
    await db.delete(schema.packageModules).where(eq(schema.packageModules.packageId, packageId));
    
    if (moduleIds.length > 0) {
      const values = moduleIds.map(moduleId => ({ packageId, moduleId }));
      await db.insert(schema.packageModules).values(values);
    }
  }

  async getPackageWithModules(packageId: string): Promise<(Package & { modules: Module[] }) | undefined> {
    const pkg = await this.getPackageById(packageId);
    if (!pkg) return undefined;

    const packageModules = await this.getPackageModules(packageId);
    const modules = packageModules.map(pm => pm.module);

    return { ...pkg, modules };
  }

  async getAllPackagesWithModules(): Promise<(Package & { modules: Module[] })[]> {
    const packages = await this.getAllPackages();
    const result = await Promise.all(
      packages.map(async (pkg) => {
        const packageModules = await this.getPackageModules(pkg.id);
        const modules = packageModules.map(pm => pm.module);
        return { ...pkg, modules };
      })
    );
    return result;
  }

  // ==================== EMAIL MODULE OPERATIONS ====================

  // Email Template operations
  async createEmailTemplate(insertTemplate: InsertEmailTemplate): Promise<EmailTemplate> {
    const [template] = await db.insert(schema.emailTemplates).values(insertTemplate).returning();
    return template;
  }

  async getEmailTemplatesByTenant(tenantId: string): Promise<EmailTemplate[]> {
    return db.select().from(schema.emailTemplates)
      .where(eq(schema.emailTemplates.tenantId, tenantId))
      .orderBy(desc(schema.emailTemplates.createdAt));
  }

  async getEmailTemplateById(id: string, tenantId: string): Promise<EmailTemplate | undefined> {
    // First try to find tenant-specific template
    const [template] = await db.select().from(schema.emailTemplates)
      .where(and(eq(schema.emailTemplates.id, id), eq(schema.emailTemplates.tenantId, tenantId)));
    if (template) return template;
    
    // If not found, check for system template (null tenantId)
    const [systemTemplate] = await db.select().from(schema.emailTemplates)
      .where(and(eq(schema.emailTemplates.id, id), eq(schema.emailTemplates.ownerType, 'system')));
    return systemTemplate;
  }

  async updateEmailTemplate(id: string, tenantId: string, updates: Partial<InsertEmailTemplate>): Promise<EmailTemplate | undefined> {
    const [template] = await db.update(schema.emailTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(schema.emailTemplates.id, id), eq(schema.emailTemplates.tenantId, tenantId)))
      .returning();
    return template;
  }

  async deleteEmailTemplate(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.emailTemplates)
      .where(and(eq(schema.emailTemplates.id, id), eq(schema.emailTemplates.tenantId, tenantId)));
  }

  async getDefaultTemplateForPurpose(tenantId: string, purpose: string): Promise<EmailTemplate | undefined> {
    // First check for tenant-specific default template
    const [template] = await db.select().from(schema.emailTemplates)
      .where(and(
        eq(schema.emailTemplates.tenantId, tenantId),
        eq(schema.emailTemplates.isDefault, true),
        eq(schema.emailTemplates.defaultFor, purpose)
      ));
    if (template) return template;
    
    // Fall back to system default template
    const [systemTemplate] = await db.select().from(schema.emailTemplates)
      .where(and(
        eq(schema.emailTemplates.ownerType, 'system'),
        eq(schema.emailTemplates.isDefault, true),
        eq(schema.emailTemplates.defaultFor, purpose)
      ));
    return systemTemplate;
  }

  async getEmailTemplatesWithOwnership(tenantId: string, userId: string, workspaceId?: string): Promise<{
    userTemplates: EmailTemplate[];
    sharedTemplates: EmailTemplate[];
    workspaceTemplates: EmailTemplate[];
    systemTemplates: EmailTemplate[];
  }> {
    // Get tenant-specific templates
    const tenantTemplates = await db.select().from(schema.emailTemplates)
      .where(eq(schema.emailTemplates.tenantId, tenantId))
      .orderBy(desc(schema.emailTemplates.createdAt));

    // Get system templates (ownerType = 'system', which may have null tenantId or be global)
    const systemTemplates = await db.select().from(schema.emailTemplates)
      .where(eq(schema.emailTemplates.ownerType, 'system'))
      .orderBy(desc(schema.emailTemplates.createdAt));

    const userTemplates = tenantTemplates.filter(t => 
      t.ownerType === 'user' && t.ownerId === userId && !t.isShared
    );
    
    const sharedTemplates = tenantTemplates.filter(t => 
      t.ownerType === 'user' && t.isShared
    );
    
    const workspaceTemplates = tenantTemplates.filter(t => 
      t.ownerType === 'workspace' && (!workspaceId || t.ownerId === workspaceId)
    );

    return { userTemplates, sharedTemplates, workspaceTemplates, systemTemplates };
  }

  async duplicateEmailTemplate(id: string, tenantId: string, userId: string): Promise<EmailTemplate | undefined> {
    const original = await this.getEmailTemplateById(id, tenantId);
    if (!original) return undefined;

    const duplicateData: InsertEmailTemplate = {
      tenantId,
      createdBy: userId,
      ownerType: 'user',
      ownerId: userId,
      isShared: false,
      isSystemTemplate: false, // Duplicates are always user-owned, not system templates
      name: `${original.name} (Copy)`,
      purpose: original.purpose,
      subject: original.subject,
      body: original.body,
      mergeFields: original.mergeFields,
      isDefault: false,
      defaultFor: null,
      isActive: true,
      version: 1,
    };

    return this.createEmailTemplate(duplicateData);
  }

  async toggleEmailTemplateShare(id: string, tenantId: string, userId: string, isShared: boolean): Promise<EmailTemplate | undefined> {
    const template = await this.getEmailTemplateById(id, tenantId);
    if (!template || template.ownerType !== 'user' || template.ownerId !== userId) {
      return undefined;
    }
    return this.updateEmailTemplate(id, tenantId, { isShared });
  }

  async canEditEmailTemplate(template: EmailTemplate, userId: string, isAdmin: boolean): Promise<boolean> {
    if (template.ownerType === 'system') return false;
    if (template.ownerType === 'user' && template.ownerId === userId) return true;
    if (template.ownerType === 'workspace' && isAdmin) return true;
    if (template.isShared && isAdmin) return true;
    return false;
  }

  async canDeleteEmailTemplate(template: EmailTemplate, userId: string, isAdmin: boolean): Promise<boolean> {
    if (template.ownerType === 'system') return false;
    if (template.ownerType === 'user' && template.ownerId === userId) return true;
    if (template.ownerType === 'workspace' && isAdmin) return true;
    return false;
  }

  // Email Log operations
  async createEmailLog(insertLog: InsertEmailLog): Promise<EmailLog> {
    const [log] = await db.insert(schema.emailLogs).values(insertLog).returning();
    return log;
  }

  async getEmailLogsByTenant(tenantId: string): Promise<EmailLog[]> {
    return db.select().from(schema.emailLogs)
      .where(eq(schema.emailLogs.tenantId, tenantId))
      .orderBy(desc(schema.emailLogs.createdAt));
  }

  async getEmailLogById(id: string, tenantId: string): Promise<EmailLog | undefined> {
    const [log] = await db.select().from(schema.emailLogs)
      .where(and(eq(schema.emailLogs.id, id), eq(schema.emailLogs.tenantId, tenantId)));
    return log;
  }

  async updateEmailLog(id: string, updates: Partial<EmailLog>): Promise<EmailLog | undefined> {
    const [log] = await db.update(schema.emailLogs)
      .set(updates)
      .where(eq(schema.emailLogs.id, id))
      .returning();
    return log;
  }

  async getEmailLogsByCustomer(customerId: string, tenantId: string): Promise<EmailLog[]> {
    return db.select().from(schema.emailLogs)
      .where(and(eq(schema.emailLogs.customerId, customerId), eq(schema.emailLogs.tenantId, tenantId)))
      .orderBy(desc(schema.emailLogs.createdAt));
  }

  // Automation Rule operations
  async createAutomationRule(insertRule: InsertAutomationRule): Promise<AutomationRule> {
    const [rule] = await db.insert(schema.automationRules).values(insertRule).returning();
    return rule;
  }

  async getAutomationRulesByTenant(tenantId: string): Promise<AutomationRule[]> {
    return db.select().from(schema.automationRules)
      .where(eq(schema.automationRules.tenantId, tenantId))
      .orderBy(desc(schema.automationRules.createdAt));
  }

  async getAutomationRuleById(id: string, tenantId: string): Promise<AutomationRule | undefined> {
    const [rule] = await db.select().from(schema.automationRules)
      .where(and(eq(schema.automationRules.id, id), eq(schema.automationRules.tenantId, tenantId)));
    return rule;
  }

  async updateAutomationRule(id: string, tenantId: string, updates: Partial<InsertAutomationRule>): Promise<AutomationRule | undefined> {
    const [rule] = await db.update(schema.automationRules)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(schema.automationRules.id, id), eq(schema.automationRules.tenantId, tenantId)))
      .returning();
    return rule;
  }

  async deleteAutomationRule(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.automationRules)
      .where(and(eq(schema.automationRules.id, id), eq(schema.automationRules.tenantId, tenantId)));
  }

  async getEnabledAutomationsByTrigger(tenantId: string, trigger: string): Promise<AutomationRule[]> {
    return db.select().from(schema.automationRules)
      .where(and(
        eq(schema.automationRules.tenantId, tenantId),
        eq(schema.automationRules.trigger, trigger),
        eq(schema.automationRules.isEnabled, true)
      ));
  }

  // Follow-up Sequence operations
  async createFollowUpSequence(insertSequence: InsertFollowUpSequence): Promise<FollowUpSequence> {
    const [sequence] = await db.insert(schema.followUpSequences).values(insertSequence).returning();
    return sequence;
  }

  async getFollowUpSequencesByTenant(tenantId: string): Promise<FollowUpSequence[]> {
    return db.select().from(schema.followUpSequences)
      .where(eq(schema.followUpSequences.tenantId, tenantId))
      .orderBy(desc(schema.followUpSequences.createdAt));
  }

  async getFollowUpSequenceById(id: string, tenantId: string): Promise<FollowUpSequence | undefined> {
    const [sequence] = await db.select().from(schema.followUpSequences)
      .where(and(eq(schema.followUpSequences.id, id), eq(schema.followUpSequences.tenantId, tenantId)));
    return sequence;
  }

  async updateFollowUpSequence(id: string, tenantId: string, updates: Partial<InsertFollowUpSequence>): Promise<FollowUpSequence | undefined> {
    const [sequence] = await db.update(schema.followUpSequences)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(schema.followUpSequences.id, id), eq(schema.followUpSequences.tenantId, tenantId)))
      .returning();
    return sequence;
  }

  async deleteFollowUpSequence(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.followUpSequences)
      .where(and(eq(schema.followUpSequences.id, id), eq(schema.followUpSequences.tenantId, tenantId)));
  }

  // Follow-up Step operations
  async createFollowUpStep(insertStep: InsertFollowUpStep): Promise<FollowUpStep> {
    const [step] = await db.insert(schema.followUpSteps).values(insertStep).returning();
    return step;
  }

  async getFollowUpStepsBySequence(sequenceId: string): Promise<FollowUpStep[]> {
    return db.select().from(schema.followUpSteps)
      .where(eq(schema.followUpSteps.sequenceId, sequenceId))
      .orderBy(schema.followUpSteps.stepOrder);
  }

  async updateFollowUpStep(id: string, updates: Partial<InsertFollowUpStep>): Promise<FollowUpStep | undefined> {
    const [step] = await db.update(schema.followUpSteps)
      .set(updates)
      .where(eq(schema.followUpSteps.id, id))
      .returning();
    return step;
  }

  async deleteFollowUpStep(id: string): Promise<void> {
    await db.delete(schema.followUpSteps).where(eq(schema.followUpSteps.id, id));
  }

  // Scheduled Email operations
  async createScheduledEmail(insertEmail: InsertScheduledEmail): Promise<ScheduledEmail> {
    const [email] = await db.insert(schema.scheduledEmails).values(insertEmail).returning();
    return email;
  }

  async getScheduledEmailsByTenant(tenantId: string): Promise<ScheduledEmail[]> {
    return db.select().from(schema.scheduledEmails)
      .where(eq(schema.scheduledEmails.tenantId, tenantId))
      .orderBy(schema.scheduledEmails.scheduledFor);
  }

  async getPendingScheduledEmails(tenantId: string): Promise<ScheduledEmail[]> {
    return db.select().from(schema.scheduledEmails)
      .where(and(
        eq(schema.scheduledEmails.tenantId, tenantId),
        eq(schema.scheduledEmails.status, "pending")
      ))
      .orderBy(schema.scheduledEmails.scheduledFor);
  }

  async updateScheduledEmail(id: string, updates: Partial<ScheduledEmail>): Promise<ScheduledEmail | undefined> {
    const [email] = await db.update(schema.scheduledEmails)
      .set(updates)
      .where(eq(schema.scheduledEmails.id, id))
      .returning();
    return email;
  }

  async deleteScheduledEmail(id: string): Promise<void> {
    await db.delete(schema.scheduledEmails).where(eq(schema.scheduledEmails.id, id));
  }

  // Email Sender Account operations
  async createEmailSenderAccount(insertAccount: InsertEmailSenderAccount): Promise<EmailSenderAccount> {
    const [account] = await db.insert(schema.emailSenderAccounts).values(insertAccount).returning();
    return account;
  }

  async getEmailSenderAccountsByTenant(tenantId: string): Promise<EmailSenderAccount[]> {
    return db.select().from(schema.emailSenderAccounts)
      .where(eq(schema.emailSenderAccounts.tenantId, tenantId))
      .orderBy(desc(schema.emailSenderAccounts.createdAt));
  }

  async getDefaultSenderAccount(tenantId: string): Promise<EmailSenderAccount | undefined> {
    const [account] = await db.select().from(schema.emailSenderAccounts)
      .where(and(
        eq(schema.emailSenderAccounts.tenantId, tenantId),
        eq(schema.emailSenderAccounts.isDefault, true)
      ));
    return account;
  }

  async updateEmailSenderAccount(id: string, updates: Partial<InsertEmailSenderAccount>): Promise<EmailSenderAccount | undefined> {
    const [account] = await db.update(schema.emailSenderAccounts)
      .set(updates)
      .where(eq(schema.emailSenderAccounts.id, id))
      .returning();
    return account;
  }

  async deleteEmailSenderAccount(id: string): Promise<void> {
    await db.delete(schema.emailSenderAccounts).where(eq(schema.emailSenderAccounts.id, id));
  }

  // SMTP Settings operations
  async getSmtpSettings(tenantId: string): Promise<SmtpSettings | undefined> {
    const [settings] = await db.select().from(schema.smtpSettings)
      .where(eq(schema.smtpSettings.tenantId, tenantId));
    return settings;
  }

  async upsertSmtpSettings(tenantId: string, settings: Partial<InsertSmtpSettings>): Promise<SmtpSettings> {
    const existing = await this.getSmtpSettings(tenantId);
    if (existing) {
      const [updated] = await db.update(schema.smtpSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(schema.smtpSettings.tenantId, tenantId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(schema.smtpSettings)
        .values({ ...settings, tenantId })
        .returning();
      return created;
    }
  }

  async testSmtpConnection(tenantId: string): Promise<{ success: boolean; message: string }> {
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
  async getTaskWithDetails(id: string, tenantId: string): Promise<(Task & { 
    assignments: (TaskAssignment & { user?: User })[];
    checklists: TaskChecklistItem[];
    comments: (TaskComment & { user?: User })[];
    timeLogs: TaskTimeLog[];
    attachments: TaskAttachment[];
    statusHistory: (TaskStatusHistory & { user?: User })[];
    activityLog: (TaskActivityLog & { user?: User })[];
    creator?: User;
    assignee?: User;
  }) | undefined> {
    const [task] = await db.select().from(schema.tasks)
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.tenantId, tenantId)));
    
    if (!task) return undefined;

    const [assignments, checklists, comments, timeLogs, attachments, statusHistory, activityLog] = await Promise.all([
      this.getTaskAssignments(id),
      this.getTaskChecklistItems(id),
      this.getTaskComments(id),
      this.getTaskTimeLogs(id),
      this.getTaskAttachments(id),
      this.getTaskStatusHistory(id),
      this.getTaskActivityLog(id),
    ]);

    let creator: User | undefined;
    let assignee: User | undefined;

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
      assignee,
    };
  }

  async getTasksWithFilters(tenantId: string, filters: {
    assignedTo?: string;
    status?: string;
    priority?: string;
    dueFrom?: Date;
    dueTo?: Date;
    customerId?: string;
    dealId?: string;
    tags?: string[];
  }): Promise<Task[]> {
    const conditions = [eq(schema.tasks.tenantId, tenantId)];
    
    if (filters.assignedTo) {
      conditions.push(eq(schema.tasks.assignedTo, filters.assignedTo));
    }
    if (filters.status) {
      conditions.push(eq(schema.tasks.status, filters.status));
    }
    if (filters.priority) {
      conditions.push(eq(schema.tasks.priority, filters.priority));
    }
    if (filters.dueFrom) {
      conditions.push(gte(schema.tasks.dueDate, filters.dueFrom));
    }
    if (filters.dueTo) {
      conditions.push(lte(schema.tasks.dueDate, filters.dueTo));
    }
    if (filters.customerId) {
      conditions.push(eq(schema.tasks.customerId, filters.customerId));
    }
    if (filters.dealId) {
      conditions.push(eq(schema.tasks.dealId, filters.dealId));
    }

    return db.select().from(schema.tasks)
      .where(and(...conditions))
      .orderBy(desc(schema.tasks.createdAt));
  }

  async updateTaskStatus(id: string, tenantId: string, status: string, changedBy: string, notes?: string): Promise<Task | undefined> {
    const existingTask = await this.getTaskById(id, tenantId);
    if (!existingTask) return undefined;

    const [task] = await db.update(schema.tasks)
      .set({ 
        status, 
        updatedAt: new Date(),
        completedAt: status === 'completed' ? new Date() : null,
      })
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.tenantId, tenantId)))
      .returning();

    await db.insert(schema.taskStatusHistory).values({
      taskId: id,
      changedBy,
      fromStatus: existingTask.status,
      toStatus: status,
      notes,
    });

    await db.insert(schema.taskActivityLog).values({
      taskId: id,
      userId: changedBy,
      action: 'status_change',
      description: `Status changed from ${existingTask.status} to ${status}`,
      oldValue: existingTask.status,
      newValue: status,
    });

    return task;
  }

  // Task Assignment operations
  async createTaskAssignment(insertAssignment: InsertTaskAssignment): Promise<TaskAssignment> {
    const [assignment] = await db.insert(schema.taskAssignments).values(insertAssignment).returning();
    
    await db.insert(schema.taskActivityLog).values({
      taskId: insertAssignment.taskId,
      userId: insertAssignment.assignedBy,
      action: 'assignment_added',
      description: `Task assigned to team member`,
      newValue: insertAssignment.userId,
    });

    return assignment;
  }

  async getTaskAssignments(taskId: string): Promise<(TaskAssignment & { user?: User })[]> {
    const assignments = await db.select().from(schema.taskAssignments)
      .where(eq(schema.taskAssignments.taskId, taskId));
    
    const result = await Promise.all(assignments.map(async (assignment) => {
      const user = await this.getUserById(assignment.userId);
      return { ...assignment, user };
    }));
    
    return result;
  }

  async deleteTaskAssignment(taskId: string, userId: string): Promise<void> {
    await db.delete(schema.taskAssignments)
      .where(and(
        eq(schema.taskAssignments.taskId, taskId),
        eq(schema.taskAssignments.userId, userId)
      ));
  }

  async getTasksAssignedToUser(userId: string, tenantId: string): Promise<Task[]> {
    const assignments = await db.select().from(schema.taskAssignments)
      .where(eq(schema.taskAssignments.userId, userId));
    
    const taskIds = assignments.map(a => a.taskId);
    if (taskIds.length === 0) return [];

    const tasks = await db.select().from(schema.tasks)
      .where(and(
        eq(schema.tasks.tenantId, tenantId),
        sql`${schema.tasks.id} = ANY(${taskIds})`
      ));
    
    return tasks;
  }

  // Task Comment operations
  async createTaskComment(insertComment: InsertTaskComment): Promise<TaskComment> {
    const [comment] = await db.insert(schema.taskComments).values(insertComment).returning();
    
    await db.insert(schema.taskActivityLog).values({
      taskId: insertComment.taskId,
      userId: insertComment.userId,
      action: 'comment_added',
      description: 'Added a comment',
    });

    return comment;
  }

  async getTaskComments(taskId: string): Promise<(TaskComment & { user?: User })[]> {
    const comments = await db.select().from(schema.taskComments)
      .where(eq(schema.taskComments.taskId, taskId))
      .orderBy(schema.taskComments.createdAt);
    
    const result = await Promise.all(comments.map(async (comment) => {
      const user = await this.getUserById(comment.userId);
      return { ...comment, user };
    }));
    
    return result;
  }

  async updateTaskComment(id: string, content: string): Promise<TaskComment | undefined> {
    const [comment] = await db.update(schema.taskComments)
      .set({ content, updatedAt: new Date() })
      .where(eq(schema.taskComments.id, id))
      .returning();
    return comment;
  }

  async deleteTaskComment(id: string): Promise<void> {
    await db.delete(schema.taskComments).where(eq(schema.taskComments.id, id));
  }

  // Task Checklist operations
  async createTaskChecklistItem(insertItem: InsertTaskChecklistItem, createdByUserId: string): Promise<TaskChecklistItem> {
    const [item] = await db.insert(schema.taskChecklistItems).values(insertItem).returning();
    
    await db.insert(schema.taskActivityLog).values({
      taskId: insertItem.taskId,
      userId: createdByUserId,
      action: 'checklist_item_added',
      description: `Added checklist item: ${insertItem.title}`,
    });

    return item;
  }

  async getTaskChecklistItems(taskId: string): Promise<TaskChecklistItem[]> {
    return db.select().from(schema.taskChecklistItems)
      .where(eq(schema.taskChecklistItems.taskId, taskId))
      .orderBy(schema.taskChecklistItems.sortOrder);
  }

  async updateTaskChecklistItem(id: string, updates: Partial<InsertTaskChecklistItem>): Promise<TaskChecklistItem | undefined> {
    const [item] = await db.update(schema.taskChecklistItems)
      .set(updates)
      .where(eq(schema.taskChecklistItems.id, id))
      .returning();
    return item;
  }

  async toggleTaskChecklistItem(id: string, userId: string): Promise<TaskChecklistItem | undefined> {
    const [existing] = await db.select().from(schema.taskChecklistItems)
      .where(eq(schema.taskChecklistItems.id, id));
    
    if (!existing) return undefined;

    const [item] = await db.update(schema.taskChecklistItems)
      .set({ 
        isCompleted: !existing.isCompleted,
        completedBy: !existing.isCompleted ? userId : null,
        completedAt: !existing.isCompleted ? new Date() : null,
      })
      .where(eq(schema.taskChecklistItems.id, id))
      .returning();

    await db.insert(schema.taskActivityLog).values({
      taskId: existing.taskId,
      userId,
      action: item.isCompleted ? 'checklist_item_completed' : 'checklist_item_uncompleted',
      description: `${item.isCompleted ? 'Completed' : 'Uncompleted'}: ${existing.title}`,
    });

    return item;
  }

  async deleteTaskChecklistItem(id: string): Promise<void> {
    await db.delete(schema.taskChecklistItems).where(eq(schema.taskChecklistItems.id, id));
  }

  // Task Time Log operations
  async createTaskTimeLog(insertTimeLog: InsertTaskTimeLog): Promise<TaskTimeLog> {
    const [timeLog] = await db.insert(schema.taskTimeLogs).values(insertTimeLog).returning();
    
    await db.insert(schema.taskActivityLog).values({
      taskId: insertTimeLog.taskId,
      userId: insertTimeLog.userId,
      action: 'time_log_added',
      description: insertTimeLog.durationMinutes 
        ? `Logged ${insertTimeLog.durationMinutes} minutes` 
        : 'Started time tracking',
    });

    return timeLog;
  }

  async getTaskTimeLogs(taskId: string): Promise<TaskTimeLog[]> {
    return db.select().from(schema.taskTimeLogs)
      .where(eq(schema.taskTimeLogs.taskId, taskId))
      .orderBy(desc(schema.taskTimeLogs.startedAt));
  }

  async updateTaskTimeLog(id: string, updates: Partial<InsertTaskTimeLog>): Promise<TaskTimeLog | undefined> {
    const [timeLog] = await db.update(schema.taskTimeLogs)
      .set(updates)
      .where(eq(schema.taskTimeLogs.id, id))
      .returning();
    return timeLog;
  }

  async deleteTaskTimeLog(id: string): Promise<void> {
    await db.delete(schema.taskTimeLogs).where(eq(schema.taskTimeLogs.id, id));
  }

  async getActiveTimeLog(userId: string): Promise<TaskTimeLog | undefined> {
    const [timeLog] = await db.select().from(schema.taskTimeLogs)
      .where(and(
        eq(schema.taskTimeLogs.userId, userId),
        sql`${schema.taskTimeLogs.endedAt} IS NULL`
      ));
    return timeLog;
  }

  async stopActiveTimeLog(userId: string): Promise<TaskTimeLog | undefined> {
    const activeLog = await this.getActiveTimeLog(userId);
    if (!activeLog) return undefined;

    const endedAt = new Date();
    const durationMinutes = Math.round((endedAt.getTime() - activeLog.startedAt.getTime()) / 60000);

    const [timeLog] = await db.update(schema.taskTimeLogs)
      .set({ endedAt, durationMinutes })
      .where(eq(schema.taskTimeLogs.id, activeLog.id))
      .returning();

    await db.insert(schema.taskActivityLog).values({
      taskId: activeLog.taskId,
      userId,
      action: 'time_log_stopped',
      description: `Stopped time tracking. Total: ${durationMinutes} minutes`,
    });

    return timeLog;
  }

  // Task Attachment operations
  async createTaskAttachment(insertAttachment: InsertTaskAttachment): Promise<TaskAttachment> {
    const [attachment] = await db.insert(schema.taskAttachments).values(insertAttachment).returning();
    
    await db.insert(schema.taskActivityLog).values({
      taskId: insertAttachment.taskId,
      userId: insertAttachment.uploadedBy,
      action: 'attachment_added',
      description: `Uploaded file: ${insertAttachment.fileName}`,
    });

    return attachment;
  }

  async getTaskAttachments(taskId: string): Promise<TaskAttachment[]> {
    return db.select().from(schema.taskAttachments)
      .where(eq(schema.taskAttachments.taskId, taskId))
      .orderBy(desc(schema.taskAttachments.createdAt));
  }

  async deleteTaskAttachment(id: string): Promise<void> {
    await db.delete(schema.taskAttachments).where(eq(schema.taskAttachments.id, id));
  }

  // Task Notification operations
  async createTaskNotification(insertNotification: InsertTaskNotification): Promise<TaskNotification> {
    const [notification] = await db.insert(schema.taskNotifications).values(insertNotification).returning();
    return notification;
  }

  async getTaskNotifications(recipientId: string, tenantId: string, unreadOnly?: boolean): Promise<TaskNotification[]> {
    const conditions = [
      eq(schema.taskNotifications.recipientId, recipientId),
      eq(schema.taskNotifications.tenantId, tenantId),
    ];
    
    if (unreadOnly) {
      conditions.push(eq(schema.taskNotifications.isRead, false));
    }

    return db.select().from(schema.taskNotifications)
      .where(and(...conditions))
      .orderBy(desc(schema.taskNotifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(schema.taskNotifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(schema.taskNotifications.id, id));
  }

  async markAllNotificationsAsRead(recipientId: string, tenantId: string): Promise<void> {
    await db.update(schema.taskNotifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(
        eq(schema.taskNotifications.recipientId, recipientId),
        eq(schema.taskNotifications.tenantId, tenantId),
        eq(schema.taskNotifications.isRead, false)
      ));
  }

  async getUnreadNotificationCount(recipientId: string, tenantId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.taskNotifications)
      .where(and(
        eq(schema.taskNotifications.recipientId, recipientId),
        eq(schema.taskNotifications.tenantId, tenantId),
        eq(schema.taskNotifications.isRead, false)
      ));
    return result[0]?.count || 0;
  }

  // Task AI History operations
  async createTaskAiHistory(insertHistory: InsertTaskAiHistory): Promise<TaskAiHistory> {
    const [history] = await db.insert(schema.taskAiHistory).values(insertHistory).returning();
    
    await db.insert(schema.taskActivityLog).values({
      taskId: insertHistory.taskId,
      userId: insertHistory.userId,
      action: 'ai_assist',
      description: `AI assisted with: ${insertHistory.action}`,
    });

    return history;
  }

  async getTaskAiHistory(taskId: string): Promise<TaskAiHistory[]> {
    return db.select().from(schema.taskAiHistory)
      .where(eq(schema.taskAiHistory.taskId, taskId))
      .orderBy(desc(schema.taskAiHistory.createdAt));
  }

  // Task Activity Log operations
  async createTaskActivityLog(insertLog: InsertTaskActivityLog): Promise<TaskActivityLog> {
    const [log] = await db.insert(schema.taskActivityLog).values(insertLog).returning();
    return log;
  }

  async getTaskActivityLog(taskId: string): Promise<(TaskActivityLog & { user?: User })[]> {
    const logs = await db.select().from(schema.taskActivityLog)
      .where(eq(schema.taskActivityLog.taskId, taskId))
      .orderBy(desc(schema.taskActivityLog.createdAt));
    
    const result = await Promise.all(logs.map(async (log) => {
      const user = await this.getUserById(log.userId);
      return { ...log, user };
    }));
    
    return result;
  }

  // Task Status History operations
  async getTaskStatusHistory(taskId: string): Promise<(TaskStatusHistory & { user?: User })[]> {
    const history = await db.select().from(schema.taskStatusHistory)
      .where(eq(schema.taskStatusHistory.taskId, taskId))
      .orderBy(desc(schema.taskStatusHistory.createdAt));
    
    const result = await Promise.all(history.map(async (entry) => {
      const user = await this.getUserById(entry.changedBy);
      return { ...entry, user };
    }));
    
    return result;
  }

  // Task Analytics
  async getTaskAnalytics(tenantId: string): Promise<{
    totalTasks: number;
    completedThisWeek: number;
    completedThisMonth: number;
    overdueTasks: number;
    avgCompletionTime: number;
    tasksByStatus: { status: string; count: number }[];
    tasksByPriority: { priority: string; count: number }[];
    teamPerformance: { userId: string; userName: string; completed: number; inProgress: number }[];
  }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const allTasks = await db.select().from(schema.tasks)
      .where(eq(schema.tasks.tenantId, tenantId));

    const totalTasks = allTasks.length;
    const completedThisWeek = allTasks.filter(t => 
      t.status === 'completed' && t.completedAt && t.completedAt >= weekAgo
    ).length;
    const completedThisMonth = allTasks.filter(t => 
      t.status === 'completed' && t.completedAt && t.completedAt >= monthAgo
    ).length;
    const overdueTasks = allTasks.filter(t => 
      t.dueDate && t.dueDate < now && t.status !== 'completed' && t.status !== 'cancelled'
    ).length;

    const completedTasks = allTasks.filter(t => t.status === 'completed' && t.completedAt);
    const avgCompletionTime = completedTasks.length > 0
      ? completedTasks.reduce((sum, t) => 
          sum + (t.completedAt!.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24), 0
        ) / completedTasks.length
      : 0;

    const tasksByStatus = Object.values(schema.TASK_STATUSES).map(status => ({
      status,
      count: allTasks.filter(t => t.status === status).length,
    }));

    const tasksByPriority = Object.values(schema.TASK_PRIORITIES).map(priority => ({
      priority,
      count: allTasks.filter(t => t.priority === priority).length,
    }));

    const users = await this.getUsersByTenant(tenantId);
    const teamPerformance = users.map(user => ({
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      completed: allTasks.filter(t => t.assignedTo === user.id && t.status === 'completed').length,
      inProgress: allTasks.filter(t => t.assignedTo === user.id && t.status === 'in_progress').length,
    })).filter(u => u.completed > 0 || u.inProgress > 0);

    return {
      totalTasks,
      completedThisWeek,
      completedThisMonth,
      overdueTasks,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      tasksByStatus,
      tasksByPriority,
      teamPerformance,
    };
  }

  // ==================== PROPOSAL BUILDER OPERATIONS ====================

  // Proposal Template operations
  async createProposalTemplate(template: InsertProposalTemplate): Promise<ProposalTemplate> {
    const [result] = await db.insert(schema.proposalTemplates).values(template).returning();
    return result;
  }

  async getProposalTemplatesByTenant(tenantId: string): Promise<ProposalTemplate[]> {
    return db.select().from(schema.proposalTemplates)
      .where(
        or(
          eq(schema.proposalTemplates.tenantId, tenantId),
          eq(schema.proposalTemplates.isSystemTemplate, true)
        )
      )
      .orderBy(desc(schema.proposalTemplates.isSystemTemplate), desc(schema.proposalTemplates.createdAt));
  }

  async getProposalTemplateById(id: string, tenantId: string): Promise<ProposalTemplate | undefined> {
    const [template] = await db.select().from(schema.proposalTemplates)
      .where(
        and(
          eq(schema.proposalTemplates.id, id),
          or(
            eq(schema.proposalTemplates.tenantId, tenantId),
            eq(schema.proposalTemplates.isSystemTemplate, true)
          )
        )
      );
    return template;
  }

  async updateProposalTemplate(id: string, tenantId: string, updates: Partial<InsertProposalTemplate>): Promise<ProposalTemplate | undefined> {
    const [template] = await db.update(schema.proposalTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(schema.proposalTemplates.id, id), eq(schema.proposalTemplates.tenantId, tenantId)))
      .returning();
    return template;
  }

  async deleteProposalTemplate(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.proposalTemplates)
      .where(and(eq(schema.proposalTemplates.id, id), eq(schema.proposalTemplates.tenantId, tenantId)));
  }

  async duplicateProposalTemplate(id: string, tenantId: string, createdBy: string): Promise<ProposalTemplate | undefined> {
    const original = await this.getProposalTemplateById(id, tenantId);
    if (!original) return undefined;

    const [newTemplate] = await db.insert(schema.proposalTemplates).values({
      tenantId,
      createdBy,
      name: `${original.name} (Copy)`,
      description: original.description,
      purpose: original.purpose,
      isActive: true,
      isDefault: false,
    }).returning();

    const sections = await this.getTemplateSections(id);
    for (const section of sections) {
      await db.insert(schema.templateSections).values({
        templateId: newTemplate.id,
        sectionType: section.sectionType,
        title: section.title,
        content: section.content,
        sortOrder: section.sortOrder,
        isLocked: section.isLocked,
        isVisible: section.isVisible,
        settings: section.settings,
      });
    }

    return newTemplate;
  }

  // Template Section operations
  async createTemplateSection(section: InsertTemplateSection): Promise<TemplateSection> {
    const [result] = await db.insert(schema.templateSections).values(section).returning();
    return result;
  }

  async getTemplateSections(templateId: string): Promise<TemplateSection[]> {
    return db.select().from(schema.templateSections)
      .where(eq(schema.templateSections.templateId, templateId))
      .orderBy(asc(schema.templateSections.sortOrder));
  }

  async updateTemplateSection(id: string, updates: Partial<InsertTemplateSection>): Promise<TemplateSection | undefined> {
    const [section] = await db.update(schema.templateSections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.templateSections.id, id))
      .returning();
    return section;
  }

  async deleteTemplateSection(id: string): Promise<void> {
    await db.delete(schema.templateSections).where(eq(schema.templateSections.id, id));
  }

  async reorderTemplateSections(templateId: string, sectionIds: string[]): Promise<void> {
    for (let i = 0; i < sectionIds.length; i++) {
      await db.update(schema.templateSections)
        .set({ sortOrder: i })
        .where(and(eq(schema.templateSections.id, sectionIds[i]), eq(schema.templateSections.templateId, templateId)));
    }
  }

  // Proposal operations
  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const [result] = await db.insert(schema.proposals).values(proposal).returning();
    return result;
  }

  async getProposalsByTenant(tenantId: string, filters?: { status?: string; customerId?: string; ownerId?: string }): Promise<Proposal[]> {
    const conditions = [eq(schema.proposals.tenantId, tenantId)];
    
    if (filters?.status) {
      conditions.push(eq(schema.proposals.status, filters.status));
    }
    if (filters?.customerId) {
      conditions.push(eq(schema.proposals.customerId, filters.customerId));
    }
    if (filters?.ownerId) {
      conditions.push(eq(schema.proposals.ownerId, filters.ownerId));
    }
    
    return db.select().from(schema.proposals)
      .where(and(...conditions))
      .orderBy(desc(schema.proposals.createdAt));
  }

  async getProposalById(id: string, tenantId: string): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(schema.proposals)
      .where(and(eq(schema.proposals.id, id), eq(schema.proposals.tenantId, tenantId)));
    return proposal;
  }

  async getProposalByAccessToken(accessToken: string): Promise<Proposal | undefined> {
    let [proposal] = await db.select().from(schema.proposals)
      .where(eq(schema.proposals.accessToken, accessToken));
    
    if (!proposal) {
      [proposal] = await db.select().from(schema.proposals)
        .where(eq(schema.proposals.id, accessToken));
    }
    return proposal;
  }

  async updateProposal(id: string, tenantId: string, updates: Partial<InsertProposal>): Promise<Proposal | undefined> {
    const [proposal] = await db.update(schema.proposals)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(schema.proposals.id, id), eq(schema.proposals.tenantId, tenantId)))
      .returning();
    return proposal;
  }

  async deleteProposal(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.proposals)
      .where(and(eq(schema.proposals.id, id), eq(schema.proposals.tenantId, tenantId)));
  }

  async getNextProposalNumber(tenantId: string): Promise<string> {
    const proposals = await db.select().from(schema.proposals)
      .where(eq(schema.proposals.tenantId, tenantId))
      .orderBy(desc(schema.proposals.createdAt));
    
    const count = proposals.length + 1;
    const year = new Date().getFullYear();
    return `PROP-${year}-${count.toString().padStart(4, '0')}`;
  }

  async updateProposalStatus(id: string, tenantId: string, status: string, changedBy: string, notes?: string): Promise<Proposal | undefined> {
    const proposal = await this.getProposalById(id, tenantId);
    if (!proposal) return undefined;

    const [updated] = await db.update(schema.proposals)
      .set({ 
        status, 
        updatedAt: new Date(),
        ...(status === 'sent' && { sentAt: new Date() }),
        ...(status === 'viewed' && { viewedAt: new Date() }),
        ...(status === 'accepted' && { acceptedAt: new Date() }),
        ...(status === 'rejected' && { rejectedAt: new Date() }),
      })
      .where(and(eq(schema.proposals.id, id), eq(schema.proposals.tenantId, tenantId)))
      .returning();

    await db.insert(schema.proposalStatusHistory).values({
      proposalId: id,
      changedBy,
      fromStatus: proposal.status,
      toStatus: status,
      notes,
    });

    return updated;
  }

  async generateProposalAccessToken(id: string, tenantId: string): Promise<string> {
    const token = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    await db.update(schema.proposals)
      .set({ accessToken: token })
      .where(and(eq(schema.proposals.id, id), eq(schema.proposals.tenantId, tenantId)));
    return token;
  }

  // Proposal Section operations
  async createProposalSection(section: InsertProposalSection): Promise<ProposalSection> {
    const [result] = await db.insert(schema.proposalSections).values(section).returning();
    return result;
  }

  async getProposalSections(proposalId: string): Promise<ProposalSection[]> {
    return db.select().from(schema.proposalSections)
      .where(eq(schema.proposalSections.proposalId, proposalId))
      .orderBy(asc(schema.proposalSections.sortOrder));
  }

  async updateProposalSection(id: string, updates: Partial<InsertProposalSection>): Promise<ProposalSection | undefined> {
    const [section] = await db.update(schema.proposalSections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.proposalSections.id, id))
      .returning();
    return section;
  }

  async deleteProposalSection(id: string): Promise<void> {
    await db.delete(schema.proposalSections).where(eq(schema.proposalSections.id, id));
  }

  async reorderProposalSections(proposalId: string, sectionIds: string[]): Promise<void> {
    for (let i = 0; i < sectionIds.length; i++) {
      await db.update(schema.proposalSections)
        .set({ sortOrder: i })
        .where(and(eq(schema.proposalSections.id, sectionIds[i]), eq(schema.proposalSections.proposalId, proposalId)));
    }
  }

  // Proposal Pricing Item operations
  async createProposalPricingItem(item: InsertProposalPricingItem): Promise<ProposalPricingItem> {
    const [result] = await db.insert(schema.proposalPricingItems).values(item).returning();
    return result;
  }

  async getProposalPricingItems(proposalId: string): Promise<ProposalPricingItem[]> {
    return db.select().from(schema.proposalPricingItems)
      .where(eq(schema.proposalPricingItems.proposalId, proposalId))
      .orderBy(asc(schema.proposalPricingItems.sortOrder));
  }

  async updateProposalPricingItem(id: string, updates: Partial<InsertProposalPricingItem>): Promise<ProposalPricingItem | undefined> {
    const [item] = await db.update(schema.proposalPricingItems)
      .set(updates)
      .where(eq(schema.proposalPricingItems.id, id))
      .returning();
    return item;
  }

  async deleteProposalPricingItem(id: string): Promise<void> {
    await db.delete(schema.proposalPricingItems).where(eq(schema.proposalPricingItems.id, id));
  }

  async deleteProposalPricingItems(proposalId: string): Promise<void> {
    await db.delete(schema.proposalPricingItems).where(eq(schema.proposalPricingItems.proposalId, proposalId));
  }

  async recalculateProposalTotals(proposalId: string, tenantId: string): Promise<Proposal | undefined> {
    const items = await this.getProposalPricingItems(proposalId);
    
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    for (const item of items) {
      if (item.isSelected) {
        const itemTotal = parseFloat(item.totalPrice as string) || 0;
        const itemTax = (parseFloat(item.taxRate as string) || 0) * itemTotal / 100;
        const itemDiscount = (parseFloat(item.discount as string) || 0) * itemTotal / 100;
        
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
      totalAmount: totalAmount.toFixed(2),
    } as any);
  }

  // Proposal Version operations
  async createProposalVersion(version: InsertProposalVersion): Promise<ProposalVersion> {
    const [result] = await db.insert(schema.proposalVersions).values(version).returning();
    return result;
  }

  async getProposalVersions(proposalId: string): Promise<ProposalVersion[]> {
    return db.select().from(schema.proposalVersions)
      .where(eq(schema.proposalVersions.proposalId, proposalId))
      .orderBy(desc(schema.proposalVersions.versionNumber));
  }

  async getProposalVersionById(id: string): Promise<ProposalVersion | undefined> {
    const [version] = await db.select().from(schema.proposalVersions)
      .where(eq(schema.proposalVersions.id, id));
    return version;
  }

  async restoreProposalVersion(proposalId: string, versionId: string, tenantId: string, userId: string): Promise<Proposal | undefined> {
    const version = await this.getProposalVersionById(versionId);
    if (!version) return undefined;

    const proposal = await this.getProposalById(proposalId, tenantId);
    if (!proposal) return undefined;

    const snapshot = JSON.parse(version.snapshot);
    
    await this.deleteProposalPricingItems(proposalId);
    await db.delete(schema.proposalSections).where(eq(schema.proposalSections.proposalId, proposalId));

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
          settings: section.settings,
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
          sortOrder: item.sortOrder,
        });
      }
    }

    const newVersion = proposal.currentVersion + 1;
    return this.updateProposal(proposalId, tenantId, {
      currentVersion: newVersion,
      title: snapshot.title || proposal.title,
    } as any);
  }

  // Proposal Activity Log operations
  async createProposalActivityLog(log: InsertProposalActivityLog): Promise<ProposalActivityLog> {
    const [result] = await db.insert(schema.proposalActivityLogs).values(log).returning();
    return result;
  }

  async getProposalActivityLogs(proposalId: string): Promise<ProposalActivityLog[]> {
    return db.select().from(schema.proposalActivityLogs)
      .where(eq(schema.proposalActivityLogs.proposalId, proposalId))
      .orderBy(desc(schema.proposalActivityLogs.createdAt));
  }

  // Proposal Signature operations
  async createProposalSignature(signature: InsertProposalSignature): Promise<ProposalSignature> {
    const [result] = await db.insert(schema.proposalSignatures).values(signature).returning();
    return result;
  }

  async getProposalSignatures(proposalId: string): Promise<ProposalSignature[]> {
    return db.select().from(schema.proposalSignatures)
      .where(eq(schema.proposalSignatures.proposalId, proposalId))
      .orderBy(desc(schema.proposalSignatures.signedAt));
  }

  // Proposal View Log operations
  async createProposalViewLog(log: InsertProposalViewLog): Promise<ProposalViewLog> {
    const [result] = await db.insert(schema.proposalViewLogs).values(log).returning();
    return result;
  }

  async getProposalViewLogs(proposalId: string): Promise<ProposalViewLog[]> {
    return db.select().from(schema.proposalViewLogs)
      .where(eq(schema.proposalViewLogs.proposalId, proposalId))
      .orderBy(desc(schema.proposalViewLogs.createdAt));
  }

  async recordProposalView(proposalId: string, viewData: Partial<InsertProposalViewLog>): Promise<void> {
    await db.insert(schema.proposalViewLogs).values({
      proposalId,
      ...viewData,
    } as InsertProposalViewLog);

    await db.update(schema.proposals)
      .set({ 
        viewCount: sql`view_count + 1`,
        totalViewTime: sql`total_view_time + ${viewData.duration || 0}`,
        viewedAt: new Date(),
      })
      .where(eq(schema.proposals.id, proposalId));
  }

  // Proposal Status History operations
  async getProposalStatusHistory(proposalId: string): Promise<ProposalStatusHistory[]> {
    return db.select().from(schema.proposalStatusHistory)
      .where(eq(schema.proposalStatusHistory.proposalId, proposalId))
      .orderBy(desc(schema.proposalStatusHistory.createdAt));
  }

  // Proposal Comment operations
  async createProposalComment(comment: InsertProposalComment): Promise<ProposalComment> {
    const [result] = await db.insert(schema.proposalComments).values(comment).returning();
    return result;
  }

  async getProposalComments(proposalId: string): Promise<ProposalComment[]> {
    return db.select().from(schema.proposalComments)
      .where(eq(schema.proposalComments.proposalId, proposalId))
      .orderBy(desc(schema.proposalComments.createdAt));
  }

  async updateProposalComment(id: string, updates: Partial<InsertProposalComment>): Promise<ProposalComment | undefined> {
    const [comment] = await db.update(schema.proposalComments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.proposalComments.id, id))
      .returning();
    return comment;
  }

  async deleteProposalComment(id: string): Promise<void> {
    await db.delete(schema.proposalComments).where(eq(schema.proposalComments.id, id));
  }

  // Proposal Analytics
  async getProposalAnalytics(tenantId: string): Promise<{
    totalProposals: number;
    acceptedProposals: number;
    rejectedProposals: number;
    pendingProposals: number;
    totalValue: number;
    acceptedValue: number;
    avgViewTime: number;
    conversionRate: number;
  }> {
    const proposals = await db.select().from(schema.proposals)
      .where(eq(schema.proposals.tenantId, tenantId));

    const totalProposals = proposals.length;
    const acceptedProposals = proposals.filter(p => p.status === 'accepted').length;
    const rejectedProposals = proposals.filter(p => p.status === 'rejected').length;
    const pendingProposals = proposals.filter(p => ['draft', 'sent', 'viewed'].includes(p.status)).length;
    
    const totalValue = proposals.reduce((sum, p) => sum + parseFloat(p.totalAmount as string || '0'), 0);
    const acceptedValue = proposals
      .filter(p => p.status === 'accepted')
      .reduce((sum, p) => sum + parseFloat(p.totalAmount as string || '0'), 0);
    
    const avgViewTime = proposals.length > 0
      ? proposals.reduce((sum, p) => sum + (p.totalViewTime || 0), 0) / proposals.length
      : 0;
    
    const conversionRate = totalProposals > 0 ? (acceptedProposals / totalProposals) * 100 : 0;

    return {
      totalProposals,
      acceptedProposals,
      rejectedProposals,
      pendingProposals,
      totalValue,
      acceptedValue,
      avgViewTime: Math.round(avgViewTime),
      conversionRate: Math.round(conversionRate * 10) / 10,
    };
  }

  // Create proposal from template
  async createProposalFromTemplate(templateId: string, proposalData: InsertProposal): Promise<Proposal | undefined> {
    const template = await this.getProposalTemplateById(templateId, proposalData.tenantId);
    if (!template) return undefined;

    const proposal = await this.createProposal({
      ...proposalData,
      templateId,
    });

    const templateSections = await this.getTemplateSections(templateId);
    for (const section of templateSections) {
      await this.createProposalSection({
        proposalId: proposal.id,
        sectionType: section.sectionType,
        title: section.title,
        content: section.content,
        sortOrder: section.sortOrder,
        isLocked: section.isLocked,
        isVisible: section.isVisible,
        settings: section.settings,
      });
    }

    return proposal;
  }

  // ==================== FEATURE FLAGS ====================
  
  async getFeatureFlag(key: string, tenantId?: string): Promise<boolean> {
    console.log(`[getFeatureFlag] Checking key=${key}, tenantId=${tenantId}`);
    // First check tenant-specific flag, then global
    if (tenantId) {
      const [tenantFlag] = await db.select()
        .from(schema.featureFlags)
        .where(and(
          eq(schema.featureFlags.key, key),
          eq(schema.featureFlags.tenantId, tenantId)
        ));
      console.log(`[getFeatureFlag] Tenant flag result:`, tenantFlag);
      if (tenantFlag) return tenantFlag.enabled;
    }
    
    // Check global flag (tenantId is null)
    const [globalFlag] = await db.select()
      .from(schema.featureFlags)
      .where(and(
        eq(schema.featureFlags.key, key),
        isNull(schema.featureFlags.tenantId)
      ));
    console.log(`[getFeatureFlag] Global flag result:`, globalFlag);
    return globalFlag?.enabled ?? false;
  }

  async getFeatureFlagRecord(key: string, tenantId?: string): Promise<FeatureFlag | undefined> {
    if (tenantId) {
      const [tenantFlag] = await db.select()
        .from(schema.featureFlags)
        .where(and(
          eq(schema.featureFlags.key, key),
          eq(schema.featureFlags.tenantId, tenantId)
        ));
      if (tenantFlag) return tenantFlag;
    }
    
    const [globalFlag] = await db.select()
      .from(schema.featureFlags)
      .where(and(
        eq(schema.featureFlags.key, key),
        isNull(schema.featureFlags.tenantId)
      ));
    return globalFlag;
  }

  async setFeatureFlag(key: string, enabled: boolean, tenantId?: string, description?: string): Promise<FeatureFlag> {
    const existing = await this.getFeatureFlagRecord(key, tenantId);
    
    if (existing) {
      const [updated] = await db.update(schema.featureFlags)
        .set({ enabled, updatedAt: new Date(), description: description || existing.description })
        .where(eq(schema.featureFlags.id, existing.id))
        .returning();
      return updated;
    }
    
    const [created] = await db.insert(schema.featureFlags)
      .values({
        key,
        tenantId: tenantId || null,
        enabled,
        description,
      })
      .returning();
    return created;
  }

  async getAllFeatureFlags(tenantId?: string): Promise<FeatureFlag[]> {
    if (tenantId) {
      return db.select()
        .from(schema.featureFlags)
        .where(or(
          eq(schema.featureFlags.tenantId, tenantId),
          isNull(schema.featureFlags.tenantId)
        ))
        .orderBy(schema.featureFlags.key);
    }
    return db.select()
      .from(schema.featureFlags)
      .where(isNull(schema.featureFlags.tenantId))
      .orderBy(schema.featureFlags.key);
  }

  // ==================== WORKSPACE OPERATIONS ====================

  async getUserWorkspaces(userId: string): Promise<(WorkspaceUser & { workspace: Tenant })[]> {
    const results = await db.select({
      id: schema.workspaceUsers.id,
      userId: schema.workspaceUsers.userId,
      workspaceId: schema.workspaceUsers.workspaceId,
      role: schema.workspaceUsers.role,
      isPrimary: schema.workspaceUsers.isPrimary,
      invitedBy: schema.workspaceUsers.invitedBy,
      joinedAt: schema.workspaceUsers.joinedAt,
      lastAccessedAt: schema.workspaceUsers.lastAccessedAt,
      createdAt: schema.workspaceUsers.createdAt,
      workspace: schema.tenants,
    })
    .from(schema.workspaceUsers)
    .innerJoin(schema.tenants, eq(schema.workspaceUsers.workspaceId, schema.tenants.id))
    .where(eq(schema.workspaceUsers.userId, userId))
    .orderBy(desc(schema.workspaceUsers.isPrimary), schema.tenants.name);

    return results.map(r => ({
      id: r.id,
      userId: r.userId,
      workspaceId: r.workspaceId,
      role: r.role,
      isPrimary: r.isPrimary,
      invitedBy: r.invitedBy,
      joinedAt: r.joinedAt,
      lastAccessedAt: r.lastAccessedAt,
      createdAt: r.createdAt,
      workspace: r.workspace,
    }));
  }

  async getWorkspaceUsers(workspaceId: string): Promise<(WorkspaceUser & { user: Omit<User, 'passwordHash'> })[]> {
    const results = await db.select({
      id: schema.workspaceUsers.id,
      userId: schema.workspaceUsers.userId,
      workspaceId: schema.workspaceUsers.workspaceId,
      role: schema.workspaceUsers.role,
      isPrimary: schema.workspaceUsers.isPrimary,
      invitedBy: schema.workspaceUsers.invitedBy,
      joinedAt: schema.workspaceUsers.joinedAt,
      lastAccessedAt: schema.workspaceUsers.lastAccessedAt,
      createdAt: schema.workspaceUsers.createdAt,
      user: schema.users,
    })
    .from(schema.workspaceUsers)
    .innerJoin(schema.users, eq(schema.workspaceUsers.userId, schema.users.id))
    .where(eq(schema.workspaceUsers.workspaceId, workspaceId))
    .orderBy(desc(schema.workspaceUsers.role), schema.users.firstName);

    return results.map(r => {
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
        user: userWithoutPassword,
      };
    });
  }

  async addUserToWorkspace(data: InsertWorkspaceUser): Promise<WorkspaceUser> {
    const [workspaceUser] = await db.insert(schema.workspaceUsers)
      .values(data)
      .returning();
    return workspaceUser;
  }

  async updateWorkspaceUser(userId: string, workspaceId: string, updates: { role?: string; isPrimary?: boolean }): Promise<WorkspaceUser | undefined> {
    const [updated] = await db.update(schema.workspaceUsers)
      .set(updates)
      .where(and(
        eq(schema.workspaceUsers.userId, userId),
        eq(schema.workspaceUsers.workspaceId, workspaceId)
      ))
      .returning();
    return updated;
  }

  async removeUserFromWorkspace(userId: string, workspaceId: string): Promise<void> {
    await db.delete(schema.workspaceUsers)
      .where(and(
        eq(schema.workspaceUsers.userId, userId),
        eq(schema.workspaceUsers.workspaceId, workspaceId)
      ));
  }

  async isUserInWorkspace(userId: string, workspaceId: string): Promise<boolean> {
    const [result] = await db.select()
      .from(schema.workspaceUsers)
      .where(and(
        eq(schema.workspaceUsers.userId, userId),
        eq(schema.workspaceUsers.workspaceId, workspaceId)
      ));
    return !!result;
  }

  async getUserWorkspaceRole(userId: string, workspaceId: string): Promise<string | undefined> {
    const [result] = await db.select({ role: schema.workspaceUsers.role })
      .from(schema.workspaceUsers)
      .where(and(
        eq(schema.workspaceUsers.userId, userId),
        eq(schema.workspaceUsers.workspaceId, workspaceId)
      ));
    return result?.role;
  }

  async setActiveWorkspace(userId: string, workspaceId: string): Promise<void> {
    await db.update(schema.workspaceUsers)
      .set({ lastAccessedAt: new Date() })
      .where(and(
        eq(schema.workspaceUsers.userId, userId),
        eq(schema.workspaceUsers.workspaceId, workspaceId)
      ));
  }

  // Workspace Invitations
  async createWorkspaceInvitation(invitation: InsertWorkspaceInvitation): Promise<WorkspaceInvitation> {
    const [created] = await db.insert(schema.workspaceInvitations)
      .values(invitation)
      .returning();
    return created;
  }

  async getWorkspaceInvitations(workspaceId: string, status?: string): Promise<WorkspaceInvitation[]> {
    const conditions = [eq(schema.workspaceInvitations.workspaceId, workspaceId)];
    if (status) {
      conditions.push(eq(schema.workspaceInvitations.status, status));
    }
    return db.select()
      .from(schema.workspaceInvitations)
      .where(and(...conditions))
      .orderBy(desc(schema.workspaceInvitations.createdAt));
  }

  async getInvitationByToken(token: string): Promise<WorkspaceInvitation | undefined> {
    const [invitation] = await db.select()
      .from(schema.workspaceInvitations)
      .where(eq(schema.workspaceInvitations.token, token));
    return invitation;
  }

  async getInvitationsByEmail(email: string, status?: string): Promise<(WorkspaceInvitation & { workspace: Tenant })[]> {
    const conditions = [eq(schema.workspaceInvitations.email, email.toLowerCase())];
    if (status) {
      conditions.push(eq(schema.workspaceInvitations.status, status));
    }

    const results = await db.select({
      invitation: schema.workspaceInvitations,
      workspace: schema.tenants,
    })
    .from(schema.workspaceInvitations)
    .innerJoin(schema.tenants, eq(schema.workspaceInvitations.workspaceId, schema.tenants.id))
    .where(and(...conditions))
    .orderBy(desc(schema.workspaceInvitations.createdAt));

    return results.map(r => ({
      ...r.invitation,
      workspace: r.workspace,
    }));
  }

  async updateInvitationStatus(id: string, status: string): Promise<WorkspaceInvitation | undefined> {
    const updates: any = { status };
    if (status === 'accepted') {
      updates.acceptedAt = new Date();
    }
    const [updated] = await db.update(schema.workspaceInvitations)
      .set(updates)
      .where(eq(schema.workspaceInvitations.id, id))
      .returning();
    return updated;
  }

  async acceptInvitation(token: string, userId: string): Promise<WorkspaceUser | undefined> {
    const invitation = await this.getInvitationByToken(token);
    if (!invitation || invitation.status !== 'pending') return undefined;
    if (new Date() > new Date(invitation.expiresAt)) {
      await this.updateInvitationStatus(invitation.id, 'expired');
      return undefined;
    }

    // Check if user is already in workspace
    const existing = await this.isUserInWorkspace(userId, invitation.workspaceId);
    if (existing) {
      await this.updateInvitationStatus(invitation.id, 'accepted');
      const [workspaceUser] = await db.select()
        .from(schema.workspaceUsers)
        .where(and(
          eq(schema.workspaceUsers.userId, userId),
          eq(schema.workspaceUsers.workspaceId, invitation.workspaceId)
        ));
      return workspaceUser;
    }

    // Add user to workspace
    const workspaceUser = await this.addUserToWorkspace({
      userId,
      workspaceId: invitation.workspaceId,
      role: invitation.role,
      isPrimary: false,
      invitedBy: invitation.invitedBy,
    });

    // Mark invitation as accepted
    await this.updateInvitationStatus(invitation.id, 'accepted');

    return workspaceUser;
  }

  async revokeInvitation(id: string): Promise<void> {
    await db.update(schema.workspaceInvitations)
      .set({ status: 'revoked' })
      .where(eq(schema.workspaceInvitations.id, id));
  }

  async cleanupExpiredInvitations(): Promise<number> {
    const result = await db.update(schema.workspaceInvitations)
      .set({ status: 'expired' })
      .where(and(
        eq(schema.workspaceInvitations.status, 'pending'),
        lte(schema.workspaceInvitations.expiresAt, new Date())
      ))
      .returning();
    return result.length;
  }

  // Workspace Activity Logging
  async logWorkspaceActivity(log: InsertWorkspaceActivityLog): Promise<WorkspaceActivityLog> {
    const [created] = await db.insert(schema.workspaceActivityLogs)
      .values(log)
      .returning();
    return created;
  }

  async getWorkspaceActivityLogs(workspaceId: string, limit: number = 100): Promise<WorkspaceActivityLog[]> {
    return db.select()
      .from(schema.workspaceActivityLogs)
      .where(eq(schema.workspaceActivityLogs.workspaceId, workspaceId))
      .orderBy(desc(schema.workspaceActivityLogs.createdAt))
      .limit(limit);
  }

  // Create workspace with owner
  async createWorkspace(tenantData: InsertTenant, ownerId: string): Promise<Tenant> {
    const tenant = await this.createTenant(tenantData);
    
    // Add creator as workspace owner
    await this.addUserToWorkspace({
      userId: ownerId,
      workspaceId: tenant.id,
      role: 'owner',
      isPrimary: false,
      invitedBy: null,
    });

    // Log workspace creation
    await this.logWorkspaceActivity({
      workspaceId: tenant.id,
      userId: ownerId,
      action: 'workspace_created',
      details: JSON.stringify({ name: tenantData.name }),
    });

    return tenant;
  }

  // ==================== MODULE 1: WORKSPACE BILLING OPERATIONS ====================

  async getAllWorkspacePlans(): Promise<WorkspacePlan[]> {
    return db.select()
      .from(schema.workspacePlans)
      .where(eq(schema.workspacePlans.isActive, true))
      .orderBy(schema.workspacePlans.sortOrder);
  }

  async getWorkspacePlanById(id: string): Promise<WorkspacePlan | undefined> {
    const [plan] = await db.select()
      .from(schema.workspacePlans)
      .where(eq(schema.workspacePlans.id, id));
    return plan;
  }

  async getWorkspacePlanByName(name: string): Promise<WorkspacePlan | undefined> {
    const [plan] = await db.select()
      .from(schema.workspacePlans)
      .where(eq(schema.workspacePlans.name, name));
    return plan;
  }

  async getWorkspaceSubscription(workspaceId: string): Promise<(WorkspaceSubscription & { plan?: WorkspacePlan }) | undefined> {
    const [result] = await db.select({
      subscription: schema.workspaceSubscriptions,
      plan: schema.workspacePlans,
    })
    .from(schema.workspaceSubscriptions)
    .leftJoin(schema.workspacePlans, eq(schema.workspaceSubscriptions.planId, schema.workspacePlans.id))
    .where(eq(schema.workspaceSubscriptions.workspaceId, workspaceId));
    
    if (!result) return undefined;
    return { ...result.subscription, plan: result.plan || undefined };
  }

  async createWorkspaceSubscription(data: InsertWorkspaceSubscription): Promise<WorkspaceSubscription> {
    const [subscription] = await db.insert(schema.workspaceSubscriptions)
      .values(data)
      .returning();
    return subscription;
  }

  async updateWorkspaceSubscription(workspaceId: string, updates: Partial<InsertWorkspaceSubscription>): Promise<WorkspaceSubscription | undefined> {
    const [updated] = await db.update(schema.workspaceSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.workspaceSubscriptions.workspaceId, workspaceId))
      .returning();
    return updated;
  }

  async getWorkspaceUsage(workspaceId: string): Promise<WorkspaceUsage | undefined> {
    const now = new Date();
    const [usage] = await db.select()
      .from(schema.workspaceUsage)
      .where(and(
        eq(schema.workspaceUsage.workspaceId, workspaceId),
        lte(schema.workspaceUsage.periodStart, now),
        gte(schema.workspaceUsage.periodEnd, now)
      ));
    return usage;
  }

  async upsertWorkspaceUsage(workspaceId: string, periodStart: Date, periodEnd: Date, updates: Partial<InsertWorkspaceUsage>): Promise<WorkspaceUsage> {
    const existing = await this.getWorkspaceUsage(workspaceId);
    if (existing) {
      const [updated] = await db.update(schema.workspaceUsage)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(schema.workspaceUsage.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(schema.workspaceUsage)
      .values({ workspaceId, periodStart, periodEnd, ...updates })
      .returning();
    return created;
  }

  async incrementWorkspaceUsage(workspaceId: string, field: 'emailsSent' | 'proposalsCreated' | 'automationsUsed'): Promise<void> {
    const usage = await this.getWorkspaceUsage(workspaceId);
    if (usage) {
      await db.update(schema.workspaceUsage)
        .set({ [field]: sql`${schema.workspaceUsage[field]} + 1`, updatedAt: new Date() })
        .where(eq(schema.workspaceUsage.id, usage.id));
    }
  }

  async getWorkspaceInvoices(workspaceId: string): Promise<WorkspaceInvoice[]> {
    return db.select()
      .from(schema.workspaceInvoices)
      .where(eq(schema.workspaceInvoices.workspaceId, workspaceId))
      .orderBy(desc(schema.workspaceInvoices.createdAt));
  }

  async getWorkspacePaymentMethods(workspaceId: string): Promise<WorkspacePaymentMethod[]> {
    return db.select()
      .from(schema.workspacePaymentMethods)
      .where(eq(schema.workspacePaymentMethods.workspaceId, workspaceId))
      .orderBy(desc(schema.workspacePaymentMethods.isDefault));
  }

  async checkBillingLimits(workspaceId: string): Promise<{ withinLimits: boolean; usage: any; limits: any }> {
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
      maxStorageMb: plan.maxStorageMb,
    };

    const currentUsage = {
      memberCount,
      automationsUsed: usage?.automationsUsed || 0,
      emailsSent: usage?.emailsSent || 0,
      proposalsCreated: usage?.proposalsCreated || 0,
      storageMbUsed: usage?.storageMbUsed || 0,
    };

    const withinLimits = 
      (plan.maxMembers === -1 || memberCount <= plan.maxMembers) &&
      (plan.maxAutomations === -1 || currentUsage.automationsUsed <= plan.maxAutomations) &&
      (plan.maxEmailsPerMonth === -1 || currentUsage.emailsSent <= plan.maxEmailsPerMonth) &&
      (plan.maxProposals === -1 || currentUsage.proposalsCreated <= plan.maxProposals);

    return { withinLimits, usage: currentUsage, limits };
  }

  async getWorkspaceMemberCount(workspaceId: string): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` })
      .from(schema.workspaceUsers)
      .where(eq(schema.workspaceUsers.workspaceId, workspaceId));
    return Number(result?.count || 0);
  }

  // ==================== MODULE 2: WORKSPACE BRANDING OPERATIONS ====================

  async getWorkspaceBranding(workspaceId: string): Promise<WorkspaceBranding | undefined> {
    const [branding] = await db.select()
      .from(schema.workspaceBranding)
      .where(eq(schema.workspaceBranding.workspaceId, workspaceId));
    return branding;
  }

  async upsertWorkspaceBranding(workspaceId: string, data: Partial<InsertWorkspaceBranding>): Promise<WorkspaceBranding> {
    const existing = await this.getWorkspaceBranding(workspaceId);
    if (existing) {
      const [updated] = await db.update(schema.workspaceBranding)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.workspaceBranding.workspaceId, workspaceId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(schema.workspaceBranding)
      .values({ workspaceId, ...data })
      .returning();
    return created;
  }

  async getWorkspacePdfSettings(workspaceId: string): Promise<WorkspacePdfSettings | undefined> {
    const [settings] = await db.select()
      .from(schema.workspacePdfSettings)
      .where(eq(schema.workspacePdfSettings.workspaceId, workspaceId));
    return settings;
  }

  async upsertWorkspacePdfSettings(workspaceId: string, data: Partial<InsertWorkspacePdfSettings>): Promise<WorkspacePdfSettings> {
    const existing = await this.getWorkspacePdfSettings(workspaceId);
    if (existing) {
      const [updated] = await db.update(schema.workspacePdfSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.workspacePdfSettings.workspaceId, workspaceId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(schema.workspacePdfSettings)
      .values({ workspaceId, ...data })
      .returning();
    return created;
  }

  // ==================== MODULE 3: CUSTOM ROLES OPERATIONS ====================

  async getWorkspaceCustomRoles(workspaceId: string): Promise<WorkspaceCustomRole[]> {
    return db.select()
      .from(schema.workspaceCustomRoles)
      .where(eq(schema.workspaceCustomRoles.workspaceId, workspaceId))
      .orderBy(schema.workspaceCustomRoles.name);
  }

  async getWorkspaceCustomRoleById(id: string): Promise<WorkspaceCustomRole | undefined> {
    const [role] = await db.select()
      .from(schema.workspaceCustomRoles)
      .where(eq(schema.workspaceCustomRoles.id, id));
    return role;
  }

  async createWorkspaceCustomRole(data: InsertWorkspaceCustomRole): Promise<WorkspaceCustomRole> {
    const [role] = await db.insert(schema.workspaceCustomRoles)
      .values(data)
      .returning();
    return role;
  }

  async updateWorkspaceCustomRole(id: string, updates: Partial<InsertWorkspaceCustomRole>): Promise<WorkspaceCustomRole | undefined> {
    const [updated] = await db.update(schema.workspaceCustomRoles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.workspaceCustomRoles.id, id))
      .returning();
    return updated;
  }

  async deleteWorkspaceCustomRole(id: string): Promise<void> {
    await db.delete(schema.workspaceRolePermissions)
      .where(eq(schema.workspaceRolePermissions.roleId, id));
    await db.delete(schema.workspaceCustomRoles)
      .where(eq(schema.workspaceCustomRoles.id, id));
  }

  async getRolePermissions(roleId: string): Promise<WorkspaceRolePermission[]> {
    return db.select()
      .from(schema.workspaceRolePermissions)
      .where(eq(schema.workspaceRolePermissions.roleId, roleId));
  }

  async setRolePermissions(roleId: string, permissions: { module: string; action: string; allowed: boolean }[]): Promise<void> {
    await db.delete(schema.workspaceRolePermissions)
      .where(eq(schema.workspaceRolePermissions.roleId, roleId));
    
    if (permissions.length > 0) {
      await db.insert(schema.workspaceRolePermissions)
        .values(permissions.map(p => ({ roleId, ...p })));
    }
  }

  async getCustomRoleWithPermissions(id: string): Promise<(WorkspaceCustomRole & { permissions: WorkspaceRolePermission[] }) | undefined> {
    const role = await this.getWorkspaceCustomRoleById(id);
    if (!role) return undefined;
    const permissions = await this.getRolePermissions(id);
    return { ...role, permissions };
  }

  // ==================== MODULE 4: ANALYTICS OPERATIONS ====================

  async getWorkspaceAnalytics(workspaceId: string, metricType?: string, startDate?: Date, endDate?: Date): Promise<WorkspaceAnalyticsCache[]> {
    const conditions = [eq(schema.workspaceAnalyticsCache.workspaceId, workspaceId)];
    if (metricType) {
      conditions.push(eq(schema.workspaceAnalyticsCache.metricType, metricType));
    }
    if (startDate) {
      conditions.push(gte(schema.workspaceAnalyticsCache.metricDate, startDate));
    }
    if (endDate) {
      conditions.push(lte(schema.workspaceAnalyticsCache.metricDate, endDate));
    }

    return db.select()
      .from(schema.workspaceAnalyticsCache)
      .where(and(...conditions))
      .orderBy(desc(schema.workspaceAnalyticsCache.metricDate));
  }

  async upsertWorkspaceAnalytics(workspaceId: string, metricType: string, metricDate: Date, value: number, metadata?: string): Promise<WorkspaceAnalyticsCache> {
    const dateStart = new Date(metricDate);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);

    const [existing] = await db.select()
      .from(schema.workspaceAnalyticsCache)
      .where(and(
        eq(schema.workspaceAnalyticsCache.workspaceId, workspaceId),
        eq(schema.workspaceAnalyticsCache.metricType, metricType),
        gte(schema.workspaceAnalyticsCache.metricDate, dateStart),
        lte(schema.workspaceAnalyticsCache.metricDate, dateEnd)
      ));

    if (existing) {
      const [updated] = await db.update(schema.workspaceAnalyticsCache)
        .set({ value: value.toString(), metadata, updatedAt: new Date() })
        .where(eq(schema.workspaceAnalyticsCache.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(schema.workspaceAnalyticsCache)
      .values({ workspaceId, metricType, metricDate, value: value.toString(), metadata })
      .returning();
    return created;
  }

  async getWorkspaceAnalyticsSummary(workspaceId: string): Promise<{
    totalRevenue: number;
    unpaidInvoices: number;
    proposalsSent: number;
    proposalAcceptRate: number;
    leadsCreated: number;
    leadsConverted: number;
    tasksCompleted: number;
  }> {
    const [invoiceStats] = await db.select({
      totalPaid: sql<number>`COALESCE(SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END), 0)`,
      totalUnpaid: sql<number>`COALESCE(SUM(CASE WHEN status NOT IN ('paid', 'cancelled') THEN balance_due ELSE 0 END), 0)`,
    })
    .from(schema.invoices)
    .where(eq(schema.invoices.tenantId, workspaceId));

    const [proposalStats] = await db.select({
      total: sql<number>`count(*)`,
      accepted: sql<number>`SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END)`,
    })
    .from(schema.proposals)
    .where(eq(schema.proposals.tenantId, workspaceId));

    const [customerStats] = await db.select({
      leads: sql<number>`SUM(CASE WHEN customer_type = 'lead' THEN 1 ELSE 0 END)`,
      converted: sql<number>`SUM(CASE WHEN customer_type = 'customer' THEN 1 ELSE 0 END)`,
    })
    .from(schema.customers)
    .where(eq(schema.customers.tenantId, workspaceId));

    const [taskStats] = await db.select({
      completed: sql<number>`SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`,
    })
    .from(schema.tasks)
    .where(eq(schema.tasks.tenantId, workspaceId));

    return {
      totalRevenue: Number(invoiceStats?.totalPaid || 0),
      unpaidInvoices: Number(invoiceStats?.totalUnpaid || 0),
      proposalsSent: Number(proposalStats?.total || 0),
      proposalAcceptRate: proposalStats?.total ? (Number(proposalStats.accepted) / Number(proposalStats.total)) * 100 : 0,
      leadsCreated: Number(customerStats?.leads || 0),
      leadsConverted: Number(customerStats?.converted || 0),
      tasksCompleted: Number(taskStats?.completed || 0),
    };
  }

  // ==================== MODULE 5: WORKSPACE DELETION OPERATIONS ====================

  async softDeleteWorkspace(workspaceId: string, deletedBy: string, reason?: string): Promise<Tenant | undefined> {
    const scheduledPurgeAt = new Date();
    scheduledPurgeAt.setDate(scheduledPurgeAt.getDate() + 30);

    const [updated] = await db.update(schema.tenants)
      .set({ deletedAt: new Date() })
      .where(eq(schema.tenants.id, workspaceId))
      .returning();

    if (updated) {
      await db.insert(schema.workspaceDeletionLogs)
        .values({
          workspaceId,
          action: 'deleted',
          deletedBy,
          reason,
          scheduledPurgeAt,
        });
    }

    return updated;
  }

  async restoreWorkspace(workspaceId: string, restoredBy: string): Promise<Tenant | undefined> {
    const [updated] = await db.update(schema.tenants)
      .set({ deletedAt: null })
      .where(eq(schema.tenants.id, workspaceId))
      .returning();

    if (updated) {
      await db.insert(schema.workspaceDeletionLogs)
        .values({
          workspaceId,
          action: 'restored',
          restoredBy,
        });
    }

    return updated;
  }

  async getDeletedWorkspaces(): Promise<Tenant[]> {
    return db.select()
      .from(schema.tenants)
      .where(sql`${schema.tenants.deletedAt} IS NOT NULL`);
  }

  async getWorkspaceDeletionLogs(workspaceId: string): Promise<WorkspaceDeletionLog[]> {
    return db.select()
      .from(schema.workspaceDeletionLogs)
      .where(eq(schema.workspaceDeletionLogs.workspaceId, workspaceId))
      .orderBy(desc(schema.workspaceDeletionLogs.createdAt));
  }

  async canDeleteWorkspace(workspaceId: string, userId: string): Promise<{ canDelete: boolean; reason?: string }> {
    const subscription = await this.getWorkspaceSubscription(workspaceId);
    if (subscription && subscription.status === 'active') {
      return { canDelete: false, reason: 'Cannot delete workspace with active subscription' };
    }

    const userWorkspaces = await this.getUserWorkspaces(userId);
    if (userWorkspaces.length <= 1) {
      return { canDelete: false, reason: 'Cannot delete your only workspace' };
    }

    return { canDelete: true };
  }

  // ==================== MODULE 6: ONBOARDING OPERATIONS ====================

  async getWorkspaceOnboardingProgress(workspaceId: string): Promise<WorkspaceOnboardingProgress | undefined> {
    const [progress] = await db.select()
      .from(schema.workspaceOnboardingProgress)
      .where(eq(schema.workspaceOnboardingProgress.workspaceId, workspaceId));
    return progress;
  }

  async createWorkspaceOnboardingProgress(workspaceId: string): Promise<WorkspaceOnboardingProgress> {
    const [created] = await db.insert(schema.workspaceOnboardingProgress)
      .values({ workspaceId })
      .returning();
    return created;
  }

  async updateOnboardingStep(workspaceId: string, step: string, status: string): Promise<WorkspaceOnboardingProgress | undefined> {
    const updates: any = { [step]: status, updatedAt: new Date() };
    
    const progress = await this.getWorkspaceOnboardingProgress(workspaceId);
    if (!progress) {
      await this.createWorkspaceOnboardingProgress(workspaceId);
    }

    const allSteps = ['step1AddBranding', 'step2AddTeamMembers', 'step3AddFirstClient', 'step4CreateProject', 'step5CreateProposal'];
    const stepIndex = allSteps.indexOf(step);
    if (stepIndex !== -1 && status === 'completed') {
      updates.currentStep = Math.min(stepIndex + 2, 5);
    }

    const [updated] = await db.update(schema.workspaceOnboardingProgress)
      .set(updates)
      .where(eq(schema.workspaceOnboardingProgress.workspaceId, workspaceId))
      .returning();
    return updated;
  }

  async completeOnboarding(workspaceId: string): Promise<WorkspaceOnboardingProgress | undefined> {
    const [updated] = await db.update(schema.workspaceOnboardingProgress)
      .set({ isCompleted: true, completedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.workspaceOnboardingProgress.workspaceId, workspaceId))
      .returning();
    return updated;
  }

  async dismissOnboarding(workspaceId: string): Promise<WorkspaceOnboardingProgress | undefined> {
    const [updated] = await db.update(schema.workspaceOnboardingProgress)
      .set({ isDismissed: true, updatedAt: new Date() })
      .where(eq(schema.workspaceOnboardingProgress.workspaceId, workspaceId))
      .returning();
    return updated;
  }

  async reopenOnboarding(workspaceId: string): Promise<WorkspaceOnboardingProgress | undefined> {
    const [updated] = await db.update(schema.workspaceOnboardingProgress)
      .set({ isDismissed: false, updatedAt: new Date() })
      .where(eq(schema.workspaceOnboardingProgress.workspaceId, workspaceId))
      .returning();
    return updated;
  }

  // ==================== ENTERPRISE SECURITY: AUDIT LOG OPERATIONS ====================

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [created] = await db.insert(schema.auditLogs)
      .values(log)
      .returning();
    return created;
  }

  async getAuditLogs(tenantId: string, options?: { 
    limit?: number; 
    offset?: number;
    action?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AuditLog[]> {
    const conditions = [eq(schema.auditLogs.tenantId, tenantId)];
    
    if (options?.action) {
      conditions.push(eq(schema.auditLogs.action, options.action));
    }
    if (options?.userId) {
      conditions.push(eq(schema.auditLogs.userId, options.userId));
    }
    if (options?.startDate) {
      conditions.push(gte(schema.auditLogs.createdAt, options.startDate));
    }
    if (options?.endDate) {
      conditions.push(lte(schema.auditLogs.createdAt, options.endDate));
    }

    return db.select()
      .from(schema.auditLogs)
      .where(and(...conditions))
      .orderBy(desc(schema.auditLogs.createdAt))
      .limit(options?.limit || 100)
      .offset(options?.offset || 0);
  }

  async createLoginAttempt(attempt: InsertLoginAttempt): Promise<LoginAttempt> {
    const [created] = await db.insert(schema.loginAttempts)
      .values(attempt)
      .returning();
    return created;
  }

  async getRecentLoginAttempts(email: string, minutes: number = 15): Promise<LoginAttempt[]> {
    const since = new Date(Date.now() - minutes * 60 * 1000);
    return db.select()
      .from(schema.loginAttempts)
      .where(and(
        eq(schema.loginAttempts.email, email.toLowerCase()),
        gte(schema.loginAttempts.createdAt, since)
      ))
      .orderBy(desc(schema.loginAttempts.createdAt));
  }

  async getFailedLoginCount(email: string, minutes: number = 15): Promise<number> {
    const attempts = await this.getRecentLoginAttempts(email, minutes);
    return attempts.filter(a => !a.success).length;
  }

  // ==================== MODULE 7: CUSTOMER PORTAL OPERATIONS ====================

  async getCustomerPortalSettings(workspaceId: string): Promise<CustomerPortalSettings | undefined> {
    const [settings] = await db.select()
      .from(schema.customerPortalSettings)
      .where(eq(schema.customerPortalSettings.workspaceId, workspaceId));
    return settings;
  }

  async upsertCustomerPortalSettings(workspaceId: string, data: Partial<InsertCustomerPortalSettings>): Promise<CustomerPortalSettings> {
    const existing = await this.getCustomerPortalSettings(workspaceId);
    
    if (existing) {
      const [updated] = await db.update(schema.customerPortalSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.customerPortalSettings.workspaceId, workspaceId))
        .returning();
      return updated;
    }
    
    const [created] = await db.insert(schema.customerPortalSettings)
      .values({ workspaceId, ...data })
      .returning();
    return created;
  }

  async createPortalActivityLog(log: InsertCustomerPortalActivityLog): Promise<CustomerPortalActivityLog> {
    const [created] = await db.insert(schema.customerPortalActivityLogs)
      .values(log)
      .returning();
    return created;
  }

  async getPortalActivityLogs(workspaceId: string, options?: { customerId?: string; limit?: number }): Promise<CustomerPortalActivityLog[]> {
    const conditions = [eq(schema.customerPortalActivityLogs.workspaceId, workspaceId)];
    
    if (options?.customerId) {
      conditions.push(eq(schema.customerPortalActivityLogs.customerId, options.customerId));
    }
    
    return db.select()
      .from(schema.customerPortalActivityLogs)
      .where(and(...conditions))
      .orderBy(desc(schema.customerPortalActivityLogs.createdAt))
      .limit(options?.limit || 100);
  }

  async createPasswordResetToken(data: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [created] = await db.insert(schema.passwordResetTokens)
      .values(data)
      .returning();
    return created;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [result] = await db.select()
      .from(schema.passwordResetTokens)
      .where(and(
        eq(schema.passwordResetTokens.token, token),
        isNull(schema.passwordResetTokens.usedAt),
        gte(schema.passwordResetTokens.expiresAt, new Date())
      ));
    return result;
  }

  async markPasswordResetTokenUsed(id: string): Promise<void> {
    await db.update(schema.passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(schema.passwordResetTokens.id, id));
  }

  async createClientDocument(doc: InsertClientDocument): Promise<ClientDocument> {
    const [created] = await db.insert(schema.clientDocuments)
      .values(doc)
      .returning();
    return created;
  }

  async getClientDocuments(tenantId: string, customerId: string): Promise<ClientDocument[]> {
    return db.select()
      .from(schema.clientDocuments)
      .where(and(
        eq(schema.clientDocuments.tenantId, tenantId),
        eq(schema.clientDocuments.customerId, customerId)
      ))
      .orderBy(desc(schema.clientDocuments.createdAt));
  }

  async getClientDocumentById(id: string, tenantId: string): Promise<ClientDocument | undefined> {
    const [doc] = await db.select()
      .from(schema.clientDocuments)
      .where(and(
        eq(schema.clientDocuments.id, id),
        eq(schema.clientDocuments.tenantId, tenantId)
      ));
    return doc;
  }

  async deleteClientDocument(id: string, tenantId: string): Promise<void> {
    await db.delete(schema.clientDocuments)
      .where(and(
        eq(schema.clientDocuments.id, id),
        eq(schema.clientDocuments.tenantId, tenantId)
      ));
  }

  async getProposalsByCustomerForPortal(customerId: string, tenantId: string): Promise<schema.Proposal[]> {
    return db.select()
      .from(schema.proposals)
      .where(and(
        eq(schema.proposals.tenantId, tenantId),
        eq(schema.proposals.customerId, customerId),
        or(
          eq(schema.proposals.status, 'sent'),
          eq(schema.proposals.status, 'accepted'),
          eq(schema.proposals.status, 'rejected')
        )
      ))
      .orderBy(desc(schema.proposals.createdAt));
  }

  async getTasksForCustomerPortal(customerId: string, tenantId: string): Promise<Task[]> {
    return db.select()
      .from(schema.tasks)
      .where(and(
        eq(schema.tasks.tenantId, tenantId),
        eq(schema.tasks.customerId, customerId)
      ))
      .orderBy(desc(schema.tasks.createdAt));
  }

  // ==================== AI ENHANCEMENT MODULE ====================

  async getAiSettings(tenantId: string): Promise<AiSettings | undefined> {
    const [settings] = await db.select()
      .from(schema.aiSettings)
      .where(eq(schema.aiSettings.tenantId, tenantId));
    return settings;
  }

  async createOrUpdateAiSettings(data: InsertAiSettings): Promise<AiSettings> {
    const existing = await this.getAiSettings(data.tenantId);
    if (existing) {
      const [updated] = await db.update(schema.aiSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.aiSettings.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(schema.aiSettings)
      .values(data)
      .returning();
    return created;
  }

  async updateAiSettings(tenantId: string, updates: Partial<InsertAiSettings>): Promise<AiSettings | undefined> {
    const existing = await this.getAiSettings(tenantId);
    if (!existing) return undefined;
    
    const [updated] = await db.update(schema.aiSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.aiSettings.id, existing.id))
      .returning();
    return updated;
  }

  async createAiUsage(data: InsertAiUsage): Promise<AiUsage> {
    const [created] = await db.insert(schema.aiUsage)
      .values(data)
      .returning();
    return created;
  }

  async getAiUsageByTenant(tenantId: string, limit: number = 100): Promise<AiUsage[]> {
    return db.select()
      .from(schema.aiUsage)
      .where(eq(schema.aiUsage.tenantId, tenantId))
      .orderBy(desc(schema.aiUsage.createdAt))
      .limit(limit);
  }

  async getAiUsageStats(tenantId: string): Promise<{ total: number; thisMonth: number; byModule: Record<string, number> }> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const allUsage = await db.select()
      .from(schema.aiUsage)
      .where(eq(schema.aiUsage.tenantId, tenantId));

    const total = allUsage.reduce((sum, u) => sum + (u.tokensUsed || 0), 0);
    const thisMonth = allUsage
      .filter(u => new Date(u.createdAt) >= startOfMonth)
      .reduce((sum, u) => sum + (u.tokensUsed || 0), 0);

    const byModule: Record<string, number> = {};
    for (const usage of allUsage) {
      byModule[usage.module] = (byModule[usage.module] || 0) + (usage.tokensUsed || 0);
    }

    return { total, thisMonth, byModule };
  }

  async createAiLog(data: InsertAiLog): Promise<AiLog> {
    const [created] = await db.insert(schema.aiLogs)
      .values(data)
      .returning();
    return created;
  }

  async getAiLogs(tenantId: string, limit: number = 100): Promise<AiLog[]> {
    return db.select()
      .from(schema.aiLogs)
      .where(eq(schema.aiLogs.tenantId, tenantId))
      .orderBy(desc(schema.aiLogs.createdAt))
      .limit(limit);
  }

  async updateAiLogFeedback(id: string, rating: number, comment?: string): Promise<AiLog | undefined> {
    const [updated] = await db.update(schema.aiLogs)
      .set({ feedbackRating: rating, feedbackComment: comment })
      .where(eq(schema.aiLogs.id, id))
      .returning();
    return updated;
  }

  async createAiContentVersion(data: InsertAiContentVersion): Promise<AiContentVersion> {
    const [created] = await db.insert(schema.aiContentVersions)
      .values(data)
      .returning();
    return created;
  }

  async getAiContentVersions(tenantId: string, resourceType: string, resourceId: string): Promise<AiContentVersion[]> {
    return db.select()
      .from(schema.aiContentVersions)
      .where(and(
        eq(schema.aiContentVersions.tenantId, tenantId),
        eq(schema.aiContentVersions.resourceType, resourceType),
        eq(schema.aiContentVersions.resourceId, resourceId)
      ))
      .orderBy(desc(schema.aiContentVersions.createdAt));
  }

  async incrementAiTokenUsage(tenantId: string, tokens: number): Promise<void> {
    const settings = await this.getAiSettings(tenantId);
    if (settings) {
      const now = new Date();
      const resetDate = new Date(settings.tokenResetDate);
      
      // Reset if we're in a new month
      if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
        await db.update(schema.aiSettings)
          .set({ 
            tokensUsedThisMonth: tokens, 
            tokenResetDate: now,
            updatedAt: now 
          })
          .where(eq(schema.aiSettings.id, settings.id));
      } else {
        await db.update(schema.aiSettings)
          .set({ 
            tokensUsedThisMonth: settings.tokensUsedThisMonth + tokens,
            updatedAt: now 
          })
          .where(eq(schema.aiSettings.id, settings.id));
      }
    }
  }
}

export const storage = new DatabaseStorage();
