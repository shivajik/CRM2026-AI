import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  DollarSign,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  PenLine,
} from "lucide-react";

type ProposalSection = {
  id: string;
  title: string;
  sectionType: string;
  content: string;
  sortOrder: number;
};

type PricingItem = {
  id: string;
  name: string;
  description: string | null;
  quantity: string;
  unitPrice: string;
  discountPercent: string;
  totalPrice: string;
};

type Signature = {
  id: string;
  signerName: string;
  signerEmail: string;
  signedAt: string;
};

type Proposal = {
  id: string;
  proposalNumber: string;
  title: string;
  status: string;
  currency: string;
  subtotal: string | null;
  taxAmount: string | null;
  discountAmount: string | null;
  totalAmount: string | null;
  validUntil: string | null;
  sections: ProposalSection[];
  pricingItems: PricingItem[];
  signatures: Signature[];
  customer: { name: string; company: string | null; email: string } | null;
  company: { name: string | null; logo: string | null; email: string | null; phone: string | null } | null;
};

export default function PublicProposalView() {
  const [, params] = useRoute("/proposal/view/:accessToken");
  const accessToken = params?.accessToken;
  const { toast } = useToast();

  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [signatureData, setSignatureData] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [comment, setComment] = useState("");

  const { data: proposal, isLoading, error } = useQuery<Proposal>({
    queryKey: ["public-proposal", accessToken],
    queryFn: async () => {
      const response = await fetch(`/api/public/proposal/${accessToken}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to load proposal");
      }
      return response.json();
    },
    enabled: !!accessToken,
  });

  const acceptMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/public/proposal/${accessToken}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to accept proposal");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Proposal accepted successfully!" });
      setShowAcceptDialog(false);
      window.location.reload();
    },
    onError: () => {
      toast({ title: "Failed to accept proposal", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/public/proposal/${accessToken}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to reject proposal");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Proposal rejected" });
      setShowRejectDialog(false);
      window.location.reload();
    },
    onError: () => {
      toast({ title: "Failed to reject proposal", variant: "destructive" });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/public/proposal/${accessToken}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Comment added" });
      setShowCommentDialog(false);
      setComment("");
    },
    onError: () => {
      toast({ title: "Failed to add comment", variant: "destructive" });
    },
  });

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: proposal?.currency || "USD",
    }).format(parseFloat(amount));
  };

  const handleAccept = () => {
    acceptMutation.mutate({
      signerName,
      signerEmail,
      signatureData: signatureData || signerName,
      signatureType: "typed",
    });
  };

  const handleReject = () => {
    rejectMutation.mutate({
      reason: rejectReason,
      email: signerEmail,
    });
  };

  const handleComment = () => {
    commentMutation.mutate({
      content: comment,
      clientEmail: signerEmail,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-muted-foreground">Loading proposal...</div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold">Proposal Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              {error instanceof Error ? error.message : "This proposal may have expired or been removed."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = proposal.validUntil && new Date(proposal.validUntil) < new Date();
  const isAccepted = proposal.status === "accepted";
  const isRejected = proposal.status === "rejected";
  const canRespond = !isExpired && !isAccepted && !isRejected;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-8 border-b">
            <div className="flex items-start justify-between">
              <div>
                {proposal.company?.logo && (
                  <img src={proposal.company.logo} alt="Company logo" className="h-12 mb-4" />
                )}
                <h1 className="text-3xl font-bold" data-testid="text-title">{proposal.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                  <Badge variant="secondary">{proposal.proposalNumber}</Badge>
                  {proposal.validUntil && (
                    <span className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4" />
                      Valid until {format(new Date(proposal.validUntil), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                {isAccepted && (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Accepted
                  </Badge>
                )}
                {isRejected && (
                  <Badge className="bg-red-500 text-white">
                    <XCircle className="w-3 h-3 mr-1" />
                    Rejected
                  </Badge>
                )}
                {isExpired && !isAccepted && (
                  <Badge variant="secondary">Expired</Badge>
                )}
              </div>
            </div>

            {(proposal.company || proposal.customer) && (
              <div className="grid grid-cols-2 gap-8 mt-8">
                {proposal.company && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">From</h3>
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{proposal.company.name}</p>
                        {proposal.company.email && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {proposal.company.email}
                          </p>
                        )}
                        {proposal.company.phone && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {proposal.company.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {proposal.customer && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">To</h3>
                    <div>
                      <p className="font-medium">{proposal.customer.name}</p>
                      {proposal.customer.company && (
                        <p className="text-sm text-muted-foreground">{proposal.customer.company}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{proposal.customer.email}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-8 space-y-8">
            {proposal.sections.map((section) => (
              <div key={section.id} data-testid={`section-${section.id}`}>
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}

            {proposal.pricingItems.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Item</th>
                          <th className="text-right p-4 font-medium">Qty</th>
                          <th className="text-right p-4 font-medium">Unit Price</th>
                          <th className="text-right p-4 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposal.pricingItems.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-4">
                              <p className="font-medium">{item.name}</p>
                              {item.description && (
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              )}
                            </td>
                            <td className="p-4 text-right">{item.quantity}</td>
                            <td className="p-4 text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="p-4 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/30">
                        {proposal.subtotal && (
                          <tr className="border-t">
                            <td colSpan={3} className="p-4 text-right">Subtotal</td>
                            <td className="p-4 text-right">{formatCurrency(proposal.subtotal)}</td>
                          </tr>
                        )}
                        {proposal.discountAmount && parseFloat(proposal.discountAmount) > 0 && (
                          <tr>
                            <td colSpan={3} className="p-4 text-right">Discount</td>
                            <td className="p-4 text-right text-green-600">-{formatCurrency(proposal.discountAmount)}</td>
                          </tr>
                        )}
                        {proposal.taxAmount && parseFloat(proposal.taxAmount) > 0 && (
                          <tr>
                            <td colSpan={3} className="p-4 text-right">Tax</td>
                            <td className="p-4 text-right">{formatCurrency(proposal.taxAmount)}</td>
                          </tr>
                        )}
                        <tr className="border-t-2">
                          <td colSpan={3} className="p-4 text-right font-semibold text-lg">Total</td>
                          <td className="p-4 text-right font-bold text-lg" data-testid="text-total">
                            {formatCurrency(proposal.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </CardContent>
                </Card>
              </div>
            )}

            {proposal.signatures.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Signatures</h2>
                <div className="space-y-3">
                  {proposal.signatures.map((sig) => (
                    <div key={sig.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">{sig.signerName}</p>
                        <p className="text-sm text-muted-foreground">
                          Signed on {format(new Date(sig.signedAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {canRespond && (
            <div className="p-8 bg-muted/30 border-t">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setShowAcceptDialog(true)} data-testid="button-accept">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Proposal
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowCommentDialog(true)} data-testid="button-comment">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowRejectDialog(true)} className="text-red-600" data-testid="button-reject">
                  <XCircle className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Proposal</DialogTitle>
            <DialogDescription>
              Please provide your details to accept this proposal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="signerName">Your Name</Label>
              <Input
                id="signerName"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Enter your full name"
                data-testid="input-signer-name"
              />
            </div>
            <div>
              <Label htmlFor="signerEmail">Your Email</Label>
              <Input
                id="signerEmail"
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                placeholder="Enter your email"
                data-testid="input-signer-email"
              />
            </div>
            <div>
              <Label htmlFor="signature">Signature (Type your name)</Label>
              <Input
                id="signature"
                value={signatureData}
                onChange={(e) => setSignatureData(e.target.value)}
                placeholder="Type your signature"
                className="font-signature text-xl"
                data-testid="input-signature"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!signerName || !signerEmail}
              data-testid="button-confirm-accept"
            >
              Accept Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Proposal</DialogTitle>
            <DialogDescription>
              Please let us know why you're declining this proposal (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Your Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                placeholder="Enter your email"
                data-testid="input-reject-email"
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Tell us why you're declining..."
                data-testid="textarea-reject-reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
              data-testid="button-confirm-reject"
            >
              Decline Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Have a question or feedback about this proposal?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="commentEmail">Your Email</Label>
              <Input
                id="commentEmail"
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                placeholder="Enter your email"
                data-testid="input-comment-email"
              />
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment or question..."
                data-testid="textarea-comment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleComment}
              disabled={!comment || !signerEmail}
              data-testid="button-submit-comment"
            >
              Submit Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
