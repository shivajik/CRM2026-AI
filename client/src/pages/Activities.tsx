import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { activitiesApi, customersApi } from "@/lib/api";
import { Plus, Pencil, Trash2, Activity, Phone, Mail, Calendar, FileText, CheckSquare } from "lucide-react";
import { format } from "date-fns";

const typeIcons: Record<string, any> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  task: CheckSquare,
};

const typeColors: Record<string, string> = {
  call: "bg-blue-500",
  email: "bg-purple-500",
  meeting: "bg-green-500",
  note: "bg-yellow-500",
  task: "bg-orange-500",
};

export default function Activities() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => activitiesApi.getAll(),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: activitiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setIsDialogOpen(false);
      toast({ title: "Activity created successfully" });
    },
    onError: () => toast({ title: "Failed to create activity", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => activitiesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setIsDialogOpen(false);
      setEditingActivity(null);
      toast({ title: "Activity updated successfully" });
    },
    onError: () => toast({ title: "Failed to update activity", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: activitiesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast({ title: "Activity deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete activity", variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      type: formData.get("type"),
      subject: formData.get("subject"),
      description: formData.get("description"),
      customerId: formData.get("customerId") || null,
      outcome: formData.get("outcome"),
      scheduledAt: formData.get("scheduledAt") || null,
      completedAt: formData.get("completedAt") || null,
      duration: formData.get("duration") ? Number(formData.get("duration")) : null,
    };
    if (editingActivity) {
      updateMutation.mutate({ id: editingActivity.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Activities</h1>
              <p className="text-muted-foreground mt-2">Track calls, meetings, and notes</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingActivity(null); }}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-activity"><Plus className="w-4 h-4 mr-2" />Log Activity</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingActivity ? "Edit Activity" : "Log New Activity"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select name="type" defaultValue={editingActivity?.type || "call"}>
                        <SelectTrigger data-testid="select-activity-type"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="note">Note</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerId">Customer</Label>
                      <Select name="customerId" defaultValue={editingActivity?.customerId || ""}>
                        <SelectTrigger data-testid="select-activity-customer"><SelectValue placeholder="Select customer" /></SelectTrigger>
                        <SelectContent>
                          {customers.map((customer: any) => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" defaultValue={editingActivity?.subject} required data-testid="input-activity-subject" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" defaultValue={editingActivity?.description} data-testid="input-activity-description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input id="duration" name="duration" type="number" defaultValue={editingActivity?.duration} data-testid="input-activity-duration" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="outcome">Outcome</Label>
                      <Input id="outcome" name="outcome" defaultValue={editingActivity?.outcome} placeholder="e.g., Follow-up scheduled" data-testid="input-activity-outcome" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-submit-activity">
                    {editingActivity ? "Update" : "Log"} Activity
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" />Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : activities.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No activities yet. Log your first activity!</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity: any) => {
                      const customer = customers.find((c: any) => c.id === activity.customerId);
                      const Icon = typeIcons[activity.type] || Activity;
                      return (
                        <TableRow key={activity.id} data-testid={`row-activity-${activity.id}`}>
                          <TableCell>
                            <Badge className={typeColors[activity.type]}>
                              <Icon className="w-3 h-3 mr-1" />{activity.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{activity.subject}</TableCell>
                          <TableCell>{customer?.name || "-"}</TableCell>
                          <TableCell>{format(new Date(activity.createdAt), "MMM d, yyyy h:mm a")}</TableCell>
                          <TableCell>{activity.duration ? `${activity.duration} min` : "-"}</TableCell>
                          <TableCell>{activity.outcome || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => { setEditingActivity(activity); setIsDialogOpen(true); }} data-testid={`button-edit-activity-${activity.id}`}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(activity.id)} data-testid={`button-delete-activity-${activity.id}`}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
