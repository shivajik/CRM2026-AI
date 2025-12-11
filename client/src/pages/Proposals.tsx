import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { proposalsApi, customersApi } from "@/lib/api";
import { format } from "date-fns";
import {
  Plus,
  Search,
  FileEdit,
  MoreHorizontal,
  Eye,
  Copy,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  LayoutTemplate,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "bg-gray-500", icon: <FileText className="w-3 h-3" /> },
  pending_review: { label: "Pending Review", color: "bg-yellow-500", icon: <Clock className="w-3 h-3" /> },
  sent: { label: "Sent", color: "bg-blue-500", icon: <Send className="w-3 h-3" /> },
  viewed: { label: "Viewed", color: "bg-purple-500", icon: <Eye className="w-3 h-3" /> },
  accepted: { label: "Accepted", color: "bg-green-500", icon: <CheckCircle className="w-3 h-3" /> },
  rejected: { label: "Rejected", color: "bg-red-500", icon: <XCircle className="w-3 h-3" /> },
  expired: { label: "Expired", color: "bg-gray-400", icon: <Clock className="w-3 h-3" /> },
  revision_requested: { label: "Revision Requested", color: "bg-orange-500", icon: <FileEdit className="w-3 h-3" /> },
};

export default function Proposals() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ["proposals", selectedStatus],
    queryFn: () => proposalsApi.getAll(selectedStatus === "all" ? undefined : { status: selectedStatus }),
  });

  const { data: analytics } = useQuery({
    queryKey: ["proposals", "analytics"],
    queryFn: proposalsApi.getAnalytics,
  });

  const deleteMutation = useMutation({
    mutationFn: proposalsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast({ title: "Proposal deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete proposal", variant: "destructive" });
    },
  });

  const sendMutation = useMutation({
    mutationFn: proposalsApi.send,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast({ 
        title: "Proposal sent successfully",
        description: `Share URL: ${window.location.origin}${data.shareUrl}`,
      });
    },
    onError: () => {
      toast({ title: "Failed to send proposal", variant: "destructive" });
    },
  });

  const filteredProposals = proposals.filter(
    (p: any) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.proposalNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: string | null, currency: string) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(parseFloat(amount));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Proposals</h1>
            <p className="text-muted-foreground mt-1">Create, manage, and track professional proposals</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/proposals/templates")} data-testid="button-templates">
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button onClick={() => setLocation("/proposals/new")} data-testid="button-new-proposal">
              <Plus className="w-4 h-4 mr-2" />
              New Proposal
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-proposals">{analytics?.totalProposals ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-value">{formatCurrency(analytics?.totalValue ?? "0", "USD")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-acceptance-rate">{analytics?.acceptanceRate ?? 0}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Value</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-avg-value">{formatCurrency(analytics?.averageValue ?? "0", "USD")}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Proposals</CardTitle>
                <CardDescription>Manage your proposal pipeline</CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="mb-4">
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
                <TabsTrigger value="draft" data-testid="tab-draft">Draft</TabsTrigger>
                <TabsTrigger value="sent" data-testid="tab-sent">Sent</TabsTrigger>
                <TabsTrigger value="viewed" data-testid="tab-viewed">Viewed</TabsTrigger>
                <TabsTrigger value="accepted" data-testid="tab-accepted">Accepted</TabsTrigger>
                <TabsTrigger value="rejected" data-testid="tab-rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading proposals...</div>
            ) : filteredProposals.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No proposals found</h3>
                <p className="mt-2 text-muted-foreground">Get started by creating your first proposal.</p>
                <Button className="mt-4" onClick={() => setLocation("/proposals/new")} data-testid="button-create-first">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Proposal
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProposals.map((proposal: any) => {
                  const status = statusConfig[proposal.status] || statusConfig.draft;
                  return (
                    <div
                      key={proposal.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      data-testid={`card-proposal-${proposal.id}`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg ${status.color} flex items-center justify-center text-white`}>
                          {status.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate" data-testid={`text-title-${proposal.id}`}>{proposal.title}</span>
                            <Badge variant="secondary" className="text-xs">{proposal.proposalNumber}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>{format(new Date(proposal.createdAt), "MMM d, yyyy")}</span>
                            {proposal.validUntil && (
                              <span>Valid until: {format(new Date(proposal.validUntil), "MMM d, yyyy")}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold" data-testid={`text-amount-${proposal.id}`}>
                            {formatCurrency(proposal.totalAmount, proposal.currency)}
                          </div>
                          <Badge className={`${status.color} text-white text-xs`}>
                            {status.label}
                          </Badge>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-menu-${proposal.id}`}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLocation(`/proposals/edit/${proposal.id}`)}>
                              <FileEdit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`/proposal/view/${proposal.id}`, "_blank")}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            {proposal.status === "draft" && (
                              <DropdownMenuItem onClick={() => sendMutation.mutate(proposal.id)}>
                                <Send className="w-4 h-4 mr-2" />
                                Send to Client
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setDeleteId(proposal.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this proposal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
