import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { authApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Package, Users, Contact, HardDrive, FolderOpen, Zap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Billing() {
  const [, setLocation] = useLocation();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
  });

  const { data: tenantModules = [] } = useQuery({
    queryKey: ["tenantModules"],
    queryFn: async () => {
      const res = await fetch("/api/tenant/modules", {
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: packageData } = useQuery({
    queryKey: ["tenantPackage"],
    queryFn: async () => {
      const res = await fetch("/api/tenant/package", {
        credentials: "include",
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const formatLimit = (limit: number | null | undefined) => {
    if (limit === null || limit === undefined || limit === -1) return "Unlimited";
    return limit.toLocaleString();
  };

  const getLimitPercent = (used: number, limit: number | null | undefined) => {
    if (limit === null || limit === undefined || limit === -1) return 0;
    if (limit === 0) return 100;
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container max-w-4xl py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setLocation("/app")}
            data-testid="button-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription>
                  Manage your subscription plan and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {packageData?.displayName || "Free Plan"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {packageData?.description || "Basic CRM features"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          ${packageData?.price || "0"}<span className="text-sm font-normal text-muted-foreground">/{packageData?.billingCycle || "month"}</span>
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {packageData?.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Contact className="w-4 h-4" />
                            Contacts
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Limit</span>
                              <span className="font-medium">{formatLimit(packageData?.contactLimit)}</span>
                            </div>
                            {packageData?.contactLimit && packageData.contactLimit > 0 && (
                              <Progress value={getLimitPercent(0, packageData.contactLimit)} className="h-2" />
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Team Members
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Limit</span>
                              <span className="font-medium">{formatLimit(packageData?.teamMemberLimit)}</span>
                            </div>
                            {packageData?.teamMemberLimit && packageData.teamMemberLimit > 0 && (
                              <Progress value={getLimitPercent(0, packageData.teamMemberLimit)} className="h-2" />
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <HardDrive className="w-4 h-4" />
                            Storage
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Limit</span>
                              <span className="font-medium">
                                {packageData?.storageLimit === -1 || !packageData?.storageLimit 
                                  ? "Unlimited" 
                                  : `${packageData.storageLimit} MB`}
                              </span>
                            </div>
                            {packageData?.storageLimit && packageData.storageLimit > 0 && (
                              <Progress value={getLimitPercent(0, packageData.storageLimit)} className="h-2" />
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            API Calls
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Monthly Limit</span>
                              <span className="font-medium">{formatLimit(packageData?.apiCallsLimit)}</span>
                            </div>
                            {packageData?.apiCallsLimit && packageData.apiCallsLimit > 0 && (
                              <Progress value={getLimitPercent(0, packageData.apiCallsLimit)} className="h-2" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Included Modules</CardTitle>
                <CardDescription>Features available in your plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {tenantModules.length > 0 ? (
                    tenantModules.map((module: any) => (
                      <div
                        key={module.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{module.displayName}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground col-span-full">
                      No modules configured for your plan
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Need More?</CardTitle>
                <CardDescription>Upgrade your plan to unlock more features</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setLocation("/pricing")} data-testid="button-view-plans">
                  View Available Plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
