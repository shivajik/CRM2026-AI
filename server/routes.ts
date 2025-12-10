import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, getRefreshTokenExpiry, verifyToken } from "./auth";
import { requireAuth, validateTenant } from "./middleware";
import { z } from "zod";
import { insertContactSchema, insertDealSchema, insertTaskSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Initialize default modules on startup
  await initializeModules();
  
  // ==================== AUTH ROUTES ====================
  
  // Register new tenant and admin user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, companyName } = req.body;
      
      if (!email || !password || !firstName || !lastName || !companyName) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Create tenant
      const tenant = await storage.createTenant({ name: companyName });
      
      // Create admin role if it doesn't exist
      let adminRole = await storage.getRoleById("admin");
      if (!adminRole) {
        adminRole = await storage.createRole({
          name: "admin",
          permissions: ["*"],
        });
      }
      
      // Create user with hashed password
      const passwordHash = await hashPassword(password);
      const user = await storage.createUser({
        tenantId: tenant.id,
        email,
        passwordHash,
        firstName,
        lastName,
        roleId: adminRole.id,
      });
      
      // Enable all modules for new tenant
      const modules = await storage.getAllModules();
      for (const module of modules) {
        await storage.enableModuleForTenant({
          tenantId: tenant.id,
          moduleId: module.id,
          isEnabled: true,
        });
      }
      
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      
      // Store refresh token
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
  
  // Login
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
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Refresh token
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
  
  // Logout
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
  
  // Get current user
  app.get("/api/auth/me", requireAuth, async (req, res) => {
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
        tenantId: user.tenantId,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // ==================== TENANT MODULE ROUTES ====================
  
  // Get enabled modules for current tenant
  app.get("/api/tenant/modules", requireAuth, validateTenant, async (req, res) => {
    try {
      const tenantModules = await storage.getTenantModules(req.user!.tenantId);
      res.json(tenantModules);
    } catch (error) {
      console.error("Get tenant modules error:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });
  
  // Toggle module for tenant
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
  
  // Get all contacts for tenant
  app.get("/api/contacts", requireAuth, validateTenant, async (req, res) => {
    try {
      const contacts = await storage.getContactsByTenant(req.user!.tenantId);
      res.json(contacts);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });
  
  // Get single contact
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
  
  // Create contact
  app.post("/api/contacts", requireAuth, validateTenant, async (req, res) => {
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
  
  // Update contact
  app.patch("/api/contacts/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const contact = await storage.updateContact(
        req.params.id,
        req.user!.tenantId,
        req.body
      );
      
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.json(contact);
    } catch (error) {
      console.error("Update contact error:", error);
      res.status(500).json({ message: "Failed to update contact" });
    }
  });
  
  // Delete contact
  app.delete("/api/contacts/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteContact(req.params.id, req.user!.tenantId);
      res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Delete contact error:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });
  
  // ==================== DEAL ROUTES ====================
  
  // Get all deals for tenant
  app.get("/api/deals", requireAuth, validateTenant, async (req, res) => {
    try {
      const deals = await storage.getDealsByTenant(req.user!.tenantId);
      res.json(deals);
    } catch (error) {
      console.error("Get deals error:", error);
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });
  
  // Get single deal
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
  
  // Create deal
  app.post("/api/deals", requireAuth, validateTenant, async (req, res) => {
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
  
  // Update deal
  app.patch("/api/deals/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const deal = await storage.updateDeal(
        req.params.id,
        req.user!.tenantId,
        req.body
      );
      
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      res.json(deal);
    } catch (error) {
      console.error("Update deal error:", error);
      res.status(500).json({ message: "Failed to update deal" });
    }
  });
  
  // Delete deal
  app.delete("/api/deals/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteDeal(req.params.id, req.user!.tenantId);
      res.json({ message: "Deal deleted successfully" });
    } catch (error) {
      console.error("Delete deal error:", error);
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });
  
  // ==================== TASK ROUTES ====================
  
  // Get all tasks for tenant
  app.get("/api/tasks", requireAuth, validateTenant, async (req, res) => {
    try {
      const tasks = await storage.getTasksByTenant(req.user!.tenantId);
      res.json(tasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });
  
  // Get single task
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
  
  // Create task
  app.post("/api/tasks", requireAuth, validateTenant, async (req, res) => {
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
  
  // Update task
  app.patch("/api/tasks/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const task = await storage.updateTask(
        req.params.id,
        req.user!.tenantId,
        req.body
      );
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });
  
  // Delete task
  app.delete("/api/tasks/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteTask(req.params.id, req.user!.tenantId);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  return httpServer;
}

// Initialize default CRM modules
async function initializeModules() {
  const defaultModules = [
    { name: "contacts", displayName: "Contacts", description: "Manage your contacts and leads", icon: "users", isCore: true },
    { name: "deals", displayName: "Deals", description: "Track sales opportunities", icon: "briefcase", isCore: true },
    { name: "tasks", displayName: "Tasks", description: "Manage tasks and activities", icon: "check-square", isCore: true },
  ];
  
  for (const module of defaultModules) {
    const existing = await storage.getModuleByName(module.name);
    if (!existing) {
      await storage.createModule(module);
    }
  }
}
