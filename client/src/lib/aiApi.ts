import { getToken, getRefreshToken, setToken, clearAuth } from "./auth";

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch("/api/auth/refresh", {
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

async function aiApiRequest<T = any>(
  method: string,
  url: string,
  data?: unknown
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
    } else {
      clearAuth();
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(`${response.status}: ${error.message || "Request failed"}`);
  }

  return response.json();
}

export type AIAction = 
  | 'rewrite' | 'improve_tone' | 'expand' | 'shorten' | 'summarize'
  | 'fix_grammar' | 'make_formal' | 'make_friendly' | 'make_persuasive'
  | 'generate_subject' | 'generate_followup' | 'generate_email'
  | 'generate_subtasks' | 'suggest_due_date' | 'prioritize' | 'explain'
  | 'generate_introduction' | 'generate_scope' | 'generate_timeline' | 'generate_terms'
  | 'lead_score' | 'client_summary' | 'next_steps' | 'report_insights' | 'workflow_suggestion';

export type AIModule = 'email' | 'task' | 'proposal' | 'client' | 'report';

export interface AIRequestOptions {
  action: AIAction;
  content: string;
  context?: Record<string, any>;
}

export interface AIResponse {
  result: string;
  action: string;
  success: boolean;
}

export interface AISettings {
  id: string;
  tenantId: string;
  aiEnabled: boolean;
  emailAiEnabled: boolean;
  taskAiEnabled: boolean;
  proposalAiEnabled: boolean;
  clientAiEnabled: boolean;
  reportAiEnabled: boolean;
  monthlyTokenLimit: number;
  tokensUsedThisMonth: number;
  tokenResetDate: string;
  preferredModel?: string;
  customInstructions?: string;
}

export interface AIUsageStats {
  total: number;
  thisMonth: number;
  byModule: Record<string, number>;
  monthlyLimit: number;
  tokensUsedThisMonth: number;
  tokenResetDate?: string;
}

export interface AIStatus {
  available: boolean;
  enabled: boolean;
  hasApiKey: boolean;
  tokenLimitReached: boolean;
  modules: {
    email: boolean;
    task: boolean;
    proposal: boolean;
    client: boolean;
    report: boolean;
  };
}

export const aiApi = {
  // Get AI status for current workspace
  getStatus: async (): Promise<AIStatus> => {
    return aiApiRequest<AIStatus>("GET", "/api/ai/status");
  },

  // Get AI settings
  getSettings: async (): Promise<{ aiEnabled: boolean; settings: AISettings | null; defaults?: any }> => {
    return aiApiRequest("GET", "/api/ai/settings");
  },

  // Update AI settings
  updateSettings: async (updates: Partial<AISettings>): Promise<AISettings> => {
    return aiApiRequest<AISettings>("PUT", "/api/ai/settings", updates);
  },

  // Get AI usage stats
  getUsage: async (): Promise<AIUsageStats> => {
    return aiApiRequest<AIUsageStats>("GET", "/api/ai/usage");
  },

  // Get AI logs
  getLogs: async (limit?: number): Promise<any[]> => {
    const params = limit ? `?limit=${limit}` : '';
    return aiApiRequest<any[]>("GET", `/api/ai/logs${params}`);
  },

  // Submit feedback for an AI response
  submitFeedback: async (logId: string, rating: number, comment?: string): Promise<void> => {
    await aiApiRequest("POST", "/api/ai/feedback", { logId, rating, comment });
  },

  // Email AI assist
  emailAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    return aiApiRequest<AIResponse>("POST", "/api/email/ai-assist", options);
  },

  // Task AI assist
  taskAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    return aiApiRequest<AIResponse>("POST", "/api/tasks/ai-assist", options);
  },

  // Proposal AI assist
  proposalAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    return aiApiRequest<AIResponse>("POST", "/api/proposals/ai-assist", options);
  },

  // Client AI assist
  clientAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    return aiApiRequest<AIResponse>("POST", "/api/clients/ai-assist", options);
  },

  // Report AI assist
  reportAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    return aiApiRequest<AIResponse>("POST", "/api/reports/ai-assist", options);
  },

  // Generic AI assist based on module
  assist: async (module: AIModule, options: AIRequestOptions): Promise<AIResponse> => {
    switch (module) {
      case 'email':
        return aiApi.emailAssist(options);
      case 'task':
        return aiApi.taskAssist(options);
      case 'proposal':
        return aiApi.proposalAssist(options);
      case 'client':
        return aiApi.clientAssist(options);
      case 'report':
        return aiApi.reportAssist(options);
      default:
        throw new Error(`Unknown AI module: ${module}`);
    }
  },
};
