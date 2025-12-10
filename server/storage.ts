import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
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
  
  // Role operations
  createRole(role: InsertRole): Promise<Role>;
  getRoleById(id: string): Promise<Role | undefined>;
  
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
  getContactsByTenant(tenantId: string): Promise<Contact[]>;
  getContactById(id: string, tenantId: string): Promise<Contact | undefined>;
  updateContact(id: string, tenantId: string, updates: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: string, tenantId: string): Promise<void>;
  
  // Deal operations
  createDeal(deal: InsertDeal): Promise<Deal>;
  getDealsByTenant(tenantId: string): Promise<Deal[]>;
  getDealById(id: string, tenantId: string): Promise<Deal | undefined>;
  updateDeal(id: string, tenantId: string, updates: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: string, tenantId: string): Promise<void>;
  
  // Task operations
  createTask(task: InsertTask): Promise<Task>;
  getTasksByTenant(tenantId: string): Promise<Task[]>;
  getTaskById(id: string, tenantId: string): Promise<Task | undefined>;
  updateTask(id: string, tenantId: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, tenantId: string): Promise<void>;
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
  
  // Role operations
  async createRole(insertRole: InsertRole): Promise<Role> {
    const [role] = await db.insert(schema.roles).values(insertRole).returning();
    return role;
  }
  
  async getRoleById(id: string): Promise<Role | undefined> {
    const [role] = await db.select().from(schema.roles).where(eq(schema.roles.id, id));
    return role;
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
  
  async getContactsByTenant(tenantId: string): Promise<Contact[]> {
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
  
  async getDealsByTenant(tenantId: string): Promise<Deal[]> {
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
  
  async getTasksByTenant(tenantId: string): Promise<Task[]> {
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
}

export const storage = new DatabaseStorage();
