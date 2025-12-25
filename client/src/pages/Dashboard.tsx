import { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Briefcase, CheckSquare, BarChart3, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { dealsApi, contactsApi, tasksApi } from "@/lib/api";

export default function Dashboard() {
  const { data: deals = [] } = useQuery({
    queryKey: ["deals"],
    queryFn: dealsApi.getAll,
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: contactsApi.getAll,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksApi.getAll(),
  });

  const totalRevenue = deals.reduce((acc: number, deal: any) => acc + Number(deal.value), 0);
  const activeDeals = deals.length;
  const totalContacts = contacts.length;
  const pendingTasks = tasks.filter((t: any) => t.status !== "done").length;

  const chartData = useMemo(() => {
    if (deals.length === 0) return [];
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue: { [key: string]: number } = {};
    
    deals.forEach((deal: any) => {
      const date = deal.createdAt ? new Date(deal.createdAt) : new Date();
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = monthNames[date.getMonth()];
      
      if (!monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] = 0;
      }
      monthlyRevenue[monthKey] += Number(deal.value) || 0;
    });
    
    const sortedKeys = Object.keys(monthlyRevenue).sort();
    return sortedKeys.map(key => {
      const [year, month] = key.split("-");
      return {
        name: monthNames[parseInt(month)],
        total: monthlyRevenue[key]
      };
    });
  }, [deals]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Overview of your sales pipeline and activities.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-revenue">
                  ${totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">From {activeDeals} active deals</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <Briefcase className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-deals">
                  {activeDeals}
                </div>
                <p className="text-xs text-muted-foreground">Across all stages</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contacts</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-contacts">
                  {totalContacts}
                </div>
                <p className="text-xs text-muted-foreground">Total contacts</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-pending-tasks">
                  {pendingTasks}
                </div>
                <p className="text-xs text-muted-foreground">Tasks to complete</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderRadius: "8px",
                          border: "1px solid hsl(var(--border))",
                        }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm font-medium">No revenue data yet</p>
                    <p className="text-xs mt-1">Create deals to see your revenue overview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {deals.slice(0, 5).map((deal: any, i: number) => (
                    <div className="flex items-center" key={deal.id}>
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">New Deal: {deal.title}</p>
                        <p className="text-sm text-muted-foreground">Valued at ${Number(deal.value).toLocaleString()}</p>
                      </div>
                      <div className="ml-auto font-medium text-xs text-muted-foreground">Recently added</div>
                    </div>
                  ))}
                  {deals.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
