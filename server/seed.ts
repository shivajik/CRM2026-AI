import { db } from "./db";
import * as schema from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database with sample data...\n");

  try {
    const existingTenant = await db.select().from(schema.tenants).limit(1);
    if (existingTenant.length > 0) {
      console.log("Database already has data. Skipping seed.");
      return;
    }

    const [tenant] = await db.insert(schema.tenants).values({
      name: "Acme Corporation",
    }).returning();
    console.log("Created tenant:", tenant.name);

    const [adminRole] = await db.insert(schema.roles).values({
      name: "Admin",
      permissions: ["all"],
    }).returning();

    const [salesRole] = await db.insert(schema.roles).values({
      name: "Sales Representative",
      permissions: ["contacts:read", "contacts:write", "deals:read", "deals:write", "quotations:all", "invoices:read"],
    }).returning();
    console.log("Created roles: Admin, Sales Representative");

    const passwordHash = await bcrypt.hash("password123", 10);

    const [saasAdmin] = await db.insert(schema.users).values({
      tenantId: tenant.id,
      email: "superadmin@nexuscrm.com",
      passwordHash,
      firstName: "Super",
      lastName: "Admin",
      roleId: adminRole.id,
      userType: "saas_admin",
      isAdmin: true,
    }).returning();

    const [adminUser] = await db.insert(schema.users).values({
      tenantId: tenant.id,
      email: "admin@acme.com",
      passwordHash,
      firstName: "John",
      lastName: "Admin",
      roleId: adminRole.id,
      userType: "agency_admin",
      isAdmin: true,
    }).returning();

    const [salesUser] = await db.insert(schema.users).values({
      tenantId: tenant.id,
      email: "sarah@acme.com",
      passwordHash,
      firstName: "Sarah",
      lastName: "Sales",
      roleId: salesRole.id,
      userType: "team_member",
      isAdmin: false,
    }).returning();

    const [salesUser2] = await db.insert(schema.users).values({
      tenantId: tenant.id,
      email: "mike@acme.com",
      passwordHash,
      firstName: "Mike",
      lastName: "Johnson",
      roleId: salesRole.id,
      userType: "team_member",
      isAdmin: false,
    }).returning();

    const [customerUser] = await db.insert(schema.users).values({
      tenantId: tenant.id,
      email: "customer@techstart.com",
      passwordHash,
      firstName: "Alice",
      lastName: "Customer",
      roleId: null,
      userType: "customer",
      isAdmin: false,
    }).returning();
    console.log("Created users with different role types:");

    const productsData = [
      { name: "Enterprise CRM License", description: "Annual enterprise CRM software license", sku: "CRM-ENT-001", type: "service", unitPrice: "4999.00", taxRate: "18", category: "Software" },
      { name: "Basic CRM License", description: "Annual basic CRM software license", sku: "CRM-BAS-001", type: "service", unitPrice: "999.00", taxRate: "18", category: "Software" },
      { name: "Implementation Service", description: "CRM implementation and setup", sku: "SVC-IMP-001", type: "service", unitPrice: "2500.00", taxRate: "18", category: "Services" },
      { name: "Training Package", description: "5-day on-site training for up to 10 users", sku: "SVC-TRN-001", type: "service", unitPrice: "1500.00", taxRate: "18", category: "Services" },
      { name: "Premium Support", description: "24/7 premium support package (annual)", sku: "SUP-PRM-001", type: "service", unitPrice: "1200.00", taxRate: "18", category: "Support" },
      { name: "Data Migration", description: "Data migration from legacy systems", sku: "SVC-MIG-001", type: "service", unitPrice: "3000.00", taxRate: "18", category: "Services" },
      { name: "Custom Integration", description: "Custom API integration development", sku: "SVC-INT-001", type: "service", unitPrice: "5000.00", taxRate: "18", category: "Development" },
      { name: "Server Hardware", description: "Dell PowerEdge R740 Server", sku: "HW-SRV-001", type: "product", unitPrice: "8500.00", taxRate: "18", category: "Hardware" },
    ];

    const products = await db.insert(schema.products).values(
      productsData.map(p => ({ ...p, tenantId: tenant.id }))
    ).returning();
    console.log(`Created ${products.length} products`);

    const customersData = [
      { name: "TechStart Solutions", email: "customer@techstart.com", phone: "+1-555-0101", company: "TechStart Solutions", website: "https://techstart.com", address: "123 Innovation Way", city: "San Francisco", state: "CA", country: "USA", postalCode: "94102", customerType: "customer", segment: "mid-market", industry: "Technology", paymentTerms: "net30" },
      { name: "Global Manufacturing Inc", email: "purchasing@globalmfg.com", phone: "+1-555-0102", company: "Global Manufacturing Inc", address: "456 Industrial Blvd", city: "Detroit", state: "MI", country: "USA", postalCode: "48201", customerType: "customer", segment: "enterprise", industry: "Manufacturing", paymentTerms: "net45" },
      { name: "HealthFirst Medical", email: "admin@healthfirst.com", phone: "+1-555-0103", company: "HealthFirst Medical", address: "789 Medical Center Dr", city: "Boston", state: "MA", country: "USA", postalCode: "02101", customerType: "prospect", segment: "enterprise", industry: "Healthcare", paymentTerms: "net30" },
      { name: "EduLearn Academy", email: "contact@edulearn.edu", phone: "+1-555-0104", company: "EduLearn Academy", address: "321 Campus Ave", city: "Austin", state: "TX", country: "USA", postalCode: "73301", customerType: "lead", segment: "small-business", industry: "Education", paymentTerms: "net15" },
      { name: "RetailMax Stores", email: "ops@retailmax.com", phone: "+1-555-0105", company: "RetailMax Stores", address: "555 Commerce St", city: "Chicago", state: "IL", country: "USA", postalCode: "60601", customerType: "customer", segment: "enterprise", industry: "Retail", paymentTerms: "net30" },
      { name: "FinanceHub Corp", email: "info@financehub.com", phone: "+1-555-0106", company: "FinanceHub Corp", address: "888 Wall Street", city: "New York", state: "NY", country: "USA", postalCode: "10005", customerType: "prospect", segment: "enterprise", industry: "Finance", paymentTerms: "net60" },
    ];

    const customers = await db.insert(schema.customers).values(
      customersData.map((c, i) => ({ ...c, tenantId: tenant.id, ownerId: i % 2 === 0 ? salesUser.id : salesUser2.id }))
    ).returning();
    console.log(`Created ${customers.length} customers`);

    const contactsData = [
      { name: "Alice Johnson", email: "alice@techstart.com", phone: "+1-555-1001", company: "TechStart Solutions", role: "CEO" },
      { name: "Bob Williams", email: "bob@globalmfg.com", phone: "+1-555-1002", company: "Global Manufacturing Inc", role: "Procurement Manager" },
      { name: "Carol Davis", email: "carol@healthfirst.com", phone: "+1-555-1003", company: "HealthFirst Medical", role: "IT Director" },
      { name: "David Brown", email: "david@edulearn.edu", phone: "+1-555-1004", company: "EduLearn Academy", role: "Principal" },
      { name: "Eva Martinez", email: "eva@retailmax.com", phone: "+1-555-1005", company: "RetailMax Stores", role: "Operations Director" },
      { name: "Frank Wilson", email: "frank@financehub.com", phone: "+1-555-1006", company: "FinanceHub Corp", role: "CTO" },
    ];

    const contacts = await db.insert(schema.contacts).values(
      contactsData.map((c, i) => ({ ...c, tenantId: tenant.id, ownerId: i % 2 === 0 ? salesUser.id : salesUser2.id }))
    ).returning();
    console.log(`Created ${contacts.length} contacts`);

    const dealsData = [
      { title: "Enterprise CRM Implementation", value: "75000.00", stage: "proposal", probability: 60, notes: "Large-scale implementation for TechStart" },
      { title: "Manufacturing Floor System", value: "125000.00", stage: "negotiation", probability: 75, notes: "Multi-site deployment for Global Manufacturing" },
      { title: "Healthcare Data Platform", value: "95000.00", stage: "qualification", probability: 40, notes: "HIPAA-compliant solution for HealthFirst" },
      { title: "Education Management Suite", value: "35000.00", stage: "new", probability: 20, notes: "Initial contact with EduLearn" },
      { title: "Retail POS Integration", value: "65000.00", stage: "closed-won", probability: 100, notes: "Completed deal with RetailMax" },
      { title: "Finance Compliance System", value: "180000.00", stage: "proposal", probability: 55, notes: "Regulatory compliance solution for FinanceHub" },
    ];

    const deals = await db.insert(schema.deals).values(
      dealsData.map((d, i) => ({
        ...d,
        tenantId: tenant.id,
        ownerId: i % 2 === 0 ? salesUser.id : salesUser2.id,
        contactId: contacts[i % contacts.length].id,
        customerId: customers[i % customers.length].id,
        expectedCloseDate: new Date(Date.now() + (30 + i * 15) * 24 * 60 * 60 * 1000),
      }))
    ).returning();
    console.log(`Created ${deals.length} deals`);

    const tasksData = [
      { title: "Follow up with TechStart", description: "Send proposal review meeting invite", status: "todo", priority: "high", dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
      { title: "Prepare demo for Global Manufacturing", description: "Set up demo environment with manufacturing data", status: "in-progress", priority: "high", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      { title: "Send contract to RetailMax", description: "Final contract with negotiated terms", status: "completed", priority: "medium", dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { title: "Research HealthFirst requirements", description: "HIPAA compliance documentation", status: "todo", priority: "medium", dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
      { title: "Schedule call with FinanceHub CTO", description: "Discuss technical architecture", status: "todo", priority: "high", dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
      { title: "Update pricing proposal", description: "Revise based on client feedback", status: "in-progress", priority: "low", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    ];

    const tasks = await db.insert(schema.tasks).values(
      tasksData.map((t, i) => ({
        ...t,
        tenantId: tenant.id,
        assignedTo: i % 2 === 0 ? salesUser.id : salesUser2.id,
        customerId: customers[i % customers.length].id,
        dealId: deals[i % deals.length].id,
      }))
    ).returning();
    console.log(`Created ${tasks.length} tasks`);

    const [quotation1] = await db.insert(schema.quotations).values({
      tenantId: tenant.id,
      customerId: customers[0].id,
      createdBy: salesUser.id,
      quoteNumber: "QT-00001",
      title: "Enterprise CRM Package for TechStart",
      status: "sent",
      subtotal: "11499.00",
      taxAmount: "2069.82",
      discountAmount: "0",
      totalAmount: "13568.82",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      terms: "Payment due within 30 days of acceptance. Annual license renewable.",
    }).returning();

    await db.insert(schema.quotationItems).values([
      { quotationId: quotation1.id, productId: products[0].id, description: "Enterprise CRM License (Annual)", quantity: "1", unitPrice: "4999.00", taxRate: "18", discount: "0", totalPrice: "5898.82", sortOrder: 1 },
      { quotationId: quotation1.id, productId: products[2].id, description: "Implementation Service", quantity: "1", unitPrice: "2500.00", taxRate: "18", discount: "0", totalPrice: "2950.00", sortOrder: 2 },
      { quotationId: quotation1.id, productId: products[3].id, description: "Training Package", quantity: "2", unitPrice: "1500.00", taxRate: "18", discount: "0", totalPrice: "3540.00", sortOrder: 3 },
      { quotationId: quotation1.id, productId: products[4].id, description: "Premium Support (Annual)", quantity: "1", unitPrice: "1200.00", taxRate: "18", discount: "0", totalPrice: "1416.00", sortOrder: 4 },
    ]);

    const [quotation2] = await db.insert(schema.quotations).values({
      tenantId: tenant.id,
      customerId: customers[1].id,
      createdBy: salesUser2.id,
      quoteNumber: "QT-00002",
      title: "Manufacturing System Package",
      status: "draft",
      subtotal: "19999.00",
      taxAmount: "3599.82",
      discountAmount: "1000.00",
      totalAmount: "22598.82",
      validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    }).returning();

    await db.insert(schema.quotationItems).values([
      { quotationId: quotation2.id, productId: products[0].id, description: "Enterprise CRM License x3 (Multi-site)", quantity: "3", unitPrice: "4999.00", taxRate: "18", discount: "0", totalPrice: "17696.46", sortOrder: 1 },
      { quotationId: quotation2.id, productId: products[5].id, description: "Data Migration", quantity: "1", unitPrice: "3000.00", taxRate: "18", discount: "0", totalPrice: "3540.00", sortOrder: 2 },
      { quotationId: quotation2.id, productId: products[6].id, description: "Custom Integration", quantity: "1", unitPrice: "5000.00", taxRate: "18", discount: "0", totalPrice: "5900.00", sortOrder: 3 },
    ]);
    console.log("Created 2 quotations with line items");

    const [invoice1] = await db.insert(schema.invoices).values({
      tenantId: tenant.id,
      customerId: customers[4].id,
      createdBy: salesUser.id,
      invoiceNumber: "INV-00001",
      status: "paid",
      issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      subtotal: "8499.00",
      taxAmount: "1529.82",
      discountAmount: "0",
      totalAmount: "10028.82",
      paidAmount: "10028.82",
      balanceDue: "0",
      paidAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    }).returning();

    await db.insert(schema.invoiceItems).values([
      { invoiceId: invoice1.id, productId: products[0].id, description: "Enterprise CRM License", quantity: "1", unitPrice: "4999.00", taxRate: "18", discount: "0", totalPrice: "5898.82", sortOrder: 1 },
      { invoiceId: invoice1.id, productId: products[2].id, description: "Implementation Service", quantity: "1", unitPrice: "2500.00", taxRate: "18", discount: "0", totalPrice: "2950.00", sortOrder: 2 },
      { invoiceId: invoice1.id, productId: products[4].id, description: "Premium Support", quantity: "1", unitPrice: "1200.00", taxRate: "18", discount: "0", totalPrice: "1416.00", sortOrder: 3 },
    ]);

    await db.insert(schema.payments).values({
      tenantId: tenant.id,
      invoiceId: invoice1.id,
      amount: "10028.82",
      paymentMethod: "bank_transfer",
      paymentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      reference: "TRF-2024-001",
    });

    const [invoice2] = await db.insert(schema.invoices).values({
      tenantId: tenant.id,
      customerId: customers[0].id,
      createdBy: salesUser.id,
      invoiceNumber: "INV-00002",
      status: "sent",
      issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      subtotal: "6499.00",
      taxAmount: "1169.82",
      discountAmount: "500.00",
      totalAmount: "7168.82",
      paidAmount: "0",
      balanceDue: "7168.82",
    }).returning();

    await db.insert(schema.invoiceItems).values([
      { invoiceId: invoice2.id, productId: products[1].id, description: "Basic CRM License", quantity: "5", unitPrice: "999.00", taxRate: "18", discount: "0", totalPrice: "5894.10", sortOrder: 1 },
      { invoiceId: invoice2.id, productId: products[3].id, description: "Training Package", quantity: "1", unitPrice: "1500.00", taxRate: "18", discount: "0", totalPrice: "1770.00", sortOrder: 2 },
    ]);

    const [invoice3] = await db.insert(schema.invoices).values({
      tenantId: tenant.id,
      customerId: customers[1].id,
      createdBy: salesUser2.id,
      invoiceNumber: "INV-00003",
      status: "overdue",
      issueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      subtotal: "4999.00",
      taxAmount: "899.82",
      discountAmount: "0",
      totalAmount: "5898.82",
      paidAmount: "2000.00",
      balanceDue: "3898.82",
    }).returning();

    await db.insert(schema.invoiceItems).values([
      { invoiceId: invoice3.id, productId: products[0].id, description: "Enterprise CRM License", quantity: "1", unitPrice: "4999.00", taxRate: "18", discount: "0", totalPrice: "5898.82", sortOrder: 1 },
    ]);

    await db.insert(schema.payments).values({
      tenantId: tenant.id,
      invoiceId: invoice3.id,
      amount: "2000.00",
      paymentMethod: "credit_card",
      paymentDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      reference: "CC-2024-001",
      notes: "Partial payment",
    });
    console.log("Created 3 invoices with line items and payments");

    const activitiesData = [
      { type: "call", subject: "Initial discovery call", description: "Discussed requirements and timeline", outcome: "Positive, requested proposal", duration: 45 },
      { type: "email", subject: "Sent proposal document", description: "Attached detailed proposal PDF", outcome: "Awaiting response" },
      { type: "meeting", subject: "Product demo", description: "Demonstrated core features to stakeholders", outcome: "Well received, moving to negotiation", duration: 90 },
      { type: "note", subject: "Budget discussion", description: "Client mentioned budget constraints, may need to adjust package" },
      { type: "task", subject: "Prepare custom demo", description: "Need to set up demo with client-specific data" },
      { type: "call", subject: "Follow-up call", description: "Answered technical questions", outcome: "Scheduled next meeting", duration: 30 },
    ];

    await db.insert(schema.activities).values(
      activitiesData.map((a, i) => ({
        ...a,
        tenantId: tenant.id,
        userId: i % 2 === 0 ? salesUser.id : salesUser2.id,
        customerId: customers[i % customers.length].id,
        dealId: deals[i % deals.length].id,
        scheduledAt: new Date(Date.now() - (i * 3) * 24 * 60 * 60 * 1000),
        completedAt: i < 4 ? new Date(Date.now() - (i * 3 - 1) * 24 * 60 * 60 * 1000) : null,
      }))
    );
    console.log(`Created ${activitiesData.length} activities`);

    // Default Email Templates
    const emailTemplatesData = [
      {
        name: "Welcome Email",
        purpose: "welcome",
        subject: "Welcome to {{agency.name}} - Let's Get Started!",
        body: `<h2>Welcome, {{client.name}}!</h2>
<p>Thank you for choosing {{agency.name}}. We're thrilled to have you on board and look forward to working with you.</p>
<p>Here's what you can expect from us:</p>
<ul>
  <li>Dedicated support for all your needs</li>
  <li>Regular updates on your projects</li>
  <li>Access to our client portal</li>
</ul>
<p>If you have any questions, don't hesitate to reach out to us at {{agency.email}} or call {{agency.phone}}.</p>
<p>Best regards,<br>{{user.name}}<br>{{agency.name}}</p>`,
        isDefault: true,
        defaultFor: "welcome",
      },
      {
        name: "Quotation Email",
        purpose: "quotation",
        subject: "Your Quotation #{{quotation.number}} from {{agency.name}}",
        body: `<h2>Hello {{client.name}},</h2>
<p>Thank you for your interest in our services. Please find attached your quotation #{{quotation.number}}.</p>
<p><strong>Quotation Details:</strong></p>
<ul>
  <li>Title: {{quotation.title}}</li>
  <li>Amount: {{quotation.amount}}</li>
  <li>Valid Until: {{quotation.valid_until}}</li>
</ul>
<p>If you have any questions or would like to discuss this quotation further, please don't hesitate to contact us.</p>
<p>We look forward to working with you!</p>
<p>Best regards,<br>{{user.name}}<br>{{agency.name}}</p>`,
        isDefault: true,
        defaultFor: "quotation",
      },
      {
        name: "Invoice Email",
        purpose: "invoice",
        subject: "Invoice #{{invoice.number}} from {{agency.name}}",
        body: `<h2>Hello {{client.name}},</h2>
<p>Please find attached your invoice #{{invoice.number}}.</p>
<p><strong>Invoice Details:</strong></p>
<ul>
  <li>Amount Due: {{invoice.amount}}</li>
  <li>Due Date: {{invoice.due_date}}</li>
</ul>
<p>Payment can be made via bank transfer or credit card. Please reference the invoice number in your payment.</p>
<p>If you have any questions regarding this invoice, please contact us.</p>
<p>Thank you for your business!</p>
<p>Best regards,<br>{{user.name}}<br>{{agency.name}}</p>`,
        isDefault: true,
        defaultFor: "invoice",
      },
      {
        name: "Payment Reminder",
        purpose: "payment_reminder",
        subject: "Friendly Reminder: Invoice #{{invoice.number}} Payment Due",
        body: `<h2>Hello {{client.name}},</h2>
<p>This is a friendly reminder that invoice #{{invoice.number}} is due for payment.</p>
<p><strong>Invoice Details:</strong></p>
<ul>
  <li>Balance Due: {{invoice.balance}}</li>
  <li>Due Date: {{invoice.due_date}}</li>
</ul>
<p>If you have already made the payment, please disregard this message. Otherwise, we kindly request that you process the payment at your earliest convenience.</p>
<p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
<p>Best regards,<br>{{user.name}}<br>{{agency.name}}</p>`,
        isDefault: true,
        defaultFor: "payment_reminder",
      },
      {
        name: "Follow-Up Email",
        purpose: "follow_up",
        subject: "Following Up on Our Recent Conversation",
        body: `<h2>Hello {{client.name}},</h2>
<p>I hope this email finds you well. I wanted to follow up on our recent conversation and see if you had any questions.</p>
<p>We at {{agency.name}} are committed to providing you with the best possible service, and I'd love to hear your thoughts.</p>
<p>Please let me know if there's anything I can help you with or if you'd like to schedule a call to discuss further.</p>
<p>Looking forward to hearing from you!</p>
<p>Best regards,<br>{{user.name}}<br>{{agency.name}}</p>`,
        isDefault: true,
        defaultFor: "follow_up",
      },
      {
        name: "Thank You Email",
        purpose: "thank_you",
        subject: "Thank You for Your Business!",
        body: `<h2>Hello {{client.name}},</h2>
<p>We wanted to take a moment to thank you for choosing {{agency.name}}.</p>
<p>Your trust in our services means a lot to us, and we are committed to delivering exceptional results.</p>
<p>If you ever need any assistance or have feedback to share, please don't hesitate to reach out to us at {{agency.email}}.</p>
<p>We look forward to continuing to serve you!</p>
<p>Warm regards,<br>{{user.name}}<br>{{agency.name}}</p>`,
        isDefault: true,
        defaultFor: "thank_you",
      },
      {
        name: "Meeting Confirmation",
        purpose: "meeting",
        subject: "Meeting Confirmation - {{agency.name}}",
        body: `<h2>Hello {{client.name}},</h2>
<p>This is to confirm our upcoming meeting.</p>
<p>We look forward to speaking with you and discussing how we can best serve your needs.</p>
<p>If you need to reschedule or have any questions beforehand, please let us know.</p>
<p>Best regards,<br>{{user.name}}<br>{{agency.name}}</p>`,
        isDefault: true,
        defaultFor: "meeting",
      },
      {
        name: "Renewal Reminder",
        purpose: "renewal",
        subject: "Your Subscription Renewal - {{agency.name}}",
        body: `<h2>Hello {{client.name}},</h2>
<p>This is a friendly reminder that your subscription/service with {{agency.name}} is coming up for renewal.</p>
<p>To ensure uninterrupted service, please review your current plan and renew before the expiration date.</p>
<p>If you have any questions about renewal options or would like to discuss your account, please contact us.</p>
<p>Thank you for your continued partnership!</p>
<p>Best regards,<br>{{user.name}}<br>{{agency.name}}</p>`,
        isDefault: true,
        defaultFor: "renewal",
      },
    ];

    const emailTemplates = await db.insert(schema.emailTemplates).values(
      emailTemplatesData.map(t => ({
        ...t,
        tenantId: tenant.id,
        createdBy: adminUser.id,
      }))
    ).returning();
    console.log(`Created ${emailTemplates.length} default email templates`);

    // Default Automation Rules
    const automationRulesData = [
      {
        name: "Invoice Payment Reminder (3 Days Before)",
        description: "Automatically send payment reminder 3 days before invoice due date",
        trigger: "invoice_due_3_days",
        delayMinutes: 0,
        isEnabled: true,
      },
      {
        name: "Invoice Overdue Reminder",
        description: "Automatically send reminder when invoice is overdue",
        trigger: "invoice_overdue",
        delayMinutes: 1440, // 24 hours after overdue
        isEnabled: true,
      },
      {
        name: "Quotation Follow-Up",
        description: "Send follow-up email 3 days after sending quotation",
        trigger: "quotation_sent",
        delayMinutes: 4320, // 3 days
        isEnabled: true,
      },
      {
        name: "New Customer Welcome",
        description: "Send welcome email when new customer is created",
        trigger: "customer_created",
        delayMinutes: 0,
        isEnabled: true,
      },
      {
        name: "Payment Received Thank You",
        description: "Send thank you email after payment is received",
        trigger: "payment_received",
        delayMinutes: 0,
        isEnabled: true,
      },
    ];

    // Find corresponding template IDs for automations
    const welcomeTemplate = emailTemplates.find(t => t.purpose === "welcome");
    const quotationTemplate = emailTemplates.find(t => t.purpose === "quotation");
    const paymentReminderTemplate = emailTemplates.find(t => t.purpose === "payment_reminder");
    const thankYouTemplate = emailTemplates.find(t => t.purpose === "thank_you");
    const followUpTemplate = emailTemplates.find(t => t.purpose === "follow_up");

    const automationRules = await db.insert(schema.automationRules).values(
      automationRulesData.map((a, i) => {
        let templateId = welcomeTemplate!.id;
        if (a.trigger === "invoice_due_3_days" || a.trigger === "invoice_overdue") {
          templateId = paymentReminderTemplate!.id;
        } else if (a.trigger === "quotation_sent") {
          templateId = followUpTemplate!.id;
        } else if (a.trigger === "customer_created") {
          templateId = welcomeTemplate!.id;
        } else if (a.trigger === "payment_received") {
          templateId = thankYouTemplate!.id;
        }
        return {
          ...a,
          tenantId: tenant.id,
          createdBy: adminUser.id,
          templateId,
        };
      })
    ).returning();
    console.log(`Created ${automationRules.length} default automation rules`);

    // Default Follow-Up Sequences
    const [welcomeSequence] = await db.insert(schema.followUpSequences).values({
      tenantId: tenant.id,
      createdBy: adminUser.id,
      name: "New Customer Onboarding",
      description: "Welcome sequence for new customers with onboarding steps",
      purpose: "onboarding",
      isEnabled: true,
    }).returning();

    await db.insert(schema.followUpSteps).values([
      { sequenceId: welcomeSequence.id, templateId: welcomeTemplate!.id, stepOrder: 1, delayDays: 0 },
      { sequenceId: welcomeSequence.id, templateId: followUpTemplate!.id, stepOrder: 2, delayDays: 3 },
      { sequenceId: welcomeSequence.id, templateId: thankYouTemplate!.id, stepOrder: 3, delayDays: 7 },
    ]);

    const [quotationSequence] = await db.insert(schema.followUpSequences).values({
      tenantId: tenant.id,
      createdBy: adminUser.id,
      name: "Quotation Follow-Up",
      description: "Follow up on sent quotations to encourage conversion",
      purpose: "sales",
      isEnabled: true,
    }).returning();

    await db.insert(schema.followUpSteps).values([
      { sequenceId: quotationSequence.id, templateId: followUpTemplate!.id, stepOrder: 1, delayDays: 3 },
      { sequenceId: quotationSequence.id, templateId: followUpTemplate!.id, stepOrder: 2, delayDays: 7 },
    ]);

    console.log("Created 2 default follow-up sequences with steps");

    // Default Proposal Templates
    const proposalTemplatesData = [
      {
        name: "Web Design Proposal",
        description: "Professional template for web design and development projects",
        purpose: "web_design",
        isDefault: true,
        sections: [
          { sectionType: "cover", title: "Cover Page", content: "<div class='highlight'><p class='text-xl font-medium'>Transform your online presence with a stunning, high-performance website designed to captivate your audience and drive results.</p></div>", sortOrder: 1, isLocked: true },
          { sectionType: "introduction", title: "Introduction", content: "<p>Thank you for considering {{agency.name}} for your web design project. We are excited about the opportunity to help bring your vision to life and create a digital experience that truly represents your brand.</p><div class='highlight'><p><strong>Our Goal:</strong> To create a modern, responsive, and user-friendly website for {{client.company}} that effectively engages your target audience and drives measurable business results.</p></div>", sortOrder: 2 },
          { sectionType: "about_us", title: "Why Choose Us", content: "<p>{{agency.name}} is a full-service digital agency specializing in creating stunning websites and digital experiences that deliver results.</p><div class='feature-grid'><div class='feature-card'><h4>Award-Winning Design</h4><p>Our creative team crafts visually stunning designs that capture your brand essence.</p></div><div class='feature-card'><h4>Technical Excellence</h4><p>Built with modern technologies for speed, security, and scalability.</p></div><div class='feature-card'><h4>User-Focused</h4><p>Every design decision is made with your users' experience in mind.</p></div><div class='feature-card'><h4>Results-Driven</h4><p>Optimized for conversions, SEO, and your business objectives.</p></div></div>", sortOrder: 3 },
          { sectionType: "scope_of_work", title: "Project Scope", content: "<div class='feature-grid'><div class='feature-card'><h4>Discovery & Planning</h4><ul><li>Requirements gathering & analysis</li><li>Competitor & market research</li><li>Site architecture planning</li><li>Wireframing & prototyping</li></ul></div><div class='feature-card'><h4>Design Phase</h4><ul><li>Custom UI/UX design</li><li>Mobile-first responsive design</li><li>Brand integration & visual identity</li><li>Interactive prototypes</li></ul></div><div class='feature-card'><h4>Development</h4><ul><li>Clean, semantic front-end code</li><li>CMS integration & setup</li><li>Performance optimization</li><li>Cross-browser testing</li></ul></div><div class='feature-card'><h4>Launch & Support</h4><ul><li>Comprehensive QA testing</li><li>Seamless deployment</li><li>Training & documentation</li><li>30-day post-launch support</li></ul></div></div>", sortOrder: 4 },
          { sectionType: "deliverables", title: "What You'll Receive", content: "<ul class='check-list'><li>Fully responsive custom website optimized for all devices</li><li>Easy-to-use Content Management System (CMS)</li><li>SEO-optimized pages with meta tags and structured data</li><li>Contact forms with email notifications</li><li>Social media integration</li><li>Google Analytics setup and tracking</li><li>Comprehensive training documentation</li><li>30 days of post-launch support and bug fixes</li><li>All source files and assets</li></ul>", sortOrder: 5 },
          { sectionType: "timeline", title: "Project Timeline", content: "<p>We follow a proven development process to ensure your project is delivered on time and exceeds expectations:</p><table><thead><tr><th>Phase</th><th>Duration</th><th>Deliverables</th></tr></thead><tbody><tr><td><strong>Discovery</strong></td><td>1-2 Weeks</td><td>Project brief, sitemap, wireframes</td></tr><tr><td><strong>Design</strong></td><td>2-3 Weeks</td><td>UI designs, style guide, prototypes</td></tr><tr><td><strong>Development</strong></td><td>3-4 Weeks</td><td>Fully functional website</td></tr><tr><td><strong>Launch</strong></td><td>1 Week</td><td>Testing, deployment, training</td></tr></tbody></table><div class='highlight'><p><strong>Estimated Total: 7-10 Weeks</strong> from project kickoff to launch</p></div>", sortOrder: 6 },
          { sectionType: "pricing_table", title: "Your Investment", content: "<p>Your investment includes everything needed to create a professional, high-performing website. See the detailed breakdown below:</p>", sortOrder: 7 },
          { sectionType: "terms_conditions", title: "Terms & Conditions", content: "<h3>Payment Schedule</h3><ul><li><strong>Deposit:</strong> 50% upon project acceptance to begin work</li><li><strong>Final Payment:</strong> 50% upon project completion before launch</li></ul><h3>Revisions & Changes</h3><ul><li>Includes up to 2 rounds of design revisions per phase</li><li>Additional revisions billed at our standard hourly rate</li><li>Scope changes documented via change order process</li></ul><h3>Ownership & Rights</h3><ul><li>Full ownership transfers upon final payment</li><li>We retain rights to showcase work in our portfolio</li></ul><h3>Proposal Validity</h3><ul><li>This proposal is valid for 30 days from issue date</li></ul>", sortOrder: 8 },
          { sectionType: "signature", title: "Ready to Begin?", content: "<div class='highlight'><p>We're excited about the opportunity to create something amazing for {{client.company}}. By accepting this proposal, you're taking the first step toward a website that will elevate your brand and drive real results.</p></div><p><strong>Let's bring your vision to life.</strong> Accept this proposal to start your web design journey.</p>", sortOrder: 9, isLocked: true },
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
          { sectionType: "cover", title: "Cover Page", content: "<div class='highlight'><p class='text-xl font-medium'>Accelerate your growth with data-driven digital marketing strategies that deliver measurable results and maximize your ROI.</p></div>", sortOrder: 1, isLocked: true },
          { sectionType: "introduction", title: "Introduction", content: "<p>Thank you for considering us as your digital marketing partner. In today's competitive landscape, a strategic and data-driven approach to digital marketing is essential for sustainable business growth.</p><div class='highlight'><p><strong>Our Mission:</strong> To help {{client.company}} achieve measurable growth through targeted digital campaigns, engaging content, and continuous optimization based on real performance data.</p></div><p>This proposal outlines a comprehensive digital marketing strategy designed specifically for your business objectives, target audience, and competitive landscape.</p>", sortOrder: 2 },
          { sectionType: "about_us", title: "Why Choose Us", content: "<p>{{agency.name}} is a results-driven digital marketing agency with a proven track record of helping businesses like yours achieve remarkable growth.</p><div class='feature-grid'><div class='feature-card'><h4>Data-Driven Approach</h4><p>Every decision is backed by analytics and performance data to ensure optimal ROI.</p></div><div class='feature-card'><h4>Full-Service Expertise</h4><p>From paid ads to content marketing, we handle all aspects of your digital presence.</p></div><div class='feature-card'><h4>Transparent Reporting</h4><p>Clear, actionable reports that show exactly how your investment is performing.</p></div><div class='feature-card'><h4>Dedicated Support</h4><p>A dedicated account manager who understands your business and goals.</p></div></div>", sortOrder: 3 },
          { sectionType: "scope_of_work", title: "Our Services", content: "<div class='feature-grid'><div class='feature-card'><h4>Paid Advertising</h4><ul><li>Google Ads management & optimization</li><li>Social media advertising (Facebook, Instagram, LinkedIn)</li><li>Retargeting & remarketing campaigns</li><li>A/B testing for maximum conversions</li></ul></div><div class='feature-card'><h4>Social Media Marketing</h4><ul><li>Platform strategy development</li><li>Content creation & scheduling</li><li>Community management & engagement</li><li>Influencer partnership coordination</li></ul></div><div class='feature-card'><h4>Email Marketing</h4><ul><li>Email strategy & automation flows</li><li>Newsletter design & management</li><li>Drip campaigns & sequences</li><li>List segmentation & personalization</li></ul></div><div class='feature-card'><h4>Analytics & Reporting</h4><ul><li>Campaign tracking & attribution</li><li>ROI measurement & analysis</li><li>Monthly performance dashboards</li><li>Strategy optimization recommendations</li></ul></div></div>", sortOrder: 4 },
          { sectionType: "deliverables", title: "What You'll Receive", content: "<ul class='check-list'><li>Dedicated account manager for personalized support</li><li>Campaign management across all selected channels</li><li>Custom content calendar with strategic posting schedule</li><li>Professional email newsletters and automation sequences</li><li>Comprehensive monthly analytics report with insights</li><li>Monthly strategy call to review performance and plan ahead</li><li>Ad spend management and optimization</li><li>Creative assets including graphics and ad copy</li><li>Competitor monitoring and market insights</li></ul>", sortOrder: 5 },
          { sectionType: "timeline", title: "Implementation Timeline", content: "<p>We follow a proven onboarding process to ensure a smooth start and quick results:</p><table><thead><tr><th>Phase</th><th>Timeline</th><th>Key Activities</th></tr></thead><tbody><tr><td><strong>Discovery</strong></td><td>Week 1</td><td>Onboarding call, account access, brand audit, competitor analysis</td></tr><tr><td><strong>Strategy</strong></td><td>Week 2</td><td>Strategy development, campaign planning, creative briefing</td></tr><tr><td><strong>Setup</strong></td><td>Week 3</td><td>Campaign setup, creative development, tracking implementation</td></tr><tr><td><strong>Launch</strong></td><td>Week 4</td><td>Campaign launch, initial optimization, performance monitoring</td></tr></tbody></table><div class='highlight'><p><strong>Ongoing:</strong> After the initial setup phase, we transition into ongoing management with continuous optimization, A/B testing, and monthly strategy reviews to maximize your results.</p></div>", sortOrder: 6 },
          { sectionType: "pricing_table", title: "Your Investment", content: "<p>Your investment includes full-service digital marketing management with transparent pricing and no hidden fees. See the detailed breakdown below:</p>", sortOrder: 7 },
          { sectionType: "terms_conditions", title: "Terms & Conditions", content: "<h3>Engagement Terms</h3><ul><li><strong>Commitment Period:</strong> 3-month minimum to ensure meaningful results</li><li><strong>Billing Cycle:</strong> Monthly invoicing at the start of each month</li><li><strong>Ad Spend:</strong> Billed separately and paid directly to advertising platforms</li></ul><h3>Deliverables & Reporting</h3><ul><li><strong>Monthly Reports:</strong> Delivered by the 10th of each month</li><li><strong>Strategy Calls:</strong> Scheduled monthly at your convenience</li><li><strong>Response Time:</strong> Within 24 business hours for all inquiries</li></ul><h3>Cancellation Policy</h3><ul><li>30 days written notice required after initial commitment period</li><li>Final report and asset handover included upon conclusion</li></ul>", sortOrder: 8 },
          { sectionType: "signature", title: "Let's Get Started", content: "<div class='highlight'><p>We're excited about the opportunity to partner with {{client.company}} and help accelerate your digital growth. By accepting this proposal, you're taking the first step toward achieving measurable results and sustainable business growth.</p></div><p><strong>Ready to transform your digital presence?</strong> Accept this proposal to begin your journey to digital marketing success.</p>", sortOrder: 9, isLocked: true },
        ],
      },
      {
        name: "Consulting Proposal",
        description: "Professional template for consulting and advisory services",
        purpose: "consulting",
        isDefault: true,
        sections: [
          { sectionType: "cover", title: "Cover Page", content: "<div class='highlight'><p class='text-xl font-medium'>Strategic consulting to unlock growth, optimize operations, and drive sustainable business transformation.</p></div>", sortOrder: 1, isLocked: true },
          { sectionType: "introduction", title: "Executive Summary", content: "<p>This proposal outlines our consulting engagement designed to address the strategic challenges and opportunities facing {{client.company}}.</p><div class='highlight'><p><strong>Our Commitment:</strong> To combine deep industry expertise with practical, actionable solutions that deliver measurable business outcomes and lasting organizational change.</p></div><p>We understand that every organization is unique. Our approach is tailored to your specific context, challenges, and objectives to ensure maximum impact and sustainable results.</p>", sortOrder: 2 },
          { sectionType: "about_us", title: "Our Expertise", content: "<p>{{agency.name}} brings decades of combined experience in strategic consulting across multiple industries, with a proven track record of transformative results.</p><div class='feature-grid'><div class='feature-card'><h4>Industry Expertise</h4><p>Deep knowledge across technology, healthcare, finance, manufacturing, and retail sectors.</p></div><div class='feature-card'><h4>Proven Methodology</h4><p>Battle-tested frameworks refined through hundreds of successful engagements.</p></div><div class='feature-card'><h4>Executive Experience</h4><p>Senior consultants with C-suite experience who understand your challenges firsthand.</p></div><div class='feature-card'><h4>Measurable Results</h4><p>Focus on quantifiable outcomes with clear success metrics and accountability.</p></div></div>", sortOrder: 3 },
          { sectionType: "scope_of_work", title: "Engagement Approach", content: "<div class='feature-grid'><div class='feature-card'><h4>Phase 1: Assessment</h4><ul><li>Current state analysis</li><li>Stakeholder interviews</li><li>Process mapping & documentation</li><li>Gap analysis & opportunity identification</li></ul></div><div class='feature-card'><h4>Phase 2: Strategy Development</h4><ul><li>Strategic options identification</li><li>Feasibility & impact analysis</li><li>Recommendation development</li><li>Implementation roadmap</li></ul></div><div class='feature-card'><h4>Phase 3: Implementation Support</h4><ul><li>Change management planning</li><li>Hands-on implementation guidance</li><li>Progress monitoring & reporting</li><li>Course corrections as needed</li></ul></div><div class='feature-card'><h4>Phase 4: Knowledge Transfer</h4><ul><li>Documentation & playbooks</li><li>Team training & enablement</li><li>Sustainability planning</li><li>Success measurement framework</li></ul></div></div>", sortOrder: 4 },
          { sectionType: "deliverables", title: "Key Deliverables", content: "<ul class='check-list'><li>Comprehensive Current State Assessment Report</li><li>Strategic Recommendations Document with prioritized initiatives</li><li>Detailed Implementation Roadmap with timelines and milestones</li><li>Executive Presentation for leadership alignment</li><li>Weekly Progress Updates throughout the engagement</li><li>Change Management Toolkit and templates</li><li>Final Summary Report with outcomes and next steps</li><li>Knowledge transfer sessions for your team</li></ul>", sortOrder: 5 },
          { sectionType: "timeline", title: "Engagement Timeline", content: "<p>Our proven engagement framework ensures structured progress with clear milestones:</p><table><thead><tr><th>Phase</th><th>Duration</th><th>Key Milestones</th></tr></thead><tbody><tr><td><strong>Assessment</strong></td><td>2-3 Weeks</td><td>Current State Report, Stakeholder Alignment</td></tr><tr><td><strong>Strategy</strong></td><td>3-4 Weeks</td><td>Recommendations Document, Implementation Roadmap</td></tr><tr><td><strong>Implementation</strong></td><td>As required</td><td>Milestone Reviews, Progress Reports</td></tr><tr><td><strong>Knowledge Transfer</strong></td><td>1-2 Weeks</td><td>Documentation, Training, Handover</td></tr></tbody></table><div class='highlight'><p><strong>Flexible Engagement:</strong> Timeline can be adjusted based on scope complexity and organizational readiness.</p></div>", sortOrder: 6 },
          { sectionType: "pricing_table", title: "Your Investment", content: "<p>Our consulting fees reflect the value we deliver and the expertise of our senior consulting team. See the detailed breakdown below:</p>", sortOrder: 7 },
          { sectionType: "terms_conditions", title: "Terms & Conditions", content: "<h3>Engagement Structure</h3><ul><li><strong>Format:</strong> Project-based or retainer arrangements available</li><li><strong>Team:</strong> Dedicated senior consultant with support team</li><li><strong>Meetings:</strong> Regular check-ins and steering committee reviews</li></ul><h3>Payment Terms</h3><ul><li><strong>Project Basis:</strong> Milestone-based payments tied to deliverables</li><li><strong>Retainer:</strong> Monthly invoicing at the beginning of each month</li><li><strong>Expenses:</strong> Travel and expenses billed at cost with prior approval</li></ul><h3>Confidentiality</h3><ul><li>All information shared is treated as strictly confidential</li><li>NDA available upon request</li></ul>", sortOrder: 8 },
          { sectionType: "signature", title: "Let's Begin", content: "<div class='highlight'><p>We're confident that our partnership will deliver significant value to {{client.company}}. By accepting this proposal, you're taking the first step toward transformative results and sustainable competitive advantage.</p></div><p><strong>Ready to drive meaningful change?</strong> Accept this proposal to begin our strategic consulting engagement.</p>", sortOrder: 9, isLocked: true },
        ],
      },
    ];

    // Insert proposal templates as SYSTEM templates (available to all users)
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
    }
    console.log(`Created ${proposalTemplatesData.length} default SYSTEM proposal templates with sections`);

    console.log("\n========================================");
    console.log("Database seeded successfully!");
    console.log("========================================");
    console.log("\nLogin credentials (password: password123 for all):");
    console.log("\n1. SaaS Admin (Super Admin - all tenants access):");
    console.log("   Email: superadmin@nexuscrm.com");
    console.log("\n2. Agency Admin (Admin - full agency access):");
    console.log("   Email: admin@acme.com");
    console.log("\n3. Team Member (sees only their own data):");
    console.log("   Email: sarah@acme.com");
    console.log("   Email: mike@acme.com");
    console.log("\n4. Customer (limited portal access):");
    console.log("   Email: customer@techstart.com");
    console.log("========================================\n");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed().then(() => process.exit(0)).catch(() => process.exit(1));
