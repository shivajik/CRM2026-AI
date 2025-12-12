export const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "VP of Sales",
    company: "TechFlow Inc",
    avatar: "SC",
    quote: "We switched to Nexus last quarter and our close rate jumped 34%. The pipeline visibility alone was worth it - I finally know where every deal stands without chasing my team for updates.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Founder",
    company: "GrowthStack",
    avatar: "MJ",
    quote: "I've tried five different CRMs over the years. Nexus is the first one my team actually uses daily. Setup took 20 minutes and we were productive from day one.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Sales Director",
    company: "CloudScale",
    avatar: "ER",
    quote: "The automation features saved us roughly 15 hours per week on manual data entry. Now my reps spend that time talking to prospects instead of updating spreadsheets.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Park",
    role: "CEO",
    company: "Innovate Labs",
    avatar: "DP",
    quote: "Best decision we made this year. Revenue grew 28% and I can directly trace it back to the insights Nexus gives us about our sales process.",
    rating: 5,
  },
];

export const features = [
  {
    id: "pipeline",
    title: "Visual Pipeline Management",
    shortDescription: "Drag-and-drop deals through your sales stages.",
    longDescription: "See your entire sales pipeline at a glance with our intuitive kanban-style board. Drag deals between stages, set custom pipelines for different products, and never lose track of an opportunity again. Most teams report finding 'forgotten' deals worth $50k+ within their first week.",
    icon: "Kanban",
  },
  {
    id: "automation",
    title: "Smart Automation",
    shortDescription: "Automate repetitive tasks and focus on selling.",
    longDescription: "Set up automated workflows that handle the busywork - follow-up reminders, task assignments, email sequences, and data updates. Our customers save an average of 12 hours per rep each week. That's time better spent building relationships.",
    icon: "Zap",
  },
  {
    id: "analytics",
    title: "Revenue Analytics",
    shortDescription: "Real-time insights into your sales performance.",
    longDescription: "Track metrics that matter: conversion rates, average deal size, sales velocity, and team performance. Our dashboards update in real-time so you can make decisions based on current data, not last month's numbers.",
    icon: "BarChart",
  },
  {
    id: "contacts",
    title: "Contact Intelligence",
    shortDescription: "Everything you need to know about your prospects.",
    longDescription: "Every email, call, and meeting automatically logged. See the complete history of any contact in seconds. Our enrichment features pull in company data, social profiles, and recent news so you always walk into calls prepared.",
    icon: "Users",
  },
  {
    id: "integrations",
    title: "Seamless Integrations",
    shortDescription: "Connect with 200+ tools you already use.",
    longDescription: "Sync with your email, calendar, Slack, and the rest of your tech stack. Two-way sync means data flows automatically - no more copying and pasting between apps. Setup takes minutes, not days.",
    icon: "Puzzle",
  },
  {
    id: "mobile",
    title: "Mobile CRM",
    shortDescription: "Full functionality on any device.",
    longDescription: "Access your CRM from anywhere with our mobile apps. Update deals on the go, prep for meetings during your commute, and get notifications when prospects engage. Your data stays synced across all devices.",
    icon: "Smartphone",
  },
];

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small teams just getting started",
    monthlyPrice: 29,
    annualPrice: 290,
    features: [
      "Up to 5 team members",
      "1,000 contacts",
      "Basic pipeline management",
      "Email integration",
      "Mobile app access",
      "Email support",
    ],
    notIncluded: [
      "Advanced automation",
      "Custom reports",
      "API access",
      "Priority support",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing teams that need more power",
    monthlyPrice: 79,
    annualPrice: 790,
    features: [
      "Up to 25 team members",
      "10,000 contacts",
      "Advanced pipeline & forecasting",
      "Smart automation",
      "Custom reports & dashboards",
      "API access",
      "Priority email support",
      "Onboarding assistance",
    ],
    notIncluded: [
      "Dedicated account manager",
      "Custom integrations",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    monthlyPrice: 199,
    annualPrice: 1990,
    features: [
      "Unlimited team members",
      "Unlimited contacts",
      "Everything in Professional",
      "Custom integrations",
      "Advanced security & SSO",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom training",
      "SLA guarantees",
    ],
    notIncluded: [],
    popular: false,
    cta: "Contact Sales",
  },
];

