import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, Briefcase, CheckSquare, Settings,
  Package, Building2, FileText, Receipt, Activity, BarChart3, UsersRound, Mail, FileEdit,
  ChevronDown, Rocket, Wallet, Zap, Target, HeartHandshake, Shield, Cog
} from "lucide-react";
import { getUser } from "@/lib/auth";
import { authApi } from "@/lib/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type SidebarItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  description?: string;
};

type SidebarGroup = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  color: string;
  items: SidebarItem[];
};

const agencyAdminGroups: SidebarGroup[] = [
  {
    id: "overview",
    icon: Rocket,
    label: "Overview",
    description: "Your command center",
    color: "text-blue-500",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/agency-dashboard", description: "Key metrics & insights" },
    ],
  },
  {
    id: "sales",
    icon: Target,
    label: "Sales Hub",
    description: "Close deals faster",
    color: "text-orange-500",
    items: [
      { icon: Building2, label: "Customers", href: "/customers", description: "Manage accounts" },
      { icon: Users, label: "Contacts", href: "/contacts", description: "Your network" },
      { icon: Briefcase, label: "Deals", href: "/deals", description: "Track pipeline" },
      { icon: Package, label: "Products", href: "/products", description: "Your catalog" },
    ],
  },
  {
    id: "commerce",
    icon: Wallet,
    label: "Commerce Hub",
    description: "Quotes to cash",
    color: "text-green-500",
    items: [
      { icon: FileText, label: "Quotations", href: "/quotations", description: "Price proposals" },
      { icon: FileEdit, label: "Proposals", href: "/proposals", description: "Win business" },
      { icon: Receipt, label: "Invoices", href: "/invoices", description: "Get paid" },
    ],
  },
  {
    id: "operations",
    icon: Zap,
    label: "Operations Hub",
    description: "Stay productive",
    color: "text-purple-500",
    items: [
      { icon: Mail, label: "Email", href: "/email", description: "Communications" },
      { icon: CheckSquare, label: "Tasks", href: "/tasks", description: "To-do list" },
      { icon: Activity, label: "Activities", href: "/activities", description: "Track actions" },
    ],
  },
  {
    id: "insights",
    icon: BarChart3,
    label: "Insights Hub",
    description: "Data-driven decisions",
    color: "text-cyan-500",
    items: [
      { icon: BarChart3, label: "Reports", href: "/reports", description: "Analytics" },
    ],
  },
  {
    id: "admin",
    icon: HeartHandshake,
    label: "Admin Hub",
    description: "Manage your workspace",
    color: "text-pink-500",
    items: [
      { icon: UsersRound, label: "Team", href: "/team", description: "Your people" },
      { icon: Settings, label: "Settings", href: "/settings", description: "Configuration" },
    ],
  },
];

const teamMemberGroups: SidebarGroup[] = [
  {
    id: "overview",
    icon: Rocket,
    label: "Overview",
    description: "Your workspace",
    color: "text-blue-500",
    items: [
      { icon: LayoutDashboard, label: "My Dashboard", href: "/team-dashboard", description: "Your metrics" },
    ],
  },
  {
    id: "sales",
    icon: Target,
    label: "Sales Hub",
    description: "Close deals faster",
    color: "text-orange-500",
    items: [
      { icon: Building2, label: "Customers", href: "/customers", description: "Manage accounts" },
      { icon: Users, label: "Contacts", href: "/contacts", description: "Your network" },
      { icon: Briefcase, label: "Deals", href: "/deals", description: "Track pipeline" },
    ],
  },
  {
    id: "commerce",
    icon: Wallet,
    label: "Commerce Hub",
    description: "Quotes to cash",
    color: "text-green-500",
    items: [
      { icon: FileText, label: "Quotations", href: "/quotations", description: "Price proposals" },
      { icon: FileEdit, label: "Proposals", href: "/proposals", description: "Win business" },
      { icon: Receipt, label: "Invoices", href: "/invoices", description: "Get paid" },
    ],
  },
  {
    id: "operations",
    icon: Zap,
    label: "Operations Hub",
    description: "Stay productive",
    color: "text-purple-500",
    items: [
      { icon: Mail, label: "Email", href: "/email", description: "Communications" },
      { icon: CheckSquare, label: "Tasks", href: "/tasks", description: "To-do list" },
      { icon: Activity, label: "Activities", href: "/activities", description: "Track actions" },
    ],
  },
];

