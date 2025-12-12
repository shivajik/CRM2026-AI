import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Building2, Users, Palette, AlertTriangle, Trash2, 
  Mail, UserPlus, MoreVertical, Shield, Eye, UserMinus,
  Send, XCircle, Clock, Check
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { workspacesApi, companyProfileApi, featuresApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string | null;
  };
}

interface WorkspaceInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

const ROLES = [
  { value: "owner", label: "Owner", description: "Full access, can delete workspace" },
  { value: "admin", label: "Admin", description: "Full access, can manage team" },
  { value: "member", label: "Member", description: "Can view and edit data" },
  { value: "viewer", label: "Viewer", description: "Read-only access" },
];

export default function WorkspaceSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getUser();
  
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get("tab") || "info";

  const { data: features } = useQuery({
    queryKey: ["features"],
    queryFn: featuresApi.getFeatures,
    enabled: !!user,
  });

  const { data: companyProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["company-profile"],
    queryFn: companyProfileApi.get,
    enabled: !!user,
  });

  const { data: workspacesData, isLoading: workspacesLoading } = useQuery<{ workspaces: any[]; activeWorkspaceId: string }>({
    queryKey: ["workspaces"],
    queryFn: workspacesApi.getAll,
    enabled: !!user && features?.multi_workspace_enabled === true,
  });

  const workspaces = workspacesData?.workspaces || [];
  const currentWorkspace = workspaces.find((w: any) => w.isPrimary) || workspaces[0];
  const workspaceId = currentWorkspace?.id;

  const { data: members = [], isLoading: membersLoading } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => workspacesApi.getMembers(workspaceId!),
    enabled: !!workspaceId && !!currentWorkspace && features?.multi_workspace_enabled === true,
  });

  const { data: invitations = [], isLoading: invitationsLoading } = useQuery<WorkspaceInvitation[]>({
    queryKey: ["workspace-invitations", workspaceId],
    queryFn: () => workspacesApi.getInvitations(workspaceId!),
    enabled: !!workspaceId && !!currentWorkspace && features?.multi_workspace_enabled === true,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => companyProfileApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
      toast({ title: "Workspace info updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const inviteMutation = useMutation({
    mutationFn: (data: { email: string; role: string }) => {
      if (!workspaceId) throw new Error("No workspace selected");
      return workspacesApi.createInvitation(workspaceId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations"] });
      setInviteDialogOpen(false);
      setInviteEmail("");
      setInviteRole("member");
      toast({ title: "Invitation sent", description: "An invitation email has been sent." });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to send invitation", description: error.message, variant: "destructive" });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => {
      if (!workspaceId) throw new Error("No workspace selected");
      return workspacesApi.updateMemberRole(workspaceId, userId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members"] });
      toast({ title: "Role updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => {
      if (!workspaceId) throw new Error("No workspace selected");
      return workspacesApi.removeMember(workspaceId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members"] });
      toast({ title: "Member removed from workspace" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to remove member", description: error.message, variant: "destructive" });
    },
  });

  const revokeInvitationMutation = useMutation({
    mutationFn: (invitationId: string) => {
      if (!workspaceId) throw new Error("No workspace selected");
      return workspacesApi.revokeInvitation(workspaceId, invitationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations"] });
      toast({ title: "Invitation revoked" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to revoke invitation", description: error.message, variant: "destructive" });
    },
  });

  const handleInvite = () => {
    if (!inviteEmail.trim() || !workspaceId) return;
    inviteMutation.mutate({ email: inviteEmail.trim(), role: inviteRole });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const f = firstName?.charAt(0) || "";
    const l = lastName?.charAt(0) || "";
    return (f + l).toUpperCase() || "U";
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner": return "default";
      case "admin": return "default";
      case "member": return "secondary";
      case "viewer": return "outline";
      default: return "secondary";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "accepted":
        return <Badge variant="default" className="bg-green-600"><Check className="h-3 w-3 mr-1" />Accepted</Badge>;
      case "expired":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      case "revoked":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isMultiWorkspaceEnabled = features?.multi_workspace_enabled === true;
  const isDataLoading = !features || workspacesLoading;

  if (isDataLoading) {
    return (
      <Layout>
        <div className="p-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Loading workspace settings...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isMultiWorkspaceEnabled) {
    return (
      <Layout>
        <div className="p-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Workspace Management
              </CardTitle>
              <CardDescription>
                Multi-workspace features are not enabled for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contact your administrator to enable multi-workspace support.
              </p>
              <Button onClick={() => setLocation("/settings")} className="mt-4">
                Back to Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Workspace Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your workspace configuration, team, and branding.
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info" className="flex items-center gap-2" data-testid="tab-workspace-info">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Workspace Info</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2" data-testid="tab-workspace-team">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2" data-testid="tab-workspace-branding">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2" data-testid="tab-workspace-danger">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Danger Zone</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workspace Information</CardTitle>
                <CardDescription>
                  Basic information about your workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Workspace Name</Label>
                        <Input
                          id="company-name"
                          defaultValue={companyProfile?.companyName || ""}
                          placeholder="Enter workspace name"
                          data-testid="input-workspace-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          defaultValue={companyProfile?.industry || ""}
                          placeholder="Enter industry"
                          data-testid="input-workspace-industry"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={companyProfile?.email || ""}
                          placeholder="contact@company.com"
                          data-testid="input-workspace-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          defaultValue={companyProfile?.phone || ""}
                          placeholder="+1 (555) 000-0000"
                          data-testid="input-workspace-phone"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        defaultValue={companyProfile?.address || ""}
                        placeholder="Enter business address"
                        rows={2}
                        data-testid="input-workspace-address"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        const formData = {
                          companyName: (document.getElementById("company-name") as HTMLInputElement)?.value,
                          industry: (document.getElementById("industry") as HTMLInputElement)?.value,
                          email: (document.getElementById("email") as HTMLInputElement)?.value,
                          phone: (document.getElementById("phone") as HTMLInputElement)?.value,
                          address: (document.getElementById("address") as HTMLTextAreaElement)?.value,
                        };
                        updateProfileMutation.mutate(formData);
                      }}
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-workspace-info"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage who has access to this workspace.
                  </CardDescription>
                </div>
                <Button onClick={() => setInviteDialogOpen(true)} data-testid="button-invite-member">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="text-muted-foreground">Loading members...</div>
                ) : members.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8">
                    No team members yet. Invite someone to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {member.user.profileImageUrl ? (
                              <AvatarImage src={member.user.profileImageUrl} />
                            ) : null}
                            <AvatarFallback>
                              {getInitials(member.user.firstName, member.user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {member.user.firstName} {member.user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{member.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {member.role === "owner" && <Shield className="h-3 w-3 mr-1" />}
                            {member.role}
                          </Badge>
                          {member.role !== "owner" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" data-testid={`button-member-menu-${member.userId}`}>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => updateRoleMutation.mutate({ userId: member.userId, role: "admin" })}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateRoleMutation.mutate({ userId: member.userId, role: "member" })}>
                                  <Users className="h-4 w-4 mr-2" />
                                  Make Member
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateRoleMutation.mutate({ userId: member.userId, role: "viewer" })}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Make Viewer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => removeMemberMutation.mutate(member.userId)}
                                  className="text-destructive"
                                >
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  Remove from Workspace
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  Invitations that haven't been accepted yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invitationsLoading ? (
                  <div className="text-muted-foreground">Loading invitations...</div>
                ) : invitations.filter(i => i.status === "pending").length === 0 ? (
                  <div className="text-muted-foreground text-center py-4">
                    No pending invitations.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invitations.filter(i => i.status === "pending").map((invitation) => (
                      <div key={invitation.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{invitation.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Invited as {invitation.role} · Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(invitation.status)}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => revokeInvitationMutation.mutate(invitation.id)}
                            data-testid={`button-revoke-invitation-${invitation.id}`}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Workspace Logo</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        {companyProfile?.logoUrl ? (
                          <AvatarImage src={companyProfile.logoUrl} />
                        ) : null}
                        <AvatarFallback className="text-2xl">
                          {companyProfile?.companyName?.charAt(0) || "W"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended: 200x200px, PNG or JPG
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          defaultValue="#3b82f6"
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          defaultValue="#3b82f6"
                          placeholder="#3b82f6"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary-color"
                          type="color"
                          defaultValue="#64748b"
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          defaultValue="#64748b"
                          placeholder="#64748b"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="email-signature">Email Signature Template</Label>
                    <Textarea
                      id="email-signature"
                      placeholder="Enter your email signature template..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use {"{name}"}, {"{title}"}, {"{company}"} as placeholders.
                    </p>
                  </div>

                  <Button data-testid="button-save-branding">Save Branding Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger" className="space-y-6">
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Workspace</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Permanently delete this workspace and all its data. This action cannot be undone.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Note:</strong> Data will be retained for 30 days before permanent deletion.
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => setDeleteDialogOpen(true)}
                      data-testid="button-delete-workspace"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Workspace
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join this workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                data-testid="input-invite-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger data-testid="select-invite-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.filter(r => r.value !== "owner").map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div>
                        <span className="font-medium">{role.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {role.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || inviteMutation.isPending}
              data-testid="button-send-invitation"
            >
              <Send className="h-4 w-4 mr-2" />
              {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the workspace "{companyProfile?.companyName}". 
              All data will be permanently removed after 30 days.
              <br /><br />
              Type <strong>DELETE</strong> to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Type DELETE to confirm"
            value={confirmDeleteText}
            onChange={(e) => setConfirmDeleteText(e.target.value)}
            data-testid="input-confirm-delete"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDeleteText("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={confirmDeleteText !== "DELETE"}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-workspace"
            >
              Delete Workspace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
