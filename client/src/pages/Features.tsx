import { useState } from "react";
import { Link } from "wouter";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Check, 
  BarChart3, 
  Users, 
  Receipt,
  FileText,
  Package,
  Activity,
  Building2,
  UserCircle,
  LayoutDashboard,
  Settings,
  Shield
} from "lucide-react";

const detailedFeatures = [
  {
    id: "invoices",
    title: "Invoice Management",
    icon: Receipt,
    shortCopy: "Create, send, and track professional invoices with payment recording and status management.",
    longCopy: `Our comprehensive invoice management system helps you get paid faster. Create professional invoices in seconds, track payment status in real-time, and record partial or full payments as they come in.

Generate invoices with line items, taxes, and discounts. Set due dates and payment terms. Track which invoices are paid, pending, or overdue at a glance.

Your company logo and details appear automatically on every invoice, giving your business a professional look. Export invoices to PDF for easy sharing with customers.`,
    benefits: [
      "Professional invoice templates",
      "Payment tracking & recording",
      "Tax & discount calculations",
      "PDF export with company logo",
      "Status tracking (draft, sent, paid, overdue)",
    ],
  },
  {
    id: "quotations",
    title: "Quotation System",
    icon: FileText,
    shortCopy: "Generate professional quotes for customers with line items, terms, and easy conversion to invoices.",
    longCopy: `Win more business with professional quotations that impress your customers. Create detailed quotes with multiple line items, set validity periods, and include your terms and conditions.

Track quotation status from draft to accepted. When a customer approves your quote, easily convert it to an invoice with a single click - no re-entering data.

Each quotation includes your company branding, making your business look established and trustworthy to potential customers.`,
    benefits: [
      "Professional quote templates",
      "Line items with pricing",
      "Terms & conditions",
      "Validity date tracking",
      "Company logo on exports",
    ],
  },
  {
    id: "customers",
    title: "Customer Management",
    icon: Users,
    shortCopy: "Keep all your customer information organized with complete contact details and history.",
    longCopy: `All your customer information in one place. Store contact details, company information, addresses, and custom notes for every customer.

Categorize customers by type - leads, prospects, or active customers. Add industry and segment information for better organization and reporting.

View the complete customer journey including all quotations, invoices, deals, and activities. Never lose track of a customer relationship again.`,
    benefits: [
      "Complete contact profiles",
      "Customer type categorization",
      "Industry & segment tracking",
      "Customer journey timeline",
      "Notes & history",
    ],
  },
  {
    id: "deals",
    title: "Deal Pipeline",
    icon: Building2,
    shortCopy: "Track sales opportunities through your pipeline stages and forecast revenue.",
    longCopy: `Visualize your entire sales pipeline at a glance. Track deals from initial contact through qualification, proposal, negotiation, and close.

Set deal values and probability percentages to forecast revenue accurately. Assign expected close dates to prioritize your time on the most promising opportunities.

Link deals to customers and contacts to maintain a complete picture of every sales relationship.`,
    benefits: [
      "Visual pipeline stages",
      "Deal value tracking",
      "Probability & forecasting",
      "Expected close dates",
      "Customer linking",
    ],
  },
  {
    id: "activities",
    title: "Activity Tracking",
    icon: Activity,
    shortCopy: "Log calls, emails, meetings, and notes to maintain a complete record of customer interactions.",
    longCopy: `Never forget a customer interaction. Log every call, email, meeting, and note with dates and descriptions.

Link activities to specific customers to build a comprehensive history. See at a glance when you last contacted someone and what was discussed.

Your team can see the complete activity history, making handoffs smooth and ensuring nothing falls through the cracks.`,
    benefits: [
      "Call & email logging",
      "Meeting records",
      "Notes & comments",
      "Customer activity timeline",
      "Team visibility",
    ],
  },
  {
    id: "products",
    title: "Product Catalog",
    icon: Package,
    shortCopy: "Manage your products and services with pricing for quick addition to quotes and invoices.",
    longCopy: `Maintain a catalog of all your products and services with standard pricing. When creating quotes or invoices, quickly add items from your catalog instead of typing details every time.

Set prices, descriptions, and categories for easy organization. Update pricing across your catalog and have changes reflected in new quotes and invoices automatically.`,
    benefits: [
      "Product & service listings",
      "Standard pricing",
      "Quick add to quotes/invoices",
      "Categories & organization",
      "Centralized price management",
    ],
  },
  {
    id: "dashboard",
    title: "Business Dashboard",
    icon: LayoutDashboard,
    shortCopy: "Get a real-time overview of your business with key metrics and performance indicators.",
    longCopy: `See how your business is doing at a glance. The dashboard shows total revenue, active deals, customer counts, and pending tasks.

Visualize revenue trends over time with charts. Understand your customer distribution across segments and industries.

Make data-driven decisions with insights that update in real-time as you record sales and payments.`,
    benefits: [
      "Revenue overview",
      "Deal statistics",
      "Customer metrics",
      "Visual charts & trends",
      "Real-time updates",
    ],
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    icon: BarChart3,
    shortCopy: "Generate detailed reports on sales, customers, invoices, and pipeline performance.",
    longCopy: `Understand your business performance with comprehensive reports. Analyze sales by time period, track pipeline health, and monitor customer growth.

Generate invoice summaries showing paid, pending, and overdue amounts. Export reports to CSV for further analysis or sharing with stakeholders.

Filter by date ranges to compare performance across different periods and identify trends.`,
    benefits: [
      "Sales & pipeline reports",
      "Customer analytics",
      "Invoice summaries",
      "CSV export",
      "Date range filtering",
    ],
  },
  {
    id: "company",
    title: "Company Profile",
    icon: Settings,
    shortCopy: "Customize your company information with logo, details, and branding for professional documents.",
    longCopy: `Set up your company profile once and have it appear on all your invoices and quotations. Upload your logo, add contact details, tax ID, and registration numbers.

Configure default payment terms, invoice prefixes, and notes that appear on every document. Make your business look professional with consistent branding.

Update your profile anytime and changes reflect immediately on new documents.`,
    benefits: [
      "Logo upload & branding",
      "Company details on documents",
      "Tax ID & registration",
      "Default payment terms",
      "Invoice/quote prefixes",
    ],
  },
  {
    id: "team",
    title: "Team Management",
    icon: UserCircle,
    shortCopy: "Invite team members and manage roles for collaborative business management.",
    longCopy: `Work as a team with role-based access. Invite team members to collaborate on customer management, deal tracking, and invoicing.

Assign different roles to control what each team member can see and do. Administrators have full access while other roles can be limited to specific functions.

Everyone works from the same data, ensuring your team is always aligned.`,
    benefits: [
      "Team member invitations",
      "Role-based access",
      "Collaborative workflows",
      "Shared customer data",
      "Admin controls",
    ],
  },
  {
    id: "portal",
    title: "Customer Portal",
    icon: Shield,
    shortCopy: "Give customers access to view their quotations, invoices, and manage their profile.",
    longCopy: `Provide a professional self-service experience for your customers. They can log in to view their quotations and invoices, check payment status, and update their contact information.

Reduce back-and-forth communication by giving customers direct access to the information they need. They can download invoices and quotes as PDFs anytime.

Strengthen customer relationships with transparency and convenience.`,
    benefits: [
      "Customer self-service",
      "View quotations & invoices",
      "Download PDF documents",
      "Profile management",
      "Professional experience",
    ],
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="secondary" className="mb-4">
          Complete Business Solution
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6" data-testid="text-features-headline">
          Everything You Need to
          <span className="text-primary block">Run Your Business</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          From quotations to invoices, customer management to reporting. 
          All the tools you need in one simple platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/checkout">
            <Button size="lg" className="h-14 px-8 text-lg" data-testid="button-features-cta">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeatureDetailSection() {
  const [copyMode, setCopyMode] = useState<"short" | "long">("short");

  return (
    <section className="py-20" data-testid="section-feature-details">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <Tabs value={copyMode} onValueChange={(v) => setCopyMode(v as "short" | "long")}>
            <TabsList>
              <TabsTrigger value="short" data-testid="tab-short-copy">Quick Overview</TabsTrigger>
              <TabsTrigger value="long" data-testid="tab-long-copy">Detailed Features</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-24">
          {detailedFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
              data-testid={`feature-section-${feature.id}`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-4">{feature.title}</h2>
                
                {copyMode === "short" ? (
                  <p className="text-lg text-muted-foreground mb-6">{feature.shortCopy}</p>
                ) : (
                  <div className="prose prose-slate dark:prose-invert mb-6">
                    {feature.longCopy.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-muted-foreground">{paragraph}</p>
                    ))}
                  </div>
                )}
                
                <ul className="space-y-3">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <Card className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <feature.icon className="h-24 w-24 text-primary/30" />
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGridSection() {
  const quickFeatures = [
    { icon: Receipt, title: "Invoices", desc: "Create & track payments" },
    { icon: FileText, title: "Quotations", desc: "Professional quotes" },
    { icon: Users, title: "Customers", desc: "Complete CRM" },
    { icon: Building2, title: "Deals", desc: "Sales pipeline" },
    { icon: Activity, title: "Activities", desc: "Interaction logging" },
    { icon: Package, title: "Products", desc: "Catalog management" },
    { icon: LayoutDashboard, title: "Dashboard", desc: "Business overview" },
    { icon: BarChart3, title: "Reports", desc: "Analytics & insights" },
    { icon: Settings, title: "Settings", desc: "Company branding" },
    { icon: UserCircle, title: "Team", desc: "Collaboration" },
    { icon: Shield, title: "Portal", desc: "Customer access" },
    { icon: FileText, title: "PDF Export", desc: "Professional documents" },
  ];

  return (
    <section className="py-20 bg-muted/30" data-testid="section-feature-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            All Features at a Glance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything included in one platform. No add-ons, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickFeatures.map((feature) => (
            <Card key={feature.title} className="text-center p-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="font-medium text-sm">{feature.title}</div>
              <div className="text-xs text-muted-foreground">{feature.desc}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
          Ready to Streamline Your Business?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Start your free 14-day trial and explore every feature. No credit card required.
        </p>
        <Link href="/checkout">
          <Button size="lg" variant="secondary" className="h-14 px-8 text-lg" data-testid="button-features-cta-bottom">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function Features() {
  return (
    <MarketingLayout>
      <SEOHead
        title="Features - Complete Business Management | Nexus"
        description="Invoices, quotations, customer management, deal pipeline, reports, and more. All the tools you need to run your business in one platform."
        canonical="https://nexus.com/features"
        keywords={["invoice software", "quotation system", "customer management", "business management", "CRM"]}
      />
      <HeroSection />
      <FeatureDetailSection />
      <FeatureGridSection />
      <CTASection />
    </MarketingLayout>
  );
}
