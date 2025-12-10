import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportsApi, dealsApi, customersApi, invoicesApi, tasksApi } from "@/lib/api";
import { DollarSign, Users, Briefcase, CheckSquare, Receipt, AlertTriangle, TrendingUp, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Reports() {
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

  const stageData = [
    { name: 'New', count: deals.filter((d: any) => d.stage === 'new').length, value: deals.filter((d: any) => d.stage === 'new').reduce((s: number, d: any) => s + Number(d.value), 0) },
    { name: 'Qualified', count: deals.filter((d: any) => d.stage === 'qualified').length, value: deals.filter((d: any) => d.stage === 'qualified').reduce((s: number, d: any) => s + Number(d.value), 0) },
    { name: 'Proposal', count: deals.filter((d: any) => d.stage === 'proposal').length, value: deals.filter((d: any) => d.stage === 'proposal').reduce((s: number, d: any) => s + Number(d.value), 0) },
    { name: 'Negotiation', count: deals.filter((d: any) => d.stage === 'negotiation').length, value: deals.filter((d: any) => d.stage === 'negotiation').reduce((s: number, d: any) => s + Number(d.value), 0) },
    { name: 'Won', count: deals.filter((d: any) => d.stage === 'won').length, value: deals.filter((d: any) => d.stage === 'won').reduce((s: number, d: any) => s + Number(d.value), 0) },
  ].filter(s => s.count > 0);

  const customerTypeData = [
    { name: 'Lead', value: customers.filter((c: any) => c.customerType === 'lead').length },
    { name: 'Prospect', value: customers.filter((c: any) => c.customerType === 'prospect').length },
    { name: 'Customer', value: customers.filter((c: any) => c.customerType === 'customer').length },
    { name: 'Partner', value: customers.filter((c: any) => c.customerType === 'partner').length },
  ].filter(c => c.value > 0);

  const taskStatusData = [
    { name: 'To Do', value: tasks.filter((t: any) => t.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter((t: any) => t.status === 'in_progress').length },
    { name: 'Done', value: tasks.filter((t: any) => t.status === 'done').length },
  ].filter(t => t.value > 0);

  const invoiceStatusData = [
    { name: 'Draft', value: invoices.filter((i: any) => i.status === 'draft').length },
    { name: 'Sent', value: invoices.filter((i: any) => i.status === 'sent').length },
    { name: 'Paid', value: invoices.filter((i: any) => i.status === 'paid').length },
    { name: 'Partial', value: invoices.filter((i: any) => i.status === 'partial').length },
    { name: 'Overdue', value: invoices.filter((i: any) => i.status === 'overdue').length },
  ].filter(i => i.value > 0);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-2">Analytics and business insights</p>
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
                <CardTitle className="flex items-center gap-2"><CheckSquare className="w-5 h-5" />Task Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {taskStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie data={taskStatusData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-12 text-muted-foreground">No task data available</p>
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
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-12 text-muted-foreground">No invoice data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
