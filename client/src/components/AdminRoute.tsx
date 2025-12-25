import { useEffect } from "react";
import { useLocation, Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { isAuthenticated } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";

function isAdminUser(user: { isAdmin?: boolean; userType?: string } | null | undefined): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  if (user.userType === 'agency_admin' || user.userType === 'saas_admin') return true;
  return false;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
    enabled: isAuthenticated(),
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAdminUser(currentUser)) {
    return <Redirect to="/team-dashboard" />;
  }

  return <>{children}</>;
}
