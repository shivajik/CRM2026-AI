import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus, Calendar, Flag, Pencil, Trash2, MoreHorizontal, Users, Clock,
  CheckSquare, MessageSquare, Paperclip, AlertCircle, LayoutGrid, List,
  Filter, ChevronRight, Play, Pause, X, Check, Eye
} from "lucide-react";
import { AIButton } from "@/components/ai";
import { cn } from "@/lib/utils";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, usersApi } from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from "date-fns";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignedTo?: string;
  createdBy?: string;
  customerId?: string;
  dealId?: string;
  tags?: string[];
  estimatedTime?: number;
  completedAt?: string;
  createdAt: string;
}

interface TaskDetails extends Task {
  assignments: any[];
  checklists: any[];
  comments: any[];
  timeLogs: any[];
  attachments: any[];
  statusHistory: any[];
  activityLog: any[];
  creator?: any;
  assignee?: any;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
}

const TASK_STATUSES = [
  { id: "not_started", label: "To Do", color: "bg-slate-500", icon: CheckSquare },
  { id: "in_progress", label: "In Progress", color: "bg-blue-500", icon: Play },
  { id: "under_review", label: "Review", color: "bg-purple-500", icon: Eye },
  { id: "on_hold", label: "Blocked", color: "bg-red-500", icon: AlertCircle },
  { id: "completed", label: "Done", color: "bg-green-500", icon: Check },
  { id: "cancelled", label: "Cancelled", color: "bg-gray-400", icon: X },
];

