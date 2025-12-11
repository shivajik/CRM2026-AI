import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, getRefreshTokenExpiry, verifyToken } from "./auth";
import { requireAuth, validateTenant, requireAgencyAdmin, requireSaasAdmin, denyCustomerAccess } from "./middleware";
import { z } from "zod";
import { insertContactSchema, insertDealSchema, insertTaskSchema, insertProductSchema, insertCustomerSchema, insertQuotationSchema, insertQuotationItemSchema, insertInvoiceSchema, insertInvoiceItemSchema, insertPaymentSchema, insertActivitySchema, insertProposalSchema, insertProposalTemplateSchema, insertProposalSectionSchema, insertProposalPricingItemSchema, insertTemplateSectionSchema, PROPOSAL_SECTION_TYPES } from "@shared/schema";

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
          profileImageUrl: user.profileImageUrl,
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
        profileImageUrl: user.profileImageUrl,
        phone: user.phone,
        jobTitle: user.jobTitle,
        employeeCode: user.employeeCode,
        address: user.address,
        designation: user.designation,
        department: user.department,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ==================== USER LIST FOR ASSIGNMENTS ====================
  
  // Get all users in tenant (for task assignments, etc.)
  app.get("/api/users", requireAuth, validateTenant, async (req, res) => {
    try {
      const users = await storage.getUsersByTenant(req.user!.tenantId);
      
      // Return minimal user info (no sensitive data)
      const userList = users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      }));
      
      res.json(userList);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
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
      
      const { email, password, firstName, lastName, roleId, permissions, phone, employeeCode, address, designation, department } = req.body;
      
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
        phone: phone || null,
        employeeCode: employeeCode || null,
        address: address || null,
        designation: designation || null,
        department: department || null,
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
      
      const { firstName, lastName, email, roleId, permissions, isActive, phone, employeeCode, address, designation, department } = req.body;
      
      const updates: any = {};
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (email) updates.email = email;
      if (typeof isActive === 'boolean') updates.isActive = isActive;
      if (phone !== undefined) updates.phone = phone;
      if (employeeCode !== undefined) updates.employeeCode = employeeCode;
      if (address !== undefined) updates.address = address;
      if (designation !== undefined) updates.designation = designation;
      if (department !== undefined) updates.department = department;
      
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
  
  // Get team member details with related data
  app.get("/api/team/members/:id/details", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const details = await storage.getTeamMemberWithDetails(req.params.id, req.user!.tenantId);
      if (!details) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      const { passwordHash, ...memberWithoutPassword } = details.member;
      
      const totalDealsValue = details.deals.reduce((sum, d) => sum + parseFloat(d.value as string), 0);
      const wonDeals = details.deals.filter(d => d.stage === 'won');
      const wonDealsValue = wonDeals.reduce((sum, d) => sum + parseFloat(d.value as string), 0);
      
      const totalQuotationsValue = details.quotations.reduce((sum, q) => sum + parseFloat(q.totalAmount as string), 0);
      const acceptedQuotations = details.quotations.filter(q => q.status === 'accepted');
      
      const totalInvoicesValue = details.invoices.reduce((sum, i) => sum + parseFloat(i.totalAmount as string), 0);
      const paidInvoices = details.invoices.filter(i => i.status === 'paid');
      const paidInvoicesValue = paidInvoices.reduce((sum, i) => sum + parseFloat(i.totalAmount as string), 0);
      
      const completedTasks = details.tasks.filter(t => t.status === 'completed');
      const pendingTasks = details.tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
      
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
          dealWinRate: details.deals.length > 0 ? ((wonDeals.length / details.deals.length) * 100).toFixed(1) : 0,
          totalQuotations: details.quotations.length,
          totalQuotationsValue,
          acceptedQuotations: acceptedQuotations.length,
          quotationAcceptRate: details.quotations.length > 0 ? ((acceptedQuotations.length / details.quotations.length) * 100).toFixed(1) : 0,
          totalInvoices: details.invoices.length,
          totalInvoicesValue,
          paidInvoices: paidInvoices.length,
          paidInvoicesValue,
          collectionRate: totalInvoicesValue > 0 ? ((paidInvoicesValue / totalInvoicesValue) * 100).toFixed(1) : 0,
          totalTasks: details.tasks.length,
          completedTasks: completedTasks.length,
          pendingTasks: pendingTasks.length,
          taskCompletionRate: details.tasks.length > 0 ? ((completedTasks.length / details.tasks.length) * 100).toFixed(1) : 0,
          totalCustomers: details.customers.length,
          totalActivities: details.activities.length,
        }
      });
    } catch (error) {
      console.error("Get team member details error:", error);
      res.status(500).json({ message: "Failed to fetch team member details" });
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
      const { firstName, lastName, email, profileImageUrl, phone, jobTitle } = req.body;
      
      if (!firstName && !lastName && !email && profileImageUrl === undefined && phone === undefined && jobTitle === undefined) {
        return res.status(400).json({ message: "No valid fields provided for update" });
      }
      
      const updates: { firstName?: string; lastName?: string; email?: string; profileImageUrl?: string; phone?: string; jobTitle?: string } = {};
      
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
      if (profileImageUrl !== undefined) {
        updates.profileImageUrl = profileImageUrl;
      }
      if (phone !== undefined) {
        updates.phone = typeof phone === 'string' ? phone.trim() : undefined;
      }
      if (jobTitle !== undefined) {
        updates.jobTitle = typeof jobTitle === 'string' ? jobTitle.trim() : undefined;
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
        profileImageUrl: updatedUser.profileImageUrl,
        phone: updatedUser.phone,
        jobTitle: updatedUser.jobTitle,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Profile image upload (accepts base64 data URL)
  app.post("/api/users/profile/upload-image", requireAuth, async (req, res) => {
    try {
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ message: "Image data is required" });
      }
      
      // Validate base64 image data
      const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
      if (!dataUrlPattern.test(imageData)) {
        return res.status(400).json({ message: "Invalid image format. Please upload a valid image." });
      }
      
      // Check image size (limit to ~2MB after base64 encoding)
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const sizeInBytes = Buffer.from(base64Data, 'base64').length;
      const maxSize = 2 * 1024 * 1024; // 2MB
      
      if (sizeInBytes > maxSize) {
        return res.status(400).json({ message: "Image size too large. Maximum size is 2MB." });
      }
      
      // Store the base64 data URL directly
      const updatedUser = await storage.updateUser(req.user!.userId, { 
        profileImageUrl: imageData 
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        profileImageUrl: updatedUser.profileImageUrl,
        message: "Profile image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload profile image error:", error);
      res.status(500).json({ message: "Failed to upload profile image" });
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

  app.get("/api/tenant/package", requireAuth, validateTenant, async (req, res) => {
    try {
      const tenant = await storage.getTenant(req.user!.tenantId);
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
  
  // ==================== TASK ROUTES (Enhanced) ====================
  
  app.get("/api/tasks", requireAuth, validateTenant, async (req, res) => {
    try {
      const userType = req.user!.userType;
      const filters: any = {};
      
      if (userType === 'team_member' || userType === 'customer') {
        filters.assignedTo = req.user!.userId;
      }
      if (req.query.status) filters.status = req.query.status as string;
      if (req.query.priority) filters.priority = req.query.priority as string;
      if (req.query.customerId) filters.customerId = req.query.customerId as string;
      if (req.query.dealId) filters.dealId = req.query.dealId as string;
      if (req.query.dueFrom) filters.dueFrom = new Date(req.query.dueFrom as string);
      if (req.query.dueTo) filters.dueTo = new Date(req.query.dueTo as string);

      const tasks = await storage.getTasksWithFilters(req.user!.tenantId, filters);
      res.json(tasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/analytics", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const analytics = await storage.getTaskAnalytics(req.user!.tenantId);
      res.json(analytics);
    } catch (error) {
      console.error("Get task analytics error:", error);
      res.status(500).json({ message: "Failed to fetch task analytics" });
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

  app.get("/api/tasks/:id/details", requireAuth, validateTenant, async (req, res) => {
    try {
      const task = await storage.getTaskWithDetails(req.params.id, req.user!.tenantId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Get task details error:", error);
      res.status(500).json({ message: "Failed to fetch task details" });
    }
  });
  
  app.post("/api/tasks", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse({
        ...req.body,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.userId,
        assignedTo: req.body.assignedTo || null,
      });
      
      const task = await storage.createTask(validatedData);

      await storage.createTaskActivityLog({
        taskId: task.id,
        userId: req.user!.userId,
        action: 'task_created',
        description: `Task "${task.title}" was created`,
      });

      if (req.body.assignees && Array.isArray(req.body.assignees)) {
        for (const userId of req.body.assignees) {
          await storage.createTaskAssignment({
            taskId: task.id,
            userId,
            assignedBy: req.user!.userId,
          });
          
          if (userId !== req.user!.userId) {
            await storage.createTaskNotification({
              tenantId: req.user!.tenantId,
              recipientId: userId,
              taskId: task.id,
              actorId: req.user!.userId,
              type: 'task_assigned',
              title: 'New Task Assigned',
              message: `You have been assigned to task: ${task.title}`,
            });
          }
        }
      }

      if (req.body.checklists && Array.isArray(req.body.checklists)) {
        for (let i = 0; i < req.body.checklists.length; i++) {
          await storage.createTaskChecklistItem({
            taskId: task.id,
            title: req.body.checklists[i],
            sortOrder: i,
          }, req.user!.userId);
        }
      }

      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Create task error:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });
  
  app.patch("/api/tasks/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const existingTask = await storage.getTaskById(req.params.id, req.user!.tenantId);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (req.body.status && req.body.status !== existingTask.status) {
        const task = await storage.updateTaskStatus(
          req.params.id, 
          req.user!.tenantId, 
          req.body.status, 
          req.user!.userId,
          req.body.statusNotes
        );

        const creator = existingTask.createdBy;
        if (creator && creator !== req.user!.userId) {
          await storage.createTaskNotification({
            tenantId: req.user!.tenantId,
            recipientId: creator,
            taskId: req.params.id,
            actorId: req.user!.userId,
            type: 'status_changed',
            title: 'Task Status Updated',
            message: `Task "${existingTask.title}" status changed to ${req.body.status}`,
          });
        }

        delete req.body.status;
        delete req.body.statusNotes;
        
        if (Object.keys(req.body).length === 0) {
          return res.json(task);
        }
      }

      const task = await storage.updateTask(req.params.id, req.user!.tenantId, req.body);
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

  // Task Assignments
  app.get("/api/tasks/:id/assignments", requireAuth, validateTenant, async (req, res) => {
    try {
      const assignments = await storage.getTaskAssignments(req.params.id);
      res.json(assignments);
    } catch (error) {
      console.error("Get task assignments error:", error);
      res.status(500).json({ message: "Failed to fetch task assignments" });
    }
  });

  app.post("/api/tasks/:id/assignments", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.user!.tenantId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const assignment = await storage.createTaskAssignment({
        taskId: req.params.id,
        userId: req.body.userId,
        role: req.body.role || 'assignee',
        assignedBy: req.user!.userId,
      });

      if (req.body.userId !== req.user!.userId) {
        await storage.createTaskNotification({
          tenantId: req.user!.tenantId,
          recipientId: req.body.userId,
          taskId: req.params.id,
          actorId: req.user!.userId,
          type: 'task_assigned',
          title: 'New Task Assigned',
          message: `You have been assigned to task: ${task.title}`,
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

  // Task Comments
  app.get("/api/tasks/:id/comments", requireAuth, validateTenant, async (req, res) => {
    try {
      const comments = await storage.getTaskComments(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error("Get task comments error:", error);
      res.status(500).json({ message: "Failed to fetch task comments" });
    }
  });

  app.post("/api/tasks/:id/comments", requireAuth, validateTenant, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.user!.tenantId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const comment = await storage.createTaskComment({
        taskId: req.params.id,
        userId: req.user!.userId,
        content: req.body.content,
        parentId: req.body.parentId,
        isInternal: req.body.isInternal || false,
      });

      const creator = task.createdBy;
      if (creator && creator !== req.user!.userId) {
        await storage.createTaskNotification({
          tenantId: req.user!.tenantId,
          recipientId: creator,
          taskId: req.params.id,
          actorId: req.user!.userId,
          type: 'comment_added',
          title: 'New Comment',
          message: `New comment on task: ${task.title}`,
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

  // Task Checklist
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
        sortOrder: req.body.sortOrder || 0,
      }, req.user!.userId);
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

  app.post("/api/tasks/:id/checklist/:itemId/toggle", requireAuth, validateTenant, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.user!.tenantId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const item = await storage.toggleTaskChecklistItem(req.params.itemId, req.user!.userId);
      if (!item) {
        return res.status(404).json({ message: "Checklist item not found" });
      }

      if (item.isCompleted && task.createdBy && task.createdBy !== req.user!.userId) {
        await storage.createTaskNotification({
          tenantId: req.user!.tenantId,
          recipientId: task.createdBy,
          taskId: req.params.id,
          actorId: req.user!.userId,
          type: 'checklist_completed',
          title: 'Checklist Item Completed',
          message: `Checklist item completed on task: ${task.title}`,
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

  // Task Time Logs
  app.get("/api/tasks/:id/timelogs", requireAuth, validateTenant, async (req, res) => {
    try {
      const timeLogs = await storage.getTaskTimeLogs(req.params.id);
      res.json(timeLogs);
    } catch (error) {
      console.error("Get task time logs error:", error);
      res.status(500).json({ message: "Failed to fetch time logs" });
    }
  });

  app.post("/api/tasks/:id/timelogs", requireAuth, validateTenant, async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id, req.user!.tenantId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const timeLog = await storage.createTaskTimeLog({
        taskId: req.params.id,
        userId: req.user!.userId,
        startedAt: req.body.startedAt ? new Date(req.body.startedAt) : new Date(),
        endedAt: req.body.endedAt ? new Date(req.body.endedAt) : null,
        durationMinutes: req.body.durationMinutes,
        description: req.body.description,
        isBillable: req.body.isBillable || false,
      });

      if (task.createdBy && task.createdBy !== req.user!.userId) {
        await storage.createTaskNotification({
          tenantId: req.user!.tenantId,
          recipientId: task.createdBy,
          taskId: req.params.id,
          actorId: req.user!.userId,
          type: 'time_logged',
          title: 'Time Logged',
          message: `Time logged on task: ${task.title}`,
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
      const existingActive = await storage.getActiveTimeLog(req.user!.userId);
      if (existingActive) {
        await storage.stopActiveTimeLog(req.user!.userId);
      }

      const timeLog = await storage.createTaskTimeLog({
        taskId: req.params.id,
        userId: req.user!.userId,
        startedAt: new Date(),
        endedAt: null,
        description: req.body.description,
        isBillable: req.body.isBillable || false,
      });
      res.status(201).json(timeLog);
    } catch (error) {
      console.error("Start time tracking error:", error);
      res.status(500).json({ message: "Failed to start time tracking" });
    }
  });

  app.post("/api/tasks/:id/timelogs/stop", requireAuth, validateTenant, async (req, res) => {
    try {
      const timeLog = await storage.stopActiveTimeLog(req.user!.userId);
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

  // Task Activity Log
  app.get("/api/tasks/:id/activity", requireAuth, validateTenant, async (req, res) => {
    try {
      const activityLog = await storage.getTaskActivityLog(req.params.id);
      res.json(activityLog);
    } catch (error) {
      console.error("Get task activity log error:", error);
      res.status(500).json({ message: "Failed to fetch activity log" });
    }
  });

  // Task Status History
  app.get("/api/tasks/:id/status-history", requireAuth, validateTenant, async (req, res) => {
    try {
      const history = await storage.getTaskStatusHistory(req.params.id);
      res.json(history);
    } catch (error) {
      console.error("Get task status history error:", error);
      res.status(500).json({ message: "Failed to fetch status history" });
    }
  });

  // ==================== NOTIFICATION ROUTES ====================

  app.get("/api/notifications", requireAuth, validateTenant, async (req, res) => {
    try {
      const unreadOnly = req.query.unreadOnly === 'true';
      const notifications = await storage.getTaskNotifications(req.user!.userId, req.user!.tenantId, unreadOnly);
      res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/count", requireAuth, validateTenant, async (req, res) => {
    try {
      const count = await storage.getUnreadNotificationCount(req.user!.userId, req.user!.tenantId);
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

  app.post("/api/notifications/read-all", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.markAllNotificationsAsRead(req.user!.userId, req.user!.tenantId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Mark all notifications read error:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
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
      const userType = req.user!.userType;
      const ownerId = (userType === 'team_member' || userType === 'customer') ? req.user!.userId : undefined;
      const customers = await storage.getCustomersByTenant(req.user!.tenantId, ownerId);
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

  // ==================== EMAIL MODULE ROUTES ====================

  // Email Templates
  app.get("/api/email/templates", requireAuth, validateTenant, async (req, res) => {
    try {
      const templates = await storage.getEmailTemplatesByTenant(req.user!.tenantId);
      res.json(templates);
    } catch (error) {
      console.error("Get email templates error:", error);
      res.status(500).json({ message: "Failed to fetch email templates" });
    }
  });

  app.get("/api/email/templates/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const template = await storage.getEmailTemplateById(req.params.id, req.user!.tenantId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Get email template error:", error);
      res.status(500).json({ message: "Failed to fetch email template" });
    }
  });

  app.post("/api/email/templates", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const template = await storage.createEmailTemplate({
        ...req.body,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.userId,
      });
      res.status(201).json(template);
    } catch (error) {
      console.error("Create email template error:", error);
      res.status(500).json({ message: "Failed to create email template" });
    }
  });

  app.patch("/api/email/templates/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const template = await storage.updateEmailTemplate(req.params.id, req.user!.tenantId, req.body);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Update email template error:", error);
      res.status(500).json({ message: "Failed to update email template" });
    }
  });

  app.delete("/api/email/templates/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      await storage.deleteEmailTemplate(req.params.id, req.user!.tenantId);
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Delete email template error:", error);
      res.status(500).json({ message: "Failed to delete email template" });
    }
  });

  // Email Logs
  app.get("/api/email/logs", requireAuth, validateTenant, async (req, res) => {
    try {
      const logs = await storage.getEmailLogsByTenant(req.user!.tenantId);
      res.json(logs);
    } catch (error) {
      console.error("Get email logs error:", error);
      res.status(500).json({ message: "Failed to fetch email logs" });
    }
  });

  app.get("/api/email/logs/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const log = await storage.getEmailLogById(req.params.id, req.user!.tenantId);
      if (!log) {
        return res.status(404).json({ message: "Email log not found" });
      }
      res.json(log);
    } catch (error) {
      console.error("Get email log error:", error);
      res.status(500).json({ message: "Failed to fetch email log" });
    }
  });

  // Send Email
  app.post("/api/email/send", requireAuth, validateTenant, denyCustomerAccess, async (req, res) => {
    try {
      const { toEmail, ccEmails, bccEmails, subject, body, templateId, customerId, quotationId, invoiceId, attachments, scheduledAt } = req.body;
      
      if (!toEmail || !subject || !body) {
        return res.status(400).json({ message: "To, subject, and body are required" });
      }

      const senderAccount = await storage.getDefaultSenderAccount(req.user!.tenantId);
      const fromEmail = senderAccount?.email || 'noreply@nexuscrm.com';

      const log = await storage.createEmailLog({
        tenantId: req.user!.tenantId,
        sentBy: req.user!.userId,
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
        status: scheduledAt ? 'scheduled' : 'sent',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        trackingId: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });

      if (!scheduledAt) {
        await storage.updateEmailLog(log.id, { sentAt: new Date() });
      }

      res.status(201).json({ message: "Email sent successfully", log });
    } catch (error) {
      console.error("Send email error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // Automation Rules
  app.get("/api/email/automations", requireAuth, validateTenant, async (req, res) => {
    try {
      const rules = await storage.getAutomationRulesByTenant(req.user!.tenantId);
      res.json(rules);
    } catch (error) {
      console.error("Get automation rules error:", error);
      res.status(500).json({ message: "Failed to fetch automation rules" });
    }
  });

  app.get("/api/email/automations/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const rule = await storage.getAutomationRuleById(req.params.id, req.user!.tenantId);
      if (!rule) {
        return res.status(404).json({ message: "Automation rule not found" });
      }
      res.json(rule);
    } catch (error) {
      console.error("Get automation rule error:", error);
      res.status(500).json({ message: "Failed to fetch automation rule" });
    }
  });

  app.post("/api/email/automations", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const rule = await storage.createAutomationRule({
        ...req.body,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.userId,
      });
      res.status(201).json(rule);
    } catch (error) {
      console.error("Create automation rule error:", error);
      res.status(500).json({ message: "Failed to create automation rule" });
    }
  });

  app.patch("/api/email/automations/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const rule = await storage.updateAutomationRule(req.params.id, req.user!.tenantId, req.body);
      if (!rule) {
        return res.status(404).json({ message: "Automation rule not found" });
      }
      res.json(rule);
    } catch (error) {
      console.error("Update automation rule error:", error);
      res.status(500).json({ message: "Failed to update automation rule" });
    }
  });

  app.delete("/api/email/automations/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      await storage.deleteAutomationRule(req.params.id, req.user!.tenantId);
      res.json({ message: "Automation rule deleted successfully" });
    } catch (error) {
      console.error("Delete automation rule error:", error);
      res.status(500).json({ message: "Failed to delete automation rule" });
    }
  });

  // Follow-up Sequences
  app.get("/api/email/sequences", requireAuth, validateTenant, async (req, res) => {
    try {
      const sequences = await storage.getFollowUpSequencesByTenant(req.user!.tenantId);
      res.json(sequences);
    } catch (error) {
      console.error("Get follow-up sequences error:", error);
      res.status(500).json({ message: "Failed to fetch follow-up sequences" });
    }
  });

  app.get("/api/email/sequences/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const sequence = await storage.getFollowUpSequenceById(req.params.id, req.user!.tenantId);
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

  app.post("/api/email/sequences", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const { steps, ...sequenceData } = req.body;
      const sequence = await storage.createFollowUpSequence({
        ...sequenceData,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.userId,
      });
      
      if (steps && Array.isArray(steps)) {
        for (const step of steps) {
          await storage.createFollowUpStep({
            ...step,
            sequenceId: sequence.id,
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

  app.patch("/api/email/sequences/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const { steps, ...sequenceData } = req.body;
      const sequence = await storage.updateFollowUpSequence(req.params.id, req.user!.tenantId, sequenceData);
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

  app.delete("/api/email/sequences/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      await storage.deleteFollowUpSequence(req.params.id, req.user!.tenantId);
      res.json({ message: "Follow-up sequence deleted successfully" });
    } catch (error) {
      console.error("Delete follow-up sequence error:", error);
      res.status(500).json({ message: "Failed to delete follow-up sequence" });
    }
  });

  // Follow-up Steps
  app.post("/api/email/sequences/:sequenceId/steps", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const step = await storage.createFollowUpStep({
        ...req.body,
        sequenceId: req.params.sequenceId,
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

  // Scheduled Emails
  app.get("/api/email/scheduled", requireAuth, validateTenant, async (req, res) => {
    try {
      const emails = await storage.getPendingScheduledEmails(req.user!.tenantId);
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

  // Email Sender Accounts
  app.get("/api/email/senders", requireAuth, validateTenant, async (req, res) => {
    try {
      const accounts = await storage.getEmailSenderAccountsByTenant(req.user!.tenantId);
      res.json(accounts);
    } catch (error) {
      console.error("Get sender accounts error:", error);
      res.status(500).json({ message: "Failed to fetch sender accounts" });
    }
  });

  app.post("/api/email/senders", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const account = await storage.createEmailSenderAccount({
        ...req.body,
        tenantId: req.user!.tenantId,
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

  // SMTP Settings
  app.get("/api/email/smtp-settings", requireAuth, validateTenant, async (req, res) => {
    try {
      const settings = await storage.getSmtpSettings(req.user!.tenantId);
      if (settings) {
        const { smtpPassword, apiKey, ...safeSettings } = settings;
        res.json({
          ...safeSettings,
          hasPassword: !!smtpPassword,
          hasApiKey: !!apiKey,
        });
      } else {
        res.json({
          provider: "default",
          isEnabled: true,
          isVerified: false,
        });
      }
    } catch (error) {
      console.error("Get SMTP settings error:", error);
      res.status(500).json({ message: "Failed to fetch SMTP settings" });
    }
  });

  app.put("/api/email/smtp-settings", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const settings = await storage.upsertSmtpSettings(req.user!.tenantId, req.body);
      const { smtpPassword, apiKey, ...safeSettings } = settings;
      res.json({
        ...safeSettings,
        hasPassword: !!smtpPassword,
        hasApiKey: !!apiKey,
      });
    } catch (error) {
      console.error("Update SMTP settings error:", error);
      res.status(500).json({ message: "Failed to update SMTP settings" });
    }
  });

  app.post("/api/email/smtp-settings/test", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const result = await storage.testSmtpConnection(req.user!.tenantId);
      if (result.success) {
        await storage.upsertSmtpSettings(req.user!.tenantId, { 
          isVerified: true,
        } as any);
      }
      res.json(result);
    } catch (error) {
      console.error("Test SMTP connection error:", error);
      res.status(500).json({ success: false, message: "Failed to test SMTP connection" });
    }
  });

  // Merge Fields - Get available merge fields
  app.get("/api/email/merge-fields", requireAuth, validateTenant, async (req, res) => {
    try {
      const mergeFields = [
        { category: "Client", fields: [
          { key: "{{client.name}}", label: "Client Name" },
          { key: "{{client.email}}", label: "Client Email" },
          { key: "{{client.phone}}", label: "Client Phone" },
          { key: "{{client.company}}", label: "Client Company" },
          { key: "{{client.address}}", label: "Client Address" },
        ]},
        { category: "Quotation", fields: [
          { key: "{{quotation.number}}", label: "Quotation Number" },
          { key: "{{quotation.amount}}", label: "Quotation Amount" },
          { key: "{{quotation.title}}", label: "Quotation Title" },
          { key: "{{quotation.valid_until}}", label: "Valid Until" },
        ]},
        { category: "Invoice", fields: [
          { key: "{{invoice.number}}", label: "Invoice Number" },
          { key: "{{invoice.amount}}", label: "Invoice Amount" },
          { key: "{{invoice.due_date}}", label: "Due Date" },
          { key: "{{invoice.balance}}", label: "Balance Due" },
        ]},
        { category: "Agency", fields: [
          { key: "{{agency.name}}", label: "Agency Name" },
          { key: "{{agency.email}}", label: "Agency Email" },
          { key: "{{agency.phone}}", label: "Agency Phone" },
          { key: "{{agency.website}}", label: "Agency Website" },
        ]},
        { category: "User", fields: [
          { key: "{{user.name}}", label: "Sender Name" },
          { key: "{{user.email}}", label: "Sender Email" },
        ]},
        { category: "Date", fields: [
          { key: "{{current_date}}", label: "Current Date" },
          { key: "{{due_date}}", label: "Due Date" },
        ]},
      ];
      res.json(mergeFields);
    } catch (error) {
      console.error("Get merge fields error:", error);
      res.status(500).json({ message: "Failed to fetch merge fields" });
    }
  });

  // Process merge fields in content
  app.post("/api/email/process-merge-fields", requireAuth, validateTenant, async (req, res) => {
    try {
      const { content, customerId, quotationId, invoiceId } = req.body;
      
      let processedContent = content;
      
      // Get customer data
      if (customerId) {
        const customer = await storage.getCustomerById(customerId, req.user!.tenantId);
        if (customer) {
          processedContent = processedContent
            .replace(/\{\{client\.name\}\}/g, customer.name || '')
            .replace(/\{\{client\.email\}\}/g, customer.email || '')
            .replace(/\{\{client\.phone\}\}/g, customer.phone || '')
            .replace(/\{\{client\.company\}\}/g, customer.company || '')
            .replace(/\{\{client\.address\}\}/g, customer.address || '');
        }
      }
      
      // Get quotation data
      if (quotationId) {
        const quotation = await storage.getQuotationById(quotationId, req.user!.tenantId);
        if (quotation) {
          processedContent = processedContent
            .replace(/\{\{quotation\.number\}\}/g, quotation.quoteNumber || '')
            .replace(/\{\{quotation\.amount\}\}/g, String(quotation.totalAmount) || '')
            .replace(/\{\{quotation\.title\}\}/g, quotation.title || '')
            .replace(/\{\{quotation\.valid_until\}\}/g, quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : '');
        }
      }
      
      // Get invoice data
      if (invoiceId) {
        const invoice = await storage.getInvoiceById(invoiceId, req.user!.tenantId);
        if (invoice) {
          processedContent = processedContent
            .replace(/\{\{invoice\.number\}\}/g, invoice.invoiceNumber || '')
            .replace(/\{\{invoice\.amount\}\}/g, String(invoice.totalAmount) || '')
            .replace(/\{\{invoice\.due_date\}\}/g, invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '')
            .replace(/\{\{invoice\.balance\}\}/g, String(invoice.balanceDue) || '');
        }
      }
      
      // Get company profile
      const companyProfile = await storage.getCompanyProfile(req.user!.tenantId);
      if (companyProfile) {
        processedContent = processedContent
          .replace(/\{\{agency\.name\}\}/g, companyProfile.companyName || '')
          .replace(/\{\{agency\.email\}\}/g, companyProfile.email || '')
          .replace(/\{\{agency\.phone\}\}/g, companyProfile.phone || '')
          .replace(/\{\{agency\.website\}\}/g, companyProfile.website || '');
      }
      
      // Get user data
      const user = await storage.getUserById(req.user!.userId);
      if (user) {
        processedContent = processedContent
          .replace(/\{\{user\.name\}\}/g, `${user.firstName} ${user.lastName}`)
          .replace(/\{\{user\.email\}\}/g, user.email || '');
      }
      
      // Date fields
      processedContent = processedContent
        .replace(/\{\{current_date\}\}/g, new Date().toLocaleDateString());
      
      // Handle fallback values like {{field | "default"}}
      processedContent = processedContent.replace(/\{\{[^}]+\s*\|\s*"([^"]+)"\}\}/g, '$1');
      
      res.json({ processedContent });
    } catch (error) {
      console.error("Process merge fields error:", error);
      res.status(500).json({ message: "Failed to process merge fields" });
    }
  });

  // AI Writing Assistant endpoint
  app.post("/api/email/ai-assist", requireAuth, validateTenant, async (req, res) => {
    try {
      const { action, content, context } = req.body;
      
      // Simulated AI responses based on action
      let result = content;
      
      switch (action) {
        case 'improve_tone':
          result = content.replace(/\b(please|kindly)\b/gi, 'we would appreciate if you')
            .replace(/\bASAP\b/gi, 'at your earliest convenience')
            .replace(/\bfyi\b/gi, 'for your information');
          break;
        case 'shorten':
          const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim());
          result = sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ') + '.';
          break;
        case 'make_persuasive':
          result = content + "\n\nWe believe this opportunity aligns perfectly with your goals, and we're confident you'll see exceptional value in moving forward. Don't miss this chance to elevate your business.";
          break;
        case 'fix_grammar':
          result = content.replace(/\s+/g, ' ').trim();
          break;
        case 'generate_subject':
          const words = content.split(' ').slice(0, 5).join(' ');
          result = `Re: ${words}...`;
          break;
        case 'expand':
          result = content + "\n\nWe would like to provide you with more details about our services. Our team is dedicated to delivering exceptional results tailored to your specific needs. We look forward to the opportunity to discuss how we can help you achieve your goals.";
          break;
        case 'formal':
          result = `Dear Valued Customer,\n\n${content}\n\nBest regards`;
          break;
        case 'friendly':
          result = `Hi there!\n\n${content}\n\nCheers!`;
          break;
        default:
          result = content;
      }
      
      res.json({ result, action });
    } catch (error) {
      console.error("AI assist error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  // ==================== PROPOSAL BUILDER MODULE ====================

  // Get all proposals
  app.get("/api/proposals", requireAuth, validateTenant, async (req, res) => {
    try {
      const { status, customerId, ownerId } = req.query;
      const proposals = await storage.getProposalsByTenant(req.user!.tenantId, {
        status: status as string | undefined,
        customerId: customerId as string | undefined,
        ownerId: ownerId as string | undefined,
      });
      res.json(proposals);
    } catch (error) {
      console.error("Get proposals error:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  // Get proposal analytics
  app.get("/api/proposals/analytics", requireAuth, validateTenant, async (req, res) => {
    try {
      const analytics = await storage.getProposalAnalytics(req.user!.tenantId);
      res.json(analytics);
    } catch (error) {
      console.error("Get proposal analytics error:", error);
      res.status(500).json({ message: "Failed to fetch proposal analytics" });
    }
  });

  // Get single proposal with details
  app.get("/api/proposals/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const proposal = await storage.getProposalById(req.params.id, req.user!.tenantId);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      const sections = await storage.getProposalSections(proposal.id);
      const pricingItems = await storage.getProposalPricingItems(proposal.id);
      const versions = await storage.getProposalVersions(proposal.id);
      const activityLogs = await storage.getProposalActivityLogs(proposal.id);
      const comments = await storage.getProposalComments(proposal.id);
      const signatures = await storage.getProposalSignatures(proposal.id);
      const customer = proposal.customerId ? await storage.getCustomerById(proposal.customerId, req.user!.tenantId) : null;
      
      res.json({
        ...proposal,
        sections,
        pricingItems,
        versions,
        activityLogs,
        comments,
        signatures,
        customer,
      });
    } catch (error) {
      console.error("Get proposal error:", error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });

  // Create new proposal
  app.post("/api/proposals", requireAuth, validateTenant, async (req, res) => {
    try {
      const proposalNumber = await storage.getNextProposalNumber(req.user!.tenantId);
      const { sections, pricingItems, ...proposalData } = req.body;
      
      const proposal = await storage.createProposal({
        ...proposalData,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.userId,
        ownerId: req.body.ownerId || req.user!.userId,
        proposalNumber,
        status: 'draft',
      });
      
      // Create sections if provided
      if (sections && Array.isArray(sections)) {
        for (const section of sections) {
          await storage.createProposalSection({
            proposalId: proposal.id,
            ...section,
          });
        }
      }
      
      // Create pricing items if provided
      if (pricingItems && Array.isArray(pricingItems)) {
        for (const item of pricingItems) {
          await storage.createProposalPricingItem({
            proposalId: proposal.id,
            ...item,
          });
        }
      }
      
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        userId: req.user!.userId,
        action: 'created',
        details: 'Proposal created',
      });
      
      // Fetch the complete proposal with sections and pricing
      const createdSections = await storage.getProposalSections(proposal.id);
      const createdPricingItems = await storage.getProposalPricingItems(proposal.id);
      res.status(201).json({
        ...proposal,
        sections: createdSections,
        pricingItems: createdPricingItems,
      });
    } catch (error) {
      console.error("Create proposal error:", error);
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });

  // Create proposal from template
  app.post("/api/proposals/from-template/:templateId", requireAuth, validateTenant, async (req, res) => {
    try {
      const proposalNumber = await storage.getNextProposalNumber(req.user!.tenantId);
      
      const proposal = await storage.createProposalFromTemplate(req.params.templateId, {
        ...req.body,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.userId,
        ownerId: req.body.ownerId || req.user!.userId,
        proposalNumber,
        status: 'draft',
      });
      
      if (!proposal) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        userId: req.user!.userId,
        action: 'created_from_template',
        details: `Proposal created from template`,
      });
      
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Create proposal from template error:", error);
      res.status(500).json({ message: "Failed to create proposal from template" });
    }
  });

  // Update proposal
  app.patch("/api/proposals/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const proposal = await storage.updateProposal(req.params.id, req.user!.tenantId, req.body);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        userId: req.user!.userId,
        action: 'updated',
        details: 'Proposal updated',
      });
      
      res.json(proposal);
    } catch (error) {
      console.error("Update proposal error:", error);
      res.status(500).json({ message: "Failed to update proposal" });
    }
  });

  // Update proposal status
  app.patch("/api/proposals/:id/status", requireAuth, validateTenant, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const proposal = await storage.updateProposalStatus(
        req.params.id, 
        req.user!.tenantId, 
        status, 
        req.user!.userId,
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

  // Send proposal (generate access token and update status)
  app.post("/api/proposals/:id/send", requireAuth, validateTenant, async (req, res) => {
    try {
      const accessToken = await storage.generateProposalAccessToken(req.params.id, req.user!.tenantId);
      const proposal = await storage.updateProposalStatus(
        req.params.id, 
        req.user!.tenantId, 
        'sent', 
        req.user!.userId,
        'Proposal sent to client'
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

  // Create proposal version (snapshot)
  app.post("/api/proposals/:id/version", requireAuth, validateTenant, async (req, res) => {
    try {
      const proposal = await storage.getProposalById(req.params.id, req.user!.tenantId);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      const sections = await storage.getProposalSections(proposal.id);
      const pricingItems = await storage.getProposalPricingItems(proposal.id);
      
      const snapshot = JSON.stringify({
        title: proposal.title,
        sections,
        pricingItems,
        totalAmount: proposal.totalAmount,
      });
      
      const version = await storage.createProposalVersion({
        proposalId: proposal.id,
        versionNumber: proposal.currentVersion,
        createdBy: req.user!.userId,
        snapshot,
        changeNotes: req.body.notes || 'Version saved',
      });
      
      await storage.updateProposal(proposal.id, req.user!.tenantId, {
        currentVersion: proposal.currentVersion + 1,
      } as any);
      
      res.status(201).json(version);
    } catch (error) {
      console.error("Create proposal version error:", error);
      res.status(500).json({ message: "Failed to create proposal version" });
    }
  });

  // Restore proposal version
  app.post("/api/proposals/:id/restore/:versionId", requireAuth, validateTenant, async (req, res) => {
    try {
      const proposal = await storage.restoreProposalVersion(
        req.params.id, 
        req.params.versionId, 
        req.user!.tenantId, 
        req.user!.userId
      );
      
      if (!proposal) {
        return res.status(404).json({ message: "Proposal or version not found" });
      }
      
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        userId: req.user!.userId,
        action: 'version_restored',
        details: `Restored to version ${req.params.versionId}`,
      });
      
      res.json(proposal);
    } catch (error) {
      console.error("Restore proposal version error:", error);
      res.status(500).json({ message: "Failed to restore proposal version" });
    }
  });

  // Delete proposal
  app.delete("/api/proposals/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteProposal(req.params.id, req.user!.tenantId);
      res.json({ message: "Proposal deleted successfully" });
    } catch (error) {
      console.error("Delete proposal error:", error);
      res.status(500).json({ message: "Failed to delete proposal" });
    }
  });

  // Proposal Sections
  app.post("/api/proposals/:proposalId/sections", requireAuth, validateTenant, async (req, res) => {
    try {
      const section = await storage.createProposalSection({
        ...req.body,
        proposalId: req.params.proposalId,
      });
      res.status(201).json(section);
    } catch (error) {
      console.error("Create proposal section error:", error);
      res.status(500).json({ message: "Failed to create proposal section" });
    }
  });

  app.patch("/api/proposals/sections/:id", requireAuth, validateTenant, async (req, res) => {
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

  app.delete("/api/proposals/sections/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteProposalSection(req.params.id);
      res.json({ message: "Section deleted successfully" });
    } catch (error) {
      console.error("Delete proposal section error:", error);
      res.status(500).json({ message: "Failed to delete proposal section" });
    }
  });

  app.post("/api/proposals/:proposalId/sections/reorder", requireAuth, validateTenant, async (req, res) => {
    try {
      const { sectionIds } = req.body;
      await storage.reorderProposalSections(req.params.proposalId, sectionIds);
      res.json({ message: "Sections reordered successfully" });
    } catch (error) {
      console.error("Reorder proposal sections error:", error);
      res.status(500).json({ message: "Failed to reorder sections" });
    }
  });

  // Proposal Pricing Items
  app.post("/api/proposals/:proposalId/pricing", requireAuth, validateTenant, async (req, res) => {
    try {
      const item = await storage.createProposalPricingItem({
        ...req.body,
        proposalId: req.params.proposalId,
      });
      
      await storage.recalculateProposalTotals(req.params.proposalId, req.user!.tenantId);
      
      res.status(201).json(item);
    } catch (error) {
      console.error("Create pricing item error:", error);
      res.status(500).json({ message: "Failed to create pricing item" });
    }
  });

  app.patch("/api/proposals/pricing/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const item = await storage.updateProposalPricingItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Pricing item not found" });
      }
      
      if (item.proposalId) {
        await storage.recalculateProposalTotals(item.proposalId, req.user!.tenantId);
      }
      
      res.json(item);
    } catch (error) {
      console.error("Update pricing item error:", error);
      res.status(500).json({ message: "Failed to update pricing item" });
    }
  });

  app.delete("/api/proposals/pricing/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteProposalPricingItem(req.params.id);
      res.json({ message: "Pricing item deleted successfully" });
    } catch (error) {
      console.error("Delete pricing item error:", error);
      res.status(500).json({ message: "Failed to delete pricing item" });
    }
  });

  // Proposal Comments
  app.post("/api/proposals/:proposalId/comments", requireAuth, validateTenant, async (req, res) => {
    try {
      const comment = await storage.createProposalComment({
        ...req.body,
        proposalId: req.params.proposalId,
        userId: req.user!.userId,
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error("Create comment error:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.patch("/api/proposals/comments/:id", requireAuth, validateTenant, async (req, res) => {
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

  app.delete("/api/proposals/comments/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      await storage.deleteProposalComment(req.params.id);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Delete comment error:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // ==================== PROPOSAL TEMPLATES ====================

  app.get("/api/proposal-templates", requireAuth, validateTenant, async (req, res) => {
    try {
      const templates = await storage.getProposalTemplatesByTenant(req.user!.tenantId);
      res.json(templates);
    } catch (error) {
      console.error("Get templates error:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/proposal-templates/:id", requireAuth, validateTenant, async (req, res) => {
    try {
      const template = await storage.getProposalTemplateById(req.params.id, req.user!.tenantId);
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

  app.post("/api/proposal-templates", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const template = await storage.createProposalTemplate({
        ...req.body,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.userId,
      });
      res.status(201).json(template);
    } catch (error) {
      console.error("Create template error:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.patch("/api/proposal-templates/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const template = await storage.updateProposalTemplate(req.params.id, req.user!.tenantId, req.body);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Update template error:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.post("/api/proposal-templates/:id/duplicate", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const template = await storage.duplicateProposalTemplate(
        req.params.id, 
        req.user!.tenantId, 
        req.user!.userId
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

  app.delete("/api/proposal-templates/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      await storage.deleteProposalTemplate(req.params.id, req.user!.tenantId);
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Delete template error:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Template Sections
  app.post("/api/proposal-templates/:templateId/sections", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const section = await storage.createTemplateSection({
        ...req.body,
        templateId: req.params.templateId,
      });
      res.status(201).json(section);
    } catch (error) {
      console.error("Create template section error:", error);
      res.status(500).json({ message: "Failed to create template section" });
    }
  });

  app.patch("/api/proposal-templates/sections/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
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

  app.delete("/api/proposal-templates/sections/:id", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      await storage.deleteTemplateSection(req.params.id);
      res.json({ message: "Section deleted successfully" });
    } catch (error) {
      console.error("Delete template section error:", error);
      res.status(500).json({ message: "Failed to delete template section" });
    }
  });

  app.post("/api/proposal-templates/:templateId/sections/reorder", requireAuth, validateTenant, requireAgencyAdmin, async (req, res) => {
    try {
      const { sectionIds } = req.body;
      await storage.reorderTemplateSections(req.params.templateId, sectionIds);
      res.json({ message: "Sections reordered successfully" });
    } catch (error) {
      console.error("Reorder template sections error:", error);
      res.status(500).json({ message: "Failed to reorder sections" });
    }
  });

  // ==================== PUBLIC PROPOSAL VIEW (Client-facing) ====================

  // Public proposal view (no auth required, uses access token)
  app.get("/api/public/proposal/:accessToken", async (req, res) => {
    try {
      const proposal = await storage.getProposalByAccessToken(req.params.accessToken);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      // Check if expired
      if (proposal.expiresAt && new Date(proposal.expiresAt) < new Date()) {
        return res.status(410).json({ message: "This proposal has expired" });
      }
      
      const sections = await storage.getProposalSections(proposal.id);
      const pricingItems = await storage.getProposalPricingItems(proposal.id);
      const signatures = await storage.getProposalSignatures(proposal.id);
      const customer = await storage.getCustomerById(proposal.customerId, proposal.tenantId);
      const companyProfile = await storage.getCompanyProfile(proposal.tenantId);
      
      // Record view
      await storage.recordProposalView(proposal.id, {
        deviceType: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
        userAgent: req.headers['user-agent'] || undefined,
        ipAddress: req.ip || undefined,
      });
      
      // Update status to viewed if it was sent
      if (proposal.status === 'sent') {
        await storage.updateProposal(proposal.id, proposal.tenantId, { status: 'viewed' } as any);
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
        sections,
        pricingItems,
        signatures,
        customer: customer ? { name: customer.name, company: customer.company, email: customer.email } : null,
        company: companyProfile ? { 
          name: companyProfile.companyName, 
          logo: companyProfile.logo,
          email: companyProfile.email,
          phone: companyProfile.phone,
        } : null,
      });
    } catch (error) {
      console.error("Get public proposal error:", error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });

  // Accept proposal (public)
  app.post("/api/public/proposal/:accessToken/accept", async (req, res) => {
    try {
      const proposal = await storage.getProposalByAccessToken(req.params.accessToken);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      const { signerName, signerEmail, signatureData, signatureType, selectedPackage } = req.body;
      
      // Create signature
      await storage.createProposalSignature({
        proposalId: proposal.id,
        signerName,
        signerEmail,
        signatureType: signatureType || 'typed',
        signatureData,
        ipAddress: req.ip || undefined,
        userAgent: req.headers['user-agent'] || undefined,
      });
      
      // Update proposal status
      await storage.updateProposal(proposal.id, proposal.tenantId, {
        status: 'accepted',
        selectedPackage: selectedPackage || undefined,
        acceptedAt: new Date(),
      } as any);
      
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        action: 'accepted',
        details: `Proposal accepted by ${signerName} (${signerEmail})`,
        ipAddress: req.ip || undefined,
        userAgent: req.headers['user-agent'] || undefined,
      });
      
      res.json({ message: "Proposal accepted successfully" });
    } catch (error) {
      console.error("Accept proposal error:", error);
      res.status(500).json({ message: "Failed to accept proposal" });
    }
  });

  // Reject proposal (public)
  app.post("/api/public/proposal/:accessToken/reject", async (req, res) => {
    try {
      const proposal = await storage.getProposalByAccessToken(req.params.accessToken);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      const { reason, email } = req.body;
      
      await storage.updateProposal(proposal.id, proposal.tenantId, {
        status: 'rejected',
        clientComments: reason || undefined,
        rejectedAt: new Date(),
      } as any);
      
      await storage.createProposalActivityLog({
        proposalId: proposal.id,
        action: 'rejected',
        details: reason ? `Proposal rejected. Reason: ${reason}` : 'Proposal rejected',
        ipAddress: req.ip || undefined,
        userAgent: req.headers['user-agent'] || undefined,
      });
      
      res.json({ message: "Proposal rejected" });
    } catch (error) {
      console.error("Reject proposal error:", error);
      res.status(500).json({ message: "Failed to reject proposal" });
    }
  });

  // Add client comment (public)
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
        sectionId: sectionId || undefined,
        isInternal: false,
      });
      
      res.status(201).json(comment);
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // ==================== PROPOSAL AI ASSISTANT ====================

  app.post("/api/proposals/ai-assist", requireAuth, validateTenant, async (req, res) => {
    try {
      const { action, content, context } = req.body;
      
      let result = content || '';
      
      switch (action) {
        case 'generate_introduction':
          result = `We are pleased to present this proposal for ${context?.projectName || 'your project'}. Our team has carefully analyzed your requirements and developed a comprehensive solution that addresses your specific needs.\n\nWith our proven track record and expertise, we are confident in our ability to deliver exceptional results that exceed your expectations.`;
          break;
        case 'generate_scope':
          result = `## Scope of Work\n\nThis engagement includes the following key deliverables:\n\n1. **Discovery & Planning** - Comprehensive analysis of requirements and project roadmap\n2. **Design & Development** - Creation of solutions aligned with your objectives\n3. **Testing & Quality Assurance** - Rigorous testing to ensure reliability\n4. **Deployment & Launch** - Seamless implementation and go-live support\n5. **Training & Documentation** - Knowledge transfer and user guides`;
          break;
        case 'generate_timeline':
          result = `## Project Timeline\n\n| Phase | Duration | Milestones |\n|-------|----------|------------|\n| Discovery | Week 1-2 | Requirements finalized |\n| Design | Week 3-4 | Designs approved |\n| Development | Week 5-8 | Core features complete |\n| Testing | Week 9-10 | QA sign-off |\n| Launch | Week 11-12 | Go-live |`;
          break;
        case 'generate_terms':
          result = `## Terms & Conditions\n\n**Payment Terms**\n- 50% deposit upon project commencement\n- 25% upon design approval\n- 25% upon project completion\n\n**Project Modifications**\nAny changes to the scope will be documented and may affect timeline and cost.\n\n**Intellectual Property**\nUpon full payment, all deliverables become your property.\n\n**Confidentiality**\nBoth parties agree to maintain confidentiality of sensitive information.`;
          break;
        case 'improve_tone':
          result = content.replace(/\b(please|kindly)\b/gi, 'we would appreciate if you')
            .replace(/\bASAP\b/gi, 'at your earliest convenience');
          break;
        case 'make_formal':
          result = content.replace(/\b(hey|hi)\b/gi, 'Dear')
            .replace(/\b(thanks)\b/gi, 'Thank you');
          break;
        case 'make_persuasive':
          result = content + "\n\nThis solution represents an exceptional opportunity to achieve your goals efficiently and effectively. We are committed to delivering outstanding results and building a lasting partnership.";
          break;
        case 'shorten':
          const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim());
          result = sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ') + '.';
          break;
        case 'expand':
          result = content + "\n\nOur approach is designed to maximize value while minimizing risk. We bring together industry best practices, innovative thinking, and a deep commitment to your success.";
          break;
        default:
          result = content;
      }
      
      res.json({ result, action });
    } catch (error) {
      console.error("AI assist error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  // Get section types
  app.get("/api/proposals/section-types", requireAuth, validateTenant, async (req, res) => {
    try {
      const sectionTypes = Object.entries(PROPOSAL_SECTION_TYPES).map(([key, value]) => ({
        id: value,
        name: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      }));
      res.json(sectionTypes);
    } catch (error) {
      console.error("Get section types error:", error);
      res.status(500).json({ message: "Failed to fetch section types" });
    }
  });

  // Proposal merge fields
  app.get("/api/proposals/merge-fields", requireAuth, validateTenant, async (req, res) => {
    try {
      const mergeFields = [
        { category: "Client", fields: [
          { key: "{{client.name}}", label: "Client Name" },
          { key: "{{client.company}}", label: "Client Company" },
          { key: "{{client.email}}", label: "Client Email" },
          { key: "{{client.phone}}", label: "Client Phone" },
          { key: "{{client.address}}", label: "Client Address" },
        ]},
        { category: "Project", fields: [
          { key: "{{project.name}}", label: "Project Name" },
          { key: "{{start_date}}", label: "Start Date" },
          { key: "{{deliverable.count}}", label: "Deliverable Count" },
        ]},
        { category: "Proposal", fields: [
          { key: "{{proposal.date}}", label: "Proposal Date" },
          { key: "{{proposal.number}}", label: "Proposal Number" },
          { key: "{{quote.total}}", label: "Quote Total" },
          { key: "{{valid_until}}", label: "Valid Until" },
        ]},
        { category: "Agency", fields: [
          { key: "{{agency.name}}", label: "Agency Name" },
          { key: "{{agency.email}}", label: "Agency Email" },
          { key: "{{agency.phone}}", label: "Agency Phone" },
          { key: "{{agency.website}}", label: "Agency Website" },
        ]},
      ];
      res.json(mergeFields);
    } catch (error) {
      console.error("Get merge fields error:", error);
      res.status(500).json({ message: "Failed to fetch merge fields" });
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
