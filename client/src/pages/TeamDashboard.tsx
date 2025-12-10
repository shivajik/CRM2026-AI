import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { authApi, customersApi, dealsApi, tasksApi, activitiesApi } from "@/lib/api";
import { Plus, Pencil, Trash2, Users, Target, CheckSquare, Activity, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const customerTypeColors: Record<string, string> = {
  lead: "bg-blue-500",
  prospect: "bg-yellow-500",
  customer: "bg-green-500",
  partner: "bg-purple-500",
};

export default function TeamDashboard() {
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const { data: deals = [] } = useQuery({
    queryKey: ["deals"],
    queryFn: dealsApi.getAll,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAll,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: () => activitiesApi.getAll(),
  });

  const hasPermission = (permission: string) => {
    if (currentUser?.isAdmin) return true;
    return currentUser?.permissions?.includes(permission) || currentUser?.permissions?.includes("*");
  };

  const leads = customers.filter((c: any) => c.customerType === "lead");
  const prospects = customers.filter((c: any) => c.customerType === "prospect");
  const activeDeals = deals.filter((d: any) => !["won", "lost"].includes(d.stage));
  const pendingTasks = tasks.filter((t: any) => t.status !== "done");

  const createLeadMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsLeadDialogOpen(false);
      toast({ title: "Lead created successfully" });
    },
    onError: () => toast({ title: "Failed to create lead", variant: "destructive" }),
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => customersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsLeadDialogOpen(false);
      setEditingLead(null);
      toast({ title: "Lead updated successfully" });
    },
    onError: () => toast({ title: "Failed to update lead", variant: "destructive" }),
  });

  const deleteLeadMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Lead deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete lead", variant: "destructive" }),
  });

  const handleLeadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      customerType: formData.get("customerType") as string,
      segment: formData.get("segment") as string,
      industry: formData.get("industry") as string,
      notes: formData.get("notes") as string,
    };
    
    if (editingLead) {
      updateLeadMutation.mutate({ id: editingLead.id, data });
    } else {
      createLeadMutation.mutate(data);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome, {currentUser?.firstName}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Your team dashboard overview
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-leads">{leads.length}</div>
                <p className="text-xs text-muted-foreground">
                  {prospects.length} prospects
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-active-deals">{activeDeals.length}</div>
                <p className="text-xs text-muted-foreground">
                  In pipeline
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-pending-tasks">{pendingTasks.length}</div>
                <p className="text-xs text-muted-foreground">
                  To complete
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activities</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-activities">{activities.length}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="leads" className="space-y-4">
            <TabsList>
              <TabsTrigger value="leads" data-testid="tab-leads">
                <Users className="w-4 h-4 mr-2" />
                Leads
              </TabsTrigger>
              <TabsTrigger value="deals" data-testid="tab-deals">
                <Target className="w-4 h-4 mr-2" />
                Deals
              </TabsTrigger>
              <TabsTrigger value="tasks" data-testid="tab-tasks">
                <CheckSquare className="w-4 h-4 mr-2" />
                Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leads">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Leads Management</CardTitle>
                    <CardDescription>Add, view, and manage your leads</CardDescription>
                  </div>
                  {hasPermission("leads") && (
                    <Dialog open={isLeadDialogOpen} onOpenChange={(open) => { 
                      setIsLeadDialogOpen(open); 
                      if (!open) setEditingLead(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button data-testid="button-add-lead">
                          <Plus className="w-4 h-4 mr-2" />Add Lead
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{editingLead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input 
                                id="name" 
                                name="name" 
                                defaultValue={editingLead?.name} 
                                required 
                                data-testid="input-lead-name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email" 
                                name="email" 
                                type="email"
                                defaultValue={editingLead?.email} 
                                required 
                                data-testid="input-lead-email"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input 
                                id="phone" 
                                name="phone" 
                                defaultValue={editingLead?.phone}
                                data-testid="input-lead-phone"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company">Company</Label>
                              <Input 
                                id="company" 
                                name="company" 
                                defaultValue={editingLead?.company}
                                data-testid="input-lead-company"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="customerType">Type</Label>
                              <Select name="customerType" defaultValue={editingLead?.customerType || "lead"}>
                                <SelectTrigger data-testid="select-lead-type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lead">Lead</SelectItem>
                                  <SelectItem value="prospect">Prospect</SelectItem>
                                  <SelectItem value="customer">Customer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="segment">Segment</Label>
                              <Select name="segment" defaultValue={editingLead?.segment || ""}>
                                <SelectTrigger data-testid="select-lead-segment">
                                  <SelectValue placeholder="Select segment" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="enterprise">Enterprise</SelectItem>
                                  <SelectItem value="mid-market">Mid-Market</SelectItem>
                                  <SelectItem value="small-business">Small Business</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="industry">Industry</Label>
                              <Input 
                                id="industry" 
                                name="industry" 
                                defaultValue={editingLead?.industry}
                                data-testid="input-lead-industry"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea 
                              id="notes" 
                              name="notes" 
                              defaultValue={editingLead?.notes}
                              data-testid="input-lead-notes"
                            />
                          </div>
                          <Button type="submit" className="w-full" data-testid="button-submit-lead">
                            {editingLead ? "Update" : "Create"} Lead
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent>
                  {customersLoading ? (
                    <p>Loading...</p>
                  ) : leads.length === 0 && prospects.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No leads yet. {hasPermission("leads") && "Add your first lead!"}
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created</TableHead>
                          {hasPermission("leads") && <TableHead>Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...leads, ...prospects].map((lead: any) => (
                          <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>{lead.company || "-"}</TableCell>
                            <TableCell>
                              <Badge className={customerTypeColors[lead.customerType]}>
                                {lead.customerType}
                              </Badge>
                            </TableCell>
                            <TableCell>{format(new Date(lead.createdAt), "MMM dd, yyyy")}</TableCell>
                            {hasPermission("leads") && (
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => { setEditingLead(lead); setIsLeadDialogOpen(true); }}
                                    data-testid={`button-edit-lead-${lead.id}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-destructive"
                                    onClick={() => deleteLeadMutation.mutate(lead.id)}
                                    data-testid={`button-delete-lead-${lead.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deals">
              <Card>
                <CardHeader>
                  <CardTitle>Active Deals</CardTitle>
                  <CardDescription>Track your sales opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  {deals.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No deals yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Deal</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Probability</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deals.slice(0, 10).map((deal: any) => (
                          <TableRow key={deal.id} data-testid={`row-deal-${deal.id}`}>
                            <TableCell className="font-medium">{deal.title}</TableCell>
                            <TableCell>${Number(deal.value).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{deal.stage}</Badge>
                            </TableCell>
                            <TableCell>{deal.probability}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Your Tasks</CardTitle>
                  <CardDescription>Tasks assigned to you</CardDescription>
                </CardHeader>
                <CardContent>
                  {tasks.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No tasks yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Due Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasks.slice(0, 10).map((task: any) => (
                          <TableRow key={task.id} data-testid={`row-task-${task.id}`}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>
                              <Badge variant={task.status === "done" ? "default" : "secondary"}>
                                {task.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={
                                  task.priority === "high" ? "border-red-500 text-red-500" :
                                  task.priority === "medium" ? "border-yellow-500 text-yellow-500" :
                                  "border-green-500 text-green-500"
                                }
                              >
                                {task.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
