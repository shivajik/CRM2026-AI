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
import { quotationsApi, customersApi } from "@/lib/api";
import { Plus, Pencil, Trash2, FileText, X, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-gray-500",
  sent: "bg-blue-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
  expired: "bg-yellow-500",
};

export default function Quotations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: quotationsApi.getAll,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: quotationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      setIsDialogOpen(false);
      setItems([]);
      toast({ title: "Quotation created successfully" });
    },
    onError: () => toast({ title: "Failed to create quotation", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => quotationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      setIsDialogOpen(false);
      setEditingQuotation(null);
      setItems([]);
      toast({ title: "Quotation updated successfully" });
    },
    onError: () => toast({ title: "Failed to update quotation", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: quotationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast({ title: "Quotation deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete quotation", variant: "destructive" }),
  });

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, totalPrice: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].totalPrice = Number(newItems[index].quantity) * Number(newItems[index].unitPrice);
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
    return { subtotal, totalAmount: subtotal };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { subtotal, totalAmount } = calculateTotals();
    const data = {
      customerId: formData.get("customerId"),
      title: formData.get("title"),
      status: formData.get("status"),
      validUntil: formData.get("validUntil") || null,
      terms: formData.get("terms"),
      notes: formData.get("notes"),
      subtotal: String(subtotal),
      totalAmount: String(totalAmount),
      items: items.map(item => ({
        description: item.description,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
        totalPrice: String(item.totalPrice),
      })),
    };
    if (editingQuotation) {
      updateMutation.mutate({ id: editingQuotation.id, data });
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
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Quotations</h1>
              <p className="text-muted-foreground mt-2">Create and manage quotations</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setEditingQuotation(null); setItems([]); } }}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-quotation"><Plus className="w-4 h-4 mr-2" />New Quotation</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingQuotation ? "Edit Quotation" : "New Quotation"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerId">Customer</Label>
                      <Select name="customerId" defaultValue={editingQuotation?.customerId} required>
                        <SelectTrigger data-testid="select-quotation-customer"><SelectValue placeholder="Select customer" /></SelectTrigger>
                        <SelectContent>
                          {customers.map((customer: any) => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue={editingQuotation?.status || "draft"}>
                        <SelectTrigger data-testid="select-quotation-status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" defaultValue={editingQuotation?.title} required data-testid="input-quotation-title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validUntil">Valid Until</Label>
                      <Input id="validUntil" name="validUntil" type="date" defaultValue={editingQuotation?.validUntil ? format(new Date(editingQuotation.validUntil), "yyyy-MM-dd") : ""} data-testid="input-quotation-validuntil" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Line Items</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addItem} data-testid="button-add-item">
                        <Plus className="w-4 h-4 mr-1" />Add Item
                      </Button>
                    </div>
                    {items.length > 0 && (
                      <div className="border rounded-md p-4 space-y-2">
                        {items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5">
                              <Input placeholder="Description" value={item.description || ""} onChange={(e) => updateItem(index, "description", e.target.value)} data-testid={`input-item-description-${index}`} />
                            </div>
                            <div className="col-span-2">
                              <Input type="number" placeholder="Qty" value={item.quantity || 0} onChange={(e) => updateItem(index, "quantity", e.target.value)} data-testid={`input-item-quantity-${index}`} />
                            </div>
                            <div className="col-span-2">
                              <Input type="number" step="0.01" placeholder="Price" value={item.unitPrice || 0} onChange={(e) => updateItem(index, "unitPrice", e.target.value)} data-testid={`input-item-price-${index}`} />
                            </div>
                            <div className="col-span-2 text-right font-medium">${(Number(item.totalPrice) || 0).toFixed(2)}</div>
                            <div className="col-span-1">
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}><X className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-end pt-4 border-t">
                          <div className="text-lg font-bold">Total: ${calculateTotals().totalAmount.toFixed(2)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" name="notes" defaultValue={editingQuotation?.notes} data-testid="input-quotation-notes" />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-submit-quotation">
                    {editingQuotation ? "Update" : "Create"} Quotation
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />All Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : quotations.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No quotations yet. Create your first quotation!</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote #</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotations.map((quotation: any) => {
                      const customer = customers.find((c: any) => c.id === quotation.customerId);
                      return (
                        <TableRow key={quotation.id} data-testid={`row-quotation-${quotation.id}`}>
                          <TableCell className="font-mono">
                          <button 
                            onClick={() => navigate(`/quotations/${quotation.id}`)} 
                            className="text-primary hover:underline cursor-pointer"
                            data-testid={`link-view-quotation-${quotation.id}`}
                          >
                            {quotation.quoteNumber}
                          </button>
                        </TableCell>
                          <TableCell className="font-medium">{quotation.title}</TableCell>
                          <TableCell>{customer?.name || "-"}</TableCell>
                          <TableCell><Badge className={statusColors[quotation.status]}>{quotation.status}</Badge></TableCell>
                          <TableCell>${Number(quotation.totalAmount).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => navigate(`/quotations/${quotation.id}`)} data-testid={`button-view-quotation-${quotation.id}`}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => { setEditingQuotation(quotation); setItems(quotation.items || []); setIsDialogOpen(true); }} data-testid={`button-edit-quotation-${quotation.id}`}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(quotation.id)} data-testid={`button-delete-quotation-${quotation.id}`}>
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
