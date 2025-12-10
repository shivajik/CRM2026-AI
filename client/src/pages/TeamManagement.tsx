import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { teamApi, authApi } from "@/lib/api";
import { Plus, Pencil, Trash2, Users, Shield, Copy, Check } from "lucide-react";

const AVAILABLE_PERMISSIONS = [
  { id: "leads", label: "Leads Management", description: "Add, view, and edit leads" },
  { id: "customers", label: "Customers", description: "Manage customers" },
  { id: "deals", label: "Deals", description: "Manage deals and opportunities" },
  { id: "quotations", label: "Quotations", description: "Create and manage quotations" },
  { id: "invoices", label: "Invoices", description: "Create and manage invoices" },
  { id: "tasks", label: "Tasks", description: "Manage tasks" },
  { id: "products", label: "Products", description: "Manage products catalog" },
  { id: "reports", label: "Reports", description: "View reports and analytics" },
  { id: "activities", label: "Activities", description: "Log activities" },
];

export default function TeamManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [copiedCredentials, setCopiedCredentials] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
  });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: teamApi.getMembers,
  });

  const createMutation = useMutation({
    mutationFn: teamApi.createMember,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      setIsDialogOpen(false);
      setSelectedPermissions([]);
      const loginUrl = `${window.location.origin}/team-login`;
      toast({ 
        title: "Team member created successfully",
        description: `Login URL: ${loginUrl}`,
      });
    },
    onError: (error: any) => toast({ 
      title: "Failed to create team member", 
      description: error.message,
      variant: "destructive" 
    }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => teamApi.updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      setIsDialogOpen(false);
      setEditingMember(null);
      setSelectedPermissions([]);
      toast({ title: "Team member updated successfully" });
    },
    onError: (error: any) => toast({ 
      title: "Failed to update team member", 
      description: error.message,
      variant: "destructive" 
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: teamApi.deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast({ title: "Team member deleted successfully" });
    },
    onError: (error: any) => toast({ 
      title: "Failed to delete team member", 
      description: error.message,
      variant: "destructive" 
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingMember) {
      const data = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        permissions: selectedPermissions,
      };
      updateMutation.mutate({ id: editingMember.id, data });
    } else {
      const data = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        permissions: selectedPermissions,
      };
      createMutation.mutate(data);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setSelectedPermissions(member.role?.permissions || []);
    setIsDialogOpen(true);
  };

  const copyCredentials = (member: any) => {
    const loginUrl = `${window.location.origin}/team-login`;
    const text = `Team Login URL: ${loginUrl}\nEmail: ${member.email}`;
    navigator.clipboard.writeText(text);
    setCopiedCredentials(member.id);
    setTimeout(() => setCopiedCredentials(null), 2000);
    toast({ title: "Credentials copied to clipboard" });
  };

  const toggleMemberStatus = (member: any) => {
    updateMutation.mutate({
      id: member.id,
      data: { isActive: !member.isActive }
    });
  };

  if (!currentUser?.isAdmin) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-[60vh]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Access Denied
                </CardTitle>
                <CardDescription>
                  You don't have permission to access team management. Only administrators can manage team members.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const teamLoginUrl = `${window.location.origin}/team-login`;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Management</h1>
              <p className="text-muted-foreground mt-2">Manage your team members and their permissions</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { 
              setIsDialogOpen(open); 
              if (!open) { 
                setEditingMember(null); 
                setSelectedPermissions([]); 
              } 
            }}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-member"><Plus className="w-4 h-4 mr-2" />Add Team Member</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        defaultValue={editingMember?.firstName} 
                        required 
                        data-testid="input-member-firstname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        defaultValue={editingMember?.lastName} 
                        required 
                        data-testid="input-member-lastname"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      defaultValue={editingMember?.email} 
                      required 
                      data-testid="input-member-email"
                    />
                  </div>
                  {!editingMember && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        required 
                        data-testid="input-member-password"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Label>Permissions</Label>
                    <p className="text-sm text-muted-foreground">Select which features this team member can access</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {AVAILABLE_PERMISSIONS.map((permission) => (
                        <div 
                          key={permission.id}
                          className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                            data-testid={`checkbox-permission-${permission.id}`}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`permission-${permission.id}`} className="cursor-pointer font-medium">
                              {permission.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" data-testid="button-submit-member">
                    {editingMember ? "Update" : "Create"} Team Member
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Login URL
              </CardTitle>
              <CardDescription>
                Share this URL with your team members so they can log in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-background rounded border text-sm" data-testid="text-team-login-url">
                  {teamLoginUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(teamLoginUrl);
                    toast({ title: "URL copied to clipboard" });
                  }}
                  data-testid="button-copy-login-url"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : members.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No team members yet. Add your first team member!</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member: any) => (
                      <TableRow key={member.id} data-testid={`row-member-${member.id}`}>
                        <TableCell className="font-medium">
                          {member.firstName} {member.lastName}
                          {member.isAdmin && (
                            <Badge className="ml-2 bg-purple-500">Admin</Badge>
                          )}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          {member.id !== currentUser?.id && !member.isAdmin ? (
                            <Switch
                              checked={member.isActive}
                              onCheckedChange={() => toggleMemberStatus(member)}
                              data-testid={`switch-status-${member.id}`}
                            />
                          ) : (
                            <Badge className={member.isActive ? "bg-green-500" : "bg-gray-500"}>
                              {member.isActive ? "Active" : "Inactive"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.role?.permissions?.slice(0, 3).map((p: string) => (
                              <Badge key={p} variant="outline" className="text-xs">
                                {AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                              </Badge>
                            ))}
                            {member.role?.permissions?.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.role.permissions.length - 3} more
                              </Badge>
                            )}
                            {member.isAdmin && (
                              <Badge variant="outline" className="text-xs bg-purple-100">
                                All Access
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => copyCredentials(member)}
                              data-testid={`button-copy-credentials-${member.id}`}
                            >
                              {copiedCredentials === member.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            {!member.isAdmin && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEdit(member)}
                                  data-testid={`button-edit-member-${member.id}`}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-destructive"
                                  onClick={() => deleteMutation.mutate(member.id)}
                                  data-testid={`button-delete-member-${member.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
