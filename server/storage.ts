import { db } from "./db";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
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
} from "@shared/schema";

export interface IStorage {
  // Tenant operations
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  getTenant(id: string): Promise<Tenant | undefined>;
  
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByTenant(tenantId: string): Promise<User[]>;
  updateUser(id: string, updates: { firstName?: string; lastName?: string; email?: string; profileImageUrl?: string }): Promise<User | undefined>;
  
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
  
  // Auth token operations
  createAuthToken(token: InsertAuthToken): Promise<AuthToken>;
  getAuthToken(refreshToken: string): Promise<AuthToken | undefined>;
  deleteAuthToken(id: string): Promise<void>;
  
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
  getCustomersByTenant(tenantId: string): Promise<Customer[]>;
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
  getPlatformSettings(): Promise<PlatformSetting[]>;
  getPlatformSettingByKey(key: string): Promise<PlatformSetting | undefined>;
  upsertPlatformSetting(setting: InsertPlatformSetting): Promise<PlatformSetting>;
  deletePlatformSetting(key: string): Promise<void>;

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
  
  async updateUser(id: string, updates: { firstName?: string; lastName?: string; email?: string; profileImageUrl?: string }): Promise<User | undefined> {
    const updateData: { firstName?: string; lastName?: string; email?: string; profileImageUrl?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (updates.firstName) updateData.firstName = updates.firstName;
    if (updates.lastName) updateData.lastName = updates.lastName;
    if (updates.email) updateData.email = updates.email;
    if (updates.profileImageUrl !== undefined) updateData.profileImageUrl = updates.profileImageUrl;
    
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
    const [task] = await db.update(schema.tasks)
      .set({ ...updates, updatedAt: new Date() })
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

  async getCustomersByTenant(tenantId: string): Promise<Customer[]> {
    return db.select().from(schema.customers).where(eq(schema.customers.tenantId, tenantId)).orderBy(desc(schema.customers.createdAt));
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

  async getQuotationById(id: string, tenantId: string): Promise<Quotation | undefined> {
    const [quotation] = await db.select().from(schema.quotations)
      .where(and(eq(schema.quotations.id, id), eq(schema.quotations.tenantId, tenantId)));
    return quotation;
  }

  async updateQuotation(id: string, tenantId: string, updates: Partial<InsertQuotation>): Promise<Quotation | undefined> {
    const [quotation] = await db.update(schema.quotations)
      .set({ ...updates, updatedAt: new Date() })
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
    const [invoice] = await db.update(schema.invoices)
      .set({ ...updates, updatedAt: new Date() } as any)
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
    const [activity] = await db.update(schema.activities)
      .set({ ...updates, updatedAt: new Date() })
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
    const invoices = await db.select().from(schema.invoices);
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyRevenue = invoices
      .filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
      })
      .reduce((sum, inv) => sum + Number(inv.paidAmount || 0), 0);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData: { month: string; revenue: number; users: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const targetMonth = (currentMonth - i + 12) % 12;
      const targetYear = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const monthRevenue = invoices
        .filter(inv => {
          const invDate = new Date(inv.createdAt);
          return invDate.getMonth() === targetMonth && invDate.getFullYear() === targetYear;
        })
        .reduce((sum, inv) => sum + Number(inv.paidAmount || 0), 0);
      
      const endOfTargetMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
      const monthUsers = users.filter(u => {
        const uDate = new Date(u.createdAt);
        return uDate <= endOfTargetMonth;
      }).length;
      
      revenueData.push({
        month: months[targetMonth],
        revenue: monthRevenue,
        users: monthUsers,
      });
    }
    
    const enterpriseTenants = tenants.filter(t => {
      const userCount = users.filter(u => u.tenantId === t.id).length;
      return userCount >= 10;
    }).length;
    
    const professionalTenants = tenants.filter(t => {
      const userCount = users.filter(u => u.tenantId === t.id).length;
      return userCount >= 3 && userCount < 10;
    }).length;
    
    const starterTenants = tenants.filter(t => {
      const userCount = users.filter(u => u.tenantId === t.id).length;
      return userCount < 3;
    }).length;
    
    const tenantDistribution = [
      { name: "Enterprise", value: enterpriseTenants },
      { name: "Professional", value: professionalTenants },
      { name: "Starter", value: starterTenants },
    ].filter(d => d.value > 0);
    
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

  async getAllTenants(): Promise<(Tenant & { userCount: number })[]> {
    const tenants = await db.select().from(schema.tenants).orderBy(desc(schema.tenants.createdAt));
    const users = await db.select().from(schema.users);
    
    return tenants.map(tenant => ({
      ...tenant,
      userCount: users.filter(u => u.tenantId === tenant.id).length,
    }));
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
  async getPlatformSettings(): Promise<PlatformSetting[]> {
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

    const [users, customers, deals, invoices, quotations] = await Promise.all([
      db.select().from(schema.users).where(eq(schema.users.tenantId, tenantId)),
      db.select().from(schema.customers).where(eq(schema.customers.tenantId, tenantId)),
      db.select().from(schema.deals).where(eq(schema.deals.tenantId, tenantId)),
      db.select().from(schema.invoices).where(eq(schema.invoices.tenantId, tenantId)),
      db.select().from(schema.quotations).where(eq(schema.quotations.tenantId, tenantId)),
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

    return {
      tenant,
      users: usersWithoutPasswords,
      customers,
      deals,
      invoices,
      quotations,
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
}

export const storage = new DatabaseStorage();
