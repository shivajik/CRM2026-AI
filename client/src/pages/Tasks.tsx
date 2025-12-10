import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, Flag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api";

export default function Tasks() {
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAll,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      tasksApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "todo" : "done";
    updateTaskMutation.mutate({ id: taskId, status: newStatus });
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
              <p className="text-muted-foreground mt-1">Stay on top of your to-dos.</p>
            </div>
            <Button data-testid="button-add-task">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No tasks yet. Create your first task to get started.</p>
              <Button data-testid="button-create-first-task">
                <Plus className="mr-2 h-4 w-4" /> Create Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task: any) => (
                <Card key={task.id} className="group hover:shadow-sm transition-shadow" data-testid={`card-task-${task.id}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Checkbox
                      id={task.id}
                      checked={task.status === "done"}
                      onCheckedChange={() => handleToggleTask(task.id, task.status)}
                      data-testid={`checkbox-task-${task.id}`}
                    />

                    <div className="flex-1">
                      <label
                        htmlFor={task.id}
                        className={cn(
                          "text-sm font-medium cursor-pointer",
                          task.status === "done" && "line-through text-muted-foreground"
                        )}
                        data-testid={`text-title-${task.id}`}
                      >
                        {task.title}
                      </label>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      <div
                        className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-full",
                          task.priority === "high"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        )}
                        data-testid={`text-priority-${task.id}`}
                      >
                        <Flag className="h-3 w-3" />
                        <span className="capitalize">{task.priority}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                className="w-full border-dashed text-muted-foreground"
                data-testid="button-create-new-task"
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Task
              </Button>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
