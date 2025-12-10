import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { mockTasks } from "@/lib/mockData";
import { Plus, Calendar, Flag, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Tasks() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-1">Stay on top of your to-dos.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>

        <div className="space-y-4">
          {mockTasks.map((task) => (
            <Card key={task.id} className="group hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <Checkbox id={task.id} checked={task.status === 'done'} />
                
                <div className="flex-1">
                  <label 
                    htmlFor={task.id} 
                    className={cn(
                      "text-sm font-medium cursor-pointer",
                      task.status === 'done' && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </label>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {task.assignedTo}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {task.dueDate}
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full",
                    task.priority === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                    task.priority === 'medium' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  )}>
                    <Flag className="h-3 w-3" />
                    <span className="capitalize">{task.priority}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button variant="outline" className="w-full border-dashed text-muted-foreground">
            <Plus className="mr-2 h-4 w-4" /> Create New Task
          </Button>
        </div>
      </div>
    </Layout>
  );
}