export const faqs = [
  {
    question: "How long is the free trial?",
    answer: "You get 14 days to try Nexus with full access to all Professional features. No credit card required to start. If you decide it's not for you, simply don't subscribe - your data will be automatically deleted after 30 days.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Absolutely. Upgrade or downgrade anytime from your account settings. When you upgrade, you get immediate access to new features. Downgrades take effect at the end of your billing cycle so you keep access to everything you've paid for.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "Your data belongs to you. When you cancel, you can export everything - contacts, deals, activities, the works - in standard formats like CSV. We keep your data for 30 days after cancellation in case you change your mind.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes. We offer a full refund within the first 30 days if Nexus isn't right for you. No hoops to jump through - just email us and we'll process it within 48 hours. We believe in earning your business, not trapping you.",
  },
  {
    question: "How secure is my data?",
    answer: "Very. We use bank-level encryption (AES-256) for data at rest and TLS 1.3 for data in transit. We're SOC 2 Type II certified, GDPR compliant, and undergo regular third-party security audits. Your customer data is your competitive advantage - we treat it that way.",
  },
  {
    question: "Can I import data from my current CRM?",
    answer: "Yes, we support imports from Salesforce, HubSpot, Pipedrive, and most other CRMs. Our migration specialists can also help with custom imports at no extra charge for Professional and Enterprise plans. Most migrations complete in under an hour.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "Starter plans get email support with 24-hour response times. Professional plans include priority email with 4-hour responses during business hours. Enterprise plans get 24/7 phone support and a dedicated account manager who knows your business.",
  },
  {
    question: "Do you offer discounts for nonprofits?",
    answer: "Yes! Registered nonprofits get 50% off any plan. Just send us proof of your nonprofit status after signing up and we'll apply the discount. We also offer special pricing for startups and educational institutions.",
  },
];

export const trustBadges = [
  { name: "TechFlow Inc", logo: "TF" },
  { name: "GrowthStack", logo: "GS" },
  { name: "CloudScale", logo: "CS" },
  { name: "Innovate Labs", logo: "IL" },
  { name: "DataDrive", logo: "DD" },
];

export const stats = [
  { value: "10,000+", label: "Active Users" },
  { value: "2.5M+", label: "Deals Closed" },
  { value: "$4.2B", label: "Revenue Tracked" },
  { value: "99.9%", label: "Uptime" },
];

export const enterpriseIntegrations = [
  { name: "Salesforce", category: "CRM" },
  { name: "HubSpot", category: "Marketing" },
  { name: "Slack", category: "Communication" },
  { name: "Gmail", category: "Email" },
  { name: "Outlook", category: "Email" },
  { name: "Zoom", category: "Meetings" },
  { name: "Stripe", category: "Payments" },
  { name: "QuickBooks", category: "Accounting" },
  { name: "Zapier", category: "Automation" },
  { name: "Calendly", category: "Scheduling" },
  { name: "DocuSign", category: "Contracts" },
  { name: "Jira", category: "Project Management" },
];

export const securityFeatures = [
  {
    title: "SOC 2 Type II Certified",
    description: "Our security controls are independently audited and verified annually.",
    icon: "Shield",
  },
  {
    title: "GDPR Compliant",
    description: "Full data protection compliance with data residency options in EU, US, and APAC.",
    icon: "Globe",
  },
  {
    title: "Enterprise SSO",
    description: "Single sign-on integration with Okta, Azure AD, and SAML 2.0 providers.",
    icon: "Key",
  },
  {
    title: "256-bit AES Encryption",
    description: "Bank-grade encryption for all data at rest and in transit.",
    icon: "Lock",
  },
  {
    title: "Role-Based Access Control",
    description: "Granular permissions to control exactly who can see and do what.",
    icon: "Users",
  },
  {
    title: "Audit Logs",
    description: "Complete audit trail of all user actions for compliance and security.",
    icon: "FileSearch",
  },
];

