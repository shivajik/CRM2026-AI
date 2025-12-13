import OpenAI from "openai";
import type { AiSettings, InsertAiUsage, InsertAiLog } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-5";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export interface AIRequestOptions {
  tenantId: string;
  userId?: string;
  module: string;
  action: string;
  content: string;
  context?: Record<string, any>;
  resourceType?: string;
  resourceId?: string;
}

export interface AIResponse {
  result: string;
  action: string;
  tokensUsed: number;
  inputTokens: number;
  outputTokens: number;
  model: string;
  success: boolean;
  error?: string;
}

const ACTION_PROMPTS: Record<string, (content: string, context?: Record<string, any>) => string> = {
  rewrite: (content) => `Rewrite the following text while preserving its meaning but improving clarity and flow:\n\n${content}`,
  
  improve_tone: (content) => `Improve the tone of this text to be more professional and polished:\n\n${content}`,
  
  expand: (content) => `Expand this text with more details and context while keeping it relevant:\n\n${content}`,
  
  shorten: (content) => `Shorten this text to be more concise while keeping the key points:\n\n${content}`,
  
  summarize: (content) => `Summarize the following text in 2-3 sentences:\n\n${content}`,
  
  fix_grammar: (content) => `Fix any grammar, spelling, and punctuation errors in this text:\n\n${content}`,
  
  make_formal: (content) => `Rewrite this text in a formal, professional tone suitable for business communication:\n\n${content}`,
  
  make_friendly: (content) => `Rewrite this text in a warm, friendly, and approachable tone:\n\n${content}`,
  
  make_persuasive: (content) => `Rewrite this text to be more persuasive and compelling:\n\n${content}`,
  
  generate_subject: (content) => `Generate a compelling email subject line for this email content:\n\n${content}\n\nProvide only the subject line, no quotes or extra text.`,
  
  generate_followup: (content, context) => `Generate a professional follow-up email based on this context:\n\nOriginal communication: ${content}\nPurpose: ${context?.purpose || 'general follow-up'}\n\nWrite a complete follow-up email including greeting and signature placeholder.`,
  
  generate_email: (content, context) => `Generate a professional email based on this request:\n\nPurpose: ${context?.purpose || 'general communication'}\nRecipient: ${context?.recipientName || 'the recipient'}\nCompany: ${context?.companyName || 'the company'}\nContext: ${content}\n\nWrite a complete email including greeting and signature placeholder.`,
  
  generate_subtasks: (content, context) => `Break down this task into specific, actionable subtasks:\n\nTask: ${content}\nEstimated time: ${context?.estimatedMinutes || 'not specified'} minutes\n\nReturn a JSON array of subtask objects with "title" and "estimatedMinutes" fields. Example: [{"title": "Subtask 1", "estimatedMinutes": 30}]`,
  
  suggest_due_date: (content, context) => `Suggest an appropriate due date for this task:\n\nTask: ${content}\nPriority: ${context?.priority || 'medium'}\nCurrent date: ${new Date().toISOString().split('T')[0]}\n\nRespond with only a date in YYYY-MM-DD format.`,
  
  prioritize: (content) => `Analyze this task and suggest an appropriate priority level:\n\nTask: ${content}\n\nRespond with only one of: low, medium, high, urgent`,
  
  explain: (content) => `Explain this task description in simpler terms, breaking down any complex requirements:\n\n${content}`,
  
  generate_introduction: (content, context) => `Generate a professional proposal introduction for:\n\nProject: ${context?.projectName || 'the project'}\nClient: ${context?.clientName || 'the client'}\nContext: ${content}\n\nWrite 2-3 paragraphs that introduce the proposal professionally.`,
  
  generate_scope: (content, context) => `Generate a detailed scope of work section for:\n\nProject: ${context?.projectName || 'the project'}\nContext: ${content}\n\nUse markdown formatting with headers and bullet points.`,
  
  generate_timeline: (content, context) => `Generate a project timeline with phases for:\n\nProject: ${context?.projectName || 'the project'}\nContext: ${content}\n\nUse markdown table format with Phase, Duration, and Milestones columns.`,
  
  generate_terms: (content, context) => `Generate standard terms and conditions for:\n\nProject type: ${context?.projectType || 'professional services'}\nContext: ${content}\n\nInclude payment terms, modifications policy, IP rights, and confidentiality.`,
  
  lead_score: (content, context) => `Analyze this lead/prospect and provide a score from 0-100 with reasoning:\n\nLead info: ${content}\nInteraction history: ${JSON.stringify(context?.interactions || [])}\n\nRespond with JSON: {"score": number, "reasoning": "explanation", "factors": {"engagement": number, "budget": number, "timeline": number, "fit": number}}`,
  
  client_summary: (content, context) => `Generate a concise client summary card:\n\nClient data: ${content}\nRecent activity: ${JSON.stringify(context?.recentActivity || [])}\n\nInclude: key metrics, relationship health, and notable points.`,
  
  next_steps: (content, context) => `Suggest the next best actions for this client/lead:\n\nContext: ${content}\nCurrent stage: ${context?.stage || 'unknown'}\nLast interaction: ${context?.lastInteraction || 'unknown'}\n\nProvide 3-5 specific, actionable recommendations as a JSON array: [{"action": "...", "priority": "high/medium/low", "reason": "..."}]`,
  
  report_insights: (content, context) => `Analyze this data and provide business insights:\n\nData: ${content}\nMetrics: ${JSON.stringify(context?.metrics || {})}\n\nProvide: 3 key insights, 2 recommendations, and 1 risk to watch.`,
  
  workflow_suggestion: (content, context) => `Suggest automation rules for this scenario:\n\nContext: ${content}\nTrigger events available: ${JSON.stringify(context?.availableTriggers || [])}\n\nSuggest 3 automation rules as JSON: [{"name": "...", "trigger": "...", "action": "...", "condition": "..."}]`,
};

