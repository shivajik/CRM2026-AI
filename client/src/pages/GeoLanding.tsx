import { useState } from "react";
import { Link, useRoute } from "wouter";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Check, 
  Star, 
  MapPin,
  Phone,
  Building2
} from "lucide-react";
import { geoContent, pricingPlans, testimonials, faqs } from "@/lib/marketingData";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type GeoRegion = "us" | "uk" | "in";

interface GeoLandingProps {
  region?: GeoRegion;
}

function getGeoData(region: GeoRegion) {
  return geoContent[region] || geoContent.us;
}

function formatPrice(price: number, region: GeoRegion): string {
  const data = getGeoData(region);
  const adjustedPrice = Math.round(price * data.priceModifier);
  return `${data.currency}${adjustedPrice}`;
}

export default function GeoLanding({ region = "us" }: GeoLandingProps) {
  const [, params] = useRoute("/:region");
  const currentRegion = (params?.region as GeoRegion) || region;
  const geoData = getGeoData(currentRegion);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Nexus CRM",
            description: "CRM software for sales teams",
            address: {
              "@type": "PostalAddress",
              streetAddress: geoData.address.split(",")[0],
              addressLocality: geoData.address.split(",")[1]?.trim(),
              addressCountry: geoData.region,
            },
            telephone: geoData.phone,
            url: `https://nexus.com/${currentRegion}`,
          }),
        }}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Serving sales teams in {geoData.region === "US" ? "the United States" : geoData.region === "UK" ? "the United Kingdom" : "India"}
            </span>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6" data-testid="text-geo-headline">
              {geoData.headline}
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {geoData.subheadline}. Start your free trial today - 
              pricing from just {formatPrice(pricingPlans[0].monthlyPrice, currentRegion)}/user/month.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/checkout">
                <Button size="lg" className="h-14 px-8 text-lg" data-testid="button-geo-cta">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                Call {geoData.phone}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Trusted by {geoData.region === "US" ? "American" : geoData.region === "UK" ? "British" : "Indian"} Businesses
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
                data-testid={`geo-pricing-${plan.id}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Popular in {geoData.region}
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-heading font-bold">
                      {formatPrice(plan.monthlyPrice, currentRegion)}
                    </span>
                    <span className="text-muted-foreground">/user/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/checkout">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              What Our Customers Say
            </h2>
          </div>

          <Card className="p-8">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-xl font-medium mb-6">
              "{testimonials[activeTestimonial].quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                {testimonials[activeTestimonial].avatar}
              </div>
              <div>
                <div className="font-semibold">{testimonials[activeTestimonial].name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === activeTestimonial ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.slice(0, 5).map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-background"
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

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-primary text-primary-foreground">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">
                  Local Support in {geoData.region === "US" ? "the US" : geoData.region === "UK" ? "the UK" : "India"}
                </h2>
                <p className="opacity-90 mb-6">
                  Get dedicated support from our local team. We understand your market 
                  and speak your language.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    <span>{geoData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5" />
                    <span>{geoData.address}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Link href="/checkout">
                  <Button size="lg" variant="secondary" className="h-14 px-8">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm opacity-75 mt-4">
                  14-day free trial. No credit card required.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </MarketingLayout>
  );
}

export function USLanding() {
  return <GeoLanding region="us" />;
}

export function UKLanding() {
  return <GeoLanding region="uk" />;
}

export function INLanding() {
  return <GeoLanding region="in" />;
}
