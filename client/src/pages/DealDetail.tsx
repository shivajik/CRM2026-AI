import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { dealsApi, customersApi } from "@/lib/api";
import { useParams, useLocation } from "wouter";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  Target,
  FileText,
  Receipt,
  Users,
  Activity,
  CheckSquare,
  Clock,
  Building2,
  Mail,
  Phone,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const stageColors: Record<string, string> = {
  new: "bg-slate-500",
  qualified: "bg-blue-500",
  proposal: "bg-purple-500",
  negotiation: "bg-amber-500",
  won: "bg-green-500",
  lost: "bg-red-500",
  "closed-won": "bg-green-500",
  "closed-lost": "bg-red-500",
};

const statusColors: Record<string, string> = {
  draft: "bg-slate-500",
  sent: "bg-blue-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
  expired: "bg-orange-500",
  paid: "bg-green-500",
  partial: "bg-amber-500",
  overdue: "bg-red-500",
  cancelled: "bg-gray-500",
  pending: "bg-yellow-500",
  todo: "bg-slate-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  scheduled: "bg-purple-500",
};

const typeIcons: Record<string, any> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  note: FileText,
  task: CheckSquare,
};

const typeColors: Record<string, string> = {
  call: "bg-green-500",
  email: "bg-blue-500",
  meeting: "bg-purple-500",
  note: "bg-slate-500",
  task: "bg-amber-500",
};

