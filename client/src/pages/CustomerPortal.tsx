import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { authApi, apiRequest } from "@/lib/api";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, Receipt, DollarSign, User, FolderOpen,
  LogOut, LayoutDashboard, Download, Eye, Check, X, Settings
} from "lucide-react";
import { format } from "date-fns";
import { clearAuth } from "@/lib/auth";

const customerPortalApi = {
  getMyQuotations: () => apiRequest("/customer-portal/quotations"),
  getMyInvoices: () => apiRequest("/customer-portal/invoices"),
  getMyProposals: () => apiRequest("/customer-portal/proposals"),
  getMyDocuments: () => apiRequest("/customer-portal/documents"),
  getMyProfile: () => apiRequest("/customer-portal/profile"),
  getSettings: () => apiRequest("/customer-portal/settings"),
  updateProfile: (data: { firstName: string; lastName: string; phone?: string }) => 
    apiRequest("/customer-portal/profile", { method: "PATCH", body: JSON.stringify(data) }),
  respondToQuotation: (id: string, action: string, notes?: string) => 
    apiRequest(`/customer-portal/quotations/${id}/respond`, { 
      method: "POST", 
      body: JSON.stringify({ action, notes }) 
    }),
  respondToProposal: (id: string, action: string, notes?: string) => 
    apiRequest(`/customer-portal/proposals/${id}/respond`, { 
      method: "POST", 
      body: JSON.stringify({ action, notes }) 
    }),
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-500",
  sent: "bg-blue-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
  expired: "bg-yellow-500",
  paid: "bg-green-500",
  partial: "bg-yellow-500",
  overdue: "bg-red-500",
  cancelled: "bg-gray-500",
};

