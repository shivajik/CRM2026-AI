import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JWTPayload } from "./auth";
import { USER_TYPES } from "@shared/schema";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
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
