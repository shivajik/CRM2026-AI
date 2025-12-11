import { getToken, setToken, getRefreshToken, clearAuth } from "./auth";

const API_BASE = "/api";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    setToken(data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      clearAuth();
      window.location.href = "/login";
      throw new ApiError(401, "Session expired");
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(response.status, error.message || "Request failed");
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  
  register: (data: { email: string; password: string; firstName: string; lastName: string; companyName: string }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    }),
  
  me: () => apiRequest("/auth/me"),
};

// Contacts API
export const contactsApi = {
  getAll: () => apiRequest("/contacts"),
  getById: (id: string) => apiRequest(`/contacts/${id}`),
  create: (data: any) => apiRequest("/contacts", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/contacts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/contacts/${id}`, { method: "DELETE" }),
};

// Deals API
export const dealsApi = {
  getAll: () => apiRequest("/deals"),
  getById: (id: string) => apiRequest(`/deals/${id}`),
  getJourney: (id: string) => apiRequest(`/deals/${id}/journey`),
  create: (data: any) => apiRequest("/deals", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/deals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/deals/${id}`, { method: "DELETE" }),
};

// Users API
export const usersApi = {
  updateProfile: (data: { firstName?: string; lastName?: string; email?: string; profileImageUrl?: string }) =>
    apiRequest("/users/profile", { method: "PATCH", body: JSON.stringify(data) }),
};

// Company Profile API
export const companyProfileApi = {
  get: () => apiRequest("/company-profile"),
  update: (data: {
    companyName?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    logoUrl?: string;
    taxId?: string;
    registrationNumber?: string;
    industry?: string;
    companySize?: string;
    currency?: string;
    defaultPaymentTerms?: string;
    invoicePrefix?: string;
    quotePrefix?: string;
    invoiceNotes?: string;
    quoteNotes?: string;
  }) => apiRequest("/company-profile", { method: "PUT", body: JSON.stringify(data) }),
};