export default function CustomerPortal() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [responseDialog, setResponseDialog] = useState<{ open: boolean; type: 'quotation' | 'proposal'; id: string; action: 'accept' | 'reject' } | null>(null);
  const [responseNotes, setResponseNotes] = useState("");
  const [profileDialog, setProfileDialog] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phone: "" });
  
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
  });

  const { data: settings } = useQuery({
    queryKey: ["customerPortalSettings"],
    queryFn: customerPortalApi.getSettings,
    enabled: currentUser?.userType === "customer",
  });

  const { data: quotations = [] } = useQuery({
    queryKey: ["customerQuotations"],
    queryFn: customerPortalApi.getMyQuotations,
    enabled: currentUser?.userType === "customer" && settings?.showQuotations !== false,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["customerInvoices"],
    queryFn: customerPortalApi.getMyInvoices,
    enabled: currentUser?.userType === "customer" && settings?.showInvoices !== false,
  });

  const { data: proposals = [] } = useQuery({
    queryKey: ["customerProposals"],
    queryFn: customerPortalApi.getMyProposals,
    enabled: currentUser?.userType === "customer" && settings?.showProposals !== false,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["customerDocuments"],
    queryFn: customerPortalApi.getMyDocuments,
    enabled: currentUser?.userType === "customer" && settings?.showDocuments,
  });

  const quotationResponseMutation = useMutation({
    mutationFn: ({ id, action, notes }: { id: string; action: string; notes?: string }) =>
      customerPortalApi.respondToQuotation(id, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerQuotations"] });
      toast({ title: "Response submitted", description: "Your response has been recorded." });
      setResponseDialog(null);
      setResponseNotes("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit response", variant: "destructive" });
    },
  });

  const proposalResponseMutation = useMutation({
    mutationFn: ({ id, action, notes }: { id: string; action: string; notes?: string }) =>
      customerPortalApi.respondToProposal(id, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerProposals"] });
      toast({ title: "Response submitted", description: "Your response has been recorded." });
      setResponseDialog(null);
      setResponseNotes("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit response", variant: "destructive" });
    },
  });

  const profileMutation = useMutation({
    mutationFn: customerPortalApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({ title: "Profile updated", description: "Your profile has been updated." });
      setProfileDialog(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    },
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      queryClient.clear();
      setLocation("/login");
    }
  };

  const openProfileDialog = () => {
    if (currentUser) {
      setProfileForm({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        phone: currentUser.phone || "",
      });
      setProfileDialog(true);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.userType !== "customer") {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  if (currentUser && currentUser.userType !== "customer") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingQuotations = quotations.filter((q: any) => q.status === "sent");
  const pendingProposals = proposals.filter((p: any) => p.status === "sent");
  const unpaidInvoices = invoices.filter((i: any) => ["sent", "partial", "overdue"].includes(i.status));
  const totalOwed = unpaidInvoices.reduce((acc: number, inv: any) => acc + Number(inv.balanceDue || 0), 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="flex">
          <div className="h-screen w-64 bg-blue-900 text-white border-r flex flex-col fixed left-0 top-0 hidden md:flex z-50">
            <div className="p-6">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-900" />
                </div>
                Customer Portal
              </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <div className="px-3 py-2 text-xs uppercase text-blue-300 font-semibold">
                My Account
              </div>
              <a href="#overview" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium bg-blue-800 text-white" data-testid="link-portal-overview">
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </a>
              {settings?.showQuotations !== false && (
                <a href="#quotations" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-blue-200 hover:bg-blue-800" data-testid="link-portal-quotations">
                  <FileText className="w-4 h-4" />
                  Quotations
                </a>
              )}
              {settings?.showProposals !== false && (
                <a href="#proposals" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-blue-200 hover:bg-blue-800" data-testid="link-portal-proposals">
                  <FileText className="w-4 h-4" />
                  Proposals
                </a>
              )}
              {settings?.showInvoices !== false && (
                <a href="#invoices" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-blue-200 hover:bg-blue-800" data-testid="link-portal-invoices">
                  <Receipt className="w-4 h-4" />
                  Invoices
                </a>
              )}
              {settings?.showDocuments && (
                <a href="#documents" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-blue-200 hover:bg-blue-800" data-testid="link-portal-documents">
                  <FolderOpen className="w-4 h-4" />
                  Documents
                </a>
              )}
            </nav>

            <div className="p-4 border-t border-blue-800">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate" data-testid="text-customer-name">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-xs text-blue-300 truncate">{currentUser?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-blue-300 hover:text-white hover:bg-blue-800 h-8 text-xs mb-1"
                onClick={openProfileDialog}
                data-testid="button-portal-settings"
              >
                <Settings className="w-3 h-3 mr-2" />
                Profile Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-blue-300 hover:text-white hover:bg-blue-800 h-8 text-xs"
                onClick={handleLogout}
                data-testid="button-portal-logout"
              >
                <LogOut className="w-3 h-3 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="md:pl-64 flex-1 min-h-screen">
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="flex h-16 items-center px-6">
                <h1 className="text-lg font-semibold">Welcome, {currentUser?.firstName}!</h1>
              </div>
            </header>

            <main className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Quotations</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="stat-pending-quotes">
                      {pendingQuotations.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Waiting for your response
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Proposals</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="stat-pending-proposals">
                      {pendingProposals.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting approval
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="stat-unpaid-invoices">
                      {unpaidInvoices.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Requires payment
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="stat-total-outstanding">
                      ${totalOwed.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Balance due
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="quotations" className="space-y-4">
                <TabsList>
                  {settings?.showQuotations !== false && (
                    <TabsTrigger value="quotations" data-testid="tab-portal-quotations">
                      <FileText className="w-4 h-4 mr-2" />
                      Quotations
                    </TabsTrigger>
                  )}
                  {settings?.showProposals !== false && (
                    <TabsTrigger value="proposals" data-testid="tab-portal-proposals">
                      <FileText className="w-4 h-4 mr-2" />
                      Proposals
                    </TabsTrigger>
                  )}
                  {settings?.showInvoices !== false && (
                    <TabsTrigger value="invoices" data-testid="tab-portal-invoices">
                      <Receipt className="w-4 h-4 mr-2" />
                      Invoices
                    </TabsTrigger>
                  )}
                  {settings?.showDocuments && (
                    <TabsTrigger value="documents" data-testid="tab-portal-documents">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Documents
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="quotations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Quotations</CardTitle>
                      <CardDescription>View and respond to quotations sent to you</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {quotations.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                          No quotations yet
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Quote #</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Valid Until</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {quotations.map((quote: any) => (
                              <TableRow key={quote.id} data-testid={`row-quote-${quote.id}`}>
                                <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                                <TableCell>{quote.title}</TableCell>
                                <TableCell>${Number(quote.totalAmount).toLocaleString()}</TableCell>
                                <TableCell>
                                  {quote.validUntil ? format(new Date(quote.validUntil), "MMM dd, yyyy") : "-"}
                                </TableCell>
                                <TableCell>
                                  <Badge className={statusColors[quote.status] || "bg-gray-500"}>
                                    {quote.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" data-testid={`button-view-quote-${quote.id}`}>
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" data-testid={`button-download-quote-${quote.id}`}>
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    {quote.status === "sent" && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="default" 
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => setResponseDialog({ open: true, type: 'quotation', id: quote.id, action: 'accept' })}
                                          data-testid={`button-accept-quote-${quote.id}`}
                                        >
                                          <Check className="w-4 h-4 mr-1" /> Accept
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => setResponseDialog({ open: true, type: 'quotation', id: quote.id, action: 'reject' })}
                                          data-testid={`button-reject-quote-${quote.id}`}
                                        >
                                          <X className="w-4 h-4 mr-1" /> Reject
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
                </TabsContent>

                <TabsContent value="proposals">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Proposals</CardTitle>
                      <CardDescription>View and respond to proposals sent to you</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {proposals.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                          No proposals yet
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Proposal #</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Valid Until</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {proposals.map((proposal: any) => (
                              <TableRow key={proposal.id} data-testid={`row-proposal-${proposal.id}`}>
                                <TableCell className="font-medium">{proposal.proposalNumber}</TableCell>
                                <TableCell>{proposal.title}</TableCell>
                                <TableCell>${Number(proposal.totalAmount).toLocaleString()}</TableCell>
                                <TableCell>
                                  {proposal.validUntil ? format(new Date(proposal.validUntil), "MMM dd, yyyy") : "-"}
                                </TableCell>
                                <TableCell>
                                  <Badge className={statusColors[proposal.status] || "bg-gray-500"}>
                                    {proposal.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" data-testid={`button-view-proposal-${proposal.id}`}>
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    {proposal.status === "sent" && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="default" 
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => setResponseDialog({ open: true, type: 'proposal', id: proposal.id, action: 'accept' })}
                                          data-testid={`button-accept-proposal-${proposal.id}`}
                                        >
                                          <Check className="w-4 h-4 mr-1" /> Accept
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => setResponseDialog({ open: true, type: 'proposal', id: proposal.id, action: 'reject' })}
                                          data-testid={`button-reject-proposal-${proposal.id}`}
                                        >
                                          <X className="w-4 h-4 mr-1" /> Reject
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
                </TabsContent>

                <TabsContent value="invoices">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Invoices</CardTitle>
                      <CardDescription>View and pay your invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {invoices.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                          No invoices yet
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Invoice #</TableHead>
                              <TableHead>Issue Date</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Balance Due</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {invoices.map((invoice: any) => (
                              <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                <TableCell>
                                  {invoice.issueDate ? format(new Date(invoice.issueDate), "MMM dd, yyyy") : "-"}
                                </TableCell>
                                <TableCell>
                                  {invoice.dueDate ? format(new Date(invoice.dueDate), "MMM dd, yyyy") : "-"}
                                </TableCell>
                                <TableCell>${Number(invoice.totalAmount).toLocaleString()}</TableCell>
                                <TableCell className={Number(invoice.balanceDue) > 0 ? "text-red-500 font-medium" : ""}>
                                  ${Number(invoice.balanceDue).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge className={statusColors[invoice.status] || "bg-gray-500"}>
                                    {invoice.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" data-testid={`button-view-invoice-${invoice.id}`}>
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" data-testid={`button-download-invoice-${invoice.id}`}>
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    {Number(invoice.balanceDue) > 0 && settings?.allowOnlinePayments && (
                                      <Button size="sm" variant="default" data-testid={`button-pay-invoice-${invoice.id}`}>
                                        Pay Now
                                      </Button>
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
                </TabsContent>

                <TabsContent value="documents">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shared Documents</CardTitle>
                      <CardDescription>Documents shared with you by the agency</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {documents.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                          No documents yet
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {documents.map((doc: any) => (
                              <TableRow key={doc.id} data-testid={`row-document-${doc.id}`}>
                                <TableCell className="font-medium">{doc.name}</TableCell>
                                <TableCell>{doc.description || "-"}</TableCell>
                                <TableCell>{doc.fileType || "File"}</TableCell>
                                <TableCell>
                                  {doc.createdAt ? format(new Date(doc.createdAt), "MMM dd, yyyy") : "-"}
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => window.open(doc.fileUrl, "_blank")}
                                    data-testid={`button-download-doc-${doc.id}`}
                                  >
                                    <Download className="w-4 h-4 mr-1" /> Download
                                  </Button>
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
            </main>
          </div>
        </div>
      </div>

      <Dialog open={responseDialog?.open} onOpenChange={(open) => !open && setResponseDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseDialog?.action === 'accept' ? 'Accept' : 'Reject'} {responseDialog?.type === 'quotation' ? 'Quotation' : 'Proposal'}
            </DialogTitle>
            <DialogDescription>
              {responseDialog?.action === 'accept' 
                ? 'Please confirm that you want to accept this offer.' 
                : 'Please provide a reason for rejecting this offer.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or comments..."
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              className="mt-2"
              data-testid="input-response-notes"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialog(null)}>
              Cancel
            </Button>
            <Button
              variant={responseDialog?.action === 'accept' ? 'default' : 'destructive'}
              onClick={() => {
                if (!responseDialog) return;
                if (responseDialog.type === 'quotation') {
                  quotationResponseMutation.mutate({ id: responseDialog.id, action: responseDialog.action, notes: responseNotes });
                } else {
                  proposalResponseMutation.mutate({ id: responseDialog.id, action: responseDialog.action, notes: responseNotes });
                }
              }}
              disabled={quotationResponseMutation.isPending || proposalResponseMutation.isPending}
              data-testid="button-confirm-response"
            >
              {responseDialog?.action === 'accept' ? 'Accept' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={profileDialog} onOpenChange={setProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                data-testid="input-profile-firstname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                data-testid="input-profile-lastname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                data-testid="input-profile-phone"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => profileMutation.mutate(profileForm)}
              disabled={profileMutation.isPending}
              data-testid="button-save-profile"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
