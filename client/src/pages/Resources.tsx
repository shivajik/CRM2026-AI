import { Link } from "wouter";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, 
  Search,
  BookOpen,
  FileText,
  Video,
  Lightbulb,
  Calendar
} from "lucide-react";
import { blogPosts } from "@/lib/marketingData";

const resourceCategories = [
  {
    id: "guides",
    title: "Guides & Tutorials",
    description: "Step-by-step guides to get the most out of Nexus",
    icon: BookOpen,
    count: 24,
  },
  {
    id: "templates",
    title: "Templates",
    description: "Ready-to-use templates for sales processes",
    icon: FileText,
    count: 12,
  },
  {
    id: "webinars",
    title: "Webinars",
    description: "Live and recorded sessions with sales experts",
    icon: Video,
    count: 8,
  },
  {
    id: "tips",
    title: "Sales Tips",
    description: "Quick tips to improve your sales game",
    icon: Lightbulb,
    count: 45,
  },
];

const upcomingWebinars = [
  {
    id: 1,
    title: "Mastering Pipeline Management",
    date: "Dec 15, 2024",
    time: "2:00 PM EST",
    host: "Sarah Chen",
  },
  {
    id: 2,
    title: "Advanced Automation Workflows",
    date: "Dec 22, 2024",
    time: "1:00 PM EST",
    host: "Marcus Johnson",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-6" data-testid="text-resources-headline">
          Resources & Insights
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Learn from sales experts, discover best practices, and get the most 
          out of your CRM with our guides, templates, and tutorials.
        </p>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-10 h-12"
            data-testid="input-search-resources"
          />
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-16" data-testid="section-categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resourceCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                <Badge variant="secondary">{category.count} resources</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  return (
    <section className="py-16 bg-muted/30" data-testid="section-blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-2">Latest from the Blog</h2>
            <p className="text-muted-foreground">
              Insights, strategies, and stories from our team
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex">
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`blog-post-${post.id}`}>
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5" />
              <CardContent className="p-5">
                <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                <h3 className="font-heading font-semibold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline">
            View All Posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function WebinarsSection() {
  return (
    <section className="py-16" data-testid="section-webinars">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-4">Upcoming Webinars</h2>
            <p className="text-muted-foreground mb-8">
              Join our live sessions to learn from sales experts and get your questions answered.
            </p>

            <div className="space-y-4">
              {upcomingWebinars.map((webinar) => (
                <Card key={webinar.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{webinar.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {webinar.date} at {webinar.time} • Hosted by {webinar.host}
                      </p>
                      <Button size="sm" variant="outline">Register Free</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-heading font-bold mb-4" id="changelog">Product Updates</h2>
            <p className="text-muted-foreground mb-8">
              See what's new in Nexus. We ship improvements every week.
            </p>

            <div className="space-y-6">
              <div className="border-l-2 border-primary pl-4">
                <Badge variant="secondary" className="mb-2">Dec 2024</Badge>
                <h4 className="font-semibold mb-1">AI-Powered Deal Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Get AI-generated insights on deal health, suggested next steps, 
                  and risk factors for every opportunity in your pipeline.
                </p>
              </div>
              <div className="border-l-2 border-muted pl-4">
                <Badge variant="outline" className="mb-2">Nov 2024</Badge>
                <h4 className="font-semibold mb-1">Enhanced Mobile App</h4>
                <p className="text-sm text-muted-foreground">
                  Completely redesigned mobile experience with offline mode, 
                  voice notes, and faster sync.
                </p>
              </div>
              <div className="border-l-2 border-muted pl-4">
                <Badge variant="outline" className="mb-2">Oct 2024</Badge>
                <h4 className="font-semibold mb-1">Custom Report Builder</h4>
                <p className="text-sm text-muted-foreground">
                  Build exactly the reports you need with our new drag-and-drop 
                  report builder.
                </p>
              </div>
            </div>

            <Button variant="link" className="mt-4 p-0">
              View full changelog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">
          Get Sales Tips in Your Inbox
        </h2>
        <p className="text-lg opacity-90 mb-8">
          Join 15,000+ sales professionals who get our weekly insights. 
          No spam, just actionable advice.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            placeholder="Enter your email"
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 h-12"
            data-testid="input-newsletter-email"
          />
          <Button variant="secondary" size="lg" data-testid="button-subscribe">
            Subscribe
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm opacity-75 mt-4">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}

export default function Resources() {
  return (
    <MarketingLayout>
      <HeroSection />
      <CategoriesSection />
      <BlogSection />
      <WebinarsSection />
      <NewsletterSection />
    </MarketingLayout>
  );
}
