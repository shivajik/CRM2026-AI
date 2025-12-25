import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { setToken, setRefreshToken, setUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Zap, Shield, Users, Building2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const response = await authApi.login(formData.email, formData.password);
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
      
      toast({
        title: "Welcome back!",
        description: `Good to see you again, ${response.user.firstName}!`,
      });
      
      setLocation("/app");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, "password123");
      setToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
      toast({
        title: "Quick login successful!",
        description: `Logged in as ${response.user.firstName} (${response.user.userType})`,
      });
      setLocation("/app");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "User not found. Please run database seed first.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const devUsers = [
    { email: "superadmin@nexuscrm.com", label: "Super Admin", icon: Shield, color: "bg-red-500" },
    { email: "admin@acme.com", label: "Agency Admin", icon: Building2, color: "bg-blue-500" },
    { email: "sarah@acme.com", label: "Team Member", icon: Users, color: "bg-green-500" },
    { email: "customer@techstart.com", label: "Customer", icon: Zap, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform">
              <span className="text-white text-3xl font-bold">N</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-base">
            Sign in to continue to Nexus CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
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
                className={`h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                data-testid="input-email"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Password
                </Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`h-11 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Enter your password"
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
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium group" 
              disabled={isLoading} 
              data-testid="button-login"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold" data-testid="link-register">
              Create one now
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Start your 14-day free trial</span>
          </div>
        </CardFooter>
      </Card>

      {/* DEV ONLY: Quick Login Buttons - Remove before production */}
      <Card className="w-full max-w-md mt-4 shadow-lg border-dashed border-2 border-orange-300 dark:border-orange-700 backdrop-blur-sm relative z-10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Zap className="h-4 w-4" />
            Quick Login (Dev Only)
          </CardTitle>
          <CardDescription className="text-xs">
            Click to login instantly. Password: password123
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {devUsers.map((user) => (
              <Button
                key={user.email}
                variant="outline"
                size="sm"
                onClick={() => quickLogin(user.email)}
                disabled={isLoading}
                className="h-auto py-2 px-3 flex flex-col items-start gap-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                data-testid={`quick-login-${user.label.toLowerCase().replace(' ', '-')}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`p-1 rounded ${user.color}`}>
                    <user.icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium text-xs">{user.label}</span>
                </div>
                <span className="text-[10px] text-muted-foreground truncate w-full text-left">
                  {user.email}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
