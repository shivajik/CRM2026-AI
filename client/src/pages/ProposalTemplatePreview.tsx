import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { proposalTemplatesApi } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Building2,
  Mail,
  Phone,
  Award,
  Eye,
} from "lucide-react";

type TemplateSection = {
  id: string;
  title: string;
  sectionType: string;
  content: string;
  sortOrder: number;
};

type Template = {
  id: string;
  name: string;
  description: string | null;
  purpose: string;
  themePreset: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerStyle: string;
  fontFamily: string;
  sections: TemplateSection[];
  createdAt: string;
  updatedAt: string;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 };
}

function replaceTemplatePlaceholders(content: string): string {
  if (!content) return content;
  
  const today = new Date();
  const replacements: Record<string, string> = {
    '{{proposal.title}}': 'Sample Proposal Title',
    '{{proposal.date}}': format(today, 'MMMM d, yyyy'),
    '{{proposal.number}}': 'PROP-0001',
    '{{proposal.validUntil}}': format(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), 'MMMM d, yyyy'),
    '{{proposal.total}}': '$5,000.00',
    '{{client.name}}': 'John Smith',
    '{{client.company}}': 'Acme Corporation',
    '{{client.email}}': 'john@example.com',
    '{{agency.name}}': 'Your Agency Name',
    '{{agency.email}}': 'hello@youragency.com',
    '{{agency.phone}}': '+1 (555) 123-4567',
  };
  
  let result = content;
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  
  return result;
}

export default function ProposalTemplatePreview() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/proposals/templates/:id");
  const templateId = params?.id;

  const { data: template, isLoading, error } = useQuery<Template>({
    queryKey: ["proposal-template", templateId],
    queryFn: () => proposalTemplatesApi.getById(templateId!),
    enabled: !!templateId,
  });

  const handleUseTemplate = () => {
    if (templateId) {
      setLocation(`/proposals/new?templateId=${templateId}`);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600 font-medium">Loading template preview...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !template) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Template Not Found</h2>
              <p className="mt-3 text-slate-500">
                This template may have been deleted or you don't have permission to view it.
              </p>
              <Button className="mt-6" onClick={() => setLocation("/proposals/templates")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const primaryColor = template.primaryColor || '#3B82F6';
  const secondaryColor = template.secondaryColor || '#1E40AF';
  const accentColor = template.accentColor || '#10B981';
  const headerStyle = template.headerStyle || 'gradient';

  const headerGradient = headerStyle === 'gradient' 
    ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    : primaryColor;

  const sortedSections = template.sections
    ? [...template.sections].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/proposals/templates")} data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Template Preview</h1>
            </div>
            <p className="text-muted-foreground text-sm">Preview how proposals using this template will look</p>
          </div>
        </div>
        <Button onClick={handleUseTemplate} data-testid="button-use-template">
          Use This Template
        </Button>
      </div>

      <div className="bg-gradient-to-br from-slate-100 via-white to-slate-50 rounded-xl overflow-hidden shadow-lg border">
        <div 
          className="w-full py-16 px-4 relative overflow-hidden"
          style={{ background: headerGradient }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="max-w-4xl mx-auto relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="text-white">
                <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm font-medium backdrop-blur-sm" data-testid="text-template-badge">
                  Template Preview
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-template-name">
                  {template.name}
                </h1>
                {template.description && (
                  <p className="mt-3 text-white/80 max-w-xl">
                    {template.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-4 text-white/90">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Valid until {format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "MMMM d, yyyy")}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-white rounded-xl px-6 py-4 shadow-lg">
                  <div className="text-sm text-slate-500 mb-1">Template Purpose</div>
                  <Badge variant="secondary" className="text-sm capitalize">
                    {template.purpose?.replace(/_/g, ' ') || 'Custom'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
          <Card className="shadow-xl border-0 mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                    <Building2 className="w-4 h-4" />
                    From
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800">Your Agency Name</p>
                    <p className="text-slate-600 flex items-center gap-2 mt-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      hello@youragency.com
                    </p>
                    <p className="text-slate-600 flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-slate-400" />
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                    <FileText className="w-4 h-4" />
                    Prepared For
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800">John Smith</p>
                    <p className="text-slate-600 mt-1">Acme Corporation</p>
                    <p className="text-slate-600 flex items-center gap-2 mt-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      john@example.com
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8 pb-8">
            {sortedSections.length > 0 ? (
              sortedSections.map((section, index) => (
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
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                        <Badge variant="outline" className="mt-1 text-xs capitalize">
                          {section.sectionType?.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                    {section.content ? (
                      <div 
                        className="proposal-content prose prose-slate prose-lg max-w-none
                          prose-headings:text-slate-800 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-4
                          [&>h2:first-child]:hidden
                          prose-h3:text-lg prose-h3:text-slate-700 prose-h3:border-l-4 prose-h3:border-blue-500 prose-h3:pl-4 prose-h3:py-1 prose-h3:bg-blue-50/50
                          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:my-4
                          prose-ul:my-4 prose-ul:space-y-2
                          prose-li:text-slate-600 prose-li:leading-relaxed
                          prose-strong:text-slate-800 prose-strong:font-semibold
                          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                          prose-table:border-collapse prose-table:w-full prose-table:my-6
                          prose-th:bg-slate-100 prose-th:text-slate-700 prose-th:font-semibold prose-th:p-4 prose-th:text-left prose-th:border prose-th:border-slate-200
                          prose-td:p-4 prose-td:border prose-td:border-slate-200 prose-td:text-slate-600"
                        dangerouslySetInnerHTML={{ __html: replaceTemplatePlaceholders(section.content) }}
                      />
                    ) : (
                      <p className="text-slate-500 italic">No content defined for this section</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700">No Sections Defined</h3>
                  <p className="text-slate-500 mt-2">
                    This template doesn't have any sections yet. Sections will be added when you create a proposal from this template.
                  </p>
                </CardContent>
              </Card>
            )}

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
              <CardContent className="p-8">
                <p className="text-slate-500 text-center italic">
                  Pricing items will be added when creating a proposal from this template
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div 
          className="p-6 bg-white/95 backdrop-blur-lg border-t"
          style={{ borderTopColor: `rgba(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.2)` }}
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg"
              style={{ backgroundColor: accentColor }}
              onClick={handleUseTemplate}
              data-testid="button-use-template-bottom"
            >
              Use This Template
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg"
              onClick={() => setLocation("/proposals/templates")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Templates
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
