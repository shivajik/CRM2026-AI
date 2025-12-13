import { apiRequest } from "./queryClient";

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
    const res = await apiRequest("GET", "/api/ai/status");
    return res.json();
  },

  // Get AI settings
  getSettings: async (): Promise<{ aiEnabled: boolean; settings: AISettings | null; defaults?: any }> => {
    const res = await apiRequest("GET", "/api/ai/settings");
    return res.json();
  },

  // Update AI settings
  updateSettings: async (updates: Partial<AISettings>): Promise<AISettings> => {
    const res = await apiRequest("PUT", "/api/ai/settings", updates);
    return res.json();
  },

  // Get AI usage stats
  getUsage: async (): Promise<AIUsageStats> => {
    const res = await apiRequest("GET", "/api/ai/usage");
    return res.json();
  },

  // Get AI logs
  getLogs: async (limit?: number): Promise<any[]> => {
    const params = limit ? `?limit=${limit}` : '';
    const res = await apiRequest("GET", `/api/ai/logs${params}`);
    return res.json();
  },

  // Submit feedback for an AI response
  submitFeedback: async (logId: string, rating: number, comment?: string): Promise<void> => {
    await apiRequest("POST", "/api/ai/feedback", { logId, rating, comment });
  },

  // Email AI assist
  emailAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    const res = await apiRequest("POST", "/api/email/ai-assist", options);
    return res.json();
  },

  // Task AI assist
  taskAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    const res = await apiRequest("POST", "/api/tasks/ai-assist", options);
    return res.json();
  },

  // Proposal AI assist
  proposalAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    const res = await apiRequest("POST", "/api/proposals/ai-assist", options);
    return res.json();
  },

  // Client AI assist
  clientAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    const res = await apiRequest("POST", "/api/clients/ai-assist", options);
    return res.json();
  },

  // Report AI assist
  reportAssist: async (options: AIRequestOptions): Promise<AIResponse> => {
    const res = await apiRequest("POST", "/api/reports/ai-assist", options);
    return res.json();
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
