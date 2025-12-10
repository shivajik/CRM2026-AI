import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customersApi } from "@/lib/api";
import { 
  ArrowLeft, Building2, Mail, Phone, Globe, MapPin, 
  TrendingUp, FileText, Receipt, CheckCircle, Clock, AlertCircle,
  Phone as PhoneIcon, Mail as MailIcon, Calendar, MessageSquare, ClipboardList
} from "lucide-react";
import { format } from "date-fns";

const typeIcons: Record<string, any> = {
  call: PhoneIcon,
  email: MailIcon,
  meeting: Calendar,
  note: MessageSquare,
  task: ClipboardList,
  activity: Clock,
  deal: TrendingUp,
  quotation: FileText,
  invoice: Receipt,
};

const typeColors: Record<string, string> = {
  call: "bg-blue-500",
  email: "bg-green-500",
  meeting: "bg-purple-500",
  note: "bg-yellow-500",
  task: "bg-orange-500",
  activity: "bg-gray-500",
  deal: "bg-indigo-500",
  quotation: "bg-cyan-500",
  invoice: "bg-emerald-500",
};

const statusColors: Record<string, string> = {
  new: "bg-gray-500",
  qualification: "bg-blue-500",
  qualified: "bg-blue-500",
  proposal: "bg-purple-500",
  negotiation: "bg-yellow-500",
  "closed-won": "bg-green-500",
  won: "bg-green-500",
  "closed-lost": "bg-red-500",
  lost: "bg-red-500",
  draft: "bg-gray-500",
  sent: "bg-blue-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
  expired: "bg-orange-500",
  paid: "bg-green-500",
  overdue: "bg-red-500",
  pending: "bg-yellow-500",
  todo: "bg-gray-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function CustomerDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const customerId = params.id;

  const { data: journeyData, isLoading } = useQuery({
    queryKey: ["customer-journey", customerId],
    queryFn: () => customersApi.getJourney(customerId!),
    enabled: !!customerId,
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading customer journey...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!journeyData) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Customer not found</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const { customer, deals, quotations, invoices, activities, tasks, timeline, summary } = journeyData;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/customers")} data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight" data-testid="text-customer-name">{customer.name}</h1>
              <p className="text-muted-foreground mt-1">Customer Journey</p>
            </div>
            <Badge className={`ml-4 ${customer.customerType === 'customer' ? 'bg-green-500' : customer.customerType === 'prospect' ? 'bg-blue-500' : 'bg-gray-500'}`}>
              {customer.customerType}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-customer-email">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span data-testid="text-customer-phone">{customer.phone}</span>
                  </div>
                )}
                {customer.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.website}</span>
                  </div>
                )}
                {(customer.address || customer.city || customer.country) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{[customer.address, customer.city, customer.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground">Industry: {customer.industry || "-"}</p>
                  <p className="text-sm text-muted-foreground">Segment: {customer.segment || "-"}</p>
                  <p className="text-sm text-muted-foreground">Payment Terms: {customer.paymentTerms || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Journey Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary" data-testid="text-total-deals">{summary.totalDeals}</p>
                    <p className="text-sm text-muted-foreground">Total Deals</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-green-600" data-testid="text-won-deals">{summary.wonDeals}</p>
                    <p className="text-sm text-muted-foreground">Won Deals</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-blue-600" data-testid="text-total-deal-value">${summary.totalDealValue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Deal Value</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600" data-testid="text-total-revenue">${summary.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-xl font-semibold">{summary.totalQuotations}</p>
                    <p className="text-sm text-muted-foreground">Quotations</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-xl font-semibold">{summary.totalInvoices}</p>
                    <p className="text-sm text-muted-foreground">Invoices</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-xl font-semibold">{summary.paidInvoices}</p>
                    <p className="text-sm text-muted-foreground">Paid Invoices</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-xl font-semibold text-orange-600">${summary.pendingAmount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Pending Amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList>
              <TabsTrigger value="timeline" data-testid="tab-timeline">Timeline</TabsTrigger>
              <TabsTrigger value="deals" data-testid="tab-deals">Deals ({deals.length})</TabsTrigger>
              <TabsTrigger value="quotations" data-testid="tab-quotations">Quotations ({quotations.length})</TabsTrigger>
              <TabsTrigger value="invoices" data-testid="tab-invoices">Invoices ({invoices.length})</TabsTrigger>
              <TabsTrigger value="activities" data-testid="tab-activities">Activities ({activities.length})</TabsTrigger>
              <TabsTrigger value="tasks" data-testid="tab-tasks">Tasks ({tasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Journey Timeline</CardTitle>
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

            <TabsContent value="deals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  {deals.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No deals yet</p>
                  ) : (
                    <div className="space-y-4">
                      {deals.map((deal: any) => (
                        <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`deal-${deal.id}`}>
                          <div>
                            <p className="font-medium">{deal.title}</p>
                            <p className="text-sm text-muted-foreground">${Number(deal.value).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={statusColors[deal.stage] || "bg-gray-500"}>{deal.stage}</Badge>
                            {deal.probability && <span className="text-sm text-muted-foreground">{deal.probability}%</span>}
                          </div>
                        </div>
                      ))}
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
                        <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/quotations/${quote.id}`)} data-testid={`quotation-${quote.id}`}>
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
                        <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/invoices/${invoice.id}`)} data-testid={`invoice-${invoice.id}`}>
                          <div>
                            <p className="font-medium">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-muted-foreground">Due: {format(new Date(invoice.dueDate), "PPP")}</p>
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
                                {activity.completedAt ? `Completed: ${format(new Date(activity.completedAt), "PPP")}` : activity.scheduledAt ? `Scheduled: ${format(new Date(activity.scheduledAt), "PPP")}` : ""}
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
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.dueDate && (
                              <span className="text-sm text-muted-foreground">Due: {format(new Date(task.dueDate), "PPP")}</span>
                            )}
                            <Badge className={task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-yellow-500" : "bg-gray-500"}>
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
