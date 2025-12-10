import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { authApi, apiRequest } from "@/lib/api";
import { useLocation } from "wouter";
import { 
  Building2, Users, DollarSign, TrendingUp, Shield, 
  Activity, Settings, LogOut, LayoutDashboard, Globe
} from "lucide-react";
import { format } from "date-fns";
import { clearAuth } from "@/lib/auth";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const saasAdminApi = {
  getStats: () => apiRequest("/saas-admin/stats"),
  getTenants: () => apiRequest("/saas-admin/tenants"),
  getAllUsers: () => apiRequest("/saas-admin/users"),
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function SaasAdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
  });

  const { data: stats } = useQuery({
    queryKey: ["saasAdminStats"],
    queryFn: saasAdminApi.getStats,
    enabled: currentUser?.userType === "saas_admin",
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ["saasAdminTenants"],
    queryFn: saasAdminApi.getTenants,
    enabled: currentUser?.userType === "saas_admin",
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["saasAdminUsers"],
    queryFn: saasAdminApi.getAllUsers,
    enabled: currentUser?.userType === "saas_admin",
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

  useEffect(() => {
    if (currentUser && currentUser.userType !== "saas_admin") {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  if (currentUser && currentUser.userType !== "saas_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const revenueData = stats?.revenueData || [];

  const tenantDistribution = stats?.tenantDistribution?.length > 0 
    ? stats.tenantDistribution 
    : [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="flex">
          <div className="h-screen w-64 bg-slate-900 text-white border-r flex flex-col fixed left-0 top-0 hidden md:flex z-50">
            <div className="p-6">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                SaaS Admin
              </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <div className="px-3 py-2 text-xs uppercase text-slate-400 font-semibold">
                Platform
              </div>
              <a href="#overview" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium bg-primary text-white" data-testid="link-saas-overview">
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </a>
              <a href="#tenants" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800" data-testid="link-saas-tenants">
                <Building2 className="w-4 h-4" />
                Agencies/Tenants
              </a>
              <a href="#users" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800" data-testid="link-saas-users">
                <Users className="w-4 h-4" />
                All Users
              </a>
              <a href="#revenue" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800" data-testid="link-saas-revenue">
                <DollarSign className="w-4 h-4" />
                Revenue
              </a>
              
              <div className="px-3 py-2 text-xs uppercase text-slate-400 font-semibold mt-4">
                System
              </div>
              <a href="#settings" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800" data-testid="link-saas-settings">
                <Settings className="w-4 h-4" />
                Platform Settings
              </a>
              <a href="#activity" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800" data-testid="link-saas-activity">
                <Activity className="w-4 h-4" />
                Activity Logs
              </a>
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                  SA
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate" data-testid="text-saas-admin-name">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">Super Admin</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 h-8 text-xs"
                onClick={handleLogout}
                data-testid="button-saas-logout"
              >
                <LogOut className="w-3 h-3 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="md:pl-64 flex-1 min-h-screen">
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="flex h-16 items-center px-6">
                <h1 className="text-lg font-semibold">Platform Administration</h1>
                <div className="ml-auto flex items-center gap-4">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    <Globe className="w-3 h-3 mr-1" />
                    System Online
                  </Badge>
                </div>
              </div>
            </header>

            <main className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="stat-total-tenants">
                      {stats?.totalTenants ?? tenants.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Registered organizations
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="stat-total-users">
                      {stats?.totalUsers ?? allUsers.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Platform users
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="stat-monthly-revenue">
                      ${(stats?.monthlyRevenue ?? 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This month's revenue
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="stat-active-sessions">
                      {stats?.activeSessions ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently active accounts
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview" data-testid="tab-saas-overview">Overview</TabsTrigger>
                  <TabsTrigger value="tenants" data-testid="tab-saas-tenants">Agencies</TabsTrigger>
                  <TabsTrigger value="users" data-testid="tab-saas-users">Users</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                        <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {revenueData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revenueData}>
                              <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                              <Tooltip />
                              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRevenue)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No revenue data available yet
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Agency Distribution</CardTitle>
                        <CardDescription>By subscription plan</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {tenantDistribution.length > 0 ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={tenantDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {tenantDistribution.map((_entry: { name: string; value: number }, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No agency data available yet
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="tenants">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Agencies/Companies</CardTitle>
                      <CardDescription>Manage all registered agencies on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Agency Name</TableHead>
                            <TableHead>Users</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tenants.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                No agencies registered yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            tenants.map((tenant: any) => (
                              <TableRow key={tenant.id} data-testid={`row-tenant-${tenant.id}`}>
                                <TableCell className="font-medium">{tenant.name}</TableCell>
                                <TableCell>{tenant.userCount || 0}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                    Active
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {tenant.createdAt ? format(new Date(tenant.createdAt), "MMM dd, yyyy") : "-"}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Platform Users</CardTitle>
                      <CardDescription>View all users across all agencies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Agency</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                No users found
                              </TableCell>
                            </TableRow>
                          ) : (
                            allUsers.map((user: any) => (
                              <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.tenantName || "-"}</TableCell>
                                <TableCell>
                                  <Badge variant={user.userType === "saas_admin" ? "default" : "secondary"}>
                                    {user.userType === "saas_admin" ? "Super Admin" :
                                     user.userType === "agency_admin" ? "Agency Admin" :
                                     user.userType === "team_member" ? "Team Member" :
                                     user.userType === "customer" ? "Customer" : user.userType}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={user.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                                    {user.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
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
