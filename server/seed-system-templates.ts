import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedSystemTemplates() {
  console.log("Seeding system proposal templates...\n");

  try {
    const existingSystemTemplates = await db.select().from(schema.proposalTemplates)
      .where(eq(schema.proposalTemplates.isSystemTemplate, true))
      .limit(1);
    
    if (existingSystemTemplates.length > 0) {
      console.log("System proposal templates already exist. Skipping seed.");
      return;
    }

    const proposalTemplatesData = [
      {
        name: "Web Design Proposal",
        description: "Professional template for web design and development projects",
        purpose: "web_design",
        isDefault: true,
        sections: [
          { sectionType: "cover", title: "Cover Page", content: "<h1>{{proposal.title}}</h1><p>Prepared for: {{client.name}}</p><p>Date: {{proposal.date}}</p><p>Prepared by: {{agency.name}}</p>", sortOrder: 1, isLocked: true },
          { sectionType: "introduction", title: "Introduction", content: "<h2>Introduction</h2><p>Thank you for considering {{agency.name}} for your web design project. We are excited about the opportunity to help bring your vision to life.</p><p>This proposal outlines our approach to creating a modern, responsive, and user-friendly website that will effectively represent your brand and engage your target audience.</p>", sortOrder: 2 },
          { sectionType: "about_us", title: "About Us", content: "<h2>About {{agency.name}}</h2><p>We are a full-service digital agency specializing in creating stunning websites and digital experiences. With years of experience in web design and development, we bring creativity, technical expertise, and strategic thinking to every project.</p><p>Our team of designers, developers, and strategists work together to deliver results that exceed expectations.</p>", sortOrder: 3 },
          { sectionType: "scope_of_work", title: "Scope of Work", content: "<h2>Scope of Work</h2><h3>Discovery & Planning</h3><ul><li>Requirements gathering and analysis</li><li>Competitor and market research</li><li>Site architecture and wireframing</li></ul><h3>Design</h3><ul><li>Custom UI/UX design</li><li>Responsive design for all devices</li><li>Brand integration and visual identity</li></ul><h3>Development</h3><ul><li>Front-end development</li><li>Content management system integration</li><li>Cross-browser compatibility testing</li></ul><h3>Launch & Support</h3><ul><li>Quality assurance and testing</li><li>Website launch and deployment</li><li>Training and documentation</li></ul>", sortOrder: 4 },
          { sectionType: "deliverables", title: "Deliverables", content: "<h2>Deliverables</h2><ul><li>Fully responsive custom website</li><li>Content Management System (CMS)</li><li>SEO-optimized pages</li><li>Contact forms and integrations</li><li>Training documentation</li><li>30 days post-launch support</li></ul>", sortOrder: 5 },
          { sectionType: "timeline", title: "Project Timeline", content: "<h2>Project Timeline</h2><table><tr><th>Phase</th><th>Duration</th></tr><tr><td>Discovery & Planning</td><td>1-2 Weeks</td></tr><tr><td>Design</td><td>2-3 Weeks</td></tr><tr><td>Development</td><td>3-4 Weeks</td></tr><tr><td>Testing & Launch</td><td>1 Week</td></tr></table><p><strong>Estimated Total: 7-10 Weeks</strong></p>", sortOrder: 6 },
          { sectionType: "pricing_table", title: "Investment", content: "<h2>Investment</h2><p>Please see the detailed pricing breakdown below:</p>", sortOrder: 7 },
          { sectionType: "terms_conditions", title: "Terms & Conditions", content: "<h2>Terms & Conditions</h2><h3>Payment Terms</h3><p>50% deposit upon acceptance, 50% upon project completion.</p><h3>Revisions</h3><p>This proposal includes up to 2 rounds of design revisions. Additional revisions will be billed at our standard hourly rate.</p><h3>Ownership</h3><p>Upon full payment, all deliverables become the property of the client.</p><h3>Validity</h3><p>This proposal is valid for 30 days from the date of issue.</p>", sortOrder: 8 },
          { sectionType: "signature", title: "Acceptance", content: "<h2>Acceptance</h2><p>By signing below, you agree to the terms outlined in this proposal.</p><div class='signature-block'><p>Client Signature: _______________________</p><p>Date: _______________________</p></div>", sortOrder: 9, isLocked: true },
        ],
      },
      {
        name: "SEO Services Proposal",
        description: "Template for search engine optimization service proposals",
        purpose: "seo",
        isDefault: true,
        sections: [
          { sectionType: "cover", title: "Cover Page", content: "<h1>{{proposal.title}}</h1><p>SEO Strategy & Implementation</p><p>Prepared for: {{client.name}}</p><p>Date: {{proposal.date}}</p>", sortOrder: 1, isLocked: true },
          { sectionType: "introduction", title: "Introduction", content: "<h2>Introduction</h2><p>In today's digital landscape, search engine visibility is crucial for business success. This proposal outlines a comprehensive SEO strategy designed to improve your organic search rankings, drive qualified traffic, and increase conversions.</p>", sortOrder: 2 },
          { sectionType: "about_us", title: "Our SEO Expertise", content: "<h2>Our SEO Expertise</h2><p>{{agency.name}} has a proven track record of delivering measurable SEO results for businesses across various industries. Our data-driven approach combines technical expertise with creative content strategies to achieve sustainable organic growth.</p>", sortOrder: 3 },
          { sectionType: "scope_of_work", title: "SEO Strategy", content: "<h2>SEO Strategy</h2><h3>Technical SEO</h3><ul><li>Website audit and technical optimization</li><li>Site speed improvements</li><li>Mobile optimization</li><li>Schema markup implementation</li></ul><h3>On-Page SEO</h3><ul><li>Keyword research and mapping</li><li>Meta tags optimization</li><li>Content optimization</li><li>Internal linking strategy</li></ul><h3>Off-Page SEO</h3><ul><li>Backlink analysis and strategy</li><li>Link building campaigns</li><li>Local SEO optimization</li><li>Citation building</li></ul><h3>Content Strategy</h3><ul><li>Content gap analysis</li><li>Blog content creation</li><li>Landing page optimization</li></ul>", sortOrder: 4 },
          { sectionType: "deliverables", title: "Monthly Deliverables", content: "<h2>Monthly Deliverables</h2><ul><li>SEO audit and action plan (Month 1)</li><li>Keyword research report</li><li>Monthly performance reports</li><li>Technical SEO fixes</li><li>Content optimization</li><li>Link building activities</li><li>Monthly strategy calls</li></ul>", sortOrder: 5 },
          { sectionType: "timeline", title: "Expected Timeline", content: "<h2>Expected Timeline</h2><table><tr><th>Phase</th><th>Timeline</th><th>Focus</th></tr><tr><td>Foundation</td><td>Month 1-2</td><td>Technical fixes, on-page optimization</td></tr><tr><td>Growth</td><td>Month 3-4</td><td>Content creation, link building</td></tr><tr><td>Scale</td><td>Month 5-6</td><td>Scaling successful strategies</td></tr></table><p><strong>Note: SEO is a long-term strategy. Significant results typically appear within 4-6 months.</strong></p>", sortOrder: 6 },
          { sectionType: "pricing_table", title: "Investment", content: "<h2>Investment</h2><p>Monthly retainer pricing options:</p>", sortOrder: 7 },
          { sectionType: "terms_conditions", title: "Terms & Conditions", content: "<h2>Terms & Conditions</h2><h3>Contract Term</h3><p>Minimum 6-month commitment recommended for optimal results.</p><h3>Payment Terms</h3><p>Monthly invoicing, due within 15 days of invoice date.</p><h3>Reporting</h3><p>Monthly reports delivered by the 5th of each month.</p>", sortOrder: 8 },
          { sectionType: "signature", title: "Acceptance", content: "<h2>Ready to Get Started?</h2><p>Accept this proposal to begin improving your search visibility.</p>", sortOrder: 9, isLocked: true },
        ],
      },
      {
        name: "Website Maintenance Proposal",
        description: "Template for ongoing website maintenance and support services",
        purpose: "maintenance",
        isDefault: true,
        sections: [
          { sectionType: "cover", title: "Cover Page", content: "<h1>{{proposal.title}}</h1><p>Website Maintenance & Support Plan</p><p>Prepared for: {{client.name}}</p><p>Date: {{proposal.date}}</p>", sortOrder: 1, isLocked: true },
          { sectionType: "introduction", title: "Introduction", content: "<h2>Introduction</h2><p>Your website is a critical business asset that requires regular care and maintenance to ensure optimal performance, security, and user experience. This proposal outlines our comprehensive maintenance services designed to keep your website running smoothly.</p>", sortOrder: 2 },
          { sectionType: "scope_of_work", title: "Maintenance Services", content: "<h2>Maintenance Services</h2><h3>Security & Updates</h3><ul><li>Weekly security scans and malware monitoring</li><li>CMS and plugin updates</li><li>Security patches and vulnerability fixes</li><li>Daily automated backups</li></ul><h3>Performance Optimization</h3><ul><li>Monthly performance audits</li><li>Speed optimization</li><li>Database optimization</li><li>Uptime monitoring (99.9% guaranteed)</li></ul><h3>Content Updates</h3><ul><li>Text and image updates</li><li>New page creation</li><li>Blog post publishing</li><li>Minor design tweaks</li></ul><h3>Technical Support</h3><ul><li>Priority email/phone support</li><li>Bug fixes and troubleshooting</li><li>Third-party integration support</li></ul>", sortOrder: 3 },
          { sectionType: "deliverables", title: "What's Included", content: "<h2>What's Included</h2><ul><li>24/7 uptime monitoring</li><li>Daily automated backups</li><li>Weekly security scans</li><li>Monthly performance reports</li><li>Up to X hours of development time/month</li><li>Priority support response within 4 hours</li><li>Emergency support for critical issues</li></ul>", sortOrder: 4 },
          { sectionType: "pricing_table", title: "Maintenance Plans", content: "<h2>Maintenance Plans</h2><p>Choose the plan that best fits your needs:</p>", sortOrder: 5 },
          { sectionType: "terms_conditions", title: "Terms & Conditions", content: "<h2>Terms & Conditions</h2><h3>Contract Term</h3><p>12-month agreement with monthly billing. Cancel with 30 days notice after initial term.</p><h3>Rollover Hours</h3><p>Unused development hours do not roll over to the next month.</p><h3>Emergency Support</h3><p>Critical issues addressed within 2 hours, 24/7.</p><h3>Additional Work</h3><p>Work beyond included hours billed at our standard rate.</p>", sortOrder: 6 },
          { sectionType: "signature", title: "Acceptance", content: "<h2>Get Started</h2><p>Accept this proposal to ensure your website stays secure, fast, and up-to-date.</p>", sortOrder: 7, isLocked: true },
        ],
      },
      {
        name: "Branding & Identity Proposal",
        description: "Template for branding and visual identity projects",
        purpose: "branding",
        isDefault: true,
        sections: [
          { sectionType: "cover", title: "Cover Page", content: "<h1>{{proposal.title}}</h1><p>Brand Identity Development</p><p>Prepared for: {{client.name}}</p><p>Date: {{proposal.date}}</p>", sortOrder: 1, isLocked: true },
          { sectionType: "introduction", title: "Introduction", content: "<h2>Introduction</h2><p>A strong brand identity is the foundation of successful business communication. It's how your customers recognize you, remember you, and connect with you emotionally. This proposal outlines our approach to developing a compelling brand identity that will set you apart from the competition.</p>", sortOrder: 2 },
          { sectionType: "about_us", title: "Our Creative Approach", content: "<h2>Our Creative Approach</h2><p>At {{agency.name}}, we believe that great brands are built on deep understanding. Our process combines strategic thinking with creative excellence to develop brand identities that are not only visually stunning but also strategically sound.</p>", sortOrder: 3 },
          { sectionType: "scope_of_work", title: "Branding Process", content: "<h2>Branding Process</h2><h3>Phase 1: Discovery</h3><ul><li>Brand workshop and stakeholder interviews</li><li>Competitor analysis</li><li>Target audience research</li><li>Brand positioning development</li></ul><h3>Phase 2: Strategy</h3><ul><li>Brand strategy document</li><li>Brand personality and values</li><li>Messaging framework</li><li>Brand voice guidelines</li></ul><h3>Phase 3: Visual Identity</h3><ul><li>Logo design (3 concepts)</li><li>Color palette development</li><li>Typography selection</li><li>Visual elements and patterns</li></ul><h3>Phase 4: Brand Guidelines</h3><ul><li>Comprehensive brand guidelines</li><li>Usage rules and specifications</li><li>Application examples</li></ul>", sortOrder: 4 },
          { sectionType: "deliverables", title: "Deliverables", content: "<h2>Deliverables</h2><ul><li>Brand Strategy Document</li><li>Primary and secondary logo variations</li><li>Complete color palette with codes</li><li>Typography guidelines</li><li>Brand pattern/visual elements</li><li>Business card design</li><li>Letterhead and envelope design</li><li>Email signature design</li><li>Social media profile templates</li><li>Comprehensive Brand Guidelines (PDF)</li><li>All source files (AI, EPS, PNG, SVG)</li></ul>", sortOrder: 5 },
          { sectionType: "timeline", title: "Project Timeline", content: "<h2>Project Timeline</h2><table><tr><th>Phase</th><th>Duration</th></tr><tr><td>Discovery & Research</td><td>1-2 Weeks</td></tr><tr><td>Brand Strategy</td><td>1 Week</td></tr><tr><td>Visual Identity Design</td><td>2-3 Weeks</td></tr><tr><td>Refinement & Revisions</td><td>1 Week</td></tr><tr><td>Guidelines & Handoff</td><td>1 Week</td></tr></table><p><strong>Estimated Total: 6-8 Weeks</strong></p>", sortOrder: 6 },
          { sectionType: "pricing_table", title: "Investment", content: "<h2>Investment</h2>", sortOrder: 7 },
          { sectionType: "terms_conditions", title: "Terms & Conditions", content: "<h2>Terms & Conditions</h2><h3>Payment Terms</h3><p>50% deposit to begin, 50% upon completion.</p><h3>Revisions</h3><p>Includes 3 rounds of revisions at each major milestone.</p><h3>Ownership</h3><p>Full ownership and rights transfer upon final payment.</p><h3>Usage Rights</h3><p>We may use the work for portfolio purposes.</p>", sortOrder: 8 },
          { sectionType: "signature", title: "Acceptance", content: "<h2>Let's Build Your Brand</h2><p>Accept this proposal to begin your brand transformation journey.</p>", sortOrder: 9, isLocked: true },
        ],
      },
      {
        name: "Digital Marketing Proposal",
        description: "Comprehensive template for digital marketing services",
        purpose: "marketing",
        isDefault: true,
        sections: [
          { sectionType: "cover", title: "Cover Page", content: "<h1>{{proposal.title}}</h1><p>Digital Marketing Strategy & Implementation</p><p>Prepared for: {{client.name}}</p><p>Date: {{proposal.date}}</p>", sortOrder: 1, isLocked: true },
          { sectionType: "introduction", title: "Introduction", content: "<h2>Introduction</h2><p>Digital marketing is essential for business growth in today's connected world. This proposal presents a comprehensive digital marketing strategy designed to increase your online presence, generate qualified leads, and drive measurable business results.</p>", sortOrder: 2 },
          { sectionType: "about_us", title: "Our Digital Marketing Expertise", content: "<h2>Our Digital Marketing Expertise</h2><p>{{agency.name}} is a results-driven digital marketing agency with expertise across all major digital channels. We combine data-driven strategies with creative execution to deliver campaigns that connect with your audience and achieve your business objectives.</p>", sortOrder: 3 },
          { sectionType: "scope_of_work", title: "Marketing Services", content: "<h2>Marketing Services</h2><h3>Paid Advertising</h3><ul><li>Google Ads management</li><li>Social media advertising (Facebook, Instagram, LinkedIn)</li><li>Retargeting campaigns</li><li>A/B testing and optimization</li></ul><h3>Social Media Marketing</h3><ul><li>Social media strategy development</li><li>Content creation and scheduling</li><li>Community management</li><li>Influencer partnerships</li></ul><h3>Email Marketing</h3><ul><li>Email strategy and automation</li><li>Newsletter design and management</li><li>Drip campaigns</li><li>List segmentation</li></ul><h3>Analytics & Reporting</h3><ul><li>Campaign tracking and analytics</li><li>ROI measurement</li><li>Monthly performance reports</li><li>Strategy optimization</li></ul>", sortOrder: 4 },
          { sectionType: "deliverables", title: "Monthly Deliverables", content: "<h2>Monthly Deliverables</h2><ul><li>Campaign management across selected channels</li><li>Content calendar with X posts per week</li><li>Email newsletters (X per month)</li><li>Comprehensive monthly analytics report</li><li>Monthly strategy call</li><li>Ad spend management</li><li>Creative assets for campaigns</li></ul>", sortOrder: 5 },
          { sectionType: "timeline", title: "Getting Started", content: "<h2>Getting Started</h2><table><tr><th>Week</th><th>Activity</th></tr><tr><td>Week 1</td><td>Onboarding, access setup, audit</td></tr><tr><td>Week 2</td><td>Strategy development, campaign planning</td></tr><tr><td>Week 3</td><td>Campaign setup and creative development</td></tr><tr><td>Week 4</td><td>Campaign launch and optimization</td></tr></table><p><strong>Ongoing management begins after initial setup phase.</strong></p>", sortOrder: 6 },
          { sectionType: "pricing_table", title: "Investment", content: "<h2>Investment</h2><p>Management fee + recommended ad spend:</p>", sortOrder: 7 },
          { sectionType: "terms_conditions", title: "Terms & Conditions", content: "<h2>Terms & Conditions</h2><h3>Contract Term</h3><p>3-month minimum commitment recommended.</p><h3>Ad Spend</h3><p>Ad spend is billed separately and paid directly to platforms.</p><h3>Reporting</h3><p>Monthly reports delivered by the 10th of each month.</p><h3>Notice Period</h3><p>30 days notice required for cancellation.</p>", sortOrder: 8 },
          { sectionType: "signature", title: "Acceptance", content: "<h2>Ready to Grow?</h2><p>Accept this proposal to start growing your digital presence.</p>", sortOrder: 9, isLocked: true },
        ],
      },
      {
        name: "Consulting Proposal",
        description: "Professional template for consulting and advisory services",
        purpose: "consulting",
        isDefault: true,
        sections: [
          { sectionType: "cover", title: "Cover Page", content: "<h1>{{proposal.title}}</h1><p>Strategic Consulting Services</p><p>Prepared for: {{client.name}}</p><p>Date: {{proposal.date}}</p>", sortOrder: 1, isLocked: true },
          { sectionType: "introduction", title: "Executive Summary", content: "<h2>Executive Summary</h2><p>This proposal outlines our consulting engagement to address the strategic challenges and opportunities facing your organization. Our approach combines industry expertise with practical solutions to deliver measurable business outcomes.</p>", sortOrder: 2 },
          { sectionType: "about_us", title: "About Our Practice", content: "<h2>About Our Practice</h2><p>{{agency.name}} brings decades of combined experience in strategic consulting across multiple industries. Our consultants have worked with organizations of all sizes, from startups to Fortune 500 companies, delivering transformative results.</p>", sortOrder: 3 },
          { sectionType: "scope_of_work", title: "Engagement Scope", content: "<h2>Engagement Scope</h2><h3>Phase 1: Assessment</h3><ul><li>Current state analysis</li><li>Stakeholder interviews</li><li>Process mapping</li><li>Gap analysis</li></ul><h3>Phase 2: Strategy Development</h3><ul><li>Strategic options identification</li><li>Feasibility analysis</li><li>Recommendation development</li><li>Roadmap creation</li></ul><h3>Phase 3: Implementation Support</h3><ul><li>Change management planning</li><li>Implementation guidance</li><li>Progress monitoring</li><li>Course corrections</li></ul>", sortOrder: 4 },
          { sectionType: "deliverables", title: "Deliverables", content: "<h2>Deliverables</h2><ul><li>Current State Assessment Report</li><li>Strategic Recommendations Document</li><li>Implementation Roadmap</li><li>Executive Presentations</li><li>Weekly Progress Updates</li><li>Final Summary Report</li></ul>", sortOrder: 5 },
          { sectionType: "timeline", title: "Engagement Timeline", content: "<h2>Engagement Timeline</h2><table><tr><th>Phase</th><th>Duration</th><th>Key Milestones</th></tr><tr><td>Assessment</td><td>2-3 Weeks</td><td>Assessment Report</td></tr><tr><td>Strategy</td><td>3-4 Weeks</td><td>Recommendations & Roadmap</td></tr><tr><td>Implementation</td><td>As required</td><td>Ongoing support</td></tr></table>", sortOrder: 6 },
          { sectionType: "pricing_table", title: "Investment", content: "<h2>Investment</h2><p>Consulting fees based on engagement scope:</p>", sortOrder: 7 },
          { sectionType: "terms_conditions", title: "Terms & Conditions", content: "<h2>Terms & Conditions</h2><h3>Engagement Structure</h3><p>Project-based or retainer arrangements available.</p><h3>Payment Terms</h3><p>Monthly invoicing for retainer engagements; milestone-based for projects.</p><h3>Confidentiality</h3><p>All information shared is treated as strictly confidential.</p><h3>Travel Expenses</h3><p>Travel expenses billed at cost with prior approval.</p>", sortOrder: 8 },
          { sectionType: "signature", title: "Acceptance", content: "<h2>Next Steps</h2><p>Accept this proposal to begin our consulting engagement.</p>", sortOrder: 9, isLocked: true },
        ],
      },
    ];

    for (const templateData of proposalTemplatesData) {
      const { sections, ...templateInfo } = templateData;
      
      const [template] = await db.insert(schema.proposalTemplates).values({
        ...templateInfo,
        tenantId: null,
        createdBy: null,
        isSystemTemplate: true,
      }).returning();

      await db.insert(schema.templateSections).values(
        sections.map(section => ({
          ...section,
          templateId: template.id,
          isLocked: section.isLocked || false,
          isVisible: true,
        }))
      );
      
      console.log(`Created system template: ${templateInfo.name}`);
    }

    console.log(`\nSuccessfully created ${proposalTemplatesData.length} system proposal templates!`);
    console.log("These templates are now available to all users.");

  } catch (error) {
    console.error("Error seeding system templates:", error);
    throw error;
  }
}

seedSystemTemplates().then(() => process.exit(0)).catch(() => process.exit(1));
