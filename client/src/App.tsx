import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { lazy, Suspense } from "react";
import { isAuthenticated, getUser } from "@/lib/auth";
import { authApi } from "@/lib/api";

const NotFound = lazy(() => import("@/pages/not-found"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Contacts = lazy(() => import("@/pages/Contacts"));
const Deals = lazy(() => import("@/pages/Deals"));
const DealDetail = lazy(() => import("@/pages/DealDetail"));
const Tasks = lazy(() => import("@/pages/Tasks"));
const Settings = lazy(() => import("@/pages/Settings"));
const Profile = lazy(() => import("@/pages/Profile"));
const Billing = lazy(() => import("@/pages/Billing"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Products = lazy(() => import("@/pages/Products"));
const Customers = lazy(() => import("@/pages/Customers"));
const CustomerDetail = lazy(() => import("@/pages/CustomerDetail"));
const Quotations = lazy(() => import("@/pages/Quotations"));
const QuotationDetail = lazy(() => import("@/pages/QuotationDetail"));
const Invoices = lazy(() => import("@/pages/Invoices"));
const InvoiceDetail = lazy(() => import("@/pages/InvoiceDetail"));
const Activities = lazy(() => import("@/pages/Activities"));
const Reports = lazy(() => import("@/pages/Reports"));
const TeamManagement = lazy(() => import("@/pages/TeamManagement"));
const TeamMemberDetail = lazy(() => import("@/pages/TeamMemberDetail"));
const TeamLogin = lazy(() => import("@/pages/TeamLogin"));
const TeamDashboard = lazy(() => import("@/pages/TeamDashboard"));
const SaasAdminDashboard = lazy(() => import("@/pages/SaasAdminDashboard"));
const CustomerPortal = lazy(() => import("@/pages/CustomerPortal"));
const Landing = lazy(() => import("@/pages/Landing"));
const Features = lazy(() => import("@/pages/Features"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Resources = lazy(() => import("@/pages/Resources"));
const SEOAudit = lazy(() => import("@/pages/SEOAudit"));
const EmailModule = lazy(() => import("@/pages/EmailModule"));
const Proposals = lazy(() => import("@/pages/Proposals"));
const ProposalBuilder = lazy(() => import("@/pages/ProposalBuilder"));
const ProposalTemplates = lazy(() => import("@/pages/ProposalTemplates"));
const ProposalTemplatePreview = lazy(() => import("@/pages/ProposalTemplatePreview"));
const PublicProposalView = lazy(() => import("@/pages/PublicProposalView"));
const USLanding = lazy(() => import("@/pages/GeoLanding").then(m => ({ default: m.USLanding })));
const UKLanding = lazy(() => import("@/pages/GeoLanding").then(m => ({ default: m.UKLanding })));
const INLanding = lazy(() => import("@/pages/GeoLanding").then(m => ({ default: m.INLanding })));
const WorkspaceSettings = lazy(() => import("@/pages/WorkspaceSettings"));
const PlatformSettings = lazy(() => import("@/pages/PlatformSettings"));

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
    return <LoadingSpinner />;
  }

  if (currentUser?.userType === "saas_admin") {
    return <Redirect to="/saas-admin" />;
  } else if (currentUser?.userType === "customer") {
    return <Redirect to="/customer-portal" />;
  } else if (currentUser?.userType === "team_member") {
    return <Redirect to="/team-dashboard" />;
  } else {
    return (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    );
  }
}

function ProtectedPage({ component: Component }: { component: React.ComponentType }) {
  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
}

function AdminPage({ component: Component }: { component: React.ComponentType }) {
  return (
    <AdminRoute>
      <Component />
    </AdminRoute>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Landing} />
        <Route path="/features" component={Features} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/resources" component={Resources} />
        <Route path="/us" component={USLanding} />
        <Route path="/uk" component={UKLanding} />
        <Route path="/in" component={INLanding} />
        <Route path="/audit" component={SEOAudit} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/team-login" component={TeamLogin} />
        
        {/* Protected routes */}
        <Route path="/app" component={RoleBasedRedirect} />
        <Route path="/agency-dashboard">{() => <AdminPage component={Dashboard} />}</Route>
        <Route path="/customers">{() => <ProtectedPage component={Customers} />}</Route>
        <Route path="/customers/:id">{() => <ProtectedPage component={CustomerDetail} />}</Route>
        <Route path="/contacts">{() => <ProtectedPage component={Contacts} />}</Route>
        <Route path="/deals">{() => <ProtectedPage component={Deals} />}</Route>
        <Route path="/deals/:id">{() => <ProtectedPage component={DealDetail} />}</Route>
        <Route path="/products">{() => <ProtectedPage component={Products} />}</Route>
        <Route path="/quotations">{() => <ProtectedPage component={Quotations} />}</Route>
        <Route path="/quotations/:id">{() => <ProtectedPage component={QuotationDetail} />}</Route>
        <Route path="/invoices">{() => <ProtectedPage component={Invoices} />}</Route>
        <Route path="/invoices/:id">{() => <ProtectedPage component={InvoiceDetail} />}</Route>
        <Route path="/email">{() => <ProtectedPage component={EmailModule} />}</Route>
        <Route path="/proposals">{() => <ProtectedPage component={Proposals} />}</Route>
        <Route path="/proposals/new">{() => <ProtectedPage component={ProposalBuilder} />}</Route>
        <Route path="/proposals/edit/:id">{() => <ProtectedPage component={ProposalBuilder} />}</Route>
        <Route path="/proposals/templates">{() => <ProtectedPage component={ProposalTemplates} />}</Route>
        <Route path="/proposals/templates/:id">{() => <ProtectedPage component={ProposalTemplatePreview} />}</Route>
        <Route path="/proposal/view/:accessToken" component={PublicProposalView} />
        <Route path="/tasks">{() => <ProtectedPage component={Tasks} />}</Route>
        <Route path="/activities">{() => <ProtectedPage component={Activities} />}</Route>
        <Route path="/reports">{() => <AdminPage component={Reports} />}</Route>
        <Route path="/settings">{() => <AdminPage component={Settings} />}</Route>
        <Route path="/settings/workspace">{() => <ProtectedPage component={WorkspaceSettings} />}</Route>
        <Route path="/profile">{() => <ProtectedPage component={Profile} />}</Route>
        <Route path="/billing">{() => <AdminPage component={Billing} />}</Route>
        <Route path="/team">{() => <AdminPage component={TeamManagement} />}</Route>
        <Route path="/team/:id">{() => <AdminPage component={TeamMemberDetail} />}</Route>
        <Route path="/team-dashboard">{() => <ProtectedPage component={TeamDashboard} />}</Route>
        <Route path="/saas-admin">{() => <ProtectedPage component={SaasAdminDashboard} />}</Route>
        <Route path="/saas-admin/settings">{() => <Redirect to="/saas-admin" />}</Route>
        <Route path="/customer-portal">{() => <ProtectedPage component={CustomerPortal} />}</Route>
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
