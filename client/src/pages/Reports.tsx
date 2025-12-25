import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { reportsApi, dealsApi, customersApi, invoicesApi, tasksApi, quotationsApi } from "@/lib/api";
import { DollarSign, Users, Briefcase, CheckSquare, Receipt, AlertTriangle, TrendingUp, PieChart, Download, FileSpreadsheet, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line } from "recharts";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

type ReportType = "sales" | "pipeline" | "customers" | "invoices" | "activities";
type DateRange = "7days" | "30days" | "thisMonth" | "lastMonth" | "90days" | "all";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("sales");
  const [dateRange, setDateRange] = useState<DateRange>("30days");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: reportsApi.getDashboardStats,
  });

  const { data: deals = [] } = useQuery({
    queryKey: ["deals"],
    queryFn: dealsApi.getAll,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices"],
    queryFn: invoicesApi.getAll,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAll,
  });

  const { data: quotations = [] } = useQuery({
    queryKey: ["quotations"],
    queryFn: quotationsApi.getAll,
  });

  const getDateRangeFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case "7days": return subDays(now, 7);
      case "30days": return subDays(now, 30);
      case "thisMonth": return startOfMonth(now);
      case "lastMonth": return startOfMonth(subMonths(now, 1));
      case "90days": return subDays(now, 90);
      default: return new Date(0);
    }
  };

  const filterByDate = (items: any[], dateField: string = "createdAt") => {
    const startDate = getDateRangeFilter();
    return items.filter((item: any) => new Date(item[dateField]) >= startDate);
  };

  const filteredDeals = filterByDate(deals);
  const filteredInvoices = filterByDate(invoices, "issueDate");
  const filteredCustomers = filterByDate(customers);
  const filteredQuotations = filterByDate(quotations);

  const stageData = [
    { name: 'New', count: deals.filter((d: any) => d.stage === 'new').length, value: deals.filter((d: any) => d.stage === 'new').reduce((s: number, d: any) => s + Number(d.value), 0) },
    { name: 'Qualification', count: deals.filter((d: any) => d.stage === 'qualification').length, value: deals.filter((d: any) => d.stage === 'qualification').reduce((s: number, d: any) => s + Number(d.value), 0) },
    { name: 'Proposal', count: deals.filter((d: any) => d.stage === 'proposal').length, value: deals.filter((d: any) => d.stage === 'proposal').reduce((s: number, d: any) => s + Number(d.value), 0) },
    { name: 'Negotiation', count: deals.filter((d: any) => d.stage === 'negotiation').length, value: deals.filter((d: any) => d.stage === 'negotiation').reduce((s: number, d: any) => s + Number(d.value), 0) },
    { name: 'Won', count: deals.filter((d: any) => d.stage === 'closed-won' || d.stage === 'won').length, value: deals.filter((d: any) => d.stage === 'closed-won' || d.stage === 'won').reduce((s: number, d: any) => s + Number(d.value), 0) },
  ].filter(s => s.count > 0 || s.value > 0);

  const customerTypeData = [
    { name: 'Lead', value: customers.filter((c: any) => c.customerType === 'lead').length },
    { name: 'Prospect', value: customers.filter((c: any) => c.customerType === 'prospect').length },
    { name: 'Customer', value: customers.filter((c: any) => c.customerType === 'customer').length },
    { name: 'Partner', value: customers.filter((c: any) => c.customerType === 'partner').length },
  ].filter(c => c.value > 0);

  const invoiceStatusData = [
    { name: 'Draft', value: invoices.filter((i: any) => i.status === 'draft').length, amount: invoices.filter((i: any) => i.status === 'draft').reduce((s: number, i: any) => s + Number(i.totalAmount), 0) },
    { name: 'Sent', value: invoices.filter((i: any) => i.status === 'sent').length, amount: invoices.filter((i: any) => i.status === 'sent').reduce((s: number, i: any) => s + Number(i.totalAmount), 0) },
    { name: 'Paid', value: invoices.filter((i: any) => i.status === 'paid').length, amount: invoices.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + Number(i.paidAmount), 0) },
    { name: 'Overdue', value: invoices.filter((i: any) => i.status === 'overdue').length, amount: invoices.filter((i: any) => i.status === 'overdue').reduce((s: number, i: any) => s + Number(i.balanceDue), 0) },
  ].filter(i => i.value > 0);

  const totalDealValue = deals.reduce((sum: number, d: any) => sum + Number(d.value), 0);
  const wonDealValue = deals.filter((d: any) => d.stage === 'closed-won' || d.stage === 'won').reduce((sum: number, d: any) => sum + Number(d.value), 0);
  const totalInvoiced = invoices.reduce((sum: number, i: any) => sum + Number(i.totalAmount), 0);
  const totalPaid = invoices.reduce((sum: number, i: any) => sum + Number(i.paidAmount), 0);
  const totalOutstanding = invoices.reduce((sum: number, i: any) => sum + Number(i.balanceDue), 0);

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(h => {
        const key = h.toLowerCase().replace(/ /g, "");
        let value = row[key] ?? row[h] ?? "";
        if (typeof value === "string" && value.includes(",")) {
          value = `"${value}"`;
        }
        return value;
      }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSalesReport = () => {
    const data = deals.map((d: any) => ({
      title: d.title,
      stage: d.stage,
      value: Number(d.value).toFixed(2),
      probability: d.probability || 0,
      expectedCloseDate: d.expectedCloseDate ? format(new Date(d.expectedCloseDate), "yyyy-MM-dd") : "",
      createdAt: format(new Date(d.createdAt), "yyyy-MM-dd"),
    }));
    exportToCSV(data, "sales_report", ["title", "stage", "value", "probability", "expectedCloseDate", "createdAt"]);
  };

  const exportCustomerReport = () => {
    const data = customers.map((c: any) => ({
      name: c.name,
      email: c.email,
      phone: c.phone || "",
      company: c.company || "",
      customerType: c.customerType,
      segment: c.segment || "",
      industry: c.industry || "",
      createdAt: format(new Date(c.createdAt), "yyyy-MM-dd"),
    }));
    exportToCSV(data, "customer_report", ["name", "email", "phone", "company", "customerType", "segment", "industry", "createdAt"]);
  };

  const exportInvoiceReport = () => {
    const data = invoices.map((i: any) => ({
      invoiceNumber: i.invoiceNumber,
      status: i.status,
      totalAmount: Number(i.totalAmount).toFixed(2),
      paidAmount: Number(i.paidAmount).toFixed(2),
      balanceDue: Number(i.balanceDue).toFixed(2),
      issueDate: format(new Date(i.issueDate), "yyyy-MM-dd"),
      dueDate: format(new Date(i.dueDate), "yyyy-MM-dd"),
    }));
    exportToCSV(data, "invoice_report", ["invoiceNumber", "status", "totalAmount", "paidAmount", "balanceDue", "issueDate", "dueDate"]);
  };

  const exportPipelineReport = () => {
    const data = stageData.map(s => ({
      stage: s.name,
      count: s.count,
      value: Number(s.value).toFixed(2),
    }));
    exportToCSV(data, "pipeline_report", ["stage", "count", "value"]);
  };

  const printReport = (title: string, content: string) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            h1 { color: #1a1a1a; margin-bottom: 10px; }
            .meta { color: #666; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .summary-item { display: inline-block; margin-right: 40px; }
            .summary-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .summary-label { font-size: 14px; color: #64748b; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="meta">Generated on ${format(new Date(), "PPP 'at' p")}</div>
          ${content}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const printSalesReport = () => {
    const content = `
      <div class="summary">
        <div class="summary-item">
          <div class="summary-value">$${totalDealValue.toLocaleString()}</div>
          <div class="summary-label">Total Pipeline Value</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">$${wonDealValue.toLocaleString()}</div>
          <div class="summary-label">Won Deals Value</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${deals.length}</div>
          <div class="summary-label">Total Deals</div>
        </div>
      </div>
      <h3>Pipeline by Stage</h3>
      <table>
        <thead>
          <tr><th>Stage</th><th>Count</th><th>Value</th></tr>
        </thead>
        <tbody>
          ${stageData.map(s => `<tr><td>${s.name}</td><td>${s.count}</td><td>$${Number(s.value).toLocaleString()}</td></tr>`).join("")}
        </tbody>
      </table>
      <h3>Deal Details</h3>
      <table>
        <thead>
          <tr><th>Title</th><th>Stage</th><th>Value</th><th>Probability</th><th>Expected Close</th></tr>
        </thead>
        <tbody>
          ${deals.map((d: any) => `
            <tr>
              <td>${d.title}</td>
              <td>${d.stage}</td>
              <td>$${Number(d.value).toLocaleString()}</td>
              <td>${d.probability || 0}%</td>
              <td>${d.expectedCloseDate ? format(new Date(d.expectedCloseDate), "MMM dd, yyyy") : "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    printReport("Sales Pipeline Report", content);
  };

  const printInvoiceReport = () => {
    const content = `
      <div class="summary">
        <div class="summary-item">
          <div class="summary-value">$${totalInvoiced.toLocaleString()}</div>
          <div class="summary-label">Total Invoiced</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">$${totalPaid.toLocaleString()}</div>
          <div class="summary-label">Total Paid</div>
        </div>
        <div class="summary-item">
          <div class="summary-value" style="color: #dc2626;">$${totalOutstanding.toLocaleString()}</div>
          <div class="summary-label">Outstanding</div>
        </div>
      </div>
      <h3>Invoice Status Summary</h3>
      <table>
        <thead>
          <tr><th>Status</th><th>Count</th><th>Amount</th></tr>
        </thead>
        <tbody>
          ${invoiceStatusData.map(s => `<tr><td>${s.name}</td><td>${s.value}</td><td>$${Number(s.amount).toLocaleString()}</td></tr>`).join("")}
        </tbody>
      </table>
      <h3>Invoice Details</h3>
      <table>
        <thead>
          <tr><th>Invoice #</th><th>Status</th><th>Total</th><th>Paid</th><th>Balance</th><th>Due Date</th></tr>
        </thead>
        <tbody>
          ${invoices.map((i: any) => `
            <tr>
              <td>${i.invoiceNumber}</td>
              <td>${i.status}</td>
              <td>$${Number(i.totalAmount).toLocaleString()}</td>
              <td>$${Number(i.paidAmount).toLocaleString()}</td>
              <td>$${Number(i.balanceDue).toLocaleString()}</td>
              <td>${format(new Date(i.dueDate), "MMM dd, yyyy")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    printReport("Invoice Report", content);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
              <p className="text-muted-foreground mt-2">Analytics, insights, and exportable reports</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                <SelectTrigger className="w-40" data-testid="select-date-range">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-revenue">
                  ${statsLoading ? "..." : (stats?.totalRevenue || 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-deals">
                  {statsLoading ? "..." : stats?.activeDeals || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-customers">
                  {statsLoading ? "..." : stats?.totalCustomers || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-pending-tasks">
                  {statsLoading ? "..." : stats?.pendingTasks || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-pending-invoices">
                  {statsLoading ? "..." : stats?.pendingInvoices || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500" data-testid="text-overdue-invoices">
                  {statsLoading ? "..." : stats?.overdueInvoices || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="sales" data-testid="tab-sales">Sales Report</TabsTrigger>
              <TabsTrigger value="invoices" data-testid="tab-invoices">Invoice Report</TabsTrigger>
              <TabsTrigger value="customers" data-testid="tab-customers">Customer Report</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />Sales Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stageData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stageData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => ['$' + Number(value).toLocaleString(), 'Value']} />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center py-12 text-muted-foreground">No deal data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5" />Customer Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customerTypeData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPie>
                          <Pie data={customerTypeData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {customerTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPie>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center py-12 text-muted-foreground">No customer data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5" />Invoice Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {invoiceStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={invoiceStatusData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip formatter={(value, name) => [name === 'amount' ? '$' + Number(value).toLocaleString() : value, name === 'amount' ? 'Amount' : 'Count']} />
                          <Bar dataKey="value" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center py-12 text-muted-foreground">No invoice data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Export</CardTitle>
                    <CardDescription>Download reports in CSV format</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={exportSalesReport} data-testid="button-export-sales">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export Sales Report (CSV)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={exportCustomerReport} data-testid="button-export-customers">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export Customer Report (CSV)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={exportInvoiceReport} data-testid="button-export-invoices">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export Invoice Report (CSV)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={exportPipelineReport} data-testid="button-export-pipeline">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export Pipeline Report (CSV)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sales Pipeline Report</CardTitle>
                    <CardDescription>Detailed view of all deals and pipeline stages</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportSalesReport} data-testid="button-export-sales-csv">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button onClick={printSalesReport} data-testid="button-print-sales">
                      <Download className="h-4 w-4 mr-2" />
                      Print/PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">${totalDealValue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Pipeline</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-green-600">${wonDealValue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Won Value</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{deals.length}</p>
                      <p className="text-sm text-muted-foreground">Total Deals</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{deals.filter((d: any) => d.stage === 'closed-won' || d.stage === 'won').length}</p>
                      <p className="text-sm text-muted-foreground">Won Deals</p>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deal</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">Probability</TableHead>
                        <TableHead>Expected Close</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deals.map((deal: any) => (
                        <TableRow key={deal.id}>
                          <TableCell className="font-medium">{deal.title}</TableCell>
                          <TableCell><Badge variant="outline">{deal.stage}</Badge></TableCell>
                          <TableCell className="text-right">${Number(deal.value).toLocaleString()}</TableCell>
                          <TableCell className="text-right">{deal.probability || 0}%</TableCell>
                          <TableCell>{deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), "MMM dd, yyyy") : "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Invoice Report</CardTitle>
                    <CardDescription>Overview of all invoices and payment status</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportInvoiceReport} data-testid="button-export-invoice-csv">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button onClick={printInvoiceReport} data-testid="button-print-invoices">
                      <Download className="h-4 w-4 mr-2" />
                      Print/PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">${totalInvoiced.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Invoiced</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Paid</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">${totalOutstanding.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{invoices.length}</p>
                      <p className="text-sm text-muted-foreground">Total Invoices</p>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice: any) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>
                            <Badge className={invoice.status === 'paid' ? 'bg-green-500' : invoice.status === 'overdue' ? 'bg-red-500' : 'bg-blue-500'}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">${Number(invoice.totalAmount).toLocaleString()}</TableCell>
                          <TableCell className="text-right">${Number(invoice.paidAmount).toLocaleString()}</TableCell>
                          <TableCell className="text-right">${Number(invoice.balanceDue).toLocaleString()}</TableCell>
                          <TableCell>{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Customer Report</CardTitle>
                    <CardDescription>Complete list of all customers and their details</CardDescription>
                  </div>
                  <Button variant="outline" onClick={exportCustomerReport} data-testid="button-export-customer-csv">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {customerTypeData.map((ct, index) => (
                      <div key={ct.name} className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>{ct.value}</p>
                        <p className="text-sm text-muted-foreground">{ct.name}s</p>
                      </div>
                    ))}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Segment</TableHead>
                        <TableHead>Industry</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer: any) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.company || "-"}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell><Badge variant="outline">{customer.customerType}</Badge></TableCell>
                          <TableCell>{customer.segment || "-"}</TableCell>
                          <TableCell>{customer.industry || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
