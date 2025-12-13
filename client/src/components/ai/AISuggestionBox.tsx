import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Check, X, ThumbsUp, ThumbsDown, Copy, RotateCcw, Loader2, TrendingUp, Clock, DollarSign, Target } from "lucide-react";
import { aiApi } from "@/lib/aiApi";
import { useToast } from "@/hooks/use-toast";

interface InsightData {
  score?: number;
  reasoning?: string;
  factors?: {
    engagement?: number;
    budget?: number;
    timeline?: number;
    fit?: number;
  };
}

function parseInsightData(text: string): InsightData | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed && (parsed.score !== undefined || parsed.reasoning || parsed.factors)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

function getProgressColor(value: number): string {
  if (value >= 70) return "bg-green-500";
  if (value >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function FormattedInsight({ data }: { data: InsightData }) {
  return (
    <div className="space-y-4">
      {data.score !== undefined && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="font-medium">Score:</span>
          </div>
          <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
            {data.score}
          </span>
          <span className="text-muted-foreground">/ 100</span>
        </div>
      )}
      
      {data.reasoning && (
        <div className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">Analysis</span>
          <p className="text-sm leading-relaxed">{data.reasoning}</p>
        </div>
      )}
      
      {data.factors && (
        <div className="space-y-3">
          <span className="text-sm font-medium text-muted-foreground">Key Factors</span>
          <div className="grid grid-cols-2 gap-3">
            {data.factors.engagement !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Engagement
                  </span>
                  <span className="font-medium">{data.factors.engagement}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(data.factors.engagement)} transition-all`}
                    style={{ width: `${data.factors.engagement}%` }}
                  />
                </div>
              </div>
            )}
            
            {data.factors.budget !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Budget
                  </span>
                  <span className="font-medium">{data.factors.budget}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(data.factors.budget)} transition-all`}
                    style={{ width: `${data.factors.budget}%` }}
                  />
                </div>
              </div>
            )}
            
            {data.factors.timeline !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Timeline
                  </span>
                  <span className="font-medium">{data.factors.timeline}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(data.factors.timeline)} transition-all`}
                    style={{ width: `${data.factors.timeline}%` }}
                  />
                </div>
              </div>
            )}
            
            {data.factors.fit !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    ICP Fit
                  </span>
                  <span className="font-medium">{data.factors.fit}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor(data.factors.fit)} transition-all`}
                    style={{ width: `${data.factors.fit}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface AISuggestionBoxProps {
  suggestion: string;
  logId?: string;
  onAccept: (text: string) => void;
  onReject?: () => void;
  onRegenerate?: () => void;
  isLoading?: boolean;
  showFeedback?: boolean;
  title?: string;
  className?: string;
}

export function AISuggestionBox({
  suggestion,
  logId,
  onAccept,
  onReject,
  onRegenerate,
  isLoading = false,
  showFeedback = true,
  title = "AI Suggestion",
  className = "",
}: AISuggestionBoxProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const insightData = useMemo(() => parseInsightData(suggestion), [suggestion]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Suggestion copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleFeedback = async (rating: number) => {
    if (!logId || feedbackSubmitted) return;
    
    try {
      await aiApi.submitFeedback(logId, rating);
      setFeedbackSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Your feedback helps improve AI suggestions.",
      });
    } catch (error) {
      toast({
        title: "Feedback failed",
        description: "Could not submit feedback.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className={`border-dashed border-2 border-primary/20 ${className}`}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating suggestion...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestion) {
    return null;
  }

  return (
    <Card className={`border-primary/20 bg-primary/5 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{title}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            AI Generated
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm bg-background rounded-md p-3 border">
          {insightData ? (
            <FormattedInsight data={insightData} />
          ) : (
            <div className="whitespace-pre-wrap">{suggestion}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onAccept(suggestion)}
              data-testid="button-accept-suggestion"
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            
            {onReject && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReject}
                data-testid="button-reject-suggestion"
              >
                <X className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
            )}
            
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                data-testid="button-regenerate-suggestion"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Regenerate
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              data-testid="button-copy-suggestion"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          {showFeedback && logId && !feedbackSubmitted && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-2">Was this helpful?</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleFeedback(1)}
                data-testid="button-feedback-positive"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleFeedback(-1)}
                data-testid="button-feedback-negative"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          
          {showFeedback && feedbackSubmitted && (
            <span className="text-xs text-muted-foreground">Thanks for feedback!</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AISuggestionBox;
