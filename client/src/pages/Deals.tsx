import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MoreHorizontal, Calendar, Pencil, Trash2, Eye } from "lucide-react";
import { useLocation } from "wouter";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dealsApi } from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Deal {
  id: string;
  title: string;
  value: string;
  stage: string;
  expectedCloseDate?: string;
  notes?: string;
  contactId?: string;
}

const stages = [
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

const emptyDeal = {
  title: "",
  value: "",
  stage: "new",
  expectedCloseDate: "",
  notes: "",
};

export default function Deals() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [formData, setFormData] = useState(emptyDeal);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: dealsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: dealsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast({ title: "Deal created", description: "New deal has been added successfully." });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create deal", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => dealsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast({ title: "Deal updated", description: "Deal has been updated successfully." });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update deal", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dealsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast({ title: "Deal deleted", description: "Deal has been removed successfully." });
      setIsDeleteDialogOpen(false);
      setDealToDelete(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete deal", variant: "destructive" });
    },
  });

  const handleOpenCreate = () => {
    setEditingDeal(null);
    setFormData(emptyDeal);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split("T")[0] : "",
      notes: deal.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDeal(null);
    setFormData(emptyDeal);
  };

  const handleOpenDelete = (deal: Deal) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      value: formData.value,
      expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString() : null,
    };

    if (editingDeal) {
      updateMutation.mutate({ id: editingDeal.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = () => {
    if (dealToDelete) {
      deleteMutation.mutate(dealToDelete.id);
    }
  };

  const handleStageChange = (dealId: string, newStage: string) => {
    updateMutation.mutate({ id: dealId, data: { stage: newStage } });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Deals Pipeline</h1>
              <p className="text-muted-foreground mt-1">Track your sales opportunities.</p>
            </div>
            <Button onClick={handleOpenCreate} data-testid="button-new-deal">
              <Plus className="mr-2 h-4 w-4" /> New Deal
            </Button>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Loading deals...
            </div>
          ) : deals.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No deals yet. Create your first deal to get started.</p>
                <Button onClick={handleOpenCreate} data-testid="button-create-first-deal">
                  <Plus className="mr-2 h-4 w-4" /> Create Deal
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto pb-4">
              <div className="flex gap-6 h-full min-w-max">
                {stages.map((stage) => {
                  const stageDeals = deals.filter((d: Deal) => d.stage === stage.id);
                  const stageValue = stageDeals.reduce((acc: number, d: Deal) => acc + Number(d.value), 0);

                  return (
                    <div key={stage.id} className="w-80 flex flex-col gap-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{stage.label}</span>
                          <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                            {stageDeals.length}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          ${stageValue.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex-1 bg-muted/30 rounded-lg p-2 flex flex-col gap-3 overflow-y-auto">
                        {stageDeals.map((deal: Deal) => (
                          <Card
                            key={deal.id}
                            className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-primary/50 hover:border-l-primary"
                            data-testid={`card-deal-${deal.id}`}
                          >
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-sm font-medium flex justify-between items-start">
                                <span data-testid={`text-title-${deal.id}`}>{deal.title}</span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-6 w-6 p-0 -mt-1 -mr-1 text-muted-foreground"
                                      data-testid={`button-actions-${deal.id}`}
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => navigate(`/deals/${deal.id}`)} data-testid={`button-view-${deal.id}`}>
                                      <Eye className="mr-2 h-4 w-4" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOpenEdit(deal)} data-testid={`button-edit-${deal.id}`}>
                                      <Pencil className="mr-2 h-4 w-4" /> Edit Deal
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel className="text-xs">Move to Stage</DropdownMenuLabel>
                                    {stages.filter(s => s.id !== deal.stage).map(s => (
                                      <DropdownMenuItem
                                        key={s.id}
                                        onClick={() => handleStageChange(deal.id, s.id)}
                                      >
                                        {s.label}
                                      </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleOpenDelete(deal)}
                                      className="text-destructive"
                                      data-testid={`button-delete-${deal.id}`}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <div className="flex flex-col gap-2">
                                <div className="text-lg font-bold text-foreground/90" data-testid={`text-value-${deal.id}`}>
                                  ${Number(deal.value).toLocaleString()}
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                  {deal.expectedCloseDate && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(deal.expectedCloseDate).toLocaleDateString()}
                                    </span>
                                  )}
                                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-sm">
                                    {stage.label}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {stageDeals.length === 0 && (
                          <div className="h-24 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                            No deals
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingDeal ? "Edit Deal" : "Create New Deal"}</DialogTitle>
              <DialogDescription>
                {editingDeal ? "Update the deal information below." : "Fill in the details to create a new deal."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Deal Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Enterprise Software License"
                    required
                    data-testid="input-deal-title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="value">Deal Value *</Label>
                    <Input
                      id="value"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="10000"
                      required
                      data-testid="input-deal-value"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stage">Stage *</Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value) => setFormData({ ...formData, stage: value })}
                    >
                      <SelectTrigger data-testid="select-deal-stage">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                    data-testid="input-deal-close-date"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Additional notes about this deal..."
                    data-testid="input-deal-notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} data-testid="button-save-deal">
                  {isSubmitting ? "Saving..." : editingDeal ? "Update Deal" : "Create Deal"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Deal</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{dealToDelete?.title}"? This action cannot be undone.
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
