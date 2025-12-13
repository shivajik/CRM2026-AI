import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { authApi, saasAdminApi } from "@/lib/api";
import { useLocation } from "wouter";
import { 
  Building2, Users, DollarSign, TrendingUp, Shield, 
  Activity, Settings, LogOut, LayoutDashboard, Globe,
  User, FileText, ChevronRight, Save, RefreshCw, Eye,
  Calendar, Clock, Search, X, Briefcase, Receipt, Package,
  Plus, Pencil, Trash2, Check
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { clearAuth } from "@/lib/auth";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function SaasAdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", email: "" });
  const [settingForm, setSettingForm] = useState({ key: "", value: "", category: "general", description: "", isSensitive: false });
  const [aiSettingsForm, setAiSettingsForm] = useState({ openaiApiKey: "", provider: "openai" });
  const [emailSettingsForm, setEmailSettingsForm] = useState({ smtpHost: "", smtpPort: "", smtpUser: "", smtpPassword: "", senderEmail: "", senderName: "" });
  const [settingsTab, setSettingsTab] = useState("ai");
  const [activityFilters, setActivityFilters] = useState({ action: "", targetType: "", limit: 50 });
  const [showPackageDialog, setShowPackageDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    displayName: "",
    description: "",
    price: "0",
    billingCycle: "monthly",
    isActive: true,
    isPopular: false,
    sortOrder: 0,
    features: [] as string[],
    moduleIds: [] as string[],
    contactLimit: -1,
    teamMemberLimit: -1,
    storageLimit: -1,
    projectLimit: -1,
    apiCallsLimit: -1,
  });
  const [newFeature, setNewFeature] = useState("");
  
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

  const { data: settings = [] } = useQuery({
    queryKey: ["platformSettings"],
    queryFn: saasAdminApi.getSettings,
    enabled: currentUser?.userType === "saas_admin",
  });

  const { data: activityLogs = [], refetch: refetchLogs } = useQuery({
    queryKey: ["activityLogs", activityFilters],
    queryFn: () => saasAdminApi.getActivityLogs(activityFilters),
    enabled: currentUser?.userType === "saas_admin" && showActivityLogs,
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["saasAdminPackages"],
    queryFn: saasAdminApi.getPackages,
    enabled: currentUser?.userType === "saas_admin",
  });

  const { data: modules = [] } = useQuery({
    queryKey: ["saasAdminModules"],
    queryFn: saasAdminApi.getModules,
    enabled: currentUser?.userType === "saas_admin",
  });

  const { data: tenantDetails, isLoading: loadingTenant } = useQuery({
    queryKey: ["tenantDetails", selectedTenant?.id],
    queryFn: () => saasAdminApi.getTenantById(selectedTenant?.id),
    enabled: !!selectedTenant?.id,
  });

  const { data: userDetails, isLoading: loadingUser } = useQuery({
    queryKey: ["userDetails", selectedUser?.id],
    queryFn: () => saasAdminApi.getUserById(selectedUser?.id),
    enabled: !!selectedUser?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: saasAdminApi.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setShowProfileDialog(false);
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: saasAdminApi.updateSetting,
    onSuccess: () => {
      toast.success("Setting saved successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
      setSettingForm({ key: "", value: "", category: "general", description: "", isSensitive: false });
    },
    onError: () => {
      toast.error("Failed to save setting");
    },
  });

  const createPackageMutation = useMutation({
    mutationFn: saasAdminApi.createPackage,
    onSuccess: () => {
      toast.success("Package created successfully");
      queryClient.invalidateQueries({ queryKey: ["saasAdminPackages"] });
      setShowPackageDialog(false);
      resetPackageForm();
    },
    onError: () => {
      toast.error("Failed to create package");
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => saasAdminApi.updatePackage(id, data),
    onSuccess: () => {
      toast.success("Package updated successfully");
      queryClient.invalidateQueries({ queryKey: ["saasAdminPackages"] });
      setShowPackageDialog(false);
      setEditingPackage(null);
      resetPackageForm();
    },
    onError: () => {
      toast.error("Failed to update package");
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: saasAdminApi.deletePackage,
    onSuccess: () => {
      toast.success("Package deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["saasAdminPackages"] });
    },
    onError: () => {
      toast.error("Failed to delete package");
    },
  });

  const resetPackageForm = () => {
    setPackageForm({
      name: "",
      displayName: "",
      description: "",
      price: "0",
      billingCycle: "monthly",
      isActive: true,
      isPopular: false,
      sortOrder: 0,
      features: [],
      moduleIds: [],
      contactLimit: -1,
      teamMemberLimit: -1,
      storageLimit: -1,
      projectLimit: -1,
      apiCallsLimit: -1,
    });
    setNewFeature("");
  };

  const openCreatePackageDialog = () => {
    resetPackageForm();
    setEditingPackage(null);
    setShowPackageDialog(true);
  };

  const openEditPackageDialog = (pkg: any) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      displayName: pkg.displayName,
      description: pkg.description || "",
      price: pkg.price || "0",
      billingCycle: pkg.billingCycle || "monthly",
      isActive: pkg.isActive ?? true,
      isPopular: pkg.isPopular ?? false,
      sortOrder: pkg.sortOrder || 0,
      features: pkg.features || [],
      moduleIds: pkg.modules?.map((m: any) => m.id) || [],
      contactLimit: pkg.contactLimit ?? -1,
      teamMemberLimit: pkg.teamMemberLimit ?? -1,
      storageLimit: pkg.storageLimit ?? -1,
      projectLimit: pkg.projectLimit ?? -1,
      apiCallsLimit: pkg.apiCallsLimit ?? -1,
    });
    setShowPackageDialog(true);
  };

  const handleSavePackage = () => {
    if (!packageForm.name || !packageForm.displayName) {
      toast.error("Name and display name are required");
      return;
    }

    if (editingPackage) {
      updatePackageMutation.mutate({
        id: editingPackage.id,
        data: packageForm,
      });
    } else {
      createPackageMutation.mutate(packageForm);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setPackageForm({
        ...packageForm,
        features: [...packageForm.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setPackageForm({
      ...packageForm,
      features: packageForm.features.filter((_, i) => i !== index),
    });
  };

  const toggleModule = (moduleId: string) => {
    if (packageForm.moduleIds.includes(moduleId)) {
      setPackageForm({
        ...packageForm,
        moduleIds: packageForm.moduleIds.filter(id => id !== moduleId),
      });
    } else {
      setPackageForm({
        ...packageForm,
        moduleIds: [...packageForm.moduleIds, moduleId],
      });
    }
  };

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

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  if (currentUser && currentUser.userType !== "saas_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const revenueData = stats?.revenueData || [];
  const tenantDistribution = stats?.tenantDistribution?.length > 0 ? stats.tenantDistribution : [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
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
              <button 
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${activeTab === "overview" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
                data-testid="link-saas-overview"
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>
              <button 
                onClick={() => setActiveTab("tenants")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${activeTab === "tenants" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
                data-testid="link-saas-tenants"
              >
                <Building2 className="w-4 h-4" />
                Agencies/Tenants
              </button>
              <button 
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${activeTab === "users" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
                data-testid="link-saas-users"
              >
                <Users className="w-4 h-4" />
                All Users
              </button>
              <button 
                onClick={() => setActiveTab("revenue")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${activeTab === "revenue" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
                data-testid="link-saas-revenue"
              >
                <DollarSign className="w-4 h-4" />
                Revenue
              </button>
              <button 
                onClick={() => setActiveTab("packages")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${activeTab === "packages" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
                data-testid="link-saas-packages"
              >
                <Package className="w-4 h-4" />
                Packages
              </button>
              
              <div className="px-3 py-2 text-xs uppercase text-slate-400 font-semibold mt-4">
                System
              </div>
              <button 
                onClick={() => { setLocation("/saas-admin/settings"); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
                data-testid="link-saas-settings"
              >
                <Settings className="w-4 h-4" />
                Platform Settings
              </button>
              <button 
                onClick={() => { setShowActivityLogs(true); setActiveTab("activity"); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${activeTab === "activity" ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"}`}
                data-testid="link-saas-activity"
              >
                <Activity className="w-4 h-4" />
                Activity Logs
              </button>
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button 
                onClick={() => setShowProfileDialog(true)}
                className="w-full flex items-center gap-3 px-3 py-2 mb-2 hover:bg-slate-800 rounded-md transition-colors"
                data-testid="button-profile"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                  SA
                </div>
                <div className="flex-1 overflow-hidden text-left">
                  <p className="text-sm font-medium truncate" data-testid="text-saas-admin-name">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">Super Admin</p>
                </div>
              </button>
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

          {/* Main Content */}
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
              {/* Stats Cards */}
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
                    <p className="text-xs text-muted-foreground">Registered organizations</p>
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
                    <p className="text-xs text-muted-foreground">Platform users</p>
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
                    <p className="text-xs text-muted-foreground">This month's revenue</p>
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
                    <p className="text-xs text-muted-foreground">Currently active accounts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
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
                              {tenantDistribution.map((_entry: any, index: number) => (
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
              )}

              {activeTab === "tenants" && (
                <Card>
                  <CardHeader>
                    <CardTitle>All Agencies/Companies</CardTitle>
                    <CardDescription>Click on any agency to view detailed information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Agency Name</TableHead>
                          <TableHead>Users</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenants.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              No agencies registered yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          tenants.map((tenant: any) => (
                            <TableRow 
                              key={tenant.id} 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => setSelectedTenant(tenant)}
                              data-testid={`row-tenant-${tenant.id}`}
                            >
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
                              <TableCell>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {activeTab === "users" && (
                <Card>
                  <CardHeader>
                    <CardTitle>All Platform Users</CardTitle>
                    <CardDescription>Click on any user to view detailed information</CardDescription>
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
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          allUsers.map((user: any) => (
                            <TableRow 
                              key={user.id} 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => setSelectedUser(user)}
                              data-testid={`row-user-${user.id}`}
                            >
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
                              <TableCell>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {activeTab === "activity" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Platform Activity Logs</CardTitle>
                        <CardDescription>Track all system activities across the platform</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => refetchLogs()}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <Select 
                        value={activityFilters.action} 
                        onValueChange={(v) => setActivityFilters({...activityFilters, action: v})}
                      >
                        <SelectTrigger className="w-[180px]" data-testid="select-action-filter">
                          <SelectValue placeholder="Filter by action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Actions</SelectItem>
                          <SelectItem value="update_setting">Setting Updates</SelectItem>
                          <SelectItem value="update_profile">Profile Updates</SelectItem>
                          <SelectItem value="delete_setting">Setting Deletions</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select 
                        value={activityFilters.targetType} 
                        onValueChange={(v) => setActivityFilters({...activityFilters, targetType: v})}
                      >
                        <SelectTrigger className="w-[180px]" data-testid="select-target-filter">
                          <SelectValue placeholder="Filter by target" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Targets</SelectItem>
                          <SelectItem value="user">Users</SelectItem>
                          <SelectItem value="platform_setting">Settings</SelectItem>
                          <SelectItem value="tenant">Tenants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Target</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activityLogs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              No activity logs found
                            </TableCell>
                          </TableRow>
                        ) : (
                          activityLogs.map((log: any) => (
                            <TableRow key={log.id} data-testid={`row-log-${log.id}`}>
                              <TableCell className="text-sm">
                                {log.createdAt ? format(new Date(log.createdAt), "MMM dd, yyyy HH:mm") : "-"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{log.action}</Badge>
                              </TableCell>
                              <TableCell>{log.description || "-"}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{log.targetType}</Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {activeTab === "revenue" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                    <CardDescription>Detailed revenue breakdown and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {revenueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={revenueData}>
                          <defs>
                            <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                          <Tooltip />
                          <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRevenue2)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                        No revenue data available yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "packages" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Packages Management</CardTitle>
                        <CardDescription>Create and manage subscription packages with modular features</CardDescription>
                      </div>
                      <Button onClick={openCreatePackageDialog} data-testid="button-create-package">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Package
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Package Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Billing</TableHead>
                          <TableHead>Modules</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {packages.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No packages created yet. Click "Create Package" to get started.
                            </TableCell>
                          </TableRow>
                        ) : (
                          packages.map((pkg: any) => (
                            <TableRow key={pkg.id} data-testid={`row-package-${pkg.id}`}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{pkg.displayName}</p>
                                  <p className="text-xs text-muted-foreground">{pkg.name}</p>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                ${parseFloat(pkg.price || 0).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {pkg.billingCycle === "monthly" ? "Monthly" : 
                                   pkg.billingCycle === "yearly" ? "Yearly" : "One-time"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {pkg.modules?.slice(0, 3).map((m: any) => (
                                    <Badge key={m.id} variant="secondary" className="text-xs">
                                      {m.displayName}
                                    </Badge>
                                  ))}
                                  {pkg.modules?.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{pkg.modules.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge variant={pkg.isActive ? "default" : "secondary"}>
                                    {pkg.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                  {pkg.isPopular && (
                                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => openEditPackageDialog(pkg)}
                                    data-testid={`button-edit-package-${pkg.id}`}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      if (confirm("Are you sure you want to delete this package?")) {
                                        deletePackageMutation.mutate(pkg.id);
                                      }
                                    }}
                                    data-testid={`button-delete-package-${pkg.id}`}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </div>

        {/* Tenant Detail Sheet */}
        <Sheet open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {selectedTenant?.name}
              </SheetTitle>
              <SheetDescription>Agency details and related data</SheetDescription>
            </SheetHeader>
            
            {loadingTenant ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : tenantDetails ? (
              <div className="mt-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{tenantDetails.stats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">Users</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{tenantDetails.stats.totalCustomers}</div>
                      <p className="text-xs text-muted-foreground">Customers</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{tenantDetails.stats.activeDeals}</div>
                      <p className="text-xs text-muted-foreground">Active Deals</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">${tenantDetails.stats.totalRevenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabs for related data */}
                <Tabs defaultValue="users" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="users" data-testid="tab-tenant-users">Users</TabsTrigger>
                    <TabsTrigger value="customers" data-testid="tab-tenant-customers">Customers</TabsTrigger>
                    <TabsTrigger value="deals" data-testid="tab-tenant-deals">Deals</TabsTrigger>
                    <TabsTrigger value="invoices" data-testid="tab-tenant-invoices">Invoices</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="users" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenantDetails.users.map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{user.userType}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.isActive ? "default" : "destructive"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="customers" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenantDetails.customers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                              No customers found
                            </TableCell>
                          </TableRow>
                        ) : (
                          tenantDetails.customers.map((customer: any) => (
                            <TableRow key={customer.id}>
                              <TableCell>{customer.name}</TableCell>
                              <TableCell>{customer.email}</TableCell>
                              <TableCell>{customer.company || "-"}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{customer.customerType}</Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="deals" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Stage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenantDetails.deals.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No deals found
                            </TableCell>
                          </TableRow>
                        ) : (
                          tenantDetails.deals.map((deal: any) => (
                            <TableRow key={deal.id}>
                              <TableCell>{deal.title}</TableCell>
                              <TableCell>${Number(deal.value).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{deal.stage}</Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="invoices" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenantDetails.invoices.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No invoices found
                            </TableCell>
                          </TableRow>
                        ) : (
                          tenantDetails.invoices.map((invoice: any) => (
                            <TableRow key={invoice.id}>
                              <TableCell>{invoice.invoiceNumber}</TableCell>
                              <TableCell>${Number(invoice.totalAmount).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                                  {invoice.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </div>
            ) : null}
          </SheetContent>
        </Sheet>

        {/* User Detail Sheet */}
        <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {selectedUser?.firstName} {selectedUser?.lastName}
              </SheetTitle>
              <SheetDescription>User details and related data</SheetDescription>
            </SheetHeader>
            
            {loadingUser ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : userDetails ? (
              <div className="mt-6 space-y-6">
                {/* User Info Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-white">
                          {userDetails.user.firstName?.charAt(0)}{userDetails.user.lastName?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{userDetails.user.firstName} {userDetails.user.lastName}</h3>
                          <p className="text-muted-foreground">{userDetails.user.email}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge>{userDetails.user.userType}</Badge>
                            <Badge variant={userDetails.user.isActive ? "default" : "destructive"}>
                              {userDetails.user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {userDetails.tenant && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground">Agency</p>
                          <p className="font-medium">{userDetails.tenant.name}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{userDetails.ownedCustomers.length}</div>
                      <p className="text-xs text-muted-foreground">Customers</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{userDetails.deals.length}</div>
                      <p className="text-xs text-muted-foreground">Deals</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{userDetails.assignedTasks.length}</div>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{userDetails.activities.length}</div>
                      <p className="text-xs text-muted-foreground">Activities</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabs for related data */}
                <Tabs defaultValue="customers" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="customers" data-testid="tab-user-customers">Customers</TabsTrigger>
                    <TabsTrigger value="deals" data-testid="tab-user-deals">Deals</TabsTrigger>
                    <TabsTrigger value="tasks" data-testid="tab-user-tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="activities" data-testid="tab-user-activities">Activities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="customers" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userDetails.ownedCustomers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No customers found
                            </TableCell>
                          </TableRow>
                        ) : (
                          userDetails.ownedCustomers.map((customer: any) => (
                            <TableRow key={customer.id}>
                              <TableCell>{customer.name}</TableCell>
                              <TableCell>{customer.email}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{customer.customerType}</Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="deals" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Stage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userDetails.deals.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No deals found
                            </TableCell>
                          </TableRow>
                        ) : (
                          userDetails.deals.map((deal: any) => (
                            <TableRow key={deal.id}>
                              <TableCell>{deal.title}</TableCell>
                              <TableCell>${Number(deal.value).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{deal.stage}</Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="tasks" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userDetails.assignedTasks.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No tasks found
                            </TableCell>
                          </TableRow>
                        ) : (
                          userDetails.assignedTasks.map((task: any) => (
                            <TableRow key={task.id}>
                              <TableCell>{task.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{task.status}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                                  {task.priority}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="activities" className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userDetails.activities.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No activities found
                            </TableCell>
                          </TableRow>
                        ) : (
                          userDetails.activities.map((activity: any) => (
                            <TableRow key={activity.id}>
                              <TableCell>{activity.subject}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{activity.type}</Badge>
                              </TableCell>
                              <TableCell>
                                {activity.createdAt ? format(new Date(activity.createdAt), "MMM dd, yyyy") : "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </div>
            ) : null}
          </SheetContent>
        </Sheet>

        {/* Profile Dialog */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Super Admin Profile</DialogTitle>
              <DialogDescription>Update your profile information</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateProfileMutation.mutate(profileForm);
            }} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      data-testid="input-profile-firstname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      data-testid="input-profile-lastname"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    data-testid="input-profile-email"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowProfileDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateProfileMutation.isPending} data-testid="button-save-profile">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Package Create/Edit Dialog */}
        <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {editingPackage ? "Edit Package" : "Create Package"}
              </DialogTitle>
              <DialogDescription>
                {editingPackage ? "Update package details and included modules" : "Create a new subscription package with modular features"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="packageName">Internal Name</Label>
                  <Input
                    id="packageName"
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
                    placeholder="starter"
                    data-testid="input-package-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={packageForm.displayName}
                    onChange={(e) => setPackageForm({...packageForm, displayName: e.target.value})}
                    placeholder="Starter Plan"
                    data-testid="input-package-display-name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                  placeholder="Perfect for small teams getting started..."
                  rows={2}
                  data-testid="input-package-description"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({...packageForm, price: e.target.value})}
                    data-testid="input-package-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select
                    value={packageForm.billingCycle}
                    onValueChange={(v) => setPackageForm({...packageForm, billingCycle: v})}
                  >
                    <SelectTrigger data-testid="select-package-billing">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="one_time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={packageForm.sortOrder}
                    onChange={(e) => setPackageForm({...packageForm, sortOrder: parseInt(e.target.value) || 0})}
                    data-testid="input-package-sort-order"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={packageForm.isActive}
                    onCheckedChange={(checked) => setPackageForm({...packageForm, isActive: checked})}
                    data-testid="switch-package-active"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="isPopular"
                    checked={packageForm.isPopular}
                    onCheckedChange={(checked) => setPackageForm({...packageForm, isPopular: checked})}
                    data-testid="switch-package-popular"
                  />
                  <Label htmlFor="isPopular">Mark as Popular</Label>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Package Limits</Label>
                <p className="text-sm text-muted-foreground">Set -1 for unlimited</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactLimit">Contact Limit</Label>
                    <Input
                      id="contactLimit"
                      type="number"
                      value={packageForm.contactLimit}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPackageForm({...packageForm, contactLimit: Number.isNaN(val) ? -1 : val});
                      }}
                      placeholder="-1 for unlimited"
                      data-testid="input-package-contact-limit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamMemberLimit">Team Member Limit</Label>
                    <Input
                      id="teamMemberLimit"
                      type="number"
                      value={packageForm.teamMemberLimit}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPackageForm({...packageForm, teamMemberLimit: Number.isNaN(val) ? -1 : val});
                      }}
                      placeholder="-1 for unlimited"
                      data-testid="input-package-team-limit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storageLimit">Storage Limit (MB)</Label>
                    <Input
                      id="storageLimit"
                      type="number"
                      value={packageForm.storageLimit}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPackageForm({...packageForm, storageLimit: Number.isNaN(val) ? -1 : val});
                      }}
                      placeholder="-1 for unlimited"
                      data-testid="input-package-storage-limit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectLimit">Project Limit</Label>
                    <Input
                      id="projectLimit"
                      type="number"
                      value={packageForm.projectLimit}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPackageForm({...packageForm, projectLimit: Number.isNaN(val) ? -1 : val});
                      }}
                      placeholder="-1 for unlimited"
                      data-testid="input-package-project-limit"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="apiCallsLimit">API Calls Limit (per month)</Label>
                    <Input
                      id="apiCallsLimit"
                      type="number"
                      value={packageForm.apiCallsLimit}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPackageForm({...packageForm, apiCallsLimit: Number.isNaN(val) ? -1 : val});
                      }}
                      placeholder="-1 for unlimited"
                      data-testid="input-package-api-limit"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Included Modules</Label>
                <div className="grid grid-cols-2 gap-2">
                  {modules.map((module: any) => (
                    <div
                      key={module.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        packageForm.moduleIds.includes(module.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => toggleModule(module.id)}
                      data-testid={`module-${module.name}`}
                    >
                      <Checkbox
                        checked={packageForm.moduleIds.includes(module.id)}
                        onCheckedChange={() => toggleModule(module.id)}
                      />
                      <div>
                        <p className="font-medium text-sm">{module.displayName}</p>
                        <p className="text-xs text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Custom Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    data-testid="input-new-feature"
                  />
                  <Button type="button" variant="secondary" onClick={addFeature} data-testid="button-add-feature">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {packageForm.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {packageForm.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 pr-1"
                      >
                        <Check className="w-3 h-3" />
                        {feature}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPackageDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSavePackage}
                disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
                data-testid="button-save-package"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingPackage ? "Update Package" : "Create Package"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Platform Settings Sheet */}
        <Sheet open={showSettingsSheet} onOpenChange={setShowSettingsSheet}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Platform Settings
              </SheetTitle>
              <SheetDescription>Configure platform-wide settings for AI, Email, and more</SheetDescription>
            </SheetHeader>
            
            <Tabs value={settingsTab} onValueChange={setSettingsTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ai" data-testid="tab-settings-ai">AI Configuration</TabsTrigger>
                <TabsTrigger value="email" data-testid="tab-settings-email">Email SMTP</TabsTrigger>
                <TabsTrigger value="advanced" data-testid="tab-settings-advanced">Advanced</TabsTrigger>
              </TabsList>
              
              {/* AI Configuration Tab */}
              <TabsContent value="ai" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1685a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
                        </svg>
                      </span>
                      OpenAI Configuration
                    </CardTitle>
                    <CardDescription>Configure the platform-wide OpenAI API key for AI features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id="openaiApiKey"
                          type="password"
                          value={aiSettingsForm.openaiApiKey}
                          onChange={(e) => setAiSettingsForm({...aiSettingsForm, openaiApiKey: e.target.value})}
                          placeholder={settings.find((s: any) => s.key === 'openai_api_key')?.hasValue ? '••••••••' : 'sk-...'}
                          data-testid="input-openai-api-key"
                        />
                        <Button 
                          onClick={() => {
                            if (aiSettingsForm.openaiApiKey) {
                              updateSettingMutation.mutate({
                                key: 'openai_api_key',
                                value: aiSettingsForm.openaiApiKey,
                                category: 'ai',
                                description: 'Platform OpenAI API Key',
                                isSensitive: true,
                              });
                              setAiSettingsForm({...aiSettingsForm, openaiApiKey: ''});
                            }
                          }}
                          disabled={!aiSettingsForm.openaiApiKey || updateSettingMutation.isPending}
                          data-testid="button-save-openai-key"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This key will be used for all AI features when users don't have their own key configured.
                        {settings.find((s: any) => s.key === 'openai_api_key')?.value && (
                          <span className="ml-2 text-green-600">Current: {settings.find((s: any) => s.key === 'openai_api_key')?.value}</span>
                        )}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Note:</strong> Users can configure their own OpenAI API key in their settings. 
                        User keys take priority over the platform key.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Email SMTP Tab */}
              <TabsContent value="email" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Email SMTP Configuration</CardTitle>
                    <CardDescription>Configure email sending for notifications and transactional emails</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input
                          id="smtpHost"
                          value={emailSettingsForm.smtpHost}
                          onChange={(e) => setEmailSettingsForm({...emailSettingsForm, smtpHost: e.target.value})}
                          placeholder="smtp.example.com"
                          data-testid="input-smtp-host"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          value={emailSettingsForm.smtpPort}
                          onChange={(e) => setEmailSettingsForm({...emailSettingsForm, smtpPort: e.target.value})}
                          placeholder="587"
                          data-testid="input-smtp-port"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpUser">SMTP Username</Label>
                        <Input
                          id="smtpUser"
                          value={emailSettingsForm.smtpUser}
                          onChange={(e) => setEmailSettingsForm({...emailSettingsForm, smtpUser: e.target.value})}
                          placeholder="user@example.com"
                          data-testid="input-smtp-user"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={emailSettingsForm.smtpPassword}
                          onChange={(e) => setEmailSettingsForm({...emailSettingsForm, smtpPassword: e.target.value})}
                          placeholder="••••••••"
                          data-testid="input-smtp-password"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senderEmail">Sender Email</Label>
                        <Input
                          id="senderEmail"
                          value={emailSettingsForm.senderEmail}
                          onChange={(e) => setEmailSettingsForm({...emailSettingsForm, senderEmail: e.target.value})}
                          placeholder="noreply@example.com"
                          data-testid="input-sender-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="senderName">Sender Name</Label>
                        <Input
                          id="senderName"
                          value={emailSettingsForm.senderName}
                          onChange={(e) => setEmailSettingsForm({...emailSettingsForm, senderName: e.target.value})}
                          placeholder="My Platform"
                          data-testid="input-sender-name"
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        const emailSettings = [
                          { key: 'smtp_host', value: emailSettingsForm.smtpHost, category: 'email', description: 'SMTP Server Host', isSensitive: false },
                          { key: 'smtp_port', value: emailSettingsForm.smtpPort, category: 'email', description: 'SMTP Server Port', isSensitive: false },
                          { key: 'smtp_user', value: emailSettingsForm.smtpUser, category: 'email', description: 'SMTP Username', isSensitive: false },
                          { key: 'smtp_password', value: emailSettingsForm.smtpPassword, category: 'email', description: 'SMTP Password', isSensitive: true },
                          { key: 'sender_email', value: emailSettingsForm.senderEmail, category: 'email', description: 'Default Sender Email', isSensitive: false },
                          { key: 'sender_name', value: emailSettingsForm.senderName, category: 'email', description: 'Default Sender Name', isSensitive: false },
                        ];
                        emailSettings.filter(s => s.value).forEach(s => updateSettingMutation.mutate(s));
                      }}
                      disabled={updateSettingMutation.isPending}
                      data-testid="button-save-email-settings"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Email Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Advanced Tab */}
              <TabsContent value="advanced" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Add Custom Setting</CardTitle>
                    <CardDescription>Add or update any platform setting manually</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (settingForm.key && settingForm.value) {
                        updateSettingMutation.mutate(settingForm);
                      }
                    }} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="settingKey">Key</Label>
                          <Input
                            id="settingKey"
                            value={settingForm.key}
                            onChange={(e) => setSettingForm({...settingForm, key: e.target.value})}
                            placeholder="setting.key"
                            data-testid="input-setting-key"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="settingCategory">Category</Label>
                          <Select 
                            value={settingForm.category} 
                            onValueChange={(v) => setSettingForm({...settingForm, category: v})}
                          >
                            <SelectTrigger data-testid="select-setting-category">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="branding">Branding</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="ai">AI</SelectItem>
                              <SelectItem value="billing">Billing</SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="settingValue">Value</Label>
                        <Input
                          id="settingValue"
                          value={settingForm.value}
                          onChange={(e) => setSettingForm({...settingForm, value: e.target.value})}
                          placeholder="Setting value"
                          data-testid="input-setting-value"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="settingDescription">Description (optional)</Label>
                        <Input
                          id="settingDescription"
                          value={settingForm.description}
                          onChange={(e) => setSettingForm({...settingForm, description: e.target.value})}
                          placeholder="What this setting does..."
                          data-testid="input-setting-description"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isSensitive"
                          checked={settingForm.isSensitive}
                          onCheckedChange={(checked) => setSettingForm({...settingForm, isSensitive: checked as boolean})}
                          data-testid="checkbox-is-sensitive"
                        />
                        <Label htmlFor="isSensitive" className="text-sm">This is a sensitive value (will be encrypted)</Label>
                      </div>
                      <Button type="submit" className="w-full" disabled={updateSettingMutation.isPending} data-testid="button-save-setting">
                        <Save className="w-4 h-4 mr-2" />
                        Save Setting
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Current Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">All Platform Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {settings.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No settings configured yet</p>
                    ) : (
                      <div className="space-y-3">
                        {settings.map((setting: any) => (
                          <div key={setting.id} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`setting-${setting.key}`}>
                            <div>
                              <p className="font-medium text-sm">{setting.key}</p>
                              <p className="text-xs text-muted-foreground">{setting.description || setting.category}</p>
                            </div>
                            <div className="text-right flex items-center gap-2">
                              <div>
                                <p className="text-sm font-mono">{setting.isSensitive ? (setting.value || '(not set)') : setting.value}</p>
                                <Badge variant="outline" className="text-xs">{setting.category}</Badge>
                              </div>
                              {setting.isSensitive && (
                                <Badge variant="secondary" className="text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Encrypted
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
    </ProtectedRoute>
  );
}
