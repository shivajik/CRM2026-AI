import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, Briefcase, CheckSquare, Settings,
  Package, Building2, FileText, Receipt, Activity, BarChart3, UsersRound 
} from "lucide-react";
import { getUser } from "@/lib/auth";
import { authApi } from "@/lib/api";

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

export function Sidebar() {
  const [location] = useLocation();
  const user = getUser();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
    enabled: !!user,
  });

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

    </div>
  );
}
