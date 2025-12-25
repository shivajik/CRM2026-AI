import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { teamApi } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Mail, 
  User, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  Users,
  Target,
  Percent,
  Activity,
  Clock
} from "lucide-react";

function formatCurrency(value: number | string) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

function formatDate(date: string | Date | null) {
  if (!date) return '-';
  return format(new Date(date), 'MMM d, yyyy');
}

function getStageColor(stage: string) {
  const colors: Record<string, string> = {
    new: 'bg-blue-500',
    qualified: 'bg-purple-500',
    proposal: 'bg-yellow-500',
    negotiation: 'bg-orange-500',
    won: 'bg-green-500',
    lost: 'bg-red-500',
  };
  return colors[stage] || 'bg-gray-500';
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    draft: 'bg-gray-500',
    sent: 'bg-blue-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500',
    expired: 'bg-yellow-500',
    paid: 'bg-green-500',
    partial: 'bg-yellow-500',
    overdue: 'bg-red-500',
    not_started: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
}

export default function TeamMemberDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["teamMemberDetails", id],
    queryFn: () => teamApi.getMemberDetails(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error || !data) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-muted-foreground">Team member not found</p>
            <Link href="/team">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team
              </Button>
            </Link>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const { member, deals, quotations, invoices, tasks, customers, activities, performance } = data;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6 p-6" data-testid="team-member-detail">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/team">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team
              </Button>
            </Link>
          </div>

          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={member.profileImageUrl || undefined} alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback className="text-2xl">
                {member.firstName?.[0]}{member.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold" data-testid="text-member-name">
                {member.firstName} {member.lastName}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <Badge variant={member.isActive ? "default" : "secondary"}>
                  {member.isActive ? "Active" : "Inactive"}
                </Badge>
                {member.role && (
                  <Badge variant="outline">{member.role.name}</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Total Deals</span>
                </div>
                <p className="text-2xl font-bold">{performance.totalDeals}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(performance.totalDealsValue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Win Rate</span>
                </div>
                <p className="text-2xl font-bold">{performance.dealWinRate}%</p>
                <p className="text-sm text-muted-foreground">{performance.wonDeals} won</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Quotations</span>
                </div>
                <p className="text-2xl font-bold">{performance.totalQuotations}</p>
                <p className="text-sm text-muted-foreground">{performance.quotationAcceptRate}% accepted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Invoices</span>
                </div>
                <p className="text-2xl font-bold">{performance.totalInvoices}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(performance.paidInvoicesValue)} collected</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Tasks</span>
                </div>
                <p className="text-2xl font-bold">{performance.completedTasks}/{performance.totalTasks}</p>
                <p className="text-sm text-muted-foreground">{performance.taskCompletionRate}% complete</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Customers</span>
                </div>
                <p className="text-2xl font-bold">{performance.totalCustomers}</p>
                <p className="text-sm text-muted-foreground">managed</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deal Win Rate</span>
                    <span className="font-medium">{performance.dealWinRate}%</span>
                  </div>
                  <Progress value={Number(performance.dealWinRate)} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Quote Acceptance</span>
                    <span className="font-medium">{performance.quotationAcceptRate}%</span>
                  </div>
                  <Progress value={Number(performance.quotationAcceptRate)} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collection Rate</span>
                    <span className="font-medium">{performance.collectionRate}%</span>
                  </div>
                  <Progress value={Number(performance.collectionRate)} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Task Completion</span>
                    <span className="font-medium">{performance.taskCompletionRate}%</span>
                  </div>
                  <Progress value={Number(performance.taskCompletionRate)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="deals" className="space-y-4">
            <TabsList>
              <TabsTrigger value="deals" data-testid="tab-deals">Deals ({deals.length})</TabsTrigger>
              <TabsTrigger value="quotations" data-testid="tab-quotations">Quotations ({quotations.length})</TabsTrigger>
              <TabsTrigger value="invoices" data-testid="tab-invoices">Invoices ({invoices.length})</TabsTrigger>
              <TabsTrigger value="tasks" data-testid="tab-tasks">Tasks ({tasks.length})</TabsTrigger>
              <TabsTrigger value="customers" data-testid="tab-customers">Customers ({customers.length})</TabsTrigger>
              <TabsTrigger value="activities" data-testid="tab-activities">Activities ({activities.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="deals">
              <Card>
                <CardHeader>
                  <CardTitle>Deals</CardTitle>
                  <CardDescription>All deals owned by this team member</CardDescription>
                </CardHeader>
                <CardContent>
                  {deals.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No deals yet</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Expected Close</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deals.map((deal: any) => (
                          <TableRow key={deal.id} data-testid={`row-deal-${deal.id}`}>
                            <TableCell className="font-medium">
                              <Link href={`/deals/${deal.id}`}>
                                <span className="text-blue-600 hover:underline cursor-pointer">{deal.title}</span>
                              </Link>
                            </TableCell>
                            <TableCell>{formatCurrency(deal.value)}</TableCell>
                            <TableCell>
                              <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(deal.expectedCloseDate)}</TableCell>
                            <TableCell>{formatDate(deal.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotations">
              <Card>
                <CardHeader>
                  <CardTitle>Quotations</CardTitle>
                  <CardDescription>All quotations created by this team member</CardDescription>
                </CardHeader>
                <CardContent>
                  {quotations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No quotations yet</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quote #</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Valid Until</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quotations.map((quote: any) => (
                          <TableRow key={quote.id} data-testid={`row-quotation-${quote.id}`}>
                            <TableCell className="font-medium">
                              <Link href={`/quotations/${quote.id}`}>
                                <span className="text-blue-600 hover:underline cursor-pointer">{quote.quoteNumber}</span>
                              </Link>
                            </TableCell>
                            <TableCell>{quote.title}</TableCell>
                            <TableCell>{formatCurrency(quote.totalAmount)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(quote.validUntil)}</TableCell>
                            <TableCell>{formatDate(quote.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>All invoices created by this team member</CardDescription>
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No invoices yet</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Paid</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice: any) => (
                          <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                            <TableCell className="font-medium">
                              <Link href={`/invoices/${invoice.id}`}>
                                <span className="text-blue-600 hover:underline cursor-pointer">{invoice.invoiceNumber}</span>
                              </Link>
                            </TableCell>
                            <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                            <TableCell>{formatCurrency(invoice.paidAmount)}</TableCell>
                            <TableCell>{formatCurrency(invoice.balanceDue)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>All tasks assigned to this team member</CardDescription>
                </CardHeader>
                <CardContent>
                  {tasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No tasks yet</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasks.map((task: any) => (
                          <TableRow key={task.id} data-testid={`row-task-${task.id}`}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(task.status)}>{task.status.replace('_', ' ')}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={task.priority === 'urgent' ? 'destructive' : task.priority === 'high' ? 'default' : 'secondary'}>
                                {task.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(task.dueDate)}</TableCell>
                            <TableCell>{formatDate(task.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>All customers managed by this team member</CardDescription>
                </CardHeader>
                <CardContent>
                  {customers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No customers yet</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers.map((customer: any) => (
                          <TableRow key={customer.id} data-testid={`row-customer-${customer.id}`}>
                            <TableCell className="font-medium">
                              <Link href={`/customers/${customer.id}`}>
                                <span className="text-blue-600 hover:underline cursor-pointer">{customer.name}</span>
                              </Link>
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.company || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{customer.customerType}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(customer.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Recent activities logged by this team member</CardDescription>
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No activities yet</p>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity: any) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg" data-testid={`activity-${activity.id}`}>
                          <div className="p-2 rounded-full bg-muted">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{activity.subject}</span>
                              <Badge variant="outline">{activity.type}</Badge>
                            </div>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(activity.createdAt)}
                            </div>
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
