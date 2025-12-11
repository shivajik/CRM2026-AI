import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { invoicesApi, customersApi, companyProfileApi } from "@/lib/api";
import { ArrowLeft, Download, Receipt, Building2, Calendar, CreditCard, DollarSign } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-gray-500",
  sent: "bg-blue-500",
  paid: "bg-green-500",
  partial: "bg-yellow-500",
  overdue: "bg-red-500",
  cancelled: "bg-gray-400",
};

export default function InvoiceDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const invoiceId = params.id;

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => invoicesApi.getById(invoiceId!),
    enabled: !!invoiceId,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const { data: companyProfile } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: companyProfileApi.get,
  });

  const customer = customers.find((c: any) => c.id === invoice?.customerId);

  const handleExportPDF = () => {
    if (!invoice || !customer || !companyProfile) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .company-name { font-size: 24px; font-weight: bold; color: #1a1a1a; }
          .invoice-info { text-align: right; }
          .invoice-number { font-size: 18px; font-weight: bold; color: #16a34a; }
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
          .balance-due { font-size: 20px; font-weight: bold; color: #dc2626; margin-top: 10px; }
          .payment-section { margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 8px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: 500; }
          .status-paid { background: #dcfce7; color: #16a34a; }
          .status-sent { background: #dbeafe; color: #1d4ed8; }
          .status-overdue { background: #fee2e2; color: #dc2626; }
          .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="company-name">${companyProfile?.companyName || "Your Company Name"}</div>
            ${companyProfile?.address || companyProfile?.city || companyProfile?.country ? `
              <div>${[companyProfile?.address, companyProfile?.city, companyProfile?.state, companyProfile?.postalCode, companyProfile?.country].filter(Boolean).join(", ")}</div>
            ` : ""}
            ${companyProfile?.phone ? `<div>${companyProfile.phone}</div>` : ""}
            ${companyProfile?.email ? `<div>${companyProfile.email}</div>` : ""}
            ${companyProfile?.website ? `<div>${companyProfile.website}</div>` : ""}
          </div>
          <div class="invoice-info">
            <div class="invoice-number">${invoice.invoiceNumber}</div>
            <div>Issue Date: ${format(new Date(invoice.issueDate), "PPP")}</div>
            <div>Due Date: ${format(new Date(invoice.dueDate), "PPP")}</div>
            <div class="status status-${invoice.status}">${invoice.status.toUpperCase()}</div>
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
            ${invoice.items?.map((item: any) => `
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
            <span class="total-value">$${Number(invoice.subtotal).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Tax:</span>
            <span class="total-value">$${Number(invoice.taxAmount).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Discount:</span>
            <span class="total-value">-$${Number(invoice.discountAmount).toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">Total:</span>
            <span class="total-value">$${Number(invoice.totalAmount).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Amount Paid:</span>
            <span class="total-value">$${Number(invoice.paidAmount).toFixed(2)}</span>
          </div>
          ${Number(invoice.balanceDue) > 0 ? `
            <div class="total-row balance-due">
              <span class="total-label">Balance Due:</span>
              <span class="total-value">$${Number(invoice.balanceDue).toFixed(2)}</span>
            </div>
          ` : ""}
        </div>

        ${invoice.payments && invoice.payments.length > 0 ? `
          <div class="payment-section">
            <div class="section-title">PAYMENT HISTORY</div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th style="text-align: right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.payments.map((p: any) => `
                  <tr>
                    <td>${format(new Date(p.paymentDate), "PPP")}</td>
                    <td>${p.paymentMethod}</td>
                    <td>${p.reference || "-"}</td>
                    <td style="text-align: right">$${Number(p.amount).toFixed(2)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
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
            <p className="text-muted-foreground">Loading invoice...</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!invoice) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Invoice not found</p>
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
              <Button variant="outline" size="icon" onClick={() => navigate("/invoices")} data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" data-testid="text-invoice-number">{invoice.invoiceNumber}</h1>
                <p className="text-muted-foreground mt-1">Invoice Details</p>
              </div>
              <Badge className={statusColors[invoice.status] || "bg-gray-500"}>
                {invoice.status}
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
                  <Receipt className="h-5 w-5" />
                  Invoice Items
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
                    {invoice.items?.length > 0 ? (
                      invoice.items.map((item: any) => (
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
                    <span>${Number(invoice.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-64">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>${Number(invoice.taxAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-64">
                    <span className="text-muted-foreground">Discount:</span>
                    <span>-${Number(invoice.discountAmount).toFixed(2)}</span>
                  </div>
                  <Separator className="w-64" />
                  <div className="flex justify-between w-64 text-lg font-bold">
                    <span>Total:</span>
                    <span data-testid="text-total-amount">${Number(invoice.totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-64 text-green-600">
                    <span>Paid:</span>
                    <span>${Number(invoice.paidAmount).toFixed(2)}</span>
                  </div>
                  {Number(invoice.balanceDue) > 0 && (
                    <div className="flex justify-between w-64 text-lg font-bold text-red-600">
                      <span>Balance Due:</span>
                      <span data-testid="text-balance-due">${Number(invoice.balanceDue).toFixed(2)}</span>
                    </div>
                  )}
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
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span>{format(new Date(invoice.issueDate), "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className={new Date(invoice.dueDate) < new Date() && invoice.status !== "paid" ? "text-red-600 font-medium" : ""}>
                      {format(new Date(invoice.dueDate), "PPP")}
                    </span>
                  </div>
                  {invoice.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid On:</span>
                      <span className="text-green-600">{format(new Date(invoice.paidAt), "PPP")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {invoice.payments && invoice.payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {invoice.payments.map((payment: any) => (
                        <div key={payment.id} className="p-3 border rounded-lg" data-testid={`payment-${payment.id}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">${Number(payment.amount).toFixed(2)}</span>
                            <Badge variant="outline">{payment.paymentMethod}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(payment.paymentDate), "PPP")}
                          </p>
                          {payment.reference && (
                            <p className="text-xs text-muted-foreground">Ref: {payment.reference}</p>
                          )}
                        </div>
                      ))}
                    </div>
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
