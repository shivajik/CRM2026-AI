import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, X, ThumbsUp, ThumbsDown, Copy, RotateCcw, Loader2 } from "lucide-react";
import { aiApi } from "@/lib/aiApi";
import { useToast } from "@/hooks/use-toast";

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
        <div className="text-sm whitespace-pre-wrap bg-background rounded-md p-3 border">
          {suggestion}
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
