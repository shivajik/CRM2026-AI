import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Moon, Sun, ArrowRight } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
];

export function MarketingHeader() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">N</span>
            </div>
            <span className="font-heading font-bold text-xl">Nexus</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" data-testid="nav-desktop">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login">
                Sign In
              </Button>
            </Link>
            <Link href="/checkout">
              <Button data-testid="button-cta-header">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <div className="flex flex-col gap-6 mt-6">
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium py-2"
                      data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 pt-4 border-t">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => setIsDark(!isDark)}
                >
                  {isDark ? (
                    <>
                      <Sun className="h-5 w-5 mr-2" /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-2" /> Dark Mode
                    </>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Integrations", href: "/features#integrations" },
      { label: "Changelog", href: "/resources#changelog" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/resources" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: "Help Center", href: "/help" },
      { label: "API Reference", href: "/api" },
      { label: "Status", href: "/status" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "GDPR", href: "/gdpr" },
    ],
  };

  return (
    <footer className="bg-muted/50 border-t" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="font-heading font-bold text-xl">Nexus</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              The modern CRM that helps teams close more deals, faster. Built for 
              businesses that care about their customers.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Nexus CRM. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground">
                SOC 2 Type II Certified
              </span>
              <span className="text-xs text-muted-foreground">GDPR Compliant</span>
              <span className="text-xs text-muted-foreground">
                99.9% Uptime SLA
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FloatingCTAProps {
  show?: boolean;
}

export function FloatingCTA({ show = true }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Link href="/checkout">
        <Button size="lg" className="shadow-lg" data-testid="button-floating-cta">
          Start Free Trial
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

interface MarketingLayoutProps {
  children: React.ReactNode;
  showFloatingCTA?: boolean;
}

export function MarketingLayout({
  children,
  showFloatingCTA = true,
}: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="pt-16 lg:pt-20">{children}</main>
      <MarketingFooter />
      <FloatingCTA show={showFloatingCTA} />
    </div>
  );
}
