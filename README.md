# Nexus CRM - SaaS Landing & Marketing Site

A production-ready, conversion-optimized landing and marketing site for Nexus CRM. Built with modern web technologies focusing on SEO, accessibility, and conversion rate optimization.

## Quick Start

### Prerequisites
- Node.js 18+ or compatible runtime
- Package manager (npm, yarn, pnpm, or bun)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5000`

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── marketing/     # Marketing-specific components
│   │   │   │   ├── MarketingLayout.tsx
│   │   │   │   └── ExitIntentModal.tsx
│   │   │   └── ui/            # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Landing.tsx    # Homepage
│   │   │   ├── Features.tsx   # Product features
│   │   │   ├── Pricing.tsx    # Pricing tiers
│   │   │   ├── Checkout.tsx   # Checkout flow
│   │   │   ├── Resources.tsx  # Blog/resources
│   │   │   ├── GeoLanding.tsx # Geo-targeted pages
│   │   │   └── SEOAudit.tsx   # Audit dashboard
│   │   └── lib/
│   │       └── marketingData.ts # Marketing content
│   └── index.html             # SEO-optimized HTML with structured data
├── public/
│   ├── sitemap.xml            # XML sitemap
│   └── robots.txt             # Crawler directives
├── reports/
│   └── SEO-Humanise-Report.md # SEO & content analysis
└── docs/
    └── *.md                   # Project documentation
```

## Features

### Pages
- **Landing Page** (`/`) - Hero, benefits, features, testimonials, pricing preview, FAQ
- **Features Page** (`/features`) - Detailed feature descriptions with A/B copy variants
- **Pricing Page** (`/pricing`) - Pricing tiers, feature comparison, billing toggle
- **Checkout Flow** (`/checkout`) - Multi-step checkout with success/failure states
- **Resources** (`/resources`) - Blog skeleton, webinars, newsletter signup
- **Geo Landing Pages** (`/us`, `/uk`, `/in`) - Localized content per region
- **SEO Audit** (`/audit`) - Accessibility and SEO audit dashboard

### CRO Features
- Sticky header CTA
- Floating action button (appears on scroll)
- Exit-intent newsletter modal
- Scarcity messaging on pricing
- Trust badges throughout checkout
- 30-day money-back guarantee messaging

### SEO & Technical
- Semantic HTML5 structure
- JSON-LD structured data (WebSite, Organization, Product, FAQPage, BreadcrumbList)
- Open Graph & Twitter Card meta tags
- Canonical URLs
- Hreflang tags for international targeting
- XML sitemap
- Robots.txt configuration
- Mobile-first responsive design
- Light/Dark theme support

### Accessibility (WCAG 2.1 AA)
- Proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation
- Focus indicators
- Color contrast compliance
- Screen reader friendly

## Geo-Targeted Pages

View localized landing pages at:
- `/us` - United States (USD pricing, US phone/address)
- `/uk` - United Kingdom (GBP pricing, UK phone/address)
- `/in` - India (INR pricing, India phone/address)

Each page includes LocalBusiness schema and region-specific content.

## Theme Switching

Toggle between light and dark themes using the theme button in the header. The preference persists across sessions.

## Testing

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y
```

## Deployment

### On Replit
1. Click the "Deploy" button in Replit
2. Configure domain (optional)
3. Deploy

### Other Platforms
1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting (Vercel, Netlify, Cloudflare Pages)
3. Configure environment variables if needed

## Environment Variables

No environment variables are required for the marketing site. For the full CRM application:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

## Performance Targets

- **Performance**: 90+
- **Accessibility**: 98+
- **Best Practices**: 95+
- **SEO**: 100

Run Lighthouse in Chrome DevTools to verify scores.

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

Proprietary - All rights reserved.
