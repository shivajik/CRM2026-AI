# Assumptions

This document lists assumptions made during development of the Nexus CRM marketing site.

## Content & Media

### Placeholder Content
- **Company Logos**: Trust badges display placeholder initials (TF, GS, CS, etc.) instead of actual company logos
- **Testimonials**: Customer quotes are sample content representing typical testimonial structure
- **Product Video**: Video section contains a placeholder with play button - no actual video file
- **Blog Posts**: Resources page contains sample blog post data with realistic titles and excerpts
- **Avatar Images**: Customer avatars show initials instead of actual photos

### Imagery
- **Hero Images**: Using gradient backgrounds instead of stock photos
- **Feature Screenshots**: Displaying icon placeholders instead of actual product screenshots
- **OG Images**: Using Replit's default OpenGraph image

## Pricing & Business

### Pricing Structure
- Starter: $29/user/month
- Professional: $79/user/month
- Enterprise: $199/user/month
- Annual discount: 17% (approximately 2 months free)

### Geographic Pricing
- UK prices: ~79% of USD (approximate GBP conversion)
- India prices: ~1.2% of USD (approximate INR conversion)
- These are illustrative and would need actual market research

### Payment
- Checkout flow is simulated (no real payment processing)
- Credit card form accepts any valid-format input
- Success/failure randomly assigned for demo purposes

## Technical

### URLs & Domains
- Primary domain assumed: `nexus.com`
- Geo-specific URLs: `/us`, `/uk`, `/in`
- All canonical and hreflang URLs reference `nexus.com`

### Third-Party Services
- No actual analytics tracking implemented
- No real email capture (newsletter forms are non-functional)
- Social media links point to generic platform URLs

### Phone Numbers
- US: +1 (555) 123-4567 (placeholder)
- UK: +44 20 7123 4567 (placeholder)
- India: +91 22 1234 5678 (placeholder)

### Addresses
- US: 123 Market Street, San Francisco, CA 94102
- UK: 10 Finsbury Square, London EC2A 1AF
- India: Bandra Kurla Complex, Mumbai 400051

## SEO & Performance

### Lighthouse Scores
- Scores shown on audit page are mock/target values
- Actual scores may vary based on deployment environment
- Run Lighthouse locally for accurate measurements

### Sitemap
- Static XML sitemap with hardcoded dates
- Production would need dynamic generation

## Integrations

### Listed Integrations
- 200+ integrations mentioned but only 12 displayed as examples
- Integration logos are not actual brand assets
- No actual integration functionality implemented

## User Accounts

### Authentication
- Marketing pages are public (no authentication required)
- Login/Register paths exist for the CRM application
- No actual user database for marketing site

## Compliance

### Legal Pages
- Privacy Policy, Terms of Service links exist but pages are not implemented
- GDPR, SOC 2, security claims are aspirational/marketing
- Cookie consent banner not implemented

## Mobile Experience

### Responsive Design
- Tested at common breakpoints (320px, 768px, 1024px, 1440px)
- Mobile menu uses slide-out drawer
- Touch targets meet minimum 44x44px guideline

## Copy & Content

### Humanization
- Copy written with contractions, varied sentence length
- Includes micro-anecdotes where appropriate
- Avoids common AI writing patterns
- Target Humanise score: 60+

## Multi-Workspace Feature (Production-Impacting)

### Feature Flag Control
- All multi-workspace functionality is gated behind `multi_workspace_enabled` feature flag
- Default state: **OFF** - ensures no impact on existing users
- Per-tenant override available for gradual rollout

### Data Isolation
- Workspace data remains isolated by tenantId
- Users can only access workspaces they are explicitly members of
- Cross-workspace data access is not permitted

### Backward Compatibility
- When feature flag is OFF, system behaves exactly as before
- No changes to JWT payload structure when flag is OFF
- All existing API endpoints maintain their current behavior

### Database Changes
- All schema changes are additive (new tables only)
- No existing columns are modified or renamed
- Rollback does not require data migration

### User Experience
- Workspace switcher UI is hidden when flag is OFF
- Existing single-tenant users see no UI changes
- Invitation links work for both new and existing users

### Security Considerations
- Only SaaS admins can enable/disable feature flags
- Workspace role-based access control (owner, admin, member, viewer)
- Invitation tokens are cryptographically random and expire after 7 days

### Sign-Off Required
The following assumptions require explicit sign-off before production rollout:
- [ ] Feature flag default is OFF
- [ ] No destructive database migrations
- [ ] Backward compatibility verified
- [ ] Rollback procedure tested