export default function DealDetail() {
  const params = useParams<{ id: string }>();
  const dealId = params.id;
  const [, navigate] = useLocation();

  const { data: journeyData, isLoading } = useQuery({
    queryKey: ["deal-journey", dealId],
    queryFn: () => dealsApi.getJourney(dealId!),
    enabled: !!dealId,
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading deal details...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!journeyData) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-muted-foreground">Deal not found</p>
            <Button variant="outline" onClick={() => navigate("/deals")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deals
            </Button>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const { deal, customer, contact, quotations = [], invoices = [], activities = [], tasks = [], timeline = [], summary = { totalQuotations: 0, totalInvoices: 0, totalActivities: 0, totalTasks: 0 } } = journeyData;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/deals")} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight" data-testid="text-deal-title">{deal.title}</h1>
                <Badge className={stageColors[deal.stage] || "bg-gray-500"} data-testid="badge-deal-stage">
                  {deal.stage}
                </Badge>
              </div>
              {customer && (
                <p className="text-muted-foreground mt-1" data-testid="text-customer-name">
                  {customer.name} {customer.company && `- ${customer.company}`}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Deal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold" data-testid="text-deal-value">
                    ${Number(deal.value).toLocaleString()}
                  </span>
                </div>
                {deal.probability && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span data-testid="text-deal-probability">{deal.probability}% probability</span>
                  </div>
                )}
                {deal.expectedCloseDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span data-testid="text-close-date">
                      Expected: {format(new Date(deal.expectedCloseDate), "PPP")}
                    </span>
                  </div>
                )}
                {deal.notes && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-muted-foreground">{deal.notes}</p>
                  </div>
                )}

                {customer && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm font-medium mb-2">Customer</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 cursor-pointer hover:text-primary" onClick={() => navigate(`/customers/${customer.id}`)}>
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.name}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {contact && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium mb-2">Primary Contact</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.name}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-quotation-count">{summary.totalQuotations}</p>
                      <p className="text-xs text-muted-foreground">Quotations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-invoice-count">{summary.totalInvoices}</p>
                      <p className="text-xs text-muted-foreground">Invoices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-activity-count">{summary.totalActivities}</p>
                      <p className="text-xs text-muted-foreground">Activities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-2xl font-bold" data-testid="text-task-count">{summary.totalTasks}</p>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList>
              <TabsTrigger value="timeline" data-testid="tab-timeline">Timeline</TabsTrigger>
              <TabsTrigger value="quotations" data-testid="tab-quotations">Quotations ({quotations.length})</TabsTrigger>
              <TabsTrigger value="invoices" data-testid="tab-invoices">Invoices ({invoices.length})</TabsTrigger>
              <TabsTrigger value="activities" data-testid="tab-activities">Activities ({activities.length})</TabsTrigger>
              <TabsTrigger value="tasks" data-testid="tab-tasks">Tasks ({tasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {timeline.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No activities recorded yet</p>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                      <div className="space-y-6">
                        {timeline.map((event: any, index: number) => {
                          const Icon = typeIcons[event.type] || Clock;
                          const colorClass = typeColors[event.type] || "bg-gray-500";
                          return (
                            <div key={`${event.type}-${event.id}-${index}`} className="relative pl-10" data-testid={`timeline-event-${event.id}`}>
                              <div className={`absolute left-2 w-5 h-5 rounded-full ${colorClass} flex items-center justify-center`}>
                                <Icon className="h-3 w-3 text-white" />
                              </div>
                              <div className="bg-card border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium">{event.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={statusColors[event.status] || "bg-gray-500"}>
                                      {event.status}
                                    </Badge>
                                    <Badge variant="outline">{event.type}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {event.date && format(new Date(event.date), "PPP 'at' p")}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quotations</CardTitle>
                </CardHeader>
                <CardContent>
                  {quotations.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No quotations yet</p>
                  ) : (
                    <div className="space-y-4">
                      {quotations.map((quote: any) => (
                        <div 
                          key={quote.id} 
                          className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50" 
                          onClick={() => navigate(`/quotations/${quote.id}`)} 
                          data-testid={`quotation-${quote.id}`}
                        >
                          <div>
                            <p className="font-medium">{quote.quoteNumber}</p>
                            <p className="text-sm text-muted-foreground">{quote.title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">${Number(quote.totalAmount).toLocaleString()}</p>
                            <Badge className={statusColors[quote.status] || "bg-gray-500"}>{quote.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No invoices yet</p>
                  ) : (
                    <div className="space-y-4">
                      {invoices.map((invoice: any) => (
                        <div 
                          key={invoice.id} 
                          className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50" 
                          onClick={() => navigate(`/invoices/${invoice.id}`)} 
                          data-testid={`invoice-${invoice.id}`}
                        >
                          <div>
                            <p className="font-medium">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {format(new Date(invoice.dueDate), "PPP")}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">${Number(invoice.totalAmount).toLocaleString()}</p>
                              {Number(invoice.balanceDue) > 0 && (
                                <p className="text-sm text-orange-600">Balance: ${Number(invoice.balanceDue).toLocaleString()}</p>
                              )}
                            </div>
                            <Badge className={statusColors[invoice.status] || "bg-gray-500"}>{invoice.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No activities yet</p>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity: any) => {
                        const Icon = typeIcons[activity.type] || Clock;
                        return (
                          <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg" data-testid={`activity-${activity.id}`}>
                            <div className={`p-2 rounded-lg ${typeColors[activity.type] || "bg-gray-500"}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{activity.subject}</p>
                              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                              {activity.outcome && (
                                <p className="text-sm mt-2">Outcome: {activity.outcome}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                {activity.completedAt 
                                  ? `Completed: ${format(new Date(activity.completedAt), "PPP")}` 
                                  : activity.scheduledAt 
                                  ? `Scheduled: ${format(new Date(activity.scheduledAt), "PPP")}` 
                                  : ""
                                }
                              </p>
                            </div>
                            <Badge variant="outline">{activity.type}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  {tasks.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No tasks yet</p>
                  ) : (
                    <div className="space-y-4">
                      {tasks.map((task: any) => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`task-${task.id}`}>
                          <div className="flex items-center gap-3">
                            {task.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : task.status === "in-progress" ? (
                              <Clock className="h-5 w-5 text-blue-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                              <p className="font-medium">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                              )}
                              {task.dueDate && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Due: {format(new Date(task.dueDate), "PPP")}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              task.priority === "high" ? "border-red-500 text-red-500" :
                              task.priority === "medium" ? "border-amber-500 text-amber-500" :
                              "border-slate-500 text-slate-500"
                            }>
                              {task.priority}
                            </Badge>
                            <Badge className={statusColors[task.status] || "bg-gray-500"}>{task.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
