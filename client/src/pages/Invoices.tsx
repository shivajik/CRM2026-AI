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
import { invoicesApi, customersApi } from "@/lib/api";
import { Plus, Pencil, Trash2, Receipt, X, DollarSign } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-gray-500",
  sent: "bg-blue-500",
  paid: "bg-green-500",
  partial: "bg-yellow-500",
  overdue: "bg-red-500",
  cancelled: "bg-gray-400",
};

export default function Invoices() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [payingInvoice, setPayingInvoice] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: invoicesApi.getAll,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: invoicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setIsDialogOpen(false);
      setItems([]);
      toast({ title: "Invoice created successfully" });
    },
    onError: () => toast({ title: "Failed to create invoice", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => invoicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setIsDialogOpen(false);
      setEditingInvoice(null);
      setItems([]);
      toast({ title: "Invoice updated successfully" });
    },
    onError: () => toast({ title: "Failed to update invoice", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: invoicesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Invoice deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete invoice", variant: "destructive" }),
  });

  const paymentMutation = useMutation({
    mutationFn: ({ invoiceId, data }: { invoiceId: string; data: any }) => invoicesApi.addPayment(invoiceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setIsPaymentDialogOpen(false);
      setPayingInvoice(null);
      toast({ title: "Payment recorded successfully" });
    },
    onError: () => toast({ title: "Failed to record payment", variant: "destructive" }),
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
    return { subtotal, totalAmount: subtotal, balanceDue: subtotal };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { subtotal, totalAmount, balanceDue } = calculateTotals();
    const data = {
      customerId: formData.get("customerId"),
      status: formData.get("status"),
      issueDate: formData.get("issueDate") || new Date().toISOString(),
      dueDate: formData.get("dueDate") || null,
      terms: formData.get("terms"),
      notes: formData.get("notes"),
      subtotal: String(subtotal),
      totalAmount: String(totalAmount),
      balanceDue: String(balanceDue),
      items: items.map(item => ({
        description: item.description,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
        totalPrice: String(item.totalPrice),
      })),
    };
    if (editingInvoice) {
      updateMutation.mutate({ id: editingInvoice.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      amount: formData.get("amount"),
      paymentMethod: formData.get("paymentMethod"),
      paymentDate: formData.get("paymentDate") || new Date().toISOString(),
      reference: formData.get("reference"),
      notes: formData.get("notes"),
    };
    paymentMutation.mutate({ invoiceId: payingInvoice.id, data });
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Invoices</h1>
              <p className="text-muted-foreground mt-2">Manage invoices and payments</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setEditingInvoice(null); setItems([]); } }}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-invoice"><Plus className="w-4 h-4 mr-2" />New Invoice</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingInvoice ? "Edit Invoice" : "New Invoice"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerId">Customer</Label>
                      <Select name="customerId" defaultValue={editingInvoice?.customerId} required>
                        <SelectTrigger data-testid="select-invoice-customer"><SelectValue placeholder="Select customer" /></SelectTrigger>
                        <SelectContent>
                          {customers.map((customer: any) => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select name="status" defaultValue={editingInvoice?.status || "draft"}>
                        <SelectTrigger data-testid="select-invoice-status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Issue Date</Label>
                      <Input id="issueDate" name="issueDate" type="date" defaultValue={editingInvoice?.issueDate ? format(new Date(editingInvoice.issueDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")} data-testid="input-invoice-issuedate" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" name="dueDate" type="date" defaultValue={editingInvoice?.dueDate ? format(new Date(editingInvoice.dueDate), "yyyy-MM-dd") : ""} data-testid="input-invoice-duedate" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Line Items</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addItem} data-testid="button-add-invoice-item">
                        <Plus className="w-4 h-4 mr-1" />Add Item
                      </Button>
                    </div>
                    {items.length > 0 && (
                      <div className="border rounded-md p-4 space-y-2">
                        {items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5">
                              <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} data-testid={`input-invoice-item-description-${index}`} />
                            </div>
                            <div className="col-span-2">
                              <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} data-testid={`input-invoice-item-quantity-${index}`} />
                            </div>
                            <div className="col-span-2">
                              <Input type="number" step="0.01" placeholder="Price" value={item.unitPrice} onChange={(e) => updateItem(index, "unitPrice", e.target.value)} data-testid={`input-invoice-item-price-${index}`} />
                            </div>
                            <div className="col-span-2 text-right font-medium">${item.totalPrice.toFixed(2)}</div>
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
                    <Textarea id="notes" name="notes" defaultValue={editingInvoice?.notes} data-testid="input-invoice-notes" />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-submit-invoice">
                    {editingInvoice ? "Update" : "Create"} Invoice
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog open={isPaymentDialogOpen} onOpenChange={(open) => { setIsPaymentDialogOpen(open); if (!open) setPayingInvoice(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
              </DialogHeader>
              {payingInvoice && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <p className="text-sm text-muted-foreground">Invoice: {payingInvoice.invoiceNumber}</p>
                  <p className="text-sm text-muted-foreground">Balance Due: ${Number(payingInvoice.balanceDue).toFixed(2)}</p>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" max={payingInvoice.balanceDue} required data-testid="input-payment-amount" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select name="paymentMethod" defaultValue="bank_transfer">
                      <SelectTrigger data-testid="select-payment-method"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input id="paymentDate" name="paymentDate" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} data-testid="input-payment-date" />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-submit-payment">Record Payment</Button>
                </form>
              )}
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5" />All Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : invoices.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No invoices yet. Create your first invoice!</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice: any) => {
                      const customer = customers.find((c: any) => c.id === invoice.customerId);
                      return (
                        <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                          <TableCell className="font-mono">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{customer?.name || "-"}</TableCell>
                          <TableCell><Badge className={statusColors[invoice.status]}>{invoice.status}</Badge></TableCell>
                          <TableCell>${Number(invoice.totalAmount).toFixed(2)}</TableCell>
                          <TableCell>${Number(invoice.paidAmount).toFixed(2)}</TableCell>
                          <TableCell>${Number(invoice.balanceDue).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {Number(invoice.balanceDue) > 0 && (
                                <Button size="sm" variant="ghost" onClick={() => { setPayingInvoice(invoice); setIsPaymentDialogOpen(true); }} data-testid={`button-pay-invoice-${invoice.id}`}>
                                  <DollarSign className="w-4 h-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => { setEditingInvoice(invoice); setItems(invoice.items || []); setIsDialogOpen(true); }} data-testid={`button-edit-invoice-${invoice.id}`}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(invoice.id)} data-testid={`button-delete-invoice-${invoice.id}`}>
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
