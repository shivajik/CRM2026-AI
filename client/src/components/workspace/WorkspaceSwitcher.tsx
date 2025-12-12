import { useState } from "react";
import { Building2, Plus, Settings, Check, ChevronDown } from "lucide-react";
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
      window.location.href = "/";
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
          <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto" data-testid="button-workspace-switcher">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm hidden sm:inline max-w-[120px] truncate">
              {workspaceName}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Workspaces
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.workspaceId}
              onClick={() => {
                if (ws.workspaceId !== activeWorkspaceId) {
                  switchWorkspaceMutation.mutate(ws.workspaceId);
                }
              }}
              className="flex items-center justify-between cursor-pointer"
              data-testid={`workspace-item-${ws.workspaceId}`}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {ws.workspace.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate max-w-[150px]">{ws.workspace.name}</span>
              </div>
              {ws.workspaceId === activeWorkspaceId && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2 cursor-pointer"
            data-testid="button-create-workspace"
          >
            <Plus className="h-4 w-4" />
            Create New Workspace
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => setLocation("/workspace-settings")}
            className="flex items-center gap-2 cursor-pointer"
            data-testid="button-workspace-settings"
          >
            <Settings className="h-4 w-4" />
            Workspace Settings
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
