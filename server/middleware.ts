import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JWTPayload } from "./auth";
import { USER_TYPES } from "@shared/schema";
import { storage } from "./storage";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      workspaceId?: string; // Active workspace context (only when multi_workspace_enabled)
      multiWorkspaceEnabled?: boolean; // Flag status for current user/tenant
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
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

export function validateTenant(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  next();
}

export function requireSaasAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (req.user.userType !== USER_TYPES.SAAS_ADMIN) {
    return res.status(403).json({ message: "SaaS Admin access required" });
  }
  
  next();
}

export function requireAgencyAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const allowedTypes = [USER_TYPES.SAAS_ADMIN, USER_TYPES.AGENCY_ADMIN];
  if (!allowedTypes.includes(req.user.userType as any)) {
    return res.status(403).json({ message: "Agency Admin access required" });
  }
  
  next();
}

export function requireTeamMember(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const allowedTypes = [USER_TYPES.SAAS_ADMIN, USER_TYPES.AGENCY_ADMIN, USER_TYPES.TEAM_MEMBER];
  if (!allowedTypes.includes(req.user.userType as any)) {
    return res.status(403).json({ message: "Team access required" });
  }
  
  next();
}

export function denyCustomerAccess(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (req.user.userType === USER_TYPES.CUSTOMER) {
    return res.status(403).json({ message: "Access denied for customer accounts" });
  }
  
  next();
}

// ==================== MULTI-WORKSPACE MIDDLEWARE ====================
// These middleware functions handle workspace context resolution
// IMPORTANT: All middleware is NO-OP when multi_workspace_enabled flag is OFF

export async function resolveWorkspaceContext(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next();
  }

  try {
    // Check if multi-workspace is enabled for this tenant
    const multiWorkspaceEnabled = await storage.getFeatureFlag('multi_workspace_enabled', req.user.tenantId);
    req.multiWorkspaceEnabled = multiWorkspaceEnabled;

    if (!multiWorkspaceEnabled) {
      // Feature flag OFF: use existing tenantId behavior
      req.workspaceId = req.user.tenantId;
      return next();
    }

    // Feature flag ON: resolve workspace from header, query, or JWT
    let workspaceId = req.headers['x-workspace-id'] as string 
      || req.query.workspaceId as string 
      || req.user.activeWorkspaceId;

    // If no workspace specified, use the user's primary tenant
    if (!workspaceId) {
      workspaceId = req.user.tenantId;
    }

    // Validate user has access to this workspace
    const hasAccess = await storage.isUserInWorkspace(req.user.userId, workspaceId);
    
    // Also allow access to their own tenant (backward compatibility)
    if (!hasAccess && workspaceId !== req.user.tenantId) {
      return res.status(403).json({ message: "Access denied to this workspace" });
    }

    req.workspaceId = workspaceId;
    
    // Update last accessed timestamp
    if (hasAccess) {
      await storage.setActiveWorkspace(req.user.userId, workspaceId);
    }

    next();
  } catch (error) {
    console.error("Workspace context resolution error:", error);
    // Fall back to tenantId on error
    req.workspaceId = req.user.tenantId;
    next();
  }
}

export async function requireWorkspaceAccess(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // If multi-workspace is not enabled, this is a no-op (use existing tenant logic)
  if (!req.multiWorkspaceEnabled) {
    req.workspaceId = req.user.tenantId;
    return next();
  }

  const workspaceId = req.workspaceId || req.user.tenantId;
  
  try {
    const hasAccess = await storage.isUserInWorkspace(req.user.userId, workspaceId);
    
    // Also allow access to their own tenant (backward compatibility)
    if (!hasAccess && workspaceId !== req.user.tenantId) {
      return res.status(403).json({ message: "Access denied to this workspace" });
    }

    next();
  } catch (error) {
    console.error("Workspace access check error:", error);
    return res.status(500).json({ message: "Failed to verify workspace access" });
  }
}

export async function requireWorkspaceAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // If multi-workspace is not enabled, check isAdmin status
  if (!req.multiWorkspaceEnabled) {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    return next();
  }

  const workspaceId = req.workspaceId || req.user.tenantId;
  
  try {
    const role = await storage.getUserWorkspaceRole(req.user.userId, workspaceId);
    
    // Allow if user is workspace owner/admin OR if they're admin of their primary tenant
    if (!role || !['owner', 'admin'].includes(role)) {
      // Fallback: check if this is their primary tenant and they're an admin
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

export async function requireWorkspaceOwner(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // If multi-workspace is not enabled, check isAdmin status
  if (!req.multiWorkspaceEnabled) {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Owner access required" });
    }
    return next();
  }

  const workspaceId = req.workspaceId || req.user.tenantId;
  
  try {
    const role = await storage.getUserWorkspaceRole(req.user.userId, workspaceId);
    
    if (role !== 'owner') {
      // Fallback: check if this is their primary tenant and they're an admin
      if (workspaceId === req.user.tenantId && req.user.isAdmin) {
        return next();
      }
      return res.status(403).json({ message: "Workspace owner access required" });
    }

    next();
  } catch (error) {
    console.error("Workspace owner check error:", error);
    return res.status(500).json({ message: "Failed to verify workspace permissions" });
  }
}

export function requireMultiWorkspaceEnabled(req: Request, res: Response, next: NextFunction) {
  if (!req.multiWorkspaceEnabled) {
    return res.status(403).json({ 
      message: "Multi-workspace feature is not enabled for this account",
      code: "MULTI_WORKSPACE_DISABLED"
    });
  }
  next();
}
