import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, ChevronDown, Plus, Check, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { workspacesApi, featuresApi, companyProfileApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface Workspace {
  id: string;
  name: string;
  role: string;
  logoUrl?: string | null;
  isPrimary?: boolean;
}

interface FeatureFlags {
  multi_workspace_enabled?: boolean;
}

export function WorkspaceSwitcher() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getUser();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const { data: features } = useQuery<FeatureFlags>({
    queryKey: ["features"],
    queryFn: featuresApi.getFeatures,
    enabled: !!user,
  });

  const { data: workspaces = [], isLoading: workspacesLoading } = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: workspacesApi.getAll,
    enabled: !!user && features?.multi_workspace_enabled === true,
  });

  const { data: companyProfile } = useQuery({
    queryKey: ["company-profile"],
    queryFn: companyProfileApi.get,
    enabled: !!user,
  });

  const switchMutation = useMutation({
    mutationFn: (workspaceId: string) => workspacesApi.switch(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "Workspace switched",
        description: "You are now working in a different workspace.",
      });
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to switch workspace",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => workspacesApi.create({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setCreateDialogOpen(false);
      setNewWorkspaceName("");
      toast({
        title: "Workspace created",
        description: "Your new workspace has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create workspace",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isMultiWorkspaceEnabled = features?.multi_workspace_enabled === true;
  const hasMultipleWorkspaces = workspaces.length > 1;
  const showSwitcher = isMultiWorkspaceEnabled || hasMultipleWorkspaces;

  if (!showSwitcher) {
    return null;
  }

  const currentWorkspace = workspaces.find(w => w.isPrimary) || workspaces[0];
  const currentWorkspaceName = currentWorkspace?.name || companyProfile?.companyName || "Workspace";

  const getWorkspaceInitials = (name: string) => {
    return name.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
      case "admin":
        return "default";
      case "member":
        return "secondary";
      case "viewer":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleSwitchWorkspace = (workspaceId: string) => {
    if (workspaceId === currentWorkspace?.id) return;
    switchMutation.mutate(workspaceId);
  };

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return;
    createMutation.mutate(newWorkspaceName.trim());
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 px-3 py-2 h-auto"
            data-testid="button-workspace-switcher"
          >
            <Avatar className="h-7 w-7">
              {currentWorkspace?.logoUrl ? (
                <AvatarImage src={currentWorkspace.logoUrl} alt={currentWorkspaceName} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {getWorkspaceInitials(currentWorkspaceName)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm hidden sm:inline max-w-[120px] truncate">
              {currentWorkspaceName}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="start">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Workspaces
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {workspacesLoading ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              Loading workspaces...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No workspaces found
            </div>
          ) : (
            workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => handleSwitchWorkspace(workspace.id)}
                className="flex items-center gap-3 py-3 cursor-pointer"
                data-testid={`workspace-item-${workspace.id}`}
              >
                <Avatar className="h-8 w-8">
                  {workspace.logoUrl ? (
                    <AvatarImage src={workspace.logoUrl} alt={workspace.name} />
                  ) : null}
                  <AvatarFallback className="bg-muted text-xs font-semibold">
                    {getWorkspaceInitials(workspace.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{workspace.name}</span>
                    {workspace.id === currentWorkspace?.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <Badge variant={getRoleBadgeVariant(workspace.role)} className="text-xs mt-0.5">
                    {workspace.role}
                  </Badge>
                </div>
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />
          
          {currentWorkspace && (
            <>
              <DropdownMenuItem 
                onClick={() => setLocation("/settings/workspace")}
                className="flex items-center gap-2"
                data-testid="link-workspace-settings"
              >
                <Settings className="h-4 w-4" />
                Workspace Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLocation(`/settings/workspace?tab=team`)}
                className="flex items-center gap-2"
                data-testid="link-workspace-team"
              >
                <Users className="h-4 w-4" />
                Manage Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem 
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2"
            data-testid="button-create-workspace"
          >
            <Plus className="h-4 w-4" />
            Create New Workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to manage a separate organization or agency.
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
              disabled={!newWorkspaceName.trim() || createMutation.isPending}
              data-testid="button-confirm-create-workspace"
            >
              {createMutation.isPending ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
