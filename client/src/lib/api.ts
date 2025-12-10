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
  updateProfile: (data: { firstName?: string; lastName?: string; email?: string }) =>
    apiRequest("/users/profile", { method: "PATCH", body: JSON.stringify(data) }),
};

// Tasks API
export const tasksApi = {
  getAll: () => apiRequest("/tasks"),
  getById: (id: string) => apiRequest(`/tasks/${id}`),
  create: (data: any) => apiRequest("/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/tasks/${id}`, { method: "DELETE" }),
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
};
