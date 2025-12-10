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

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Building2, label: "Customers", href: "/customers" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: Briefcase, label: "Deals", href: "/deals" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: FileText, label: "Quotations", href: "/quotations" },
  { icon: Receipt, label: "Invoices", href: "/invoices" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Activity, label: "Activities", href: "/activities" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: UsersRound, label: "Team", href: "/team", adminOnly: true },
  { icon: Settings, label: "Settings", href: "/settings" },
];

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
          if ((item as any).adminOnly && !currentUser?.isAdmin) {
            return null;
          }
          const isActive = location === item.href;
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
              data-testid={`link-${item.label.toLowerCase()}`}
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
            <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
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
