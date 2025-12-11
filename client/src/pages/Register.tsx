import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { setToken, setRefreshToken, setUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const features = [
  "Unlimited contacts & deals",
  "Quotations & invoicing",
  "Activity tracking",
  "Custom reports",
];

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      password: "",
    };
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const response = await authApi.register(formData);
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
      
      toast({
        title: "Account created!",
        description: `Welcome to Nexus CRM, ${response.user.firstName}! Let's get started.`,
      });
      
      setLocation("/app");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "" };
    if (password.length < 6) return { strength: 1, label: "Weak" };
    if (password.length < 8) return { strength: 2, label: "Fair" };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 4, label: "Strong" };
    }
    return { strength: 3, label: "Good" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="flex w-full max-w-4xl gap-8 relative z-10">
        <div className="hidden lg:flex flex-col justify-center w-1/2 pr-8">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white text-3xl font-bold">N</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Grow your business with Nexus CRM
              </h1>
              <p className="text-lg text-muted-foreground">
                The all-in-one platform to manage customers, deals, quotations, and invoices.
              </p>
            </div>
            <div className="space-y-3 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-4 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>14-day free trial. No credit card required.</span>
            </div>
          </div>
        </div>

        <Card className="w-full lg:w-1/2 shadow-2xl border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-center mb-4 lg:hidden">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-white text-2xl font-bold">N</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center lg:text-left">Create your account</CardTitle>
            <CardDescription className="text-center lg:text-left">
              Start your 14-day free trial today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="flex items-center gap-1.5 text-sm">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value });
                      if (errors.firstName) setErrors({ ...errors, firstName: "" });
                    }}
                    className={`h-10 ${errors.firstName ? "border-destructive" : ""}`}
                    data-testid="input-firstname"
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({ ...formData, lastName: e.target.value });
                      if (errors.lastName) setErrors({ ...errors, lastName: "" });
                    }}
                    className={`h-10 ${errors.lastName ? "border-destructive" : ""}`}
                    data-testid="input-lastname"
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="flex items-center gap-1.5 text-sm">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  placeholder="Acme Inc."
                  value={formData.companyName}
                  onChange={(e) => {
                    setFormData({ ...formData, companyName: e.target.value });
                    if (errors.companyName) setErrors({ ...errors, companyName: "" });
                  }}
                  className={`h-10 ${errors.companyName ? "border-destructive" : ""}`}
                  data-testid="input-company"
                />
                {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-sm">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Work Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`h-10 ${errors.email ? "border-destructive" : ""}`}
                  data-testid="input-email"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="flex items-center gap-1.5 text-sm">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    className={`h-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.strength
                              ? passwordStrength.strength <= 1
                                ? "bg-red-500"
                                : passwordStrength.strength <= 2
                                ? "bg-orange-500"
                                : passwordStrength.strength <= 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium group mt-2" 
                disabled={isLoading} 
                data-testid="button-register"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground pt-2">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-0">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold" data-testid="link-login">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