const PRIORITIES = [
  { id: "low", label: "Low", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { id: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { id: "high", label: "High", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  { id: "urgent", label: "Urgent", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
];

const emptyTask = {
  title: "",
  description: "",
  status: "not_started",
  priority: "medium",
  dueDate: "",
  assignedTo: "",
  estimatedTime: "",
  tags: "",
  checklists: [] as string[],
};

export default function Tasks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [formData, setFormData] = useState(emptyTask);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newComment, setNewComment] = useState("");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", statusFilter, priorityFilter],
    queryFn: () => tasksApi.getAll({
      status: statusFilter !== "all" ? statusFilter : undefined,
      priority: priorityFilter !== "all" ? priorityFilter : undefined,
    }),
  });

  const { data: taskDetails, isLoading: detailsLoading } = useQuery<TaskDetails>({
    queryKey: ["task-details", selectedTask?.id],
    queryFn: () => selectedTask ? tasksApi.getDetails(selectedTask.id) : Promise.resolve(null),
    enabled: !!selectedTask && isDetailSheetOpen,
  });

  const { data: analytics } = useQuery({
    queryKey: ["task-analytics"],
    queryFn: tasksApi.getAnalytics,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["team-members"],
    queryFn: usersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-analytics"] });
      toast({ title: "Task created", description: "New task has been added successfully." });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create task", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-details"] });
      queryClient.invalidateQueries({ queryKey: ["task-analytics"] });
      toast({ title: "Task updated", description: "Task has been updated successfully." });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update task", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-analytics"] });
      toast({ title: "Task deleted", description: "Task has been removed successfully." });
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete task", variant: "destructive" });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ taskId, content }: { taskId: string; content: string }) => 
      tasksApi.addComment(taskId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-details"] });
      setNewComment("");
      toast({ title: "Comment added" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to add comment", variant: "destructive" });
    },
  });

  const toggleChecklistMutation = useMutation({
    mutationFn: ({ taskId, itemId }: { taskId: string; itemId: string }) => 
      tasksApi.toggleChecklistItem(taskId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-details"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update checklist", variant: "destructive" });
    },
  });

  const addChecklistMutation = useMutation({
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) => 
      tasksApi.addChecklistItem(taskId, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-details"] });
      setNewChecklistItem("");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to add checklist item", variant: "destructive" });
    },
  });

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData(emptyTask);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      assignedTo: task.assignedTo || "",
      estimatedTime: task.estimatedTime?.toString() || "",
      tags: task.tags?.join(", ") || "",
      checklists: [],
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    setFormData(emptyTask);
  };

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setIsDetailSheetOpen(true);
  };

  const handleOpenDelete = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      assignedTo: formData.assignedTo || null,
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : null,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      checklists: formData.checklists,
    };

    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = () => {
    if (taskToDelete) {
      deleteMutation.mutate(taskToDelete.id);
    }
  };

  const handleStatusChange = (task: Task, newStatus: string) => {
    updateMutation.mutate({ id: task.id, data: { status: newStatus } });
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData({
        ...formData,
        checklists: [...formData.checklists, newChecklistItem.trim()],
      });
      setNewChecklistItem("");
    }
  };

  const handleRemoveChecklistItem = (index: number) => {
    setFormData({
      ...formData,
      checklists: formData.checklists.filter((_, i) => i !== index),
    });
  };

  const getStatusInfo = (status: string) => 
    TASK_STATUSES.find(s => s.id === status) || TASK_STATUSES[0];

  const getPriorityInfo = (priority: string) => 
    PRIORITIES.find(p => p.id === priority) || PRIORITIES[1];

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === "completed" || task.status === "cancelled") return false;
    return isBefore(new Date(task.dueDate), new Date());
  };

  const isDueSoon = (task: Task) => {
    if (!task.dueDate || task.status === "completed" || task.status === "cancelled") return false;
    const dueDate = new Date(task.dueDate);
    return isAfter(dueDate, new Date()) && isBefore(dueDate, addDays(new Date(), 2));
  };

  const getUserInitials = (user?: User) => {
    if (!user) return "?";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const tasksByStatus = TASK_STATUSES.reduce((acc, status) => {
    acc[status.id] = tasks.filter((t: Task) => t.status === status.id);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
              <p className="text-muted-foreground mt-1">Manage your team's tasks and projects.</p>
            </div>
            <Button onClick={handleOpenCreate} data-testid="button-add-task">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>

          {analytics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{analytics.totalTasks || 0}</div>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-green-600">{analytics.completedThisWeek || 0}</div>
                  <p className="text-xs text-muted-foreground">Completed This Week</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {tasks.filter((t: Task) => t.status === "in_progress").length}
                  </div>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-red-600">{analytics.overdueTasks || 0}</div>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {TASK_STATUSES.map(status => (
                    <SelectItem key={status.id} value={status.id}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]" data-testid="select-priority-filter">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {PRIORITIES.map(priority => (
                    <SelectItem key={priority.id} value={priority.id}>{priority.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                data-testid="view-list"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                data-testid="view-kanban"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No tasks found. Create your first task to get started.</p>
              <Button onClick={handleOpenCreate} data-testid="button-create-first-task">
                <Plus className="mr-2 h-4 w-4" /> Create Task
              </Button>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-3">
              {tasks.map((task: Task) => {
                const statusInfo = getStatusInfo(task.status);
                const priorityInfo = getPriorityInfo(task.priority);
                const assignee = users.find(u => u.id === task.assignedTo);
                
                return (
                  <Card 
                    key={task.id} 
                    className={cn(
                      "group hover:shadow-md transition-all cursor-pointer",
                      isOverdue(task) && "border-red-300 dark:border-red-800",
                      task.status === "completed" && "opacity-60"
                    )}
                    onClick={() => handleOpenDetail(task)}
                    data-testid={`card-task-${task.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div 
                          className={cn("w-2 h-2 mt-2 rounded-full", statusInfo.color)}
                          title={statusInfo.label}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span 
                              className={cn(
                                "font-medium",
                                task.status === "completed" && "line-through text-muted-foreground"
                              )}
                              data-testid={`text-title-${task.id}`}
                            >
                              {task.title}
                            </span>
                            {isOverdue(task) && (
                              <Badge variant="destructive" className="text-xs">Overdue</Badge>
                            )}
                            {isDueSoon(task) && (
                              <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">Due Soon</Badge>
                            )}
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(task.dueDate), "MMM d, yyyy")}
                              </div>
                            )}
                            {task.estimatedTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.estimatedTime}h
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                          <Badge className={priorityInfo.color} data-testid={`text-priority-${task.id}`}>
                            <Flag className="h-3 w-3 mr-1" />
                            {priorityInfo.label}
                          </Badge>

                          <Select
                            value={task.status}
                            onValueChange={(value) => handleStatusChange(task, value)}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs" data-testid={`select-status-${task.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TASK_STATUSES.map(status => (
                                <SelectItem key={status.id} value={status.id}>
                                  <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", status.color)} />
                                    {status.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {assignee && (
                            <Avatar className="h-7 w-7" title={`${assignee.firstName} ${assignee.lastName}`}>
                              <AvatarImage src={assignee.profileImageUrl} />
                              <AvatarFallback className="text-xs">{getUserInitials(assignee)}</AvatarFallback>
                            </Avatar>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${task.id}`}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenEdit(task)} data-testid={`button-edit-${task.id}`}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit Task
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenDelete(task)}
                                className="text-destructive"
                                data-testid={`button-delete-${task.id}`}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
              {TASK_STATUSES.map(status => (
                <div key={status.id} className="min-w-[280px]">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <div className={cn("w-3 h-3 rounded-full", status.color)} />
                    <span className="font-medium text-sm">{status.label}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {tasksByStatus[status.id]?.length || 0}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {(tasksByStatus[status.id] || []).map((task: Task) => {
                      const priorityInfo = getPriorityInfo(task.priority);
                      const assignee = users.find(u => u.id === task.assignedTo);
                      
                      return (
                        <Card 
                          key={task.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleOpenDetail(task)}
                          data-testid={`kanban-card-${task.id}`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-medium text-sm line-clamp-2">{task.title}</span>
                              {assignee && (
                                <Avatar className="h-6 w-6 shrink-0">
                                  <AvatarImage src={assignee.profileImageUrl} />
                                  <AvatarFallback className="text-xs">{getUserInitials(assignee)}</AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={cn("text-xs", priorityInfo.color)}>
                                {priorityInfo.label}
                              </Badge>
                              {isOverdue(task) && (
                                <Badge variant="destructive" className="text-xs">Overdue</Badge>
                              )}
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(task.dueDate), "MMM d")}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                    <Button
                      variant="ghost"
                      className="w-full border-dashed border text-muted-foreground"
                      onClick={() => {
                        setFormData({ ...emptyTask, status: status.id });
                        setIsDialogOpen(true);
                      }}
                      data-testid={`button-add-${status.id}`}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
              <DialogDescription>
                {editingTask ? "Update the task information below." : "Fill in the details to create a new task."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Follow up with client"
                    required
                    data-testid="input-task-title"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Additional details about this task..."
                    data-testid="input-task-description"
                  />
                  <div className="flex justify-end">
                    <AIButton
                      module="task"
                      content={formData.title + (formData.description ? ": " + formData.description : "")}
                      context={{ title: formData.title, priority: formData.priority, status: formData.status }}
                      onResult={(result) => setFormData({ ...formData, description: result })}
                      disabled={!formData.title}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger data-testid="select-task-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_STATUSES.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", status.color)} />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger data-testid="select-task-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((priority) => (
                          <SelectItem key={priority.id} value={priority.id}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      data-testid="input-task-due-date"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                      placeholder="e.g., 2"
                      data-testid="input-task-estimated-time"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select
                    value={formData.assignedTo || "_unassigned"}
                    onValueChange={(value) => setFormData({ ...formData, assignedTo: value === "_unassigned" ? "" : value })}
                  >
                    <SelectTrigger data-testid="select-task-assignee">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_unassigned">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., urgent, client-call, follow-up"
                    data-testid="input-task-tags"
                  />
                </div>

                {!editingTask && (
                  <div className="grid gap-2">
                    <Label>Checklist Items</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        placeholder="Add checklist item..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddChecklistItem())}
                        data-testid="input-checklist-item"
                      />
                      <Button type="button" variant="outline" onClick={handleAddChecklistItem}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.checklists.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {formData.checklists.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-2 rounded">
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="flex-1">{item}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveChecklistItem(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} data-testid="button-save-task">
                  {isSubmitting ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
          <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {selectedTask && (
                  <>
                    <div className={cn("w-3 h-3 rounded-full", getStatusInfo(selectedTask.status).color)} />
                    {selectedTask.title}
                  </>
                )}
              </SheetTitle>
              <SheetDescription>
                {selectedTask?.description || "No description"}
              </SheetDescription>
            </SheetHeader>

            {detailsLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading details...</div>
            ) : taskDetails ? (
              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="checklist">
                    Checklist ({taskDetails.checklists?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="comments">
                    Comments ({taskDetails.comments?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={cn("w-2 h-2 rounded-full", getStatusInfo(taskDetails.status).color)} />
                        <span className="font-medium">{getStatusInfo(taskDetails.status).label}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Priority</Label>
                      <Badge className={cn("mt-1", getPriorityInfo(taskDetails.priority).color)}>
                        {getPriorityInfo(taskDetails.priority).label}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Due Date</Label>
                      <p className="font-medium mt-1">
                        {taskDetails.dueDate ? format(new Date(taskDetails.dueDate), "PPP") : "No due date"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Estimated Time</Label>
                      <p className="font-medium mt-1">
                        {taskDetails.estimatedTime ? `${taskDetails.estimatedTime} hours` : "Not set"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Created By</Label>
                      <p className="font-medium mt-1">
                        {taskDetails.creator ? `${taskDetails.creator.firstName} ${taskDetails.creator.lastName}` : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Assigned To</Label>
                      <p className="font-medium mt-1">
                        {taskDetails.assignee ? `${taskDetails.assignee.firstName} ${taskDetails.assignee.lastName}` : "Unassigned"}
                      </p>
                    </div>
                  </div>

                  {taskDetails.tags && taskDetails.tags.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Tags</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {taskDetails.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-2">
                    <Button onClick={() => handleOpenEdit(taskDetails)} className="flex-1">
                      <Pencil className="h-4 w-4 mr-2" /> Edit Task
                    </Button>
                    <Button variant="destructive" onClick={() => handleOpenDelete(taskDetails)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="checklist" className="mt-4">
                  <div className="space-y-2">
                    {taskDetails.checklists?.map((item: any) => (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50",
                          item.isCompleted && "bg-muted/30"
                        )}
                        onClick={() => toggleChecklistMutation.mutate({ taskId: taskDetails.id, itemId: item.id })}
                      >
                        <Checkbox checked={item.isCompleted} />
                        <span className={cn(item.isCompleted && "line-through text-muted-foreground")}>
                          {item.title}
                        </span>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-4">
                      <Input
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        placeholder="Add new checklist item..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addChecklistMutation.mutate({ taskId: taskDetails.id, title: newChecklistItem });
                          }
                        }}
                      />
                      <Button 
                        variant="outline"
                        onClick={() => addChecklistMutation.mutate({ taskId: taskDetails.id, title: newChecklistItem })}
                        disabled={!newChecklistItem.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="mt-4">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {taskDetails.comments?.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user?.profileImageUrl} />
                            <AvatarFallback>{getUserInitials(comment.user)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : "Unknown"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newComment.trim()) {
                          addCommentMutation.mutate({ taskId: taskDetails.id, content: newComment });
                        }
                      }}
                    />
                    <Button 
                      onClick={() => addCommentMutation.mutate({ taskId: taskDetails.id, content: newComment })}
                      disabled={!newComment.trim() || addCommentMutation.isPending}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {taskDetails.activityLog?.map((log: any) => (
                        <div key={log.id} className="flex gap-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={log.user?.profileImageUrl} />
                            <AvatarFallback className="text-xs">{getUserInitials(log.user)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">
                                {log.user ? `${log.user.firstName} ${log.user.lastName}` : "System"}
                              </span>
                              {" "}{log.description}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : null}
          </SheetContent>
        </Sheet>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout>
    </ProtectedRoute>
  );
}
