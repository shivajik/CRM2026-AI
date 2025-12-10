import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Briefcase, CheckSquare, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: Briefcase, label: "Deals", href: "/deals" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();

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

      <nav className="flex-1 px-4 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-primary text-white shadow-sm" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
              )}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">john@nexus.com</p>
          </div>
        </div>
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent h-8 text-xs">
            <LogOut className="w-3 h-3 mr-2" />
            Sign Out
          </Button>
        </Link>
      </div>
    </div>
  );
}
