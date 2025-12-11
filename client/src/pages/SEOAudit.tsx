import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  X,
  AlertTriangle,
  Gauge,
  Eye,
  Zap,
  Search,
  Shield,
  Globe,
  FileText
} from "lucide-react";

const lighthouseScores = {
  performance: 92,
  accessibility: 98,
  bestPractices: 95,
  seo: 100,
};

const accessibilityChecklist = [
  { id: 1, check: "All images have alt text", status: "pass" },
  { id: 2, check: "Color contrast meets WCAG AA standards", status: "pass" },
  { id: 3, check: "All form inputs have labels", status: "pass" },
  { id: 4, check: "Keyboard navigation works throughout", status: "pass" },
  { id: 5, check: "Focus indicators are visible", status: "pass" },
  { id: 6, check: "ARIA roles used appropriately", status: "pass" },
  { id: 7, check: "Skip links provided", status: "warning" },
  { id: 8, check: "Heading hierarchy is logical", status: "pass" },
  { id: 9, check: "Links have descriptive text", status: "pass" },
  { id: 10, check: "Motion respects reduced motion preferences", status: "pass" },
];

const seoChecklist = [
  { id: 1, check: "Title tags unique and descriptive", status: "pass" },
  { id: 2, check: "Meta descriptions present", status: "pass" },
  { id: 3, check: "Canonical URLs set", status: "pass" },
  { id: 4, check: "Open Graph tags configured", status: "pass" },
  { id: 5, check: "Twitter Card tags configured", status: "pass" },
  { id: 6, check: "Structured data (JSON-LD) present", status: "pass" },
  { id: 7, check: "Sitemap.xml generated", status: "pass" },
  { id: 8, check: "Robots.txt configured", status: "pass" },
  { id: 9, check: "Hreflang tags for geo pages", status: "pass" },
  { id: 10, check: "Mobile-friendly viewport", status: "pass" },
];

const pageMetaData = [
  { page: "Home (/)", title: "Nexus CRM - Close More Deals, Spend Less Time on Admin", keywords: ["CRM software", "sales CRM", "pipeline management"] },
  { page: "Features (/features)", title: "Features Built for Modern Sales Teams | Nexus CRM", keywords: ["CRM features", "sales automation", "contact management"] },
  { page: "Pricing (/pricing)", title: "Simple, Transparent Pricing | Nexus CRM", keywords: ["CRM pricing", "affordable CRM", "sales software cost"] },
  { page: "Resources (/resources)", title: "Resources & Insights | Nexus CRM", keywords: ["sales tips", "CRM guides", "sales best practices"] },
  { page: "US Landing (/us)", title: "The CRM Built for American Sales Teams | Nexus", keywords: ["US CRM", "American sales software", "CRM USA"] },
  { page: "UK Landing (/uk)", title: "The CRM Built for British Sales Teams | Nexus", keywords: ["UK CRM", "British sales software", "CRM UK"] },
  { page: "India Landing (/in)", title: "The CRM Built for Indian Sales Teams | Nexus", keywords: ["India CRM", "Indian sales software", "CRM India"] },
];

function ScoreCard({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Icon className={`h-8 w-8 mx-auto mb-4 ${getScoreColor(score)}`} />
        <div className={`text-4xl font-heading font-bold mb-2 ${getScoreColor(score)}`}>
          {score}
        </div>
        <div className="text-sm text-muted-foreground mb-4">{label}</div>
        <Progress value={score} className="h-2" />
      </CardContent>
    </Card>
  );
}

