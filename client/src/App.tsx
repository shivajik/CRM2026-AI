import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Contacts from "@/pages/Contacts";
import Deals from "@/pages/Deals";
import DealDetail from "@/pages/DealDetail";
import Tasks from "@/pages/Tasks";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Products from "@/pages/Products";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import Quotations from "@/pages/Quotations";
import QuotationDetail from "@/pages/QuotationDetail";
import Invoices from "@/pages/Invoices";
import InvoiceDetail from "@/pages/InvoiceDetail";
import Activities from "@/pages/Activities";
import Reports from "@/pages/Reports";
import TeamManagement from "@/pages/TeamManagement";
import TeamLogin from "@/pages/TeamLogin";
import TeamDashboard from "@/pages/TeamDashboard";
import SaasAdminDashboard from "@/pages/SaasAdminDashboard";
import CustomerPortal from "@/pages/CustomerPortal";
import { isAuthenticated, getUser } from "@/lib/auth";
import { authApi } from "@/lib/api";

function RoleBasedRedirect() {
  const [, setLocation] = useLocation();
  const user = getUser();
  
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
    enabled: !!user,
  });

  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (currentUser?.userType === "saas_admin") {
    return <Redirect to="/saas-admin" />;
  } else if (currentUser?.userType === "customer") {
    return <Redirect to="/customer-portal" />;
  } else if (currentUser?.userType === "team_member") {
    return <Redirect to="/team-dashboard" />;
  } else {
    return <Dashboard />;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RoleBasedRedirect} />
      <Route path="/agency-dashboard" component={Dashboard} />
      <Route path="/customers" component={Customers} />
      <Route path="/customers/:id" component={CustomerDetail} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/deals" component={Deals} />
      <Route path="/deals/:id" component={DealDetail} />
      <Route path="/products" component={Products} />
      <Route path="/quotations" component={Quotations} />
      <Route path="/quotations/:id" component={QuotationDetail} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/invoices/:id" component={InvoiceDetail} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/activities" component={Activities} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route path="/team" component={TeamManagement} />
      <Route path="/team-login" component={TeamLogin} />
      <Route path="/team-dashboard" component={TeamDashboard} />
      <Route path="/saas-admin" component={SaasAdminDashboard} />
      <Route path="/customer-portal" component={CustomerPortal} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