const saasAdminGroups: SidebarGroup[] = [
  {
    id: "overview",
    icon: Rocket,
    label: "Overview",
    description: "Platform command center",
    color: "text-blue-500",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/saas-admin", description: "Platform metrics" },
    ],
  },
  {
    id: "platform",
    icon: Shield,
    label: "Platform",
    description: "Manage your platform",
    color: "text-purple-500",
    items: [
      { icon: Cog, label: "Platform Settings", href: "/saas-admin/settings", description: "Configure platform" },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const user = getUser();
  const [openGroups, setOpenGroups] = useState<string[]>(["overview", "sales", "commerce", "operations", "platform"]);

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
    enabled: !!user,
  });

  if (!user) return null;
  
  if (currentUser?.userType === 'customer') {
    return null;
  }

  const getSidebarGroups = () => {
    if (currentUser?.userType === 'saas_admin') return saasAdminGroups;
    if (currentUser?.userType === 'team_member') return teamMemberGroups;
    return agencyAdminGroups;
  };
  
  const sidebarGroups = getSidebarGroups();
  const showTeamLink = currentUser?.isAdmin || currentUser?.userType === 'agency_admin';

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isGroupActive = (group: SidebarGroup) => {
    return group.items.some(item => 
      location === item.href || 
      location.startsWith(item.href + "/") ||
      (item.href === "/agency-dashboard" && location === "/") ||
      (item.href === "/team-dashboard" && location === "/")
    );
  };

  return (
    <div className="h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col fixed left-0 top-0 hidden md:flex z-50">
      <div className="p-5">
        <div className="flex items-center gap-2.5 font-heading font-bold text-xl text-sidebar-primary-foreground tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white text-lg font-bold">N</span>
          </div>
          <span>Nexus CRM</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
        {sidebarGroups.map((group) => {
          if (group.id === "admin" && !showTeamLink) {
            return null;
          }
          
          const isOpen = openGroups.includes(group.id);
          const groupIsActive = isGroupActive(group);

          return (
            <Collapsible
              key={group.id}
              open={isOpen}
              onOpenChange={() => toggleGroup(group.id)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                    groupIsActive && !isOpen
                      ? "bg-sidebar-accent/50"
                      : "hover:bg-sidebar-accent/30"
                  )}
                  data-testid={`group-${group.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      groupIsActive ? "bg-sidebar-accent" : "bg-sidebar-accent/30 group-hover:bg-sidebar-accent/50"
                    )}>
                      <group.icon className={cn("w-4 h-4", group.color)} />
                    </div>
                    <div className="text-left">
                      <div className={cn(
                        "font-semibold text-sm",
                        groupIsActive ? "text-white" : "text-sidebar-foreground/90"
                      )}>
                        {group.label}
                      </div>
                      <div className="text-[10px] text-sidebar-foreground/50 font-normal">
                        {group.description}
                      </div>
                    </div>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 text-sidebar-foreground/40 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )} 
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <div className="ml-4 pl-4 border-l border-sidebar-border/50 mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    if (item.label === "Team" && !showTeamLink) {
                      return null;
                    }
                    const isActive = location === item.href || 
                      (item.href === "/agency-dashboard" && location === "/") ||
                      (item.href === "/team-dashboard" && location === "/") ||
                      (item.href === "/saas-admin" && location === "/saas-admin");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                          isActive
                            ? "bg-sidebar-primary text-white shadow-sm shadow-primary/20"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-white"
                        )}
                        data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <item.icon className={cn("w-4 h-4", isActive && "text-white")} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.label}</div>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-sidebar-foreground/90">
              {currentUser?.name || 'User'}
            </div>
            <div className="text-[10px] text-sidebar-foreground/50 truncate">
              {currentUser?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
