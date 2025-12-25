import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Mail, CheckSquare, FileText, Users, BarChart3, Loader2, AlertCircle, Info } from "lucide-react";
import { aiApi, AISettings, AIUsageStats, AIStatus } from "@/lib/aiApi";
import { useToast } from "@/hooks/use-toast";

interface AIPanelProps {
  className?: string;
}

export function AIPanel({ className = "" }: AIPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<Partial<AISettings>>({
    aiEnabled: true,
    emailAiEnabled: true,
    taskAiEnabled: true,
    proposalAiEnabled: true,
    clientAiEnabled: true,
    reportAiEnabled: true,
    monthlyTokenLimit: 100000,
    customInstructions: "",
  });

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["ai-status"],
    queryFn: aiApi.getStatus,
  });

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ["ai-settings"],
    queryFn: aiApi.getSettings,
  });

  const { data: usageData, isLoading: usageLoading } = useQuery({
    queryKey: ["ai-usage"],
    queryFn: aiApi.getUsage,
  });

  useEffect(() => {
    if (settingsData?.settings) {
      setSettings({
        aiEnabled: settingsData.settings.aiEnabled ?? true,
        emailAiEnabled: settingsData.settings.emailAiEnabled ?? true,
        taskAiEnabled: settingsData.settings.taskAiEnabled ?? true,
        proposalAiEnabled: settingsData.settings.proposalAiEnabled ?? true,
        clientAiEnabled: settingsData.settings.clientAiEnabled ?? true,
        reportAiEnabled: settingsData.settings.reportAiEnabled ?? true,
        monthlyTokenLimit: settingsData.settings.monthlyTokenLimit ?? 100000,
        customInstructions: settingsData.settings.customInstructions ?? "",
      });
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: aiApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-settings"] });
      queryClient.invalidateQueries({ queryKey: ["ai-status"] });
      toast({
        title: "AI Settings Updated",
        description: "Your AI preferences have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update AI settings.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

  const isLoading = statusLoading || settingsLoading || usageLoading;
  const tokenUsage = usageData?.tokensUsedThisMonth || 0;
  const tokenLimit = settings.monthlyTokenLimit || 100000;
  const usagePercent = Math.min((tokenUsage / tokenLimit) * 100, 100);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const featureEnabled = settingsData?.aiEnabled ?? false;

  if (!featureEnabled) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Features
          </CardTitle>
          <CardDescription>
            AI-powered assistance for your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">AI Features Not Available</p>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered features are not enabled for your workspace. Contact your administrator to enable this feature.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Features
          </CardTitle>
          <CardDescription>
            Configure AI-powered assistance for your workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-enabled" className="text-base">Enable AI Features</Label>
              <p className="text-sm text-muted-foreground">
                Turn on AI-powered assistance across all modules
              </p>
            </div>
            <Switch
              id="ai-enabled"
              checked={settings.aiEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, aiEnabled: checked })}
              data-testid="switch-ai-enabled"
            />
          </div>

          {settings.aiEnabled && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Module Settings</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-ai">Email AI</Label>
                    </div>
                    <Switch
                      id="email-ai"
                      checked={settings.emailAiEnabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailAiEnabled: checked })}
                      data-testid="switch-email-ai"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="task-ai">Task AI</Label>
                    </div>
                    <Switch
                      id="task-ai"
                      checked={settings.taskAiEnabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, taskAiEnabled: checked })}
                      data-testid="switch-task-ai"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="proposal-ai">Proposal AI</Label>
                    </div>
                    <Switch
                      id="proposal-ai"
                      checked={settings.proposalAiEnabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, proposalAiEnabled: checked })}
                      data-testid="switch-proposal-ai"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="client-ai">Client AI</Label>
                    </div>
                    <Switch
                      id="client-ai"
                      checked={settings.clientAiEnabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, clientAiEnabled: checked })}
                      data-testid="switch-client-ai"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="report-ai">Report AI</Label>
                    </div>
                    <Switch
                      id="report-ai"
                      checked={settings.reportAiEnabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, reportAiEnabled: checked })}
                      data-testid="switch-report-ai"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {settings.aiEnabled && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Usage & Limits</CardTitle>
              <CardDescription>
                Monitor your AI token usage and set limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Tokens Used This Month</span>
                  <span className="font-medium">{tokenUsage.toLocaleString()} / {tokenLimit.toLocaleString()}</span>
                </div>
                <Progress value={usagePercent} className="h-2" />
                {usagePercent >= 80 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    {usagePercent >= 100 ? "Token limit reached" : "Approaching token limit"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="token-limit">Monthly Token Limit</Label>
                <Input
                  id="token-limit"
                  type="number"
                  value={settings.monthlyTokenLimit}
                  onChange={(e) => setSettings({ ...settings, monthlyTokenLimit: parseInt(e.target.value) || 100000 })}
                  min={1000}
                  step={10000}
                  data-testid="input-token-limit"
                />
                <p className="text-xs text-muted-foreground">
                  Set a monthly limit to control AI usage costs
                </p>
              </div>

              {usageData && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Usage by Module</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(usageData.byModule || {}).map(([module, count]) => (
                      <div key={module} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="capitalize">{module}</span>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Instructions</CardTitle>
              <CardDescription>
                Provide custom context for AI responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-instructions">Instructions</Label>
                <Textarea
                  id="custom-instructions"
                  value={settings.customInstructions || ""}
                  onChange={(e) => setSettings({ ...settings, customInstructions: e.target.value })}
                  placeholder="E.g., Always use formal language. Our company focuses on enterprise clients..."
                  rows={4}
                  data-testid="input-custom-instructions"
                />
                <p className="text-xs text-muted-foreground">
                  These instructions will be included in all AI requests to customize responses for your business
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          data-testid="button-save-ai-settings"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save AI Settings"
          )}
        </Button>
      </div>
    </div>
  );
}

export default AIPanel;
