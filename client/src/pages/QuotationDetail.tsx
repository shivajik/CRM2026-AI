import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { quotationsApi, customersApi, companyProfileApi } from "@/lib/api";
import { ArrowLeft, Download, FileText, Building2, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-gray-500",
  sent: "bg-blue-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
  expired: "bg-orange-500",
};

export default function QuotationDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const quotationId = params.id;

  const { data: quotation, isLoading } = useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: () => quotationsApi.getById(quotationId!),
    enabled: !!quotationId,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const { data: companyProfile } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: companyProfileApi.get,
  });

  const customer = customers.find((c: any) => c.id === quotation?.customerId);

  const handleExportPDF = () => {
    if (!quotation || !customer || !companyProfile) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quotation ${quotation.quoteNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .company-name { font-size: 24px; font-weight: bold; color: #1a1a1a; }
          .quote-info { text-align: right; }
          .quote-number { font-size: 18px; font-weight: bold; color: #3b82f6; }
          .customer-section { margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; }
          .section-title { font-weight: bold; margin-bottom: 10px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
          td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .totals { margin-top: 20px; text-align: right; }
          .total-row { display: flex; justify-content: flex-end; margin: 5px 0; }
          .total-label { width: 150px; color: #64748b; }
          .total-value { width: 120px; text-align: right; font-weight: 500; }
          .grand-total { font-size: 18px; font-weight: bold; color: #1a1a1a; border-top: 2px solid #333; padding-top: 10px; }
          .terms { margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: 500; }
          .status-draft { background: #e5e7eb; color: #374151; }
          .status-sent { background: #dbeafe; color: #1d4ed8; }
          .status-accepted { background: #dcfce7; color: #16a34a; }
          .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            ${companyProfile?.logoUrl ? `
              <img src="${companyProfile.logoUrl}" alt="Company Logo" style="max-height: 60px; max-width: 150px; object-fit: contain; margin-bottom: 10px;" />
            ` : ""}
            <div class="company-name">${companyProfile?.companyName || "Your Company Name"}</div>
            ${companyProfile?.address || companyProfile?.city || companyProfile?.country ? `
              <div>${[companyProfile?.address, companyProfile?.city, companyProfile?.state, companyProfile?.postalCode, companyProfile?.country].filter(Boolean).join(", ")}</div>
            ` : ""}
            ${companyProfile?.phone ? `<div>Phone: ${companyProfile.phone}</div>` : ""}
            ${companyProfile?.email ? `<div>Email: ${companyProfile.email}</div>` : ""}
            ${companyProfile?.website ? `<div>Website: ${companyProfile.website}</div>` : ""}
            ${companyProfile?.taxId ? `<div>Tax ID: ${companyProfile.taxId}</div>` : ""}
            ${companyProfile?.registrationNumber ? `<div>Reg. No: ${companyProfile.registrationNumber}</div>` : ""}
          </div>
          <div class="quote-info">
            <div class="quote-number">${quotation.quoteNumber}</div>
            <div>Date: ${format(new Date(quotation.createdAt), "PPP")}</div>
            <div>Valid Until: ${quotation.validUntil ? format(new Date(quotation.validUntil), "PPP") : "N/A"}</div>
            <div class="status status-${quotation.status}">${quotation.status.toUpperCase()}</div>
          </div>
        </div>
        
        <div class="customer-section">
          <div class="section-title">BILL TO</div>
          <div><strong>${customer.name}</strong></div>
          <div>${customer.company || ""}</div>
          <div>${customer.email}</div>
          <div>${customer.phone || ""}</div>
          <div>${[customer.address, customer.city, customer.country].filter(Boolean).join(", ")}</div>
        </div>

        <h3>${quotation.title}</h3>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right">Qty</th>
              <th style="text-align: right">Unit Price</th>
              <th style="text-align: right">Tax</th>
              <th style="text-align: right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${quotation.items?.map((item: any) => `
              <tr>
                <td>${item.description}</td>
                <td style="text-align: right">${item.quantity}</td>
                <td style="text-align: right">$${Number(item.unitPrice).toFixed(2)}</td>
                <td style="text-align: right">$${Number(item.taxAmount || 0).toFixed(2)}</td>
                <td style="text-align: right">$${Number(item.totalPrice).toFixed(2)}</td>
              </tr>
            `).join("") || "<tr><td colspan='5'>No items</td></tr>"}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span class="total-label">Subtotal:</span>
            <span class="total-value">$${Number(quotation.subtotal).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Tax:</span>
            <span class="total-value">$${Number(quotation.taxAmount).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Discount:</span>
            <span class="total-value">-$${Number(quotation.discountAmount).toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">Total:</span>
            <span class="total-value">$${Number(quotation.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        ${quotation.terms ? `
          <div class="terms">
            <div class="section-title">TERMS & CONDITIONS</div>
            <p>${quotation.terms}</p>
          </div>
        ` : ""}

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated on ${format(new Date(), "PPP 'at' p")}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading quotation...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!quotation) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Quotation not found</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigate("/quotations")} data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" data-testid="text-quote-number">{quotation.quoteNumber}</h1>
                <p className="text-muted-foreground mt-1">{quotation.title}</p>
              </div>
              <Badge className={statusColors[quotation.status] || "bg-gray-500"}>
                {quotation.status}
              </Badge>
            </div>
            <Button onClick={handleExportPDF} disabled={!companyProfile} data-testid="button-export-pdf">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quotation Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotation.items?.length > 0 ? (
                      quotation.items.map((item: any) => (
                        <TableRow key={item.id} data-testid={`item-${item.id}`}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${Number(item.unitPrice).toFixed(2)}</TableCell>
                          <TableCell className="text-right">${Number(item.discountAmount || 0).toFixed(2)}</TableCell>
                          <TableCell className="text-right">${Number(item.taxAmount || 0).toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">${Number(item.totalPrice).toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">No items</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <Separator className="my-4" />

                <div className="flex flex-col items-end space-y-2">
                  <div className="flex justify-between w-64">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${Number(quotation.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-64">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>${Number(quotation.taxAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-64">
                    <span className="text-muted-foreground">Discount:</span>
                    <span>-${Number(quotation.discountAmount).toFixed(2)}</span>
                  </div>
                  <Separator className="w-64" />
                  <div className="flex justify-between w-64 text-lg font-bold">
                    <span>Total:</span>
                    <span data-testid="text-total-amount">${Number(quotation.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Customer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customer ? (
                    <div className="space-y-2">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.company}</p>
                      <p className="text-sm">{customer.email}</p>
                      <p className="text-sm">{customer.phone}</p>
                      <Button variant="link" className="p-0 h-auto" onClick={() => navigate(`/customers/${customer.id}`)}>
                        View Customer Journey
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Customer not found</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{format(new Date(quotation.createdAt), "PPP")}</span>
                  </div>
                  {quotation.validUntil && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valid Until:</span>
                      <span>{format(new Date(quotation.validUntil), "PPP")}</span>
                    </div>
                  )}
                  {quotation.sentAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sent:</span>
                      <span>{format(new Date(quotation.sentAt), "PPP")}</span>
                    </div>
                  )}
                  {quotation.acceptedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accepted:</span>
                      <span>{format(new Date(quotation.acceptedAt), "PPP")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {quotation.terms && (
                <Card>
                  <CardHeader>
                    <CardTitle>Terms & Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{quotation.terms}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
