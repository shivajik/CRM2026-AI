import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { isAuthenticated } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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

  useEffect(() => {
    if (!isLoading && currentUser && !currentUser.isAdmin) {
      setLocation("/team-dashboard");
    }
  }, [isLoading, currentUser, setLocation]);

  if (!isAuthenticated()) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser?.isAdmin) {
    return null;
  }

  return <>{children}</>;
}
