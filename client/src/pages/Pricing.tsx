import { useState } from "react";
import { Link } from "wouter";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowRight, 
  Check, 
  X,
  Shield,
  Clock,
  Users,
  Zap
} from "lucide-react";
import { pricingPlans, faqs } from "@/lib/marketingData";

const featureMatrix = [
  { feature: "Team members", starter: "Up to 5", professional: "Up to 25", enterprise: "Unlimited" },
  { feature: "Contacts", starter: "1,000", professional: "10,000", enterprise: "Unlimited" },
  { feature: "Custom pipelines", starter: "1", professional: "5", enterprise: "Unlimited" },
  { feature: "Email integration", starter: true, professional: true, enterprise: true },
  { feature: "Mobile apps", starter: true, professional: true, enterprise: true },
  { feature: "Basic reporting", starter: true, professional: true, enterprise: true },
  { feature: "Workflow automation", starter: false, professional: true, enterprise: true },
  { feature: "Custom reports", starter: false, professional: true, enterprise: true },
  { feature: "API access", starter: false, professional: true, enterprise: true },
  { feature: "Custom integrations", starter: false, professional: false, enterprise: true },
  { feature: "SSO / SAML", starter: false, professional: false, enterprise: true },
  { feature: "Dedicated account manager", starter: false, professional: false, enterprise: true },
  { feature: "SLA guarantees", starter: false, professional: false, enterprise: true },
  { feature: "Priority support", starter: false, professional: true, enterprise: true },
  { feature: "24/7 phone support", starter: false, professional: false, enterprise: true },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6" data-testid="text-pricing-headline">
          Simple, Transparent Pricing
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          No hidden fees, no surprise charges. Pick the plan that fits your team 
          and start your 14-day free trial today.
        </p>

        <div className="flex items-center justify-center gap-4 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">30-day money-back guarantee</span>
          <span className="text-muted-foreground">•</span>
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">14-day free trial</span>
        </div>
      </div>
    </section>
  );
}

function PricingCardsSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-12" data-testid="section-pricing-cards">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-12">
          <Label htmlFor="billing-toggle" className={!isAnnual ? "text-foreground" : "text-muted-foreground"}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            data-testid="switch-billing-toggle"
          />
          <Label htmlFor="billing-toggle" className={isAnnual ? "text-foreground" : "text-muted-foreground"}>
            Annual
            <Badge variant="secondary" className="ml-2">Save 17%</Badge>
          </Label>
        </div>

        <div className="flex items-center justify-center mb-8">
          <Badge variant="outline" className="text-sm py-1 px-3">
            <Zap className="w-3 h-3 mr-1" />
            Only 47 seats left at current pricing
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const price = isAnnual
              ? Math.round(plan.annualPrice / 12)
              : plan.monthlyPrice;
            
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${
                  plan.popular ? "border-primary shadow-xl scale-105 z-10" : ""
                }`}
                data-testid={`pricing-card-${plan.id}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-sm font-semibold py-2">
                    Most Popular
                  </div>
                )}
                <CardHeader className={plan.popular ? "pt-12" : ""}>
                  <CardTitle className="text-2xl font-heading">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-5xl font-heading font-bold">${price}</span>
                    <span className="text-muted-foreground">/user/mo</span>
                    {isAnnual && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Billed annually (${plan.annualPrice}/user/year)
                      </p>
                    )}
                  </div>

                  <Link href={plan.id === "enterprise" ? "/contact" : "/checkout"}>
                    <Button
                      className="w-full mb-6"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      data-testid={`button-plan-${plan.id}`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}

function FeatureComparisonSection() {
  return (
    <section className="py-20 bg-muted/30" data-testid="section-feature-comparison">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">Compare Plans</h2>
          <p className="text-muted-foreground">
            See exactly what's included in each plan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-feature-comparison">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-medium">Feature</th>
                <th className="text-center py-4 px-4 font-medium">Starter</th>
                <th className="text-center py-4 px-4 font-medium bg-primary/5">Professional</th>
                <th className="text-center py-4 px-4 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {featureMatrix.map((row, index) => (
                <tr key={row.feature} className={index % 2 === 0 ? "bg-background" : ""}>
                  <td className="py-4 px-4 text-sm">{row.feature}</td>
                  <td className="text-center py-4 px-4">
                    {typeof row.starter === "boolean" ? (
                      row.starter ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm">{row.starter}</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4 bg-primary/5">
                    {typeof row.professional === "boolean" ? (
                      row.professional ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm font-medium">{row.professional}</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {typeof row.enterprise === "boolean" ? (
                      row.enterprise ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm">{row.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="py-20" data-testid="section-trust">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-heading font-semibold mb-2">30-Day Money Back</h3>
            <p className="text-sm text-muted-foreground">
              Not satisfied? Get a full refund within 30 days. No questions asked, 
              no hoops to jump through.
            </p>
          </Card>
          <Card className="text-center p-6">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-heading font-semibold mb-2">14-Day Free Trial</h3>
            <p className="text-sm text-muted-foreground">
              Try all Professional features free for 14 days. No credit card required 
              to start.
            </p>
          </Card>
          <Card className="text-center p-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-heading font-semibold mb-2">Cancel Anytime</h3>
            <p className="text-sm text-muted-foreground">
              No long-term contracts. Cancel your subscription whenever you want 
              from account settings.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const pricingFaqs = faqs.filter((_, i) => i < 6);

  return (
    <section className="py-20 bg-muted/30" data-testid="section-pricing-faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Pricing Questions
          </h2>
          <p className="text-muted-foreground">
            Got questions about our plans? Here are the answers.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {pricingFaqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg px-6 bg-background"
              data-testid={`pricing-faq-${index}`}
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
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of sales teams that trust Nexus. Start your 14-day free trial 
          and see why teams switch.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/checkout">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg" data-testid="button-pricing-cta">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Talk to Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Pricing() {
  return (
    <MarketingLayout>
      <HeroSection />
      <PricingCardsSection />
      <FeatureComparisonSection />
      <TrustSection />
      <FAQSection />
      <CTASection />
    </MarketingLayout>
  );
}
