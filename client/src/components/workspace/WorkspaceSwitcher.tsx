import { useState } from "react";
import { Building2, Plus, Settings, Check, ChevronDown, Crown, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { featuresApi, workspacesApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface FeatureFlags {
  multi_workspace_enabled?: boolean;
}

interface Workspace {
  id: string;
  workspaceId: string;
  role: string;
  isPrimary: boolean;
  workspace: {
    id: string;
    name: string;
  };
}

interface WorkspacesResponse {
  workspaces: Workspace[];
  activeWorkspaceId: string;
}

export function WorkspaceSwitcher() {
  const user = getUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const { data: features } = useQuery<FeatureFlags>({
    queryKey: ["features"],
    queryFn: featuresApi.getFeatures,
    enabled: !!user,
  });

  const { data: workspacesData } = useQuery<WorkspacesResponse>({
    queryKey: ["workspaces"],
    queryFn: workspacesApi.getAll,
    enabled: !!user && features?.multi_workspace_enabled === true,
  });

  const switchWorkspaceMutation = useMutation({
    mutationFn: (workspaceId: string) => workspacesApi.switch(workspaceId),
    onSuccess: () => {
      queryClient.clear();
      toast({ title: "Workspace switched successfully" });
      // Navigate to /app which checks auth and redirects to proper dashboard
      window.location.href = "/app";
    },
    onError: (error: Error) => {
      toast({ title: "Failed to switch workspace", description: error.message, variant: "destructive" });
    },
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: (name: string) => workspacesApi.create({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setCreateDialogOpen(false);
      setNewWorkspaceName("");
      toast({ title: "Workspace created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create workspace", description: error.message, variant: "destructive" });
    },
  });

  const isMultiWorkspaceEnabled = features?.multi_workspace_enabled === true;

  if (!isMultiWorkspaceEnabled) {
    return null;
  }

  const activeWorkspaceId = workspacesData?.activeWorkspaceId;
  const workspaces = workspacesData?.workspaces || [];
  const activeWorkspace = workspaces.find(w => w.workspaceId === activeWorkspaceId);
  const workspaceName = activeWorkspace?.workspace.name || "Workspace";
  const initials = workspaceName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return;
    createWorkspaceMutation.mutate(newWorkspaceName.trim());
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2.5 px-3 py-2 h-auto hover:bg-muted/50 transition-all rounded-lg border border-transparent hover:border-border/50" 
            data-testid="button-workspace-switcher"
          >
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm hidden sm:inline max-w-[140px] truncate">
              {workspaceName}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 p-2">
          <div className="px-2 py-2.5 mb-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              Workspaces
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-8">Switch between your workspaces</p>
          </div>
          <DropdownMenuSeparator className="my-2" />
          
          <div className="space-y-1 max-h-[240px] overflow-y-auto">
            {workspaces.map((ws) => {
              const isActive = ws.workspaceId === activeWorkspaceId;
              const wsInitials = ws.workspace.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
              const isOwner = ws.role === "owner" || ws.role === "admin";
              
              return (
                <DropdownMenuItem
                  key={ws.workspaceId}
                  onClick={() => {
                    if (!isActive) {
                      switchWorkspaceMutation.mutate(ws.workspaceId);
                    }
                  }}
                  className={`flex items-center justify-between cursor-pointer rounded-lg p-2.5 transition-all ${
                    isActive 
                      ? "bg-primary/5 border border-primary/20" 
                      : "hover:bg-muted/50"
                  }`}
                  data-testid={`workspace-item-${ws.workspaceId}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className={`h-9 w-9 ring-2 ${isActive ? "ring-primary/30" : "ring-transparent"}`}>
                      <AvatarFallback className={`text-xs font-bold ${
                        isActive 
                          ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground" 
                          : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300"
                      }`}>
                        {wsInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className={`truncate max-w-[140px] text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                        {ws.workspace.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {isOwner ? (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                            <Crown className="h-3 w-3" />
                            {ws.role.charAt(0).toUpperCase() + ws.role.slice(1)}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {ws.role.charAt(0).toUpperCase() + ws.role.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-3 cursor-pointer rounded-lg p-2.5 text-primary hover:bg-primary/5 transition-all group"
            data-testid="button-create-workspace"
          >
            <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Plus className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Create New Workspace</span>
              <span className="text-[10px] text-muted-foreground">Start a new team or project</span>
            </div>
            <Sparkles className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => setLocation("/settings/workspace")}
            className="flex items-center gap-3 cursor-pointer rounded-lg p-2.5 hover:bg-muted/50 transition-all"
            data-testid="button-workspace-settings"
          >
            <div className="p-1.5 rounded-md bg-muted">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Workspace Settings</span>
              <span className="text-[10px] text-muted-foreground">Manage your workspace</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your team and projects.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                placeholder="Enter workspace name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateWorkspace();
                  }
                }}
                data-testid="input-workspace-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateWorkspace}
              disabled={!newWorkspaceName.trim() || createWorkspaceMutation.isPending}
              data-testid="button-confirm-create-workspace"
            >
              {createWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