// Tasks API (Enhanced)
export const tasksApi = {
  getAll: (filters?: { status?: string; priority?: string; assignedTo?: string; customerId?: string; dealId?: string; dueFrom?: string; dueTo?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const queryString = params.toString();
    return apiRequest(`/tasks${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string) => apiRequest(`/tasks/${id}`),
  getDetails: (id: string) => apiRequest(`/tasks/${id}/details`),
  getAnalytics: () => apiRequest("/tasks/analytics"),
  create: (data: any) => apiRequest("/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/tasks/${id}`, { method: "DELETE" }),
  
  // Assignments
  getAssignments: (taskId: string) => apiRequest(`/tasks/${taskId}/assignments`),
  addAssignment: (taskId: string, data: { userId: string; role?: string }) => 
    apiRequest(`/tasks/${taskId}/assignments`, { method: "POST", body: JSON.stringify(data) }),
  removeAssignment: (taskId: string, userId: string) => 
    apiRequest(`/tasks/${taskId}/assignments/${userId}`, { method: "DELETE" }),
  
  // Comments
  getComments: (taskId: string) => apiRequest(`/tasks/${taskId}/comments`),
  addComment: (taskId: string, data: { content: string; parentId?: string; isInternal?: boolean }) => 
    apiRequest(`/tasks/${taskId}/comments`, { method: "POST", body: JSON.stringify(data) }),
  updateComment: (taskId: string, commentId: string, content: string) => 
    apiRequest(`/tasks/${taskId}/comments/${commentId}`, { method: "PATCH", body: JSON.stringify({ content }) }),
  deleteComment: (taskId: string, commentId: string) => 
    apiRequest(`/tasks/${taskId}/comments/${commentId}`, { method: "DELETE" }),
  
  // Checklist
  getChecklist: (taskId: string) => apiRequest(`/tasks/${taskId}/checklist`),
  addChecklistItem: (taskId: string, data: { title: string; sortOrder?: number }) => 
    apiRequest(`/tasks/${taskId}/checklist`, { method: "POST", body: JSON.stringify(data) }),
  updateChecklistItem: (taskId: string, itemId: string, data: any) => 
    apiRequest(`/tasks/${taskId}/checklist/${itemId}`, { method: "PATCH", body: JSON.stringify(data) }),
  toggleChecklistItem: (taskId: string, itemId: string) => 
    apiRequest(`/tasks/${taskId}/checklist/${itemId}/toggle`, { method: "POST" }),
  deleteChecklistItem: (taskId: string, itemId: string) => 
    apiRequest(`/tasks/${taskId}/checklist/${itemId}`, { method: "DELETE" }),
  
  // Time Logs
  getTimeLogs: (taskId: string) => apiRequest(`/tasks/${taskId}/timelogs`),
  addTimeLog: (taskId: string, data: { startedAt?: string; endedAt?: string; durationMinutes?: number; description?: string; isBillable?: boolean }) => 
    apiRequest(`/tasks/${taskId}/timelogs`, { method: "POST", body: JSON.stringify(data) }),
  startTimeTracking: (taskId: string, data?: { description?: string; isBillable?: boolean }) => 
    apiRequest(`/tasks/${taskId}/timelogs/start`, { method: "POST", body: JSON.stringify(data || {}) }),
  stopTimeTracking: (taskId: string) => 
    apiRequest(`/tasks/${taskId}/timelogs/stop`, { method: "POST" }),
  deleteTimeLog: (taskId: string, logId: string) => 
    apiRequest(`/tasks/${taskId}/timelogs/${logId}`, { method: "DELETE" }),
  
  // Activity Log
  getActivityLog: (taskId: string) => apiRequest(`/tasks/${taskId}/activity`),
  
  // Status History
  getStatusHistory: (taskId: string) => apiRequest(`/tasks/${taskId}/status-history`),
};

// Notifications API
export const notificationsApi = {
  getAll: (unreadOnly?: boolean) => apiRequest(`/notifications${unreadOnly ? '?unreadOnly=true' : ''}`),
  getUnreadCount: () => apiRequest("/notifications/count"),
  markAsRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: "POST" }),
  markAllAsRead: () => apiRequest("/notifications/read-all", { method: "POST" }),
};

// Products API
export const productsApi = {
  getAll: () => apiRequest("/products"),
  getById: (id: string) => apiRequest(`/products/${id}`),
  create: (data: any) => apiRequest("/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/products/${id}`, { method: "DELETE" }),
};

// Customers API
export const customersApi = {
  getAll: () => apiRequest("/customers"),
  getById: (id: string) => apiRequest(`/customers/${id}`),
  getJourney: (id: string) => apiRequest(`/customers/${id}/journey`),
  create: (data: any) => apiRequest("/customers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/customers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/customers/${id}`, { method: "DELETE" }),
};

// Quotations API
export const quotationsApi = {
  getAll: () => apiRequest("/quotations"),
  getById: (id: string) => apiRequest(`/quotations/${id}`),
  create: (data: any) => apiRequest("/quotations", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/quotations/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/quotations/${id}`, { method: "DELETE" }),
};

// Invoices API
export const invoicesApi = {
  getAll: () => apiRequest("/invoices"),
  getById: (id: string) => apiRequest(`/invoices/${id}`),
  create: (data: any) => apiRequest("/invoices", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/invoices/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/invoices/${id}`, { method: "DELETE" }),
  addPayment: (invoiceId: string, data: any) => apiRequest(`/invoices/${invoiceId}/payments`, { method: "POST", body: JSON.stringify(data) }),
};

// Activities API
export const activitiesApi = {
  getAll: (customerId?: string) => apiRequest(`/activities${customerId ? `?customerId=${customerId}` : ''}`),
  getById: (id: string) => apiRequest(`/activities/${id}`),
  create: (data: any) => apiRequest("/activities", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/activities/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/activities/${id}`, { method: "DELETE" }),
};

// Reports API
export const reportsApi = {
  getDashboardStats: () => apiRequest("/reports/dashboard"),
  getSalesReport: () => apiRequest("/reports/sales"),
};

// Tenant API
export const tenantApi = {
  getModules: () => apiRequest("/tenant/modules"),
  updateModule: (id: string, isEnabled: boolean) =>
    apiRequest(`/tenant/modules/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isEnabled }),
    }),
};

