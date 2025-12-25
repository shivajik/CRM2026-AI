import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { aiApi, AIAction, AIModule } from "@/lib/aiApi";
import { useToast } from "@/hooks/use-toast";

interface AIActionOption {
  action: AIAction;
  label: string;
  description?: string;
}

interface AIButtonProps {
  module: AIModule;
  content: string;
  context?: Record<string, any>;
  onResult: (result: string) => void;
  actions?: AIActionOption[];
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const DEFAULT_ACTIONS: Record<AIModule, AIActionOption[]> = {
  email: [
    { action: 'improve_tone', label: 'Improve Tone', description: 'Make it more professional' },
    { action: 'make_persuasive', label: 'Make Persuasive', description: 'More compelling' },
    { action: 'shorten', label: 'Shorten', description: 'Make it concise' },
    { action: 'expand', label: 'Expand', description: 'Add more details' },
    { action: 'fix_grammar', label: 'Fix Grammar', description: 'Correct errors' },
    { action: 'generate_subject', label: 'Generate Subject', description: 'Create subject line' },
  ],
  task: [
    { action: 'generate_subtasks', label: 'Generate Subtasks', description: 'Break down into steps' },
    { action: 'suggest_due_date', label: 'Suggest Due Date', description: 'Recommend deadline' },
    { action: 'prioritize', label: 'Prioritize', description: 'Suggest priority level' },
    { action: 'explain', label: 'Explain', description: 'Simplify description' },
  ],
  proposal: [
    { action: 'generate_introduction', label: 'Generate Introduction', description: 'Create intro paragraph' },
    { action: 'generate_scope', label: 'Generate Scope', description: 'Create scope section' },
    { action: 'generate_timeline', label: 'Generate Timeline', description: 'Create project timeline' },
    { action: 'generate_terms', label: 'Generate Terms', description: 'Create terms & conditions' },
    { action: 'improve_tone', label: 'Improve Tone', description: 'Make it more professional' },
    { action: 'make_persuasive', label: 'Make Persuasive', description: 'More compelling' },
  ],
  client: [
    { action: 'lead_score', label: 'Score Lead', description: 'Analyze lead quality' },
    { action: 'client_summary', label: 'Generate Summary', description: 'Create client overview' },
    { action: 'next_steps', label: 'Suggest Next Steps', description: 'Recommend actions' },
  ],
  report: [
    { action: 'report_insights', label: 'Generate Insights', description: 'Analyze data patterns' },
    { action: 'summarize', label: 'Summarize', description: 'Create executive summary' },
  ],
};

export function AIButton({
  module,
  content,
  context,
  onResult,
  actions,
  disabled = false,
  variant = "outline",
  size = "sm",
  className = "",
}: AIButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { toast } = useToast();

  const availableActions = actions || DEFAULT_ACTIONS[module] || [];

  const handleAction = async (action: AIAction) => {
    if (!content.trim()) {
      toast({
        title: "No content",
        description: "Please provide some content for AI to work with.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingAction(action);

    try {
      const response = await aiApi.assist(module, {
        action,
        content,
        context,
      });

      if (response.success) {
        onResult(response.result);
        toast({
          title: "AI Complete",
          description: "Content has been updated with AI suggestions.",
        });
      } else {
        toast({
          title: "AI Error",
          description: "Failed to process your request. Using fallback.",
          variant: "destructive",
        });
        onResult(response.result);
      }
    } catch (error: any) {
      const message = error?.message || "Failed to process AI request";
      toast({
        title: "AI Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  if (availableActions.length === 0) {
    return null;
  }

  if (availableActions.length === 1) {
    const singleAction = availableActions[0];
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => handleAction(singleAction.action)}
        disabled={disabled || isLoading}
        className={className}
        data-testid={`ai-button-${singleAction.action}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Sparkles className="h-4 w-4 mr-2" />
        )}
        {singleAction.label}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || isLoading}
          className={className}
          data-testid="ai-button-dropdown"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          AI Assist
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>AI Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableActions.map((option) => (
          <DropdownMenuItem
            key={option.action}
            onClick={() => handleAction(option.action)}
            disabled={loadingAction === option.action}
            data-testid={`ai-action-${option.action}`}
          >
            <div className="flex flex-col">
              <span className="flex items-center gap-2">
                {loadingAction === option.action ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-muted-foreground ml-5">
                  {option.description}
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AIButton;