export const enterpriseCustomers = [
  { name: "Fortune 500 Company", logo: "F500", industry: "Technology" },
  { name: "Global Bank", logo: "GB", industry: "Finance" },
  { name: "Healthcare Leader", logo: "HL", industry: "Healthcare" },
  { name: "Retail Giant", logo: "RG", industry: "Retail" },
  { name: "Manufacturing Corp", logo: "MC", industry: "Manufacturing" },
  { name: "Consulting Firm", logo: "CF", industry: "Professional Services" },
];

export const blogPosts = [
  {
    id: 1,
    slug: "sales-automation-guide",
    title: "The Complete Guide to Sales Automation in 2024",
    excerpt: "Learn how top-performing sales teams use automation to close more deals while spending less time on admin work.",
    category: "Sales Tips",
    author: "Sarah Chen",
    date: "2024-12-01",
    readTime: "8 min read",
  },
  {
    id: 2,
    slug: "crm-implementation-checklist",
    title: "CRM Implementation Checklist: 15 Steps to Success",
    excerpt: "A practical, step-by-step guide to rolling out a new CRM without disrupting your sales team.",
    category: "Product",
    author: "Marcus Johnson",
    date: "2024-11-28",
    readTime: "12 min read",
  },
  {
    id: 3,
    slug: "pipeline-management-tips",
    title: "7 Pipeline Management Mistakes That Kill Deals",
    excerpt: "Common pitfalls that cause deals to stall or die - and how to avoid them in your sales process.",
    category: "Best Practices",
    author: "Elena Rodriguez",
    date: "2024-11-25",
    readTime: "6 min read",
  },
  {
    id: 4,
    slug: "sales-metrics-that-matter",
    title: "The Only 5 Sales Metrics You Actually Need to Track",
    excerpt: "Cut through the noise and focus on the numbers that actually predict revenue.",
    category: "Analytics",
    author: "David Park",
    date: "2024-11-20",
    readTime: "5 min read",
  },
];

export const geoContent = {
  us: {
    region: "US",
    currency: "$",
    phone: "+1 (555) 123-4567",
    address: "123 Market Street, San Francisco, CA 94102",
    headline: "The CRM Built for American Sales Teams",
    subheadline: "Join 5,000+ US companies that trust Nexus to grow their revenue",
    priceModifier: 1,
  },
  uk: {
    region: "UK",
    currency: "£",
    phone: "+44 20 7123 4567",
    address: "10 Finsbury Square, London EC2A 1AF",
    headline: "The CRM Built for British Sales Teams",
    subheadline: "Join 2,000+ UK companies that trust Nexus to grow their revenue",
    priceModifier: 0.79,
  },
  in: {
    region: "IN",
    currency: "₹",
    phone: "+91 22 1234 5678",
    address: "Bandra Kurla Complex, Mumbai 400051",
    headline: "The CRM Built for Indian Sales Teams",
    subheadline: "Join 3,000+ Indian companies that trust Nexus to grow their revenue",
    priceModifier: 0.012,
  },
};

export const seoKeywords = {
  landing: {
    primary: ["CRM software", "sales CRM", "customer relationship management"],
    secondary: ["best CRM for small business", "sales pipeline management", "deal tracking software"],
  },
  features: {
    primary: ["CRM features", "sales automation", "contact management"],
    secondary: ["pipeline management software", "sales analytics", "CRM integrations"],
  },
  pricing: {
    primary: ["CRM pricing", "affordable CRM", "CRM cost"],
    secondary: ["CRM subscription", "enterprise CRM pricing", "small business CRM pricing"],
  },
};
