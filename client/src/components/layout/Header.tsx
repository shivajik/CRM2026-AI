import { Menu, Bell, Search, User, CreditCard, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { clearAuth } from "@/lib/auth";

export function Header() {
  const [, setLocation] = useLocation();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
  });

  const getInitials = () => {
    const first = currentUser?.firstName?.charAt(0) || "";
    const last = currentUser?.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const handleLogout = () => {
    clearAuth();
    setLocation("/login");
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
        <span className="font-heading font-bold text-lg">Nexus</span>
      </div>

      <div className="hidden md:flex flex-1 max-w-md ml-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts, deals, tasks..."
            className="w-full pl-9 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="w-5 h-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0" data-testid="button-user-menu">
              <Avatar className="h-8 w-8">
                {currentUser?.profileImageUrl ? (
                  <AvatarImage src={currentUser.profileImageUrl} alt="Profile" />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLocation("/profile")} data-testid="menu-item-profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/billing")} data-testid="menu-item-billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/settings")} data-testid="menu-item-settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} data-testid="menu-item-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
