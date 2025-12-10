import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreHorizontal, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { dealsApi } from "@/lib/api";

const stages = [
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

export default function Deals() {
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: dealsApi.getAll,
  });

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Deals Pipeline</h1>
              <p className="text-muted-foreground mt-1">Track your sales opportunities.</p>
            </div>
            <Button data-testid="button-new-deal">
              <Plus className="mr-2 h-4 w-4" /> New Deal
            </Button>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Loading deals...
            </div>
          ) : deals.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">No deals yet. Create your first deal to get started.</p>
                <Button data-testid="button-create-first-deal">
                  <Plus className="mr-2 h-4 w-4" /> Create Deal
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto pb-4">
              <div className="flex gap-6 h-full min-w-max">
                {stages.map((stage) => {
                  const stageDeals = deals.filter((d: any) => d.stage === stage.id);
                  const stageValue = stageDeals.reduce((acc: number, d: any) => acc + Number(d.value), 0);

                  return (
                    <div key={stage.id} className="w-80 flex flex-col gap-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{stage.label}</span>
                          <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                            {stageDeals.length}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          ${stageValue.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex-1 bg-muted/30 rounded-lg p-2 flex flex-col gap-3 overflow-y-auto">
                        {stageDeals.map((deal: any) => (
                          <Card
                            key={deal.id}
                            className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all border-l-4 border-l-primary/50 hover:border-l-primary"
                            data-testid={`card-deal-${deal.id}`}
                          >
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-sm font-medium flex justify-between items-start">
                                <span data-testid={`text-title-${deal.id}`}>{deal.title}</span>
                                <Button variant="ghost" className="h-6 w-6 p-0 -mt-1 -mr-1 text-muted-foreground">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <div className="flex flex-col gap-2">
                                <div className="text-lg font-bold text-foreground/90" data-testid={`text-value-${deal.id}`}>
                                  ${Number(deal.value).toLocaleString()}
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                  {deal.expectedCloseDate && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(deal.expectedCloseDate).toLocaleDateString()}
                                    </span>
                                  )}
                                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-sm">
                                    {stage.label}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {stageDeals.length === 0 && (
                          <div className="h-24 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                            No deals
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
