import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { authApi, apiRequest } from "@/lib/api";
import { useLocation } from "wouter";
import { 
  FileText, Receipt, DollarSign, Clock, User,
  LogOut, LayoutDashboard, Download, Eye
} from "lucide-react";
import { format } from "date-fns";
import { clearAuth } from "@/lib/auth";

const customerPortalApi = {
  getMyQuotations: () => apiRequest("/customer-portal/quotations"),
  getMyInvoices: () => apiRequest("/customer-portal/invoices"),
  getMyProfile: () => apiRequest("/customer-portal/profile"),
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
  
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
  });

  const { data: quotations = [] } = useQuery({
    queryKey: ["customerQuotations"],
    queryFn: customerPortalApi.getMyQuotations,
    enabled: currentUser?.userType === "customer",
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["customerInvoices"],
    queryFn: customerPortalApi.getMyInvoices,
    enabled: currentUser?.userType === "customer",
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      setLocation("/login");
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
              <a href="#quotations" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-blue-200 hover:bg-blue-800" data-testid="link-portal-quotations">
                <FileText className="w-4 h-4" />
                Quotations
              </a>
              <a href="#invoices" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-blue-200 hover:bg-blue-800" data-testid="link-portal-invoices">
                <Receipt className="w-4 h-4" />
                Invoices
              </a>
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  <TabsTrigger value="quotations" data-testid="tab-portal-quotations">
                    <FileText className="w-4 h-4 mr-2" />
                    Quotations
                  </TabsTrigger>
                  <TabsTrigger value="invoices" data-testid="tab-portal-invoices">
                    <Receipt className="w-4 h-4 mr-2" />
                    Invoices
                  </TabsTrigger>
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
                                    {Number(invoice.balanceDue) > 0 && (
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
              </Tabs>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
