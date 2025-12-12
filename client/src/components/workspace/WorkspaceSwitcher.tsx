import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { featuresApi, companyProfileApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

interface FeatureFlags {
  multi_workspace_enabled?: boolean;
}

export function WorkspaceSwitcher() {
  const user = getUser();

  const { data: features } = useQuery<FeatureFlags>({
    queryKey: ["features"],
    queryFn: featuresApi.getFeatures,
    enabled: !!user,
  });

  const { data: companyProfile } = useQuery({
    queryKey: ["company-profile"],
    queryFn: companyProfileApi.get,
    enabled: !!user,
  });

  const isMultiWorkspaceEnabled = features?.multi_workspace_enabled === true;

  if (!isMultiWorkspaceEnabled) {
    return null;
  }

  const workspaceName = companyProfile?.companyName || "Workspace";
  const initials = workspaceName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto" data-testid="button-workspace-switcher">
      <Avatar className="h-7 w-7">
        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium text-sm hidden sm:inline max-w-[120px] truncate">
        {workspaceName}
      </span>
      <Building2 className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}
