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
  create: (data: any) => apiRequest("/deals", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/deals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/deals/${id}`, { method: "DELETE" }),
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
