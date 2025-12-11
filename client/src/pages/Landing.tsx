import { useState } from "react";
import { Link } from "wouter";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ExitIntentModal } from "@/components/marketing/ExitIntentModal";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Play, 
  Check, 
  Star, 
  Zap, 
  BarChart3, 
  Users, 
  Puzzle, 
  Smartphone,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";
import { testimonials, features, pricingPlans, faqs, trustBadges, stats } from "@/lib/marketingData";

import dashboardImage from "@assets/generated_images/crm_dashboard_analytics_interface.png";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4" data-testid="badge-announcement">
            <Zap className="w-3 h-3 mr-1" />
            New: AI-powered deal insights now available
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6" data-testid="text-hero-headline">
            Close More Deals.
            <span className="text-primary block">Spend Less Time on Admin.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subheadline">
            Nexus is the CRM that sales teams actually enjoy using. Beautiful, fast, 
            and packed with features that help you win - starting at just $29/month.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/checkout">
              <Button size="lg" className="h-14 px-8 text-lg" data-testid="button-hero-cta">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg" data-testid="button-watch-demo">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground" data-testid="text-hero-disclaimer">
            14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="mt-16 flex justify-center items-center gap-8 flex-wrap" data-testid="trust-badges">
          <p className="text-sm text-muted-foreground w-full text-center mb-4">
            Trusted by 10,000+ sales teams worldwide
          </p>
          {trustBadges.map((badge) => (
            <div
              key={badge.name}
              className="h-12 w-24 bg-muted/50 rounded-lg flex items-center justify-center"
              data-testid={`badge-trust-${badge.name.toLowerCase().replace(/\s/g, "-")}`}
            >
              <span className="font-heading font-bold text-lg text-muted-foreground">
                {badge.logo}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 relative mx-auto max-w-5xl">
          <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={dashboardImage} 
                alt="Nexus CRM Dashboard - Sales analytics and business overview"
                className="w-full h-full object-cover"
                data-testid="img-hero-dashboard"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
              <p className="absolute bottom-4 left-4 text-sm text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Nexus CRM Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 bg-muted/30" data-testid="section-stats">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-2" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Revenue",
      description: "Our customers see an average 34% increase in close rates within the first quarter.",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Automate data entry and follow-ups. Reps save 12+ hours per week on average.",
    },
    {
      icon: Shield,
      title: "Stay Secure",
      description: "Enterprise-grade security with SOC 2 certification and GDPR compliance.",
    },
  ];

  return (
    <section className="py-20 lg:py-28" data-testid="section-benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Why Teams Switch to Nexus
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We built the CRM we always wanted - one that actually helps you sell instead 
            of slowing you down with busywork.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const iconMap: Record<string, React.ReactNode> = {
    Kanban: <BarChart3 className="h-6 w-6" />,
    Zap: <Zap className="h-6 w-6" />,
    BarChart: <BarChart3 className="h-6 w-6" />,
    Users: <Users className="h-6 w-6" />,
    Puzzle: <Puzzle className="h-6 w-6" />,
    Smartphone: <Smartphone className="h-6 w-6" />,
  };

  return (
    <section className="py-20 lg:py-28 bg-muted/30" data-testid="section-features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Everything You Need to Sell Smarter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features that work together to help your team close more deals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.id} className="group hover:shadow-lg transition-all hover:-translate-y-1" data-testid={`card-feature-${feature.id}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {iconMap[feature.icon]}
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.shortDescription}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/features">
            <Button variant="outline" size="lg" data-testid="button-all-features">
              See All Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 lg:py-28" data-testid="section-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Loved by Sales Teams Everywhere
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from teams that switched to Nexus.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 lg:p-12" data-testid="testimonial-card">
            <CardContent className="p-0">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-xl lg:text-2xl font-medium mb-8" data-testid="text-testimonial-quote">
                "{testimonials[activeIndex].quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                  {testimonials[activeIndex].avatar}
                </div>
                <div>
                  <div className="font-semibold" data-testid="text-testimonial-name">
                    {testimonials[activeIndex].name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[activeIndex].role}, {testimonials[activeIndex].company}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                aria-label={`View testimonial ${i + 1}`}
                data-testid={`button-testimonial-${i}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingPreviewSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30" data-testid="section-pricing-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No surprises. Pick a plan that fits your team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
              data-testid={`card-pricing-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-heading font-bold">${plan.monthlyPrice}</span>
                  <span className="text-muted-foreground">/user/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    data-testid={`button-plan-${plan.id}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/pricing">
            <Button variant="link" className="text-primary" data-testid="button-view-pricing">
              Compare all plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-20 lg:py-28" data-testid="section-faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg px-6"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-primary text-primary-foreground" data-testid="section-cta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
          Ready to Transform Your Sales?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of teams that have already made the switch. 
          Start your free trial today - no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/checkout">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg" data-testid="button-cta-final">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              data-testid="button-talk-sales"
            >
              Talk to Sales
            </Button>
          </Link>
        </div>
        <p className="text-sm opacity-75 mt-6">
          30-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <MarketingLayout>
      <SEOHead
        title="Nexus CRM - Close More Deals, Spend Less Time on Admin"
        description="Nexus is the CRM that sales teams actually enjoy using. Beautiful, fast, and packed with features that help you win - starting at just $29/month."
        canonical="https://nexus.com/"
        keywords={["CRM software", "sales CRM", "customer relationship management", "pipeline management"]}
        hreflang={[
          { lang: "en-US", href: "https://nexus.com/us" },
          { lang: "en-GB", href: "https://nexus.com/uk" },
          { lang: "en-IN", href: "https://nexus.com/in" },
          { lang: "x-default", href: "https://nexus.com/" },
        ]}
      />
      <HeroSection />
      <StatsSection />
      <BenefitsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingPreviewSection />
      <FAQSection />
      <CTASection />
      <ExitIntentModal />
    </MarketingLayout>
  );
}
