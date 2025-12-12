import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  Award,
  Shield,
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
  themePreset: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerStyle: string;
  fontFamily: string;
  sections: ProposalSection[];
  pricingItems: PricingItem[];
  signatures: Signature[];
  customer: { name: string; company: string | null; email: string } | null;
  company: { name: string | null; logo: string | null; email: string | null; phone: string | null } | null;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 };
}

function replaceTemplatePlaceholders(content: string, proposal: Proposal): string {
  if (!content) return content;
  
  const today = new Date();
  const replacements: Record<string, string> = {
    '{{proposal.title}}': proposal.title || '',
    '{{proposal.date}}': format(today, 'MMMM d, yyyy'),
    '{{proposal.number}}': proposal.proposalNumber || '',
    '{{proposal.validUntil}}': proposal.validUntil ? format(new Date(proposal.validUntil), 'MMMM d, yyyy') : '',
    '{{proposal.total}}': proposal.totalAmount || '0',
    '{{client.name}}': proposal.customer?.name || '',
    '{{client.company}}': proposal.customer?.company || '',
    '{{client.email}}': proposal.customer?.email || '',
    '{{agency.name}}': proposal.company?.name || 'Our Agency',
    '{{agency.email}}': proposal.company?.email || '',
    '{{agency.phone}}': proposal.company?.phone || '',
  };
  
  let result = content;
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  
  return result;
}

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Proposal Not Found</h2>
            <p className="mt-3 text-slate-500">
              {error instanceof Error ? error.message : "This proposal may have expired or been removed."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const primaryColor = proposal.primaryColor || '#3B82F6';
  const secondaryColor = proposal.secondaryColor || '#1E40AF';
  const accentColor = proposal.accentColor || '#10B981';
  const headerStyle = proposal.headerStyle || 'gradient';
  
  const primaryRgb = hexToRgb(primaryColor);
  const accentRgb = hexToRgb(accentColor);
  const isExpired = proposal.validUntil && new Date(proposal.validUntil) < new Date();
  const isAccepted = proposal.status === "accepted";
  const isRejected = proposal.status === "rejected";
  const canRespond = !isExpired && !isAccepted && !isRejected;

  const headerGradient = headerStyle === 'gradient' 
    ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    : primaryColor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div 
        className="w-full py-16 px-4 relative overflow-hidden"
        style={{ background: headerGradient }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="max-w-4xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="text-white">
              {proposal.company?.logo && (
                <div className="bg-white rounded-lg p-2 inline-block mb-6 shadow-md">
                  <img src={proposal.company.logo} alt="Company logo" className="h-10" data-testid="img-company-logo" />
                </div>
              )}
              <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm font-medium backdrop-blur-sm" data-testid="text-proposal-number">
                {proposal.proposalNumber}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-title">
                {proposal.title}
              </h1>
              {proposal.validUntil && (
                <div className="flex items-center gap-2 mt-4 text-white/90">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Valid until {format(new Date(proposal.validUntil), "MMMM d, yyyy")}</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              {isAccepted && (
                <div className="bg-white rounded-xl px-6 py-4 shadow-lg flex items-center gap-3" data-testid="status-accepted">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-green-700">Accepted</p>
                    <p className="text-sm text-slate-500">Thank you!</p>
                  </div>
                </div>
              )}
              {isRejected && (
                <div className="bg-white rounded-xl px-6 py-4 shadow-lg flex items-center gap-3" data-testid="status-rejected">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-red-700">Declined</p>
                    <p className="text-sm text-slate-500">We understand</p>
                  </div>
                </div>
              )}
              {isExpired && !isAccepted && !isRejected && (
                <div className="bg-white rounded-xl px-6 py-4 shadow-lg flex items-center gap-3" data-testid="status-expired">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-amber-700">Expired</p>
                    <p className="text-sm text-slate-500">Contact us to renew</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        {(proposal.company || proposal.customer) && (
          <Card className="shadow-xl border-0 mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {proposal.company && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                      <Building2 className="w-4 h-4" />
                      From
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-800">{proposal.company.name}</p>
                      {proposal.company.email && (
                        <p className="text-slate-600 flex items-center gap-2 mt-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {proposal.company.email}
                        </p>
                      )}
                      {proposal.company.phone && (
                        <p className="text-slate-600 flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {proposal.company.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {proposal.customer && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                      <FileText className="w-4 h-4" />
                      Prepared For
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-800">{proposal.customer.name}</p>
                      {proposal.customer.company && (
                        <p className="text-slate-600 mt-1">{proposal.customer.company}</p>
                      )}
                      <p className="text-slate-600 flex items-center gap-2 mt-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {proposal.customer.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8 pb-8">
          {proposal.sections.map((section, index) => (
            <Card key={section.id} className="shadow-lg border-0 overflow-hidden" data-testid={`section-${section.id}`}>
              <div 
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})` }}
              />
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {index + 1}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                </div>
                <div 
                  className="prose prose-slate prose-lg max-w-none
                    prose-headings:text-slate-800 prose-headings:font-bold
                    prose-p:text-slate-600 prose-p:leading-relaxed
                    prose-li:text-slate-600
                    prose-strong:text-slate-800
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: replaceTemplatePlaceholders(section.content, proposal) }}
                />
              </CardContent>
            </Card>
          ))}

          {proposal.pricingItems.length > 0 && (
            <Card className="shadow-xl border-0 overflow-hidden">
              <div 
                className="px-8 py-6"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <div className="flex items-center gap-3 text-white">
                  <Award className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Investment Summary</h2>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="text-left p-5 font-semibold text-slate-700">Item</th>
                        <th className="text-center p-5 font-semibold text-slate-700 w-24">Qty</th>
                        <th className="text-right p-5 font-semibold text-slate-700 w-32">Unit Price</th>
                        <th className="text-right p-5 font-semibold text-slate-700 w-32">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposal.pricingItems.map((item, index) => (
                        <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`} data-testid={`row-pricing-${item.id}`}>
                          <td className="p-5">
                            <p className="font-semibold text-slate-800" data-testid={`text-item-name-${item.id}`}>{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                            )}
                          </td>
                          <td className="p-5 text-center text-slate-600" data-testid={`text-item-qty-${item.id}`}>{item.quantity}</td>
                          <td className="p-5 text-right text-slate-600" data-testid={`text-item-price-${item.id}`}>{formatCurrency(item.unitPrice)}</td>
                          <td className="p-5 text-right font-semibold text-slate-800" data-testid={`text-item-total-${item.id}`}>{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t bg-slate-50 p-6">
                  <div className="max-w-xs ml-auto space-y-3">
                    {proposal.subtotal && (
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium">{formatCurrency(proposal.subtotal)}</span>
                      </div>
                    )}
                    {proposal.discountAmount && parseFloat(proposal.discountAmount) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">-{formatCurrency(proposal.discountAmount)}</span>
                      </div>
                    )}
                    {proposal.taxAmount && parseFloat(proposal.taxAmount) > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Tax</span>
                        <span className="font-medium">{formatCurrency(proposal.taxAmount)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-800">Total Investment</span>
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: primaryColor }}
                        data-testid="text-total"
                      >
                        {formatCurrency(proposal.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {proposal.signatures.length > 0 && (
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6" style={{ color: accentColor }} />
                  <h2 className="text-2xl font-bold text-slate-800">Signatures</h2>
                </div>
                <div className="space-y-4">
                  {proposal.signatures.map((sig) => (
                    <div 
                      key={sig.id} 
                      className="flex items-center gap-4 p-5 rounded-xl border-2"
                      style={{ 
                        backgroundColor: `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.05)`,
                        borderColor: `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.2)`,
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{sig.signerName}</p>
                        <p className="text-sm text-slate-500">
                          Signed on {format(new Date(sig.signedAt), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {canRespond && (
          <div 
            className="sticky bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-lg border-t shadow-2xl"
            style={{ borderTopColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)` }}
          >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg"
                style={{ backgroundColor: accentColor }}
                onClick={() => setShowAcceptDialog(true)} 
                data-testid="button-accept"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Accept Proposal
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg"
                onClick={() => setShowCommentDialog(true)} 
                data-testid="button-comment"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Add Comment
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setShowRejectDialog(true)} 
                className="text-red-600 border-red-200 hover:bg-red-50 px-8 py-6 text-lg" 
                data-testid="button-reject"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Decline
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Accept Proposal</DialogTitle>
            <DialogDescription>
              Please provide your details to accept this proposal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="signerName">Your Name</Label>
              <Input
                id="signerName"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
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
                className="mt-1"
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
                className="mt-1 text-xl italic"
                style={{ fontFamily: 'cursive' }}
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
              style={{ backgroundColor: accentColor }}
              className="text-white"
              data-testid="button-confirm-accept"
            >
              Accept Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Decline Proposal</DialogTitle>
            <DialogDescription>
              Please let us know why you're declining this proposal (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">Your Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
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
                className="mt-1"
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add Comment</DialogTitle>
            <DialogDescription>
              Have a question or feedback about this proposal?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="commentEmail">Your Email</Label>
              <Input
                id="commentEmail"
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
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
                className="mt-1"
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
              style={{ backgroundColor: primaryColor }}
              className="text-white"
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