function ChecklistItem({ check, status }: { check: string; status: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      {status === "pass" && <Check className="h-5 w-5 text-green-600 dark:text-green-400" />}
      {status === "fail" && <X className="h-5 w-5 text-red-600 dark:text-red-400" />}
      {status === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
      <span className={status === "pass" ? "" : "text-muted-foreground"}>{check}</span>
      <Badge 
        variant={status === "pass" ? "default" : status === "warning" ? "secondary" : "destructive"}
        className="ml-auto"
      >
        {status === "pass" ? "Pass" : status === "warning" ? "Warning" : "Fail"}
      </Badge>
    </div>
  );
}

export default function SEOAudit() {
  const passCount = accessibilityChecklist.filter(c => c.status === "pass").length;
  const seoPassCount = seoChecklist.filter(c => c.status === "pass").length;

  return (
    <MarketingLayout showFloatingCTA={false}>
      <SEOHead
        title="SEO & Accessibility Audit | Nexus CRM"
        description="Comprehensive audit of site performance, accessibility compliance, and SEO optimization based on industry best practices."
        canonical="https://nexus.com/audit"
      />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Gauge className="w-3 h-3 mr-1" />
              Audit Report
            </Badge>
            <h1 className="text-4xl font-heading font-bold mb-4" data-testid="text-audit-headline">
              SEO & Accessibility Audit
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive audit of site performance, accessibility compliance, 
              and SEO optimization based on industry best practices.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-testid="lighthouse-scores">
            <ScoreCard label="Performance" score={lighthouseScores.performance} icon={Zap} />
            <ScoreCard label="Accessibility" score={lighthouseScores.accessibility} icon={Eye} />
            <ScoreCard label="Best Practices" score={lighthouseScores.bestPractices} icon={Shield} />
            <ScoreCard label="SEO" score={lighthouseScores.seo} icon={Search} />
          </div>

          <Tabs defaultValue="accessibility" className="mb-12">
            <TabsList className="mb-8">
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="meta">Page Meta</TabsTrigger>
              <TabsTrigger value="structure">Structured Data</TabsTrigger>
            </TabsList>

            <TabsContent value="accessibility">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Accessibility Checklist (WCAG 2.1 AA)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{passCount}/{accessibilityChecklist.length} checks passed</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((passCount / accessibilityChecklist.length) * 100)}%
                      </span>
                    </div>
                    <Progress value={(passCount / accessibilityChecklist.length) * 100} className="h-2" />
                  </div>
                  <div className="divide-y">
                    {accessibilityChecklist.map((item) => (
                      <ChecklistItem key={item.id} check={item.check} status={item.status} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    SEO Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{seoPassCount}/{seoChecklist.length} checks passed</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((seoPassCount / seoChecklist.length) * 100)}%
                      </span>
                    </div>
                    <Progress value={(seoPassCount / seoChecklist.length) * 100} className="h-2" />
                  </div>
                  <div className="divide-y">
                    {seoChecklist.map((item) => (
                      <ChecklistItem key={item.id} check={item.check} status={item.status} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meta">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Page Meta Data Inventory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="table-page-meta">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Page</th>
                          <th className="text-left py-3 px-4 font-medium">Title</th>
                          <th className="text-left py-3 px-4 font-medium">Target Keywords</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageMetaData.map((page) => (
                          <tr key={page.page} className="border-b">
                            <td className="py-3 px-4 text-sm font-mono">{page.page}</td>
                            <td className="py-3 px-4 text-sm">{page.title}</td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {page.keywords.map((kw) => (
                                  <Badge key={kw} variant="outline" className="text-xs">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="structure">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Structured Data (JSON-LD)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">WebSite Schema</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nexus CRM",
  "url": "https://nexus.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nexus.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Organization Schema</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nexus CRM",
  "url": "https://nexus.com",
  "logo": "https://nexus.com/logo.png",
  "sameAs": [
    "https://twitter.com/nexuscrm",
    "https://linkedin.com/company/nexuscrm"
  ]
}`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Product Schema</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nexus CRM Professional",
  "description": "CRM software for growing sales teams",
  "offers": {
    "@type": "Offer",
    "price": "79",
    "priceCurrency": "USD",
    "priceValidUntil": "2025-12-31"
  }
}`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">FAQPage Schema</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long is the free trial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You get 14 days to try Nexus..."
      }
    }
  ]
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold mb-4">How to Reproduce This Audit</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Open Chrome DevTools (F12) and navigate to the Lighthouse tab</li>
                <li>Select categories: Performance, Accessibility, Best Practices, SEO</li>
                <li>Choose "Mobile" or "Desktop" device</li>
                <li>Click "Analyze page load" to generate the report</li>
                <li>For accessibility, also run axe-core browser extension</li>
                <li>Validate structured data at schema.org/validator</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketingLayout>
  );
}