// Team API
export const teamApi = {
  getMembers: () => apiRequest("/team/members"),
  getMemberDetails: (id: string) => apiRequest(`/team/members/${id}/details`),
  createMember: (data: { email: string; password: string; firstName: string; lastName: string; permissions?: string[] }) =>
    apiRequest("/team/members", { method: "POST", body: JSON.stringify(data) }),
  updateMember: (id: string, data: { firstName?: string; lastName?: string; email?: string; permissions?: string[]; isActive?: boolean }) =>
    apiRequest(`/team/members/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteMember: (id: string) => apiRequest(`/team/members/${id}`, { method: "DELETE" }),
  getRoles: () => apiRequest("/team/roles"),
  createRole: (data: { name: string; permissions: string[] }) =>
    apiRequest("/team/roles", { method: "POST", body: JSON.stringify(data) }),
  checkAdmin: () => apiRequest("/auth/admin-check"),
};

// SaaS Admin API
export const saasAdminApi = {
  getStats: () => apiRequest("/saas-admin/stats"),
  getTenants: () => apiRequest("/saas-admin/tenants"),
  getTenantById: (id: string) => apiRequest(`/saas-admin/tenants/${id}`),
  getAllUsers: () => apiRequest("/saas-admin/users"),
  getUserById: (id: string) => apiRequest(`/saas-admin/users/${id}`),
  
  // Platform Settings
  getSettings: () => apiRequest("/saas-admin/settings"),
  updateSetting: (data: { key: string; value: string; category?: string; description?: string }) =>
    apiRequest("/saas-admin/settings", { method: "PUT", body: JSON.stringify(data) }),
  deleteSetting: (key: string) => apiRequest(`/saas-admin/settings/${key}`, { method: "DELETE" }),
  
  // Activity Logs
  getActivityLogs: (params?: {
    tenantId?: string;
    actorId?: string;
    action?: string;
    targetType?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.tenantId) searchParams.set('tenantId', params.tenantId);
    if (params?.actorId) searchParams.set('actorId', params.actorId);
    if (params?.action) searchParams.set('action', params.action);
    if (params?.targetType) searchParams.set('targetType', params.targetType);
    if (params?.from) searchParams.set('from', params.from);
    if (params?.to) searchParams.set('to', params.to);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiRequest(`/saas-admin/activity-logs${query ? `?${query}` : ''}`);
  },
  
  // Super Admin Profile
  getProfile: () => apiRequest("/saas-admin/profile"),
  updateProfile: (data: { firstName?: string; lastName?: string; email?: string }) =>
    apiRequest("/saas-admin/profile", { method: "PATCH", body: JSON.stringify(data) }),

  // Packages Management
  getPackages: () => apiRequest("/saas-admin/packages"),
  getPackageById: (id: string) => apiRequest(`/saas-admin/packages/${id}`),
  createPackage: (data: {
    name: string;
    displayName: string;
    description?: string;
    price?: string;
    billingCycle?: string;
    isActive?: boolean;
    isPopular?: boolean;
    sortOrder?: number;
    features?: string[];
    moduleIds?: string[];
  }) => apiRequest("/saas-admin/packages", { method: "POST", body: JSON.stringify(data) }),
  updatePackage: (id: string, data: {
    name?: string;
    displayName?: string;
    description?: string;
    price?: string;
    billingCycle?: string;
    isActive?: boolean;
    isPopular?: boolean;
    sortOrder?: number;
    features?: string[];
    moduleIds?: string[];
  }) => apiRequest(`/saas-admin/packages/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deletePackage: (id: string) => apiRequest(`/saas-admin/packages/${id}`, { method: "DELETE" }),
  getModules: () => apiRequest("/saas-admin/modules"),
};

// Public Packages API (for pricing page)
export const packagesApi = {
  getAll: () => apiRequest("/packages"),
};

// Email Module API
export const emailApi = {
  // Templates
  getTemplates: () => apiRequest("/email/templates"),
  getTemplateById: (id: string) => apiRequest(`/email/templates/${id}`),
  createTemplate: (data: any) => apiRequest("/email/templates", { method: "POST", body: JSON.stringify(data) }),
  updateTemplate: (id: string, data: any) => apiRequest(`/email/templates/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTemplate: (id: string) => apiRequest(`/email/templates/${id}`, { method: "DELETE" }),
  
  // Logs
  getLogs: () => apiRequest("/email/logs"),
  getLogById: (id: string) => apiRequest(`/email/logs/${id}`),
  
  // Send
  send: (data: any) => apiRequest("/email/send", { method: "POST", body: JSON.stringify(data) }),
  
  // Automations
  getAutomations: () => apiRequest("/email/automations"),
  getAutomationById: (id: string) => apiRequest(`/email/automations/${id}`),
  createAutomation: (data: any) => apiRequest("/email/automations", { method: "POST", body: JSON.stringify(data) }),
  updateAutomation: (id: string, data: any) => apiRequest(`/email/automations/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteAutomation: (id: string) => apiRequest(`/email/automations/${id}`, { method: "DELETE" }),
  
  // Sequences
  getSequences: () => apiRequest("/email/sequences"),
  getSequenceById: (id: string) => apiRequest(`/email/sequences/${id}`),
  createSequence: (data: any) => apiRequest("/email/sequences", { method: "POST", body: JSON.stringify(data) }),
  updateSequence: (id: string, data: any) => apiRequest(`/email/sequences/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteSequence: (id: string) => apiRequest(`/email/sequences/${id}`, { method: "DELETE" }),
  
  // Steps
  createStep: (sequenceId: string, data: any) => apiRequest(`/email/sequences/${sequenceId}/steps`, { method: "POST", body: JSON.stringify(data) }),
  updateStep: (id: string, data: any) => apiRequest(`/email/steps/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteStep: (id: string) => apiRequest(`/email/steps/${id}`, { method: "DELETE" }),
  
  // Scheduled Emails
  getScheduled: () => apiRequest("/email/scheduled"),
  deleteScheduled: (id: string) => apiRequest(`/email/scheduled/${id}`, { method: "DELETE" }),
  
  // Sender Accounts
  getSenders: () => apiRequest("/email/senders"),
  createSender: (data: any) => apiRequest("/email/senders", { method: "POST", body: JSON.stringify(data) }),
  updateSender: (id: string, data: any) => apiRequest(`/email/senders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteSender: (id: string) => apiRequest(`/email/senders/${id}`, { method: "DELETE" }),
  
  // SMTP Settings
  getSmtpSettings: () => apiRequest("/email/smtp-settings"),
  updateSmtpSettings: (data: any) => apiRequest("/email/smtp-settings", { method: "PUT", body: JSON.stringify(data) }),
  testSmtpConnection: () => apiRequest("/email/smtp-settings/test", { method: "POST" }),
  
  // Merge Fields
  getMergeFields: () => apiRequest("/email/merge-fields"),
  processMergeFields: (data: any) => apiRequest("/email/process-merge-fields", { method: "POST", body: JSON.stringify(data) }),
  
  // AI Assistant
  aiAssist: (data: { action: string; content: string; context?: any }) => 
    apiRequest("/email/ai-assist", { method: "POST", body: JSON.stringify(data) }),
};
