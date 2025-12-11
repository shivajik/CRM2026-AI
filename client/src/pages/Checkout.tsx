import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Shield,
  Lock,
  CreditCard,
  Building2,
  AlertCircle
} from "lucide-react";
import { pricingPlans } from "@/lib/marketingData";

type CheckoutStep = "plan" | "details" | "payment" | "success" | "error";

interface FormData {
  plan: string;
  billing: "monthly" | "annual";
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  agreeTerms: boolean;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<CheckoutStep>("plan");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    plan: "professional",
    billing: "annual",
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    agreeTerms: false,
  });

  const selectedPlan = pricingPlans.find((p) => p.id === formData.plan);
  const price = formData.billing === "annual"
    ? Math.round((selectedPlan?.annualPrice || 0) / 12)
    : selectedPlan?.monthlyPrice || 0;

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const success = Math.random() > 0.1;
    setIsProcessing(false);
    setStep(success ? "success" : "error");
  };

  if (step === "success") {
    return (
      <MarketingLayout showFloatingCTA={false}>
        <div className="min-h-[80vh] flex items-center justify-center py-20">
          <Card className="max-w-lg w-full mx-4" data-testid="checkout-success">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-heading font-bold mb-2">Welcome to Nexus!</h1>
              <p className="text-muted-foreground mb-6">
                Your account is ready. We've sent a confirmation email to {formData.email} 
                with everything you need to get started.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2">Your Trial Details</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Plan: {selectedPlan?.name}</li>
                  <li>Trial ends: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                  <li>First charge: After trial (${price}/mo)</li>
                </ul>
              </div>
              <Link href="/login">
                <Button size="lg" className="w-full" data-testid="button-go-to-app">
                  Go to Your Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MarketingLayout>
    );
  }

  if (step === "error") {
    return (
      <MarketingLayout showFloatingCTA={false}>
        <div className="min-h-[80vh] flex items-center justify-center py-20">
          <Card className="max-w-lg w-full mx-4" data-testid="checkout-error">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-heading font-bold mb-2">Payment Failed</h1>
              <p className="text-muted-foreground mb-6">
                We couldn't process your payment. This could be due to insufficient funds, 
                an incorrect card number, or a temporary issue with your bank.
              </p>
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setStep("payment")}
                  data-testid="button-try-again"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setStep("plan")}
                >
                  Change Plan
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Need help? Contact support@nexus.com
              </p>
            </CardContent>
          </Card>
        </div>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout showFloatingCTA={false}>
      <div className="py-12 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-12">
            {["plan", "details", "payment"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : ["plan", "details", "payment"].indexOf(step) > i
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {["plan", "details", "payment"].indexOf(step) > i ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 sm:w-24 h-0.5 mx-2 ${
                      ["plan", "details", "payment"].indexOf(step) > i
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === "plan" && (
                <Card data-testid="checkout-step-plan">
                  <CardHeader>
                    <CardTitle>Choose Your Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={formData.plan}
                      onValueChange={(v) => handleInputChange("plan", v)}
                      className="space-y-4"
                    >
                      {pricingPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`relative flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                            formData.plan === plan.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-muted-foreground/50"
                          }`}
                          onClick={() => handleInputChange("plan", plan.id)}
                        >
                          <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                          <div className="ml-4 flex-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={plan.id} className="font-semibold cursor-pointer">
                                {plan.name}
                              </Label>
                              {plan.popular && (
                                <Badge variant="secondary" className="text-xs">Popular</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {plan.description}
                            </p>
                            <p className="text-lg font-semibold mt-2">
                              ${formData.billing === "annual"
                                ? Math.round(plan.annualPrice / 12)
                                : plan.monthlyPrice}
                              /user/mo
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>

                    <Separator />

                    <div>
                      <Label className="mb-4 block">Billing Cycle</Label>
                      <RadioGroup
                        value={formData.billing}
                        onValueChange={(v) => handleInputChange("billing", v as "monthly" | "annual")}
                        className="flex gap-4"
                      >
                        <div
                          className={`flex-1 p-4 rounded-lg border cursor-pointer ${
                            formData.billing === "monthly"
                              ? "border-primary bg-primary/5"
                              : ""
                          }`}
                          onClick={() => handleInputChange("billing", "monthly")}
                        >
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly" className="ml-2 cursor-pointer">
                            Monthly
                          </Label>
                        </div>
                        <div
                          className={`flex-1 p-4 rounded-lg border cursor-pointer ${
                            formData.billing === "annual"
                              ? "border-primary bg-primary/5"
                              : ""
                          }`}
                          onClick={() => handleInputChange("billing", "annual")}
                        >
                          <RadioGroupItem value="annual" id="annual" />
                          <Label htmlFor="annual" className="ml-2 cursor-pointer">
                            Annual
                            <Badge variant="secondary" className="ml-2">Save 17%</Badge>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => setStep("details")}
                      data-testid="button-continue-details"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === "details" && (
                <Card data-testid="checkout-step-details">
                  <CardHeader>
                    <CardTitle>Your Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          placeholder="John"
                          className="mt-1"
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          placeholder="Doe"
                          className="mt-1"
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@company.com"
                        className="mt-1"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Acme Inc"
                        className="mt-1"
                        data-testid="input-company"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setStep("plan")}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1"
                        onClick={() => setStep("payment")}
                        disabled={!formData.firstName || !formData.lastName || !formData.email}
                        data-testid="button-continue-payment"
                      >
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "payment" && (
                <Card data-testid="checkout-step-payment">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Your card won't be charged today</p>
                        <p className="text-muted-foreground">
                          You'll only be charged after your 14-day free trial ends. 
                          Cancel anytime before then at no cost.
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative mt-1">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="pl-10"
                          data-testid="input-card-number"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input
                          id="expiry"
                          value={formData.expiry}
                          onChange={(e) => handleInputChange("expiry", e.target.value)}
                          placeholder="MM/YY"
                          className="mt-1"
                          data-testid="input-expiry"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          value={formData.cvc}
                          onChange={(e) => handleInputChange("cvc", e.target.value)}
                          placeholder="123"
                          className="mt-1"
                          data-testid="input-cvc"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(v) => handleInputChange("agreeTerms", v as boolean)}
                        data-testid="checkbox-terms"
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary underline">
                          Privacy Policy
                        </Link>
                        . I understand I can cancel anytime.
                      </Label>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setStep("details")}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1"
                        onClick={handleSubmit}
                        disabled={!formData.cardNumber || !formData.expiry || !formData.cvc || !formData.agreeTerms || isProcessing}
                        data-testid="button-start-trial"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Start Free Trial
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-24" data-testid="checkout-summary">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{selectedPlan?.name} Plan</span>
                    <span className="font-semibold">${price}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Billing</span>
                    <span className="capitalize">{formData.billing}</span>
                  </div>
                  {formData.billing === "annual" && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Annual discount</span>
                      <span>-17%</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Due today</span>
                    <span>$0.00</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your 14-day free trial starts today. You'll be charged ${price}/user/mo 
                    after the trial ends.
                  </p>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4 text-primary" />
                      <span>Secure SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span>SOC 2 Type II certified</span>
                    </div>
                  </div>

                  <div className="pt-4 text-xs text-muted-foreground">
                    <p className="mb-2">
                      <strong>Refund Policy:</strong> If you're not satisfied with Nexus, 
                      email us within 30 days for a full refund. No questions asked.
                    </p>
                    <p>
                      <strong>Data Privacy:</strong> We never sell your data. Your information 
                      is encrypted and protected by industry-leading security measures.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
