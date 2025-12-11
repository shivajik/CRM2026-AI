import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, getRefreshTokenExpiry, verifyToken } from "./auth";
import { requireAuth, validateTenant, requireAgencyAdmin, requireSaasAdmin, denyCustomerAccess } from "./middleware";
import { z } from "zod";
import { insertContactSchema, insertDealSchema, insertTaskSchema, insertProductSchema, insertCustomerSchema, insertQuotationSchema, insertQuotationItemSchema, insertInvoiceSchema, insertInvoiceItemSchema, insertPaymentSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  await initializeModules();
  await initializeDefaultPackages();
  await initializeSuperAdmin();
  
  // ==================== AUTH ROUTES ====================
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, companyName } = req.body;
      
      if (!email || !password || !firstName || !lastName || !companyName) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const tenant = await storage.createTenant({ name: companyName });
      
      let adminRole = await storage.getRoleById("admin");
      if (!adminRole) {
        adminRole = await storage.createRole({
          name: "admin",
          permissions: ["*"],
        });
      }
      
      const passwordHash = await hashPassword(password);
      const user = await storage.createUser({
        tenantId: tenant.id,
        email,
        passwordHash,
        firstName,
        lastName,
        roleId: adminRole.id,
        userType: 'agency_admin',
        isAdmin: true,
        isActive: true,
      });
      
      const modules = await storage.getAllModules();
      for (const module of modules) {
        await storage.enableModuleForTenant({
          tenantId: tenant.id,
          moduleId: module.id,
          isEnabled: true,
        });
      }
      
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      
      await storage.createAuthToken({
        userId: user.id,
        refreshToken,
        expiresAt: getRefreshTokenExpiry(),
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
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      
      await storage.createAuthToken({
        userId: user.id,
        refreshToken,
        expiresAt: getRefreshTokenExpiry(),
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
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.post("/api/auth/refresh", async (req, res) => {
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
      
      const newAccessToken = generateAccessToken(user);
      
      res.json({ accessToken: newAccessToken });
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
      const user = await storage.getUserWithRole(req.user!.userId);
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
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ==================== TEAM MANAGEMENT ROUTES ====================
  
  // Get all team members (admin only)
  app.get("/api/team/members", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const users = await storage.getUsersByTenant(req.user!.tenantId);
      const roles = await storage.getRolesByTenant(req.user!.tenantId);
      
      const membersWithRoles = users.map(user => {
        const { passwordHash, ...userWithoutPassword } = user;
        const role = roles.find(r => r.id === user.roleId);
        return {
          ...userWithoutPassword,
          role: role || null,
          permissions: role?.permissions || [],
        };
      });
      
      res.json(membersWithRoles);
    } catch (error) {
      console.error("Get team members error:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });
  
  // Create team member (admin only)
  app.post("/api/team/members", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      
      const { email, password, firstName, lastName, roleId, permissions } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Email, password, first name and last name are required" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      let userRoleId = roleId;
      
      // Create custom role with permissions if provided
      if (permissions && permissions.length > 0) {
        const customRole = await storage.createRole({
          tenantId: req.user!.tenantId,
          name: `${firstName} ${lastName} Role`,
          permissions,
        });
        userRoleId = customRole.id;
      }
      
      const passwordHash = await hashPassword(password);
      const user = await storage.createTeamMember({
        tenantId: req.user!.tenantId,
        email,
        passwordHash,
        firstName,
        lastName,
        roleId: userRoleId || null,
        isAdmin: false,
        isActive: true,
      });
      
      // Get role permissions
      let rolePermissions: string[] = [];
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
        permissions: rolePermissions,
      });
    } catch (error) {
      console.error("Create team member error:", error);
      res.status(500).json({ message: "Failed to create team member" });
    }
  });
  
  // Update team member
  app.patch("/api/team/members/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const currentUser = await storage.getUserById(req.user!.userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Only admins can update team members" });
      }
      
      const { firstName, lastName, email, roleId, permissions, isActive } = req.body;
      
      const updates: any = {};
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (email) updates.email = email;
      if (typeof isActive === 'boolean') updates.isActive = isActive;
      
      // Update role permissions if provided
      if (permissions && permissions.length > 0) {
        const existingUser = await storage.getUserById(req.params.id);
        if (existingUser?.roleId) {
          await storage.updateRole(existingUser.roleId, { permissions });
        } else {
          const customRole = await storage.createRole({
            tenantId: req.user!.tenantId,
            name: `${firstName || existingUser?.firstName} Role`,
            permissions,
          });
          updates.roleId = customRole.id;
        }
      } else if (roleId !== undefined) {
        updates.roleId = roleId;
      }
      
      const user = await storage.updateTeamMember(req.params.id, req.user!.tenantId, updates);
      if (!user) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      // Get role permissions
      let rolePermissions: string[] = [];
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
        permissions: rolePermissions,
      });
    } catch (error) {
      console.error("Update team member error:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  });
  
  // Delete team member
  app.delete("/api/team/members/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const currentUser = await storage.getUserById(req.user!.userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Only admins can delete team members" });
      }
      
      if (req.params.id === req.user!.userId) {
        return res.status(400).json({ message: "You cannot delete yourself" });
      }
      
      await storage.deleteTeamMember(req.params.id, req.user!.tenantId);
      res.json({ message: "Team member deleted successfully" });
    } catch (error) {
      console.error("Delete team member error:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });
  
  // Get roles
  app.get("/api/team/roles", requireAuth, validateTenant, async (req, res) => {
    try {
      const roles = await storage.getRolesByTenant(req.user!.tenantId);
      res.json(roles);
    } catch (error) {
      console.error("Get roles error:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });
  
  // Create role
  app.post("/api/team/roles", requireAuth, validateTenant, async (req, res) => {
    try {
      const currentUser = await storage.getUserById(req.user!.userId);
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Only admins can create roles" });
      }
      
      const { name, permissions } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Role name is required" });
      }
      
      const role = await storage.createRole({
        tenantId: req.user!.tenantId,
        name,
        permissions: permissions || [],
      });
      
      res.status(201).json(role);
    } catch (error) {
      console.error("Create role error:", error);
      res.status(500).json({ message: "Failed to create role" });
    }
  });
  
  // Check if current user is admin
  app.get("/api/auth/admin-check", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserById(req.user!.userId);
      res.json({ isAdmin: user?.isAdmin || false });
    } catch (error) {
      console.error("Admin check error:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  // ==================== USER PROFILE ROUTES ====================
  
  app.patch("/api/users/profile", requireAuth, async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;
      
      if (!firstName && !lastName && !email) {
        return res.status(400).json({ message: "No valid fields provided for update" });
      }
      
      const updates: { firstName?: string; lastName?: string; email?: string } = {};
      
      if (firstName && typeof firstName === 'string') {
        updates.firstName = firstName.trim();
      }
      if (lastName && typeof lastName === 'string') {
        updates.lastName = lastName.trim();
      }
      if (email && typeof email === 'string') {
        const trimmedEmail = email.trim().toLowerCase();
        const existingUser = await storage.getUserByEmail(trimmedEmail);
        if (existingUser && existingUser.id !== req.user!.userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
        updates.email = trimmedEmail;
      }
      
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update" });
      }
      
      const updatedUser = await storage.updateUser(req.user!.userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        tenantId: updatedUser.tenantId,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // ==================== COMPANY PROFILE ROUTES ====================
  
  app.get("/api/company-profile", requireAuth, validateTenant, async (req, res) => {
    try {
      const profile = await storage.getCompanyProfile(req.user!.tenantId);
      if (!profile) {
        const tenant = await storage.getTenant(req.user!.tenantId);
        return res.json({
          tenantId: req.user!.tenantId,
          companyName: tenant?.name || '',
          email: '',
          phone: '',
          website: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          logoUrl: '',
          taxId: '',
          registrationNumber: '',
          industry: '',
          companySize: '',
          currency: 'USD',
          defaultPaymentTerms: 'net30',
          invoicePrefix: 'INV',
          quotePrefix: 'QT',
          invoiceNotes: '',
          quoteNotes: '',
        });
      }
      res.json(profile);
    } catch (error) {
      console.error("Get company profile error:", error);
      res.status(500).json({ message: "Failed to fetch company profile" });
    }
  });

  app.put("/api/company-profile", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const profile = await storage.upsertCompanyProfile(req.user!.tenantId, req.body);
      res.json(profile);
    } catch (error) {
      console.error("Update company profile error:", error);
      res.status(500).json({ message: "Failed to update company profile" });
    }
  });
  
  // ==================== TENANT MODULE ROUTES ====================
  
  app.get("/api/tenant/modules", requireAuth, validateTenant, async (req, res) => {
    try {
      const tenantModules = await storage.getTenantModules(req.user!.tenantId);
      res.json(tenantModules);
    } catch (error) {
      console.error("Get tenant modules error:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
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
  
  // ==================== CONTACT ROUTES ====================
  
  app.get("/api/contacts", requireAuth, validateTenant, async (req, res) => {
    try {
      const userType = req.user!.userType;
      const ownerId = (userType === 'team_member' || userType === 'customer') ? req.user!.userId : undefined;
      const contacts = await storage.getContactsByTenant(req.user!.tenantId, ownerId);
      res.json(contacts);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });
  
  app.get("/api/contacts/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const contact = await storage.getContactById(req.params.id, req.user!.tenantId);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Get contact error:", error);
      res.status(500).json({ message: "Failed to fetch contact" });
    }
  });
  
  app.post("/api/contacts", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
        ownerId: req.user!.userId,
      });
      
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create contact error:", error);
      res.status(500).json({ message: "Failed to create contact" });
    }
  });
  
  app.patch("/api/contacts/:id", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const contact = await storage.updateContact(req.params.id, req.user!.tenantId, req.body);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Update contact error:", error);
      res.status(500).json({ message: "Failed to update contact" });
    }
  });
  
  app.delete("/api/contacts/:id", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      await storage.deleteContact(req.params.id, req.user!.tenantId);
      res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Delete contact error:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });
  
  // ==================== DEAL ROUTES ====================
  
  app.get("/api/deals", requireAuth, validateTenant, async (req, res) => {
    try {
      const userType = req.user!.userType;
      const ownerId = (userType === 'team_member' || userType === 'customer') ? req.user!.userId : undefined;
      const deals = await storage.getDealsByTenant(req.user!.tenantId, ownerId);
      res.json(deals);
    } catch (error) {
      console.error("Get deals error:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });
  
  app.get("/api/deals/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const deal = await storage.getDealById(req.params.id, req.user!.tenantId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Get deal error:", error);
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });
  
  app.post("/api/deals", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const validatedData = insertDealSchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
        ownerId: req.user!.userId,
      });
      
      const deal = await storage.createDeal(validatedData);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create deal error:", error);
      res.status(500).json({ message: "Failed to create deal" });
    }
  });
  
  app.patch("/api/deals/:id", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const deal = await storage.updateDeal(req.params.id, req.user!.tenantId, req.body);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Update deal error:", error);
      res.status(500).json({ message: "Failed to update deal" });
    }
  });
  
  app.delete("/api/deals/:id", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      await storage.deleteDeal(req.params.id, req.user!.tenantId);
      res.json({ message: "Deal deleted successfully" });
    } catch (error) {
      console.error("Delete deal error:", error);
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });

  // Deal Journey - get all related data for a deal
  app.get("/api/deals/:id/journey", requireAuth, validateTenant, async (req, res) => {
    try {
      const deal = await storage.getDealById(req.params.id, req.user!.tenantId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      // Get customer if linked
      let customer = null;
      if (deal.customerId) {
        customer = await storage.getCustomerById(deal.customerId, req.user!.tenantId);
      }
      
      // Get contact if linked
      let contact = null;
      if (deal.contactId) {
        contact = await storage.getContactById(deal.contactId, req.user!.tenantId);
      }
      
      // Get related entities - scoped to deal
      const activities = await storage.getActivitiesByDeal(req.params.id, req.user!.tenantId);
      const tasks = await storage.getTasksByDeal(req.params.id, req.user!.tenantId);
      
      // Get quotations and invoices linked to the customer (if exists)
      // These are customer-level as quotations/invoices are typically customer-scoped
      let quotations: any[] = [];
      let invoices: any[] = [];
      if (deal.customerId) {
        quotations = await storage.getQuotationsByCustomer(deal.customerId, req.user!.tenantId);
        invoices = await storage.getInvoicesByCustomer(deal.customerId, req.user!.tenantId);
      }
      
      // Build timeline events
      interface TimelineEvent {
        id: string;
        type: string;
        title: string;
        description: string | null;
        date: Date;
        status: string;
      }
      
      const timelineEvents: TimelineEvent[] = [];
      
      // Add activities
      activities.forEach((a) => {
        timelineEvents.push({
          id: a.id,
          type: a.type,
          title: a.subject,
          description: a.description,
          date: a.completedAt || a.scheduledAt || a.createdAt,
          status: a.completedAt ? 'completed' : 'scheduled',
        });
      });
      
      // Add quotations
      quotations.forEach((q) => {
        timelineEvents.push({
          id: q.id,
          type: 'quotation',
          title: `Quotation ${q.quoteNumber}`,
          description: q.title,
          date: q.createdAt,
          status: q.status,
        });
      });
      
      // Add invoices
      invoices.forEach((i) => {
        timelineEvents.push({
          id: i.id,
          type: 'invoice',
          title: `Invoice ${i.invoiceNumber}`,
          description: `Total: $${Number(i.totalAmount).toLocaleString()}`,
          date: i.issueDate,
          status: i.status,
        });
      });
      
      // Add tasks
      tasks.forEach((t) => {
        timelineEvents.push({
          id: t.id,
          type: 'task',
          title: t.title,
          description: t.description,
          date: t.dueDate || t.createdAt,
          status: t.status,
        });
      });
      
      // Sort by date descending
      timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      res.json({
        deal,
        customer,
        contact,
        quotations,
        invoices,
        activities,
        tasks,
        timeline: timelineEvents,
        summary: {
          totalQuotations: quotations.length,
          totalInvoices: invoices.length,
          totalActivities: activities.length,
          totalTasks: tasks.length,
        },
      });
    } catch (error) {
      console.error("Get deal journey error:", error);
      res.status(500).json({ message: "Failed to fetch deal journey" });
    }
  });
  
  // ==================== TASK ROUTES ====================
  
  app.get("/api/tasks", requireAuth, validateTenant, async (req, res) => {
    try {
      const userType = req.user!.userType;
      const assignedTo = (userType === 'team_member' || userType === 'customer') ? req.user!.userId : undefined;
      const tasks = await storage.getTasksByTenant(req.user!.tenantId, assignedTo);
      res.json(tasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });
  
  app.get("/api/tasks/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.user!.tenantId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Get task error:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });
  
  app.post("/api/tasks", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
        assignedTo: req.body.assignedTo || req.user!.userId,
      });
      
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create task error:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  
  app.patch("/api/tasks/:id", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.user!.tenantId, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  
  app.delete("/api/tasks/:id", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      await storage.deleteTask(req.params.id, req.user!.tenantId);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // ==================== PRODUCT ROUTES ====================
  
  app.get("/api/products", requireAuth, validateTenant, async (req, res) => {
    try {
      const products = await storage.getProductsByTenant(req.user!.tenantId);
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id, req.user!.tenantId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  app.post("/api/products", requireAuth, validateTenant, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
      });
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create product error:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  
  app.patch("/api/products/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.user!.tenantId, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  app.delete("/api/products/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id, req.user!.tenantId);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ==================== CUSTOMER ROUTES ====================
  
  app.get("/api/customers", requireAuth, validateTenant, async (req, res) => {
    try {
      const customers = await storage.getCustomersByTenant(req.user!.tenantId);
      res.json(customers);
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });
  
  app.get("/api/customers/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const customer = await storage.getCustomerById(req.params.id, req.user!.tenantId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Get customer error:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });
  
  app.post("/api/customers", requireAuth, validateTenant, async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
        ownerId: req.user!.userId,
      });
      
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create customer error:", error);
      res.status(500).json({ message: "Failed to create customer" });
    }
  });
  
  app.patch("/api/customers/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const customer = await storage.updateCustomer(req.params.id, req.user!.tenantId, req.body);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Update customer error:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });
  
  app.delete("/api/customers/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteCustomer(req.params.id, req.user!.tenantId);
      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Delete customer error:", error);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Customer Journey - get all related data for a customer
  app.get("/api/customers/:id/journey", requireAuth, validateTenant, async (req, res) => {
    try {
      const customer = await storage.getCustomerById(req.params.id, req.user!.tenantId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      const contacts = await storage.getContactsByCustomer(req.params.id, req.user!.tenantId);
      const deals = await storage.getDealsByCustomer(req.params.id, req.user!.tenantId);
      const quotations = await storage.getQuotationsByCustomer(req.params.id, req.user!.tenantId);
      const invoices = await storage.getInvoicesByCustomer(req.params.id, req.user!.tenantId);
      const activities = await storage.getActivitiesByCustomer(req.params.id, req.user!.tenantId);
      const tasks = await storage.getTasksByCustomer(req.params.id, req.user!.tenantId);
      
      // Build timeline events from all data
      const timelineEvents: any[] = [];
      
      // Add activities
      activities.forEach(a => {
        timelineEvents.push({
          id: a.id,
          type: 'activity',
          subType: a.type,
          title: a.subject,
          description: a.description,
          date: a.completedAt || a.scheduledAt || a.createdAt,
          status: a.completedAt ? 'completed' : 'scheduled',
          data: a,
        });
      });
      
      // Add deals
      deals.forEach(d => {
        timelineEvents.push({
          id: d.id,
          type: 'deal',
          subType: d.stage,
          title: d.title,
          description: `Deal value: $${Number(d.value).toLocaleString()}`,
          date: d.createdAt,
          status: d.stage,
          data: d,
        });
      });
      
      // Add quotations
      quotations.forEach(q => {
        timelineEvents.push({
          id: q.id,
          type: 'quotation',
          subType: q.status,
          title: `Quotation ${q.quoteNumber}`,
          description: q.title,
          date: q.createdAt,
          status: q.status,
          data: q,
        });
      });
      
      // Add invoices
      invoices.forEach(i => {
        timelineEvents.push({
          id: i.id,
          type: 'invoice',
          subType: i.status,
          title: `Invoice ${i.invoiceNumber}`,
          description: `Total: $${Number(i.totalAmount).toLocaleString()}`,
          date: i.issueDate,
          status: i.status,
          data: i,
        });
      });
      
      // Add tasks
      tasks.forEach(t => {
        timelineEvents.push({
          id: t.id,
          type: 'task',
          subType: t.priority,
          title: t.title,
          description: t.description,
          date: t.dueDate || t.createdAt,
          status: t.status,
          data: t,
        });
      });
      
      // Sort by date descending
      timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      res.json({
        customer,
        contacts,
        deals,
        quotations,
        invoices,
        activities,
        tasks,
        timeline: timelineEvents,
        summary: {
          totalDeals: deals.length,
          totalDealValue: deals.reduce((sum, d) => sum + Number(d.value), 0),
          wonDeals: deals.filter(d => d.stage === 'closed-won' || d.stage === 'won').length,
          activeDeals: deals.filter(d => !['closed-won', 'closed-lost', 'won', 'lost'].includes(d.stage)).length,
          totalQuotations: quotations.length,
          totalInvoices: invoices.length,
          paidInvoices: invoices.filter(i => i.status === 'paid').length,
          totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.paidAmount), 0),
          pendingAmount: invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + Number(i.balanceDue), 0),
        }
      });
    } catch (error) {
      console.error("Get customer journey error:", error);
      res.status(500).json({ message: "Failed to fetch customer journey" });
    }
  });

  // ==================== QUOTATION ROUTES ====================
  
  app.get("/api/quotations", requireAuth, validateTenant, async (req, res) => {
    try {
      const userType = req.user!.userType;
      const createdBy = userType === 'team_member' ? req.user!.userId : undefined;
      const quotations = await storage.getQuotationsByTenant(req.user!.tenantId, createdBy);
      res.json(quotations);
    } catch (error) {
      console.error("Get quotations error:", error);
      res.status(500).json({ message: "Failed to fetch quotations" });
    }
  });
  
  app.get("/api/quotations/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const quotation = await storage.getQuotationById(req.params.id, req.user!.tenantId);
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
  
  app.post("/api/quotations", requireAuth, validateTenant, async (req, res) => {
    try {
      const quoteNumber = await storage.getNextQuoteNumber(req.user!.tenantId);
      const validatedData = insertQuotationSchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.userId,
        quoteNumber,
      });
      
      const quotation = await storage.createQuotation(validatedData);
      
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createQuotationItem({
            ...item,
            quotationId: quotation.id,
          });
        }
      }
      
      const items = await storage.getQuotationItems(quotation.id);
      res.status(201).json({ ...quotation, items });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create quotation error:", error);
      res.status(500).json({ message: "Failed to create quotation" });
    }
  });
  
  app.patch("/api/quotations/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const quotation = await storage.updateQuotation(req.params.id, req.user!.tenantId, req.body);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      
      if (req.body.items && Array.isArray(req.body.items)) {
        await storage.deleteQuotationItems(quotation.id);
        for (const item of req.body.items) {
          await storage.createQuotationItem({
            ...item,
            quotationId: quotation.id,
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
  
  app.delete("/api/quotations/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteQuotation(req.params.id, req.user!.tenantId);
      res.json({ message: "Quotation deleted successfully" });
    } catch (error) {
      console.error("Delete quotation error:", error);
      res.status(500).json({ message: "Failed to delete quotation" });
    }
  });

  // ==================== INVOICE ROUTES ====================
  
  app.get("/api/invoices", requireAuth, validateTenant, async (req, res) => {
    try {
      const userType = req.user!.userType;
      const createdBy = userType === 'team_member' ? req.user!.userId : undefined;
      const invoices = await storage.getInvoicesByTenant(req.user!.tenantId, createdBy);
      res.json(invoices);
    } catch (error) {
      console.error("Get invoices error:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  
  app.get("/api/invoices/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const invoice = await storage.getInvoiceById(req.params.id, req.user!.tenantId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      const items = await storage.getInvoiceItems(invoice.id);
      const payments = await storage.getPaymentsByInvoice(invoice.id);
      res.json({ ...invoice, items, payments });
    } catch (error) {
      console.error("Get invoice error:", error);
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });
  
  app.post("/api/invoices", requireAuth, validateTenant, async (req, res) => {
    try {
      const invoiceNumber = await storage.getNextInvoiceNumber(req.user!.tenantId);
      const validatedData = insertInvoiceSchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.userId,
        invoiceNumber,
      });
      
      const invoice = await storage.createInvoice(validatedData);
      
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createInvoiceItem({
            ...item,
            invoiceId: invoice.id,
          });
        }
      }
      
      const items = await storage.getInvoiceItems(invoice.id);
      res.status(201).json({ ...invoice, items });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create invoice error:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });
  
  app.patch("/api/invoices/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const invoice = await storage.updateInvoice(req.params.id, req.user!.tenantId, req.body);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      if (req.body.items && Array.isArray(req.body.items)) {
        await storage.deleteInvoiceItems(invoice.id);
        for (const item of req.body.items) {
          await storage.createInvoiceItem({
            ...item,
            invoiceId: invoice.id,
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
  
  app.delete("/api/invoices/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteInvoice(req.params.id, req.user!.tenantId);
      res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
      console.error("Delete invoice error:", error);
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // ==================== PAYMENT ROUTES ====================
  
  app.post("/api/invoices/:invoiceId/payments", requireAuth, validateTenant, async (req, res) => {
    try {
      const invoice = await storage.getInvoiceById(req.params.invoiceId, req.user!.tenantId);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      const validatedData = insertPaymentSchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
        invoiceId: invoice.id,
      });
      
      const payment = await storage.createPayment(validatedData);
      
      const payments = await storage.getPaymentsByInvoice(invoice.id);
      const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const balanceDue = Number(invoice.totalAmount) - totalPaid;
      
      let status = invoice.status;
      if (balanceDue <= 0) {
        status = "paid";
      } else if (totalPaid > 0) {
        status = "partial";
      }
      
      await storage.updateInvoice(invoice.id, req.user!.tenantId, {
        paidAmount: String(totalPaid),
        balanceDue: String(balanceDue),
        status,
      } as any);
      
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create payment error:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  // ==================== ACTIVITY ROUTES ====================
  
  app.get("/api/activities", requireAuth, validateTenant, async (req, res) => {
    try {
      const { customerId } = req.query;
      let activities;
      if (customerId && typeof customerId === 'string') {
        activities = await storage.getActivitiesByCustomer(customerId, req.user!.tenantId);
      } else {
        activities = await storage.getActivitiesByTenant(req.user!.tenantId);
      }
      res.json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  
  app.get("/api/activities/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const activity = await storage.getActivityById(req.params.id, req.user!.tenantId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      console.error("Get activity error:", error);
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });
  
  app.post("/api/activities", requireAuth, validateTenant, async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
        userId: req.user!.userId,
      });
      
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create activity error:", error);
      res.status(500).json({ message: "Failed to create activity" });
    }
  });
  
  app.patch("/api/activities/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const activity = await storage.updateActivity(req.params.id, req.user!.tenantId, req.body);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      console.error("Update activity error:", error);
      res.status(500).json({ message: "Failed to update activity" });
    }
  });
  
  app.delete("/api/activities/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteActivity(req.params.id, req.user!.tenantId);
      res.json({ message: "Activity deleted successfully" });
    } catch (error) {
      console.error("Delete activity error:", error);
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });

  // ==================== REPORTS ROUTES ====================
  
  app.get("/api/reports/dashboard", requireAuth, validateTenant, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(req.user!.tenantId);
      res.json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  
  app.get("/api/reports/sales", requireAuth, validateTenant, async (req, res) => {
    try {
      const deals = await storage.getSalesReport(req.user!.tenantId);
      res.json(deals);
    } catch (error) {
      console.error("Get sales report error:", error);
      res.status(500).json({ message: "Failed to fetch sales report" });
    }
  });

  // ==================== SAAS ADMIN ROUTES ====================
  
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
      const tenants = await storage.getAllTenants();
      res.json(tenants);
    } catch (error) {
      console.error("Get all tenants error:", error);
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  });
  
  app.get("/api/saas-admin/users", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsersWithTenants();
      res.json(users);
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get tenant details
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

  // Get user details
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

  // Platform Settings routes
  app.get("/api/saas-admin/settings", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const settings = await storage.getPlatformSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get platform settings error:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/saas-admin/settings", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { key, value, category, description } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ message: "Key and value are required" });
      }

      const setting = await storage.upsertPlatformSetting({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        category: category || 'general',
        description,
        updatedBy: req.user!.userId,
      });

      await storage.createPlatformActivityLog({
        actorId: req.user!.userId,
        actorType: 'user',
        targetType: 'platform_setting',
        targetId: setting.id,
        action: 'update_setting',
        description: `Updated platform setting: ${key}`,
        metadata: JSON.stringify({ key, value }),
      });

      res.json(setting);
    } catch (error) {
      console.error("Update platform setting error:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  app.delete("/api/saas-admin/settings/:key", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      await storage.deletePlatformSetting(req.params.key);

      await storage.createPlatformActivityLog({
        actorId: req.user!.userId,
        actorType: 'user',
        targetType: 'platform_setting',
        targetId: req.params.key,
        action: 'delete_setting',
        description: `Deleted platform setting: ${req.params.key}`,
      });

      res.json({ message: "Setting deleted successfully" });
    } catch (error) {
      console.error("Delete platform setting error:", error);
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });

  // Platform Activity Logs routes
  app.get("/api/saas-admin/activity-logs", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const { tenantId, actorId, action, targetType, from, to, limit, offset } = req.query;
      
      const logs = await storage.getPlatformActivityLogs({
        tenantId: tenantId as string | undefined,
        actorId: actorId as string | undefined,
        action: action as string | undefined,
        targetType: targetType as string | undefined,
        from: from ? new Date(from as string) : undefined,
        to: to ? new Date(to as string) : undefined,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });

      res.json(logs);
    } catch (error) {
      console.error("Get activity logs error:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Super Admin Profile routes
  app.get("/api/saas-admin/profile", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const user = await storage.getUserById(req.user!.userId);
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
        createdAt: user.createdAt,
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
        if (existingUser && existingUser.id !== req.user!.userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }

      const updates: { firstName?: string; lastName?: string; email?: string } = {};
      if (firstName) updates.firstName = firstName.trim();
      if (lastName) updates.lastName = lastName.trim();
      if (email) updates.email = email.trim().toLowerCase();

      const updatedUser = await storage.updateSuperAdminProfile(req.user!.userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      await storage.createPlatformActivityLog({
        actorId: req.user!.userId,
        actorType: 'user',
        targetType: 'user',
        targetId: req.user!.userId,
        action: 'update_profile',
        description: 'Super admin updated their profile',
        metadata: JSON.stringify(updates),
      });

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userType: updatedUser.userType,
        isAdmin: updatedUser.isAdmin,
      });
    } catch (error) {
      console.error("Update super admin profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // ==================== PACKAGES MANAGEMENT ROUTES (SaaS Admin) ====================
  
  app.get("/api/saas-admin/packages", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const packages = await storage.getAllPackagesWithModules();
      res.json(packages);
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
      const packageInputSchema = z.object({
        name: z.string().min(1, "Name is required").max(100),
        displayName: z.string().min(1, "Display name is required").max(200),
        description: z.string().max(1000).optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional(),
        billingCycle: z.enum(["monthly", "yearly", "one_time"]).optional(),
        isActive: z.boolean().optional(),
        isPopular: z.boolean().optional(),
        sortOrder: z.number().int().min(0).max(1000).optional(),
        features: z.array(z.string().max(200)).max(50).optional(),
        moduleIds: z.array(z.string()).optional(),
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
        isActive: isActive !== undefined ? isActive : true,
        isPopular: isPopular || false,
        sortOrder: sortOrder || 0,
        features: features || [],
      });

      if (moduleIds && moduleIds.length > 0) {
        const validModules = await storage.getAllModules();
        const validModuleIds = validModules.map(m => m.id);
        const invalidIds = moduleIds.filter(id => !validModuleIds.includes(id));
        if (invalidIds.length > 0) {
          await storage.deletePackage(pkg.id);
          return res.status(400).json({ message: `Invalid module IDs: ${invalidIds.join(", ")}` });
        }
        await storage.setPackageModules(pkg.id, moduleIds);
      }

      const fullPackage = await storage.getPackageWithModules(pkg.id);

      await storage.createPlatformActivityLog({
        actorId: req.user!.userId,
        actorType: 'user',
        targetType: 'package',
        targetId: pkg.id,
        action: 'create_package',
        description: `Created package: ${pkg.displayName}`,
      });

      res.status(201).json(fullPackage);
    } catch (error) {
      console.error("Create package error:", error);
      res.status(500).json({ message: "Failed to create package" });
    }
  });

  app.patch("/api/saas-admin/packages/:id", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const packageUpdateSchema = z.object({
        name: z.string().min(1).max(100).optional(),
        displayName: z.string().min(1).max(200).optional(),
        description: z.string().max(1000).optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional(),
        billingCycle: z.enum(["monthly", "yearly", "one_time"]).optional(),
        isActive: z.boolean().optional(),
        isPopular: z.boolean().optional(),
        sortOrder: z.number().int().min(0).max(1000).optional(),
        features: z.array(z.string().max(200)).max(50).optional(),
        moduleIds: z.array(z.string()).optional(),
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

      const updates: any = {};
      if (name !== undefined) updates.name = name;
      if (displayName !== undefined) updates.displayName = displayName;
      if (description !== undefined) updates.description = description;
      if (price !== undefined) updates.price = price;
      if (billingCycle !== undefined) updates.billingCycle = billingCycle;
      if (isActive !== undefined) updates.isActive = isActive;
      if (isPopular !== undefined) updates.isPopular = isPopular;
      if (sortOrder !== undefined) updates.sortOrder = sortOrder;
      if (features !== undefined) updates.features = features;

      const pkg = await storage.updatePackage(req.params.id, updates);

      if (moduleIds !== undefined) {
        if (moduleIds.length > 0) {
          const validModules = await storage.getAllModules();
          const validModuleIds = validModules.map(m => m.id);
          const invalidIds = moduleIds.filter(id => !validModuleIds.includes(id));
          if (invalidIds.length > 0) {
            return res.status(400).json({ message: `Invalid module IDs: ${invalidIds.join(", ")}` });
          }
        }
        await storage.setPackageModules(req.params.id, moduleIds);
      }

      const fullPackage = await storage.getPackageWithModules(req.params.id);

      await storage.createPlatformActivityLog({
        actorId: req.user!.userId,
        actorType: 'user',
        targetType: 'package',
        targetId: req.params.id,
        action: 'update_package',
        description: `Updated package: ${pkg?.displayName}`,
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
        actorId: req.user!.userId,
        actorType: 'user',
        targetType: 'package',
        targetId: req.params.id,
        action: 'delete_package',
        description: `Deleted package: ${pkg.displayName}`,
      });

      res.json({ message: "Package deleted successfully" });
    } catch (error) {
      console.error("Delete package error:", error);
      res.status(500).json({ message: "Failed to delete package" });
    }
  });

  app.get("/api/saas-admin/modules", requireAuth, requireSaasAdmin, async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json(modules);
    } catch (error) {
      console.error("Get modules error:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  // Public packages endpoint (for frontend pricing page)
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getActivePackages();
      const packagesWithModules = await Promise.all(
        packages.map(async (pkg) => {
          const pkgWithModules = await storage.getPackageWithModules(pkg.id);
          return pkgWithModules;
        })
      );
      res.json(packagesWithModules.filter(p => p !== undefined));
    } catch (error) {
      console.error("Get public packages error:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // ==================== CUSTOMER PORTAL ROUTES ====================
  
  app.get("/api/customer-portal/quotations", requireAuth, async (req, res) => {
    try {
      if (req.user!.userType !== 'customer') {
        return res.status(403).json({ message: "Customer access only" });
      }
      const quotations = await storage.getQuotationsForCustomerUser(req.user!.userId, req.user!.tenantId);
      res.json(quotations);
    } catch (error) {
      console.error("Get customer quotations error:", error);
      res.status(500).json({ message: "Failed to fetch quotations" });
    }
  });
  
  app.get("/api/customer-portal/invoices", requireAuth, async (req, res) => {
    try {
      if (req.user!.userType !== 'customer') {
        return res.status(403).json({ message: "Customer access only" });
      }
      const invoices = await storage.getInvoicesForCustomerUser(req.user!.userId, req.user!.tenantId);
      res.json(invoices);
    } catch (error) {
      console.error("Get customer invoices error:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  
  app.get("/api/customer-portal/profile", requireAuth, async (req, res) => {
    try {
      if (req.user!.userType !== 'customer') {
        return res.status(403).json({ message: "Customer access only" });
      }
      const user = await storage.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      console.error("Get customer profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
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
    { name: "reports", displayName: "Reports", description: "Analytics and reporting", icon: "bar-chart", isCore: true },
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

  const modules = await storage.getAllModules();
  const moduleMap = new Map(modules.map(m => [m.name, m.id]));

  const starterModules = ['contacts', 'deals', 'tasks'];
  const professionalModules = ['contacts', 'customers', 'deals', 'tasks', 'products', 'quotations', 'activities'];
  const enterpriseModules = ['contacts', 'customers', 'deals', 'tasks', 'products', 'quotations', 'invoices', 'activities', 'reports'];

  const defaultPackages = [
    {
      name: 'starter',
      displayName: 'Starter',
      description: 'Perfect for small teams just getting started with CRM',
      price: '29.00',
      billingCycle: 'monthly',
      isActive: true,
      isPopular: false,
      sortOrder: 1,
      features: [
        'Up to 5 team members',
        '1,000 contacts',
        'Basic pipeline management',
        'Email support',
        'Mobile app access'
      ],
      moduleNames: starterModules
    },
    {
      name: 'professional',
      displayName: 'Professional',
      description: 'For growing teams that need more power and flexibility',
      price: '79.00',
      billingCycle: 'monthly',
      isActive: true,
      isPopular: true,
      sortOrder: 2,
      features: [
        'Up to 25 team members',
        '10,000 contacts',
        'Advanced pipeline & forecasting',
        'Customer management',
        'Quotation management',
        'Activity tracking',
        'Priority email support',
        'API access'
      ],
      moduleNames: professionalModules
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'For large organizations with advanced needs',
      price: '199.00',
      billingCycle: 'monthly',
      isActive: true,
      isPopular: false,
      sortOrder: 3,
      features: [
        'Unlimited team members',
        'Unlimited contacts',
        'All CRM modules included',
        'Advanced reporting & analytics',
        'Invoice management',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support',
        'SLA guarantees'
      ],
      moduleNames: enterpriseModules
    }
  ];

  for (const pkgData of defaultPackages) {
    const { moduleNames, ...packageData } = pkgData;
    const pkg = await storage.createPackage(packageData);
    
    const moduleIds = moduleNames
      .map(name => moduleMap.get(name))
      .filter((id): id is string => id !== undefined);
    
    if (moduleIds.length > 0) {
      await storage.setPackageModules(pkg.id, moduleIds);
    }
  }
  
  console.log('Default packages initialized successfully');
}

async function initializeSuperAdmin() {
  const existingAdmin = await storage.getUserByEmail('superadmin@nexuscrm.com');
  if (existingAdmin) {
    return;
  }

  let platformTenant = await storage.getTenant('platform-tenant');
  if (!platformTenant) {
    const tenant = await storage.createTenant({ name: 'Nexus CRM Platform' });
    platformTenant = tenant;
  }

  const passwordHash = await hashPassword('Admin123!');
  
  await storage.createUser({
    tenantId: platformTenant.id,
    email: 'superadmin@nexuscrm.com',
    passwordHash,
    firstName: 'Super',
    lastName: 'Admin',
    userType: 'saas_admin',
    isAdmin: true,
    isActive: true,
  });
  
  console.log('Super admin initialized: superadmin@nexuscrm.com / Admin123!');
}
