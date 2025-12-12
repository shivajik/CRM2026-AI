import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useToast } from "@/hooks/use-toast";
import { proposalTemplatesApi } from "@/lib/api";
import { format } from "date-fns";
import {
  ArrowLeft,
  Plus,
  Search,
  MoreHorizontal,
  FileEdit,
  Copy,
  Trash2,
  LayoutTemplate,
  FileText,
  Eye,
} from "lucide-react";

export default function ProposalTemplates() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", category: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["proposal-templates"],
    queryFn: proposalTemplatesApi.getAll,
  });

  const handleViewTemplate = (templateId: string) => {
    setLocation(`/proposals/templates/${templateId}`);
  };

  const createMutation = useMutation({
    mutationFn: proposalTemplatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal-templates"] });
      toast({ title: "Template created successfully" });
      setShowCreateDialog(false);
      setFormData({ name: "", description: "", category: "" });
    },
    onError: () => {
      toast({ title: "Failed to create template", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => proposalTemplatesApi.update(editingTemplate?.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal-templates"] });
      toast({ title: "Template updated successfully" });
      setEditingTemplate(null);
      setFormData({ name: "", description: "", category: "" });
    },
    onError: () => {
      toast({ title: "Failed to update template", variant: "destructive" });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: proposalTemplatesApi.duplicate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal-templates"] });
      toast({ title: "Template duplicated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to duplicate template", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: proposalTemplatesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal-templates"] });
      toast({ title: "Template deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete template", variant: "destructive" });
    },
  });

  const filteredTemplates = templates.filter(
    (t: any) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    updateMutation.mutate(formData);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      category: template.category || "",
    });
  };

  const handleUseTemplate = (templateId: string) => {
    setLocation(`/proposals/new?templateId=${templateId}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/proposals")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">Proposal Templates</h1>
              <p className="text-muted-foreground mt-1">Create and manage reusable proposal templates</p>
            </div>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-template">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Templates</CardTitle>
                <CardDescription>Use templates to quickly create professional proposals</CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading templates...</div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <LayoutTemplate className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No templates found</h3>
                <p className="mt-2 text-muted-foreground">Get started by creating your first template.</p>
                <Button className="mt-4" onClick={() => setShowCreateDialog(true)} data-testid="button-create-first">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template: any) => (
                  <Card key={template.id} className="hover:border-primary/50 transition-colors" data-testid={`card-template-${template.id}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base" data-testid={`text-name-${template.id}`}>{template.name}</CardTitle>
                            {template.category && (
                              <Badge variant="secondary" className="text-xs mt-1">{template.category}</Badge>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-menu-${template.id}`}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewTemplate(template.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(template)}>
                              <FileEdit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicateMutation.mutate(template.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setDeleteId(template.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {template.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Updated {format(new Date(template.updatedAt), "MMM d, yyyy")}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewTemplate(template.id)} 
                            data-testid={`button-view-${template.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" onClick={() => handleUseTemplate(template.id)} data-testid={`button-use-${template.id}`}>
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCreateDialog || !!editingTemplate} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingTemplate(null);
          setFormData({ name: "", description: "", category: "" });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? "Update template details" 
                : "Create a new proposal template to speed up your workflow"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Web Development Proposal"
                data-testid="input-template-name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category (optional)</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Development, Marketing"
                data-testid="input-template-category"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this template is for..."
                data-testid="textarea-template-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setEditingTemplate(null);
              setFormData({ name: "", description: "", category: "" });
            }}>
              Cancel
            </Button>
            <Button 
              onClick={editingTemplate ? handleUpdate : handleCreate}
              disabled={!formData.name}
              data-testid="button-submit"
            >
              {editingTemplate ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </Layout>
  );
}
