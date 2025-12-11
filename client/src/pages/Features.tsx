import { useState } from "react";
import { Link } from "wouter";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Check, 
  Zap, 
  BarChart3, 
  Users, 
  Puzzle, 
  Smartphone,
  Mail,
  Calendar,
  Target,
  RefreshCw,
  FileText,
  Lock
} from "lucide-react";
import { features } from "@/lib/marketingData";

const detailedFeatures = [
  {
    id: "pipeline",
    title: "Visual Pipeline Management",
    icon: Target,
    shortCopy: "Drag-and-drop deals through your sales stages with our intuitive kanban board.",
    longCopy: `Our visual pipeline gives you complete control over your sales process. Drag deals between stages, customize pipeline views for different teams or products, and spot bottlenecks before they kill your quota.

Most teams find deals worth $50,000+ hiding in their pipeline within the first week - opportunities that fell through the cracks with their old system. The visual format means nothing gets forgotten.

Set up deal rotting alerts so you know when opportunities have been sitting too long. Add custom fields for the metrics that matter to your business. Filter and sort by any criteria to focus on what matters most right now.`,
    benefits: [
      "Customizable deal stages",
      "Drag-and-drop interface",
      "Deal rotting alerts",
      "Multiple pipeline views",
      "Custom fields & filters",
    ],
  },
  {
    id: "automation",
    title: "Smart Automation",
    icon: Zap,
    shortCopy: "Let workflows handle the repetitive stuff so your team can focus on selling.",
    longCopy: `Every minute your reps spend on data entry is a minute they're not spending with prospects. Our automation engine handles the busywork - automatically.

Set up workflows that trigger based on any action: when a deal moves stages, when a task is overdue, when a contact opens an email. Automatically assign tasks, send follow-ups, update fields, and notify team members.

The average team saves 12+ hours per rep each week. That's time they can spend on what actually closes deals: building relationships with prospects.`,
    benefits: [
      "Trigger-based workflows",
      "Automated task creation",
      "Email sequences",
      "Field updates",
      "Team notifications",
    ],
  },
  {
    id: "analytics",
    title: "Revenue Analytics",
    icon: BarChart3,
    shortCopy: "Real-time dashboards that show you exactly what's working and what's not.",
    longCopy: `Stop guessing about your pipeline. Our analytics dashboards update in real-time, giving you visibility into every metric that matters: conversion rates, average deal size, sales velocity, and team performance.

Build custom reports for your specific needs. Track trends over time. Compare performance across reps, teams, and time periods. Forecast revenue with confidence based on historical data.

The managers who love Nexus most are the ones who used to spend hours each week building reports in spreadsheets. Now they just open a dashboard.`,
    benefits: [
      "Real-time updates",
      "Custom report builder",
      "Revenue forecasting",
      "Team leaderboards",
      "Trend analysis",
    ],
  },
  {
    id: "contacts",
    title: "Contact Intelligence",
    icon: Users,
    shortCopy: "Everything you need to know about your prospects, automatically organized.",
    longCopy: `Every email, call, and meeting is automatically logged to the right contact record. No more manual data entry, no more forgotten follow-ups, no more walking into calls unprepared.

Our enrichment features pull in company data, social profiles, and recent news so you always have context. See the complete history of any relationship in seconds - who spoke to them, what was discussed, and what's next.

Smart de-duplication means you won't have five records for the same person. Activity timelines mean you can pick up any conversation where it left off, even if you're not the one who started it.`,
    benefits: [
      "Auto-logged activities",
      "Data enrichment",
      "Relationship timeline",
      "Duplicate detection",
      "Social profiles",
    ],
  },
  {
    id: "integrations",
    title: "Seamless Integrations",
    icon: Puzzle,
    shortCopy: "Connect with 200+ tools you already use. Two-way sync means no more copy-paste.",
    longCopy: `Your CRM should work with your tools, not against them. We integrate with 200+ apps including Gmail, Outlook, Slack, Zoom, and the rest of your tech stack.

Two-way sync means changes flow automatically between systems. Update a contact in your email? It's updated in Nexus. Close a deal in Nexus? It syncs to your billing system. No more copying and pasting between tabs.

Most integrations set up in minutes, not days. Our API is fully documented for custom integrations, and our team helps Enterprise customers build exactly what they need.`,
    benefits: [
      "200+ integrations",
      "Two-way sync",
      "Gmail & Outlook",
      "Slack notifications",
      "REST API access",
    ],
  },
  {
    id: "mobile",
    title: "Mobile CRM",
    icon: Smartphone,
    shortCopy: "Full CRM functionality in your pocket. Update deals, prep for meetings, stay in sync.",
    longCopy: `Your work doesn't stop when you leave your desk. Our mobile apps give you full CRM access from anywhere - update deals on the go, prep for meetings during your commute, and get notifications when prospects engage.

The mobile apps aren't watered-down versions of the desktop experience. You can do everything on mobile that you can on desktop: manage deals, log activities, run reports, and even record voice notes that automatically transcribe.

Offline mode means you can work without internet and sync when you're back online. Perfect for trade shows, field sales, or anywhere with spotty WiFi.`,
    benefits: [
      "iOS & Android apps",
      "Full functionality",
      "Offline mode",
      "Voice notes",
      "Push notifications",
    ],
  },
  {
    id: "email",
    title: "Email Integration",
    icon: Mail,
    shortCopy: "Sync your inbox, track opens, and send sequences - all from within the CRM.",
    longCopy: `Stop switching between your inbox and your CRM. Our email integration brings your sales emails right into Nexus, with tracking that shows you exactly when prospects engage.

Set up email sequences that automatically follow up with prospects on your schedule. Track opens and clicks in real-time so you can reach out at the perfect moment. Use templates to send consistent, professional messages in seconds.

All email activity is automatically logged to the right contact record. No more BCC tricks or manual logging. Just write emails and let Nexus handle the rest.`,
    benefits: [
      "Inbox sync",
      "Open & click tracking",
      "Email sequences",
      "Templates library",
      "Auto-logging",
    ],
  },
  {
    id: "calendar",
    title: "Calendar Sync",
    icon: Calendar,
    shortCopy: "Meetings automatically logged. Scheduling made simple. No more double-booking.",
    longCopy: `Connect your Google or Outlook calendar and watch meetings automatically appear in your CRM. No more manual logging, no more forgotten follow-ups after calls.

Share your availability with prospects and let them book directly into your calendar. Nexus automatically creates the meeting record, sends reminders, and even suggests prep notes based on the contact's history.

Team calendars show everyone's availability so you can schedule internal meetings without the back-and-forth. See at a glance who's available when.`,
    benefits: [
      "Auto-logged meetings",
      "Booking links",
      "Smart reminders",
      "Team calendars",
      "Prep suggestions",
    ],
  },
  {
    id: "documents",
    title: "Document Management",
    icon: FileText,
    shortCopy: "Proposals, contracts, and collateral - organized, tracked, and ready to send.",
    longCopy: `Store all your sales documents in one place with full visibility into how prospects engage with them. Track when proposals are opened, how long they're viewed, and which sections get the most attention.

Create templates for common documents and personalize them in seconds. Collect e-signatures without leaving Nexus. Automatically attach documents to the right deal records.

Version control means you always know which version of a proposal was sent to which prospect. No more hunting through email to find the latest deck.`,
    benefits: [
      "Document tracking",
      "E-signatures",
      "Templates",
      "Version control",
      "Centralized storage",
    ],
  },
  {
    id: "security",
    title: "Enterprise Security",
    icon: Lock,
    shortCopy: "Bank-level security, SOC 2 certified, GDPR compliant. Your data is safe with us.",
    longCopy: `We take security seriously because your customer data is your competitive advantage. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit - the same standards banks use.

We're SOC 2 Type II certified, GDPR compliant, and undergo regular third-party security audits. Role-based access controls let you decide who sees what. Audit logs track every action for compliance.

Enterprise plans include SSO integration with your identity provider, custom data retention policies, and dedicated security reviews.`,
    benefits: [
      "AES-256 encryption",
      "SOC 2 Type II",
      "GDPR compliant",
      "SSO support",
      "Audit logs",
    ],
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="secondary" className="mb-4">
          <RefreshCw className="w-3 h-3 mr-1" />
          Updated for 2024
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6" data-testid="text-features-headline">
          Features Built for
          <span className="text-primary block">Modern Sales Teams</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Everything you need to manage your pipeline, close more deals, and grow revenue. 
          Powerful enough for enterprise, simple enough for startups.
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

function IntegrationsSection() {
  const integrations = [
    { name: "Gmail", category: "Email" },
    { name: "Outlook", category: "Email" },
    { name: "Slack", category: "Communication" },
    { name: "Zoom", category: "Meetings" },
    { name: "Google Calendar", category: "Calendar" },
    { name: "Stripe", category: "Payments" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Zapier", category: "Automation" },
    { name: "HubSpot", category: "Marketing" },
    { name: "Mailchimp", category: "Email Marketing" },
    { name: "Salesforce", category: "CRM" },
    { name: "LinkedIn", category: "Social" },
  ];

  return (
    <section className="py-20 bg-muted/30" id="integrations" data-testid="section-integrations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Integrates With Your Stack
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            200+ integrations with the tools you already use. Two-way sync keeps everything in sync.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.name} className="text-center p-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Puzzle className="h-6 w-6 text-primary" />
              </div>
              <div className="font-medium text-sm">{integration.name}</div>
              <div className="text-xs text-muted-foreground">{integration.category}</div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" data-testid="button-all-integrations">
            View All 200+ Integrations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
          See These Features in Action
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
      <HeroSection />
      <FeatureDetailSection />
      <IntegrationsSection />
      <CTASection />
    </MarketingLayout>
  );
}