export class AIService {
  private model: string = DEFAULT_MODEL;

  async processRequest(options: AIRequestOptions, settings?: AiSettings | null): Promise<AIResponse> {
    const { action, content, context } = options;
    const startTime = Date.now();

    if (!process.env.OPENAI_API_KEY) {
      return this.getFallbackResponse(action, content, context);
    }

    const promptFn = ACTION_PROMPTS[action];
    if (!promptFn) {
      return this.getFallbackResponse(action, content, context);
    }

    const prompt = promptFn(content, context);
    const model = settings?.preferredModel || this.model;

    try {
      // gpt-5 doesn't support temperature parameter
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: settings?.customInstructions || "You are a helpful AI assistant for a CRM application. Be professional, concise, and helpful. Return only the requested content without explanations unless asked."
          },
          { role: "user", content: prompt }
        ],
        max_completion_tokens: 2000,
      });

      const result = completion.choices[0]?.message?.content || "";
      const usage = completion.usage;

      return {
        result,
        action,
        tokensUsed: usage?.total_tokens || 0,
        inputTokens: usage?.prompt_tokens || 0,
        outputTokens: usage?.completion_tokens || 0,
        model,
        success: true,
      };
    } catch (error: any) {
      console.error("AI Service error:", error);
      return this.getFallbackResponse(action, content, context, error.message);
    }
  }

  private getFallbackResponse(action: string, content: string, context?: Record<string, any>, error?: string): AIResponse {
    let result = content;

    switch (action) {
      case 'improve_tone':
        result = content.replace(/\b(please|kindly)\b/gi, 'we would appreciate if you')
          .replace(/\bASAP\b/gi, 'at your earliest convenience');
        break;
      case 'shorten':
        const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim());
        result = sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ') + '.';
        break;
      case 'make_persuasive':
        result = content + "\n\nWe believe this opportunity aligns perfectly with your goals, and we're confident you'll see exceptional value in moving forward.";
        break;
      case 'make_formal':
        result = `Dear Valued Customer,\n\n${content}\n\nBest regards`;
        break;
      case 'make_friendly':
        result = `Hi there!\n\n${content}\n\nCheers!`;
        break;
      case 'generate_subject':
        const words = content.split(' ').slice(0, 5).join(' ');
        result = `Re: ${words}...`;
        break;
      case 'expand':
        result = content + "\n\nWe would like to provide you with more details about our services. Our team is dedicated to delivering exceptional results tailored to your specific needs.";
        break;
      case 'generate_introduction':
        result = `We are pleased to present this proposal for ${context?.projectName || 'your project'}. Our team has carefully analyzed your requirements and developed a comprehensive solution that addresses your specific needs.`;
        break;
      case 'generate_scope':
        result = `## Scope of Work\n\nThis engagement includes the following key deliverables:\n\n1. **Discovery & Planning**\n2. **Design & Development**\n3. **Testing & Quality Assurance**\n4. **Deployment & Launch**\n5. **Training & Documentation**`;
        break;
      case 'generate_timeline':
        result = `## Project Timeline\n\n| Phase | Duration | Milestones |\n|-------|----------|------------|\n| Discovery | Week 1-2 | Requirements finalized |\n| Design | Week 3-4 | Designs approved |\n| Development | Week 5-8 | Core features complete |\n| Testing | Week 9-10 | QA sign-off |\n| Launch | Week 11-12 | Go-live |`;
        break;
      case 'generate_terms':
        result = `## Terms & Conditions\n\n**Payment Terms**\n- 50% deposit upon project commencement\n- 25% upon design approval\n- 25% upon project completion`;
        break;
      case 'generate_subtasks':
        result = JSON.stringify([
          { title: "Review requirements", estimatedMinutes: 30 },
          { title: "Create implementation plan", estimatedMinutes: 45 },
          { title: "Execute main work", estimatedMinutes: 120 },
          { title: "Review and finalize", estimatedMinutes: 30 }
        ]);
        break;
      case 'suggest_due_date':
        const daysToAdd = context?.priority === 'urgent' ? 1 : context?.priority === 'high' ? 3 : 7;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + daysToAdd);
        result = dueDate.toISOString().split('T')[0];
        break;
      case 'prioritize':
        result = 'medium';
        break;
      case 'lead_score':
        result = JSON.stringify({ score: 65, reasoning: "Based on available information", factors: { engagement: 70, budget: 60, timeline: 65, fit: 65 } });
        break;
      case 'next_steps':
        result = JSON.stringify([
          { action: "Schedule follow-up call", priority: "high", reason: "Maintain engagement" },
          { action: "Send additional information", priority: "medium", reason: "Address questions" }
        ]);
        break;
      default:
        result = content;
    }

    return {
      result,
      action,
      tokensUsed: 0,
      inputTokens: 0,
      outputTokens: 0,
      model: "fallback",
      success: !error,
      error,
    };
  }
}

export const aiService = new AIService();
