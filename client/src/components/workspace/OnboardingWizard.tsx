import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle2, Circle, Palette, Users, UserPlus, 
  FolderPlus, FileText, X, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { workspacesApi } from "@/lib/api";
import { useLocation } from "wouter";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  action: string;
  route: string;
}

interface OnboardingWizardProps {
  workspaceId: string;
  onComplete?: () => void;
  onDismiss?: () => void;
}

export function OnboardingWizard({ workspaceId, onComplete, onDismiss }: OnboardingWizardProps) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isMinimized, setIsMinimized] = useState(false);

  const { data: progress, isLoading } = useQuery({
    queryKey: ["onboarding-progress", workspaceId],
    queryFn: () => workspacesApi.getOnboardingProgress(workspaceId),
    enabled: !!workspaceId,
  });

  const dismissMutation = useMutation({
    mutationFn: () => workspacesApi.dismissOnboarding(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-progress", workspaceId] });
      onDismiss?.();
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => workspacesApi.completeOnboarding(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-progress", workspaceId] });
      onComplete?.();
    },
  });

  if (isLoading || !progress) return null;
  if (progress.isCompleted || progress.isDismissed) return null;

  const steps: OnboardingStep[] = [
    {
      id: "step1AddBranding",
      title: "Customize Your Branding",
      description: "Add your logo and brand colors",
      icon: Palette,
      status: progress.step1AddBranding || 'not_started',
      action: "Add Branding",
      route: "/workspace/settings?tab=branding",
    },
    {
      id: "step2AddTeamMembers",
      title: "Invite Team Members",
      description: "Collaborate with your team",
      icon: UserPlus,
      status: progress.step2AddTeamMembers || 'not_started',
      action: "Invite Team",
      route: "/workspace/settings?tab=team",
    },
    {
      id: "step3AddFirstClient",
      title: "Add Your First Client",
      description: "Create a customer record",
      icon: Users,
      status: progress.step3AddFirstClient || 'not_started',
      action: "Add Client",
      route: "/customers",
    },
    {
      id: "step4CreateProject",
      title: "Create a Project",
      description: "Start tracking your work",
      icon: FolderPlus,
      status: progress.step4CreateProject || 'not_started',
      action: "Create Project",
      route: "/deals",
    },
    {
      id: "step5CreateProposal",
      title: "Send Your First Proposal",
      description: "Close your first deal",
      icon: FileText,
      status: progress.step5CreateProposal || 'not_started',
      action: "Create Proposal",
      route: "/proposals",
    },
  ];

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = (completedCount / steps.length) * 100;
  const currentStep = steps.find(s => s.status !== 'completed') || steps[steps.length - 1];

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50 cursor-pointer"
        onClick={() => setIsMinimized(false)}
        data-testid="onboarding-minimized"
      >
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <Progress value={progressPercent} className="w-20 h-2" />
          <span className="text-sm font-medium">{completedCount}/{steps.length} completed</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 shadow-xl" data-testid="onboarding-wizard">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Getting Started</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsMinimized(true)}
              data-testid="button-minimize-onboarding"
            >
              <span className="text-lg">−</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => dismissMutation.mutate()}
              data-testid="button-dismiss-onboarding"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Progress value={progressPercent} className="flex-1" />
          <span className="text-sm text-muted-foreground">{completedCount}/{steps.length}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.id === currentStep?.id;
          
          return (
            <div 
              key={step.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isCurrent ? 'bg-primary/10' : ''
              }`}
            >
              <div className={`flex-shrink-0 ${
                isCompleted ? 'text-green-500' : 'text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm ${
                  isCompleted ? 'line-through text-muted-foreground' : ''
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {step.description}
                </div>
              </div>
              {!isCompleted && isCurrent && (
                <Button 
                  size="sm"
                  onClick={() => setLocation(step.route)}
                  data-testid={`button-onboarding-${step.id}`}
                >
                  {step.action}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          );
        })}
        
        {completedCount === steps.length && (
          <Button 
            className="w-full mt-4"
            onClick={() => completeMutation.mutate()}
            data-testid="button-complete-onboarding"
          >
            Complete Setup
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
