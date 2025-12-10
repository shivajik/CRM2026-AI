import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, Briefcase, CheckSquare, Settings, LogOut,
  Package, Building2, FileText, Receipt, Activity, BarChart3, UsersRound 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, clearAuth } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

type SidebarItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  adminOnly?: boolean;
  allowedUserTypes?: string[];
};

const agencyAdminItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/agency-dashboard" },
  { icon: Building2, label: "Customers", href: "/customers" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: Briefcase, label: "Deals", href: "/deals" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: FileText, label: "Quotations", href: "/quotations" },
  { icon: Receipt, label: "Invoices", href: "/invoices" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Activity, label: "Activities", href: "/activities" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: UsersRound, label: "Team", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const teamMemberItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "My Dashboard", href: "/team-dashboard" },
  { icon: Building2, label: "Customers", href: "/customers" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: Briefcase, label: "Deals", href: "/deals" },
  { icon: FileText, label: "Quotations", href: "/quotations" },
  { icon: Receipt, label: "Invoices", href: "/invoices" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Activity, label: "Activities", href: "/activities" },
];

function getUserTypeLabel(userType: string): string {
  switch (userType) {
    case 'saas_admin': return 'Super Admin';
    case 'agency_admin': return 'Agency Admin';
    case 'team_member': return 'Team Member';
    case 'customer': return 'Customer';
    default: return userType;
  }
}

function getUserTypeBadgeColor(userType: string): string {
  switch (userType) {
    case 'saas_admin': return 'bg-purple-500';
    case 'agency_admin': return 'bg-blue-500';
    case 'team_member': return 'bg-green-500';
    case 'customer': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
}

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const user = getUser();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
    enabled: !!user,
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

  if (!user) return null;
  
  if (currentUser?.userType === 'saas_admin' || currentUser?.userType === 'customer') {
    return null;
  }

  const sidebarItems = currentUser?.userType === 'team_member' ? teamMemberItems : agencyAdminItems;
  const showTeamLink = currentUser?.isAdmin || currentUser?.userType === 'agency_admin';

  return (
    <div className="h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col fixed left-0 top-0 hidden md:flex z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 font-heading font-bold text-2xl text-sidebar-primary-foreground tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-lg">N</span>
          </div>
          Nexus CRM
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          if (item.label === "Team" && !showTeamLink) {
            return null;
          }
          const isActive = location === item.href || 
            (item.href === "/agency-dashboard" && location === "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-white shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
              )}
              data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate" data-testid="text-username">
              {user.firstName} {user.lastName}
            </p>
            <Badge className={cn("text-[10px] px-1.5 py-0", getUserTypeBadgeColor(currentUser?.userType || 'team_member'))}>
              {getUserTypeLabel(currentUser?.userType || 'Team Member')}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent h-8 text-xs"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-3 h-3 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
