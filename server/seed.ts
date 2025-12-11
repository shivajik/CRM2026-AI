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
