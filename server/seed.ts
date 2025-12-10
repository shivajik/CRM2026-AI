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

    const [adminUser] = await db.insert(schema.users).values({
      tenantId: tenant.id,
      email: "admin@acme.com",
      passwordHash,
      firstName: "John",
      lastName: "Admin",
      roleId: adminRole.id,
    }).returning();

    const [salesUser] = await db.insert(schema.users).values({
      tenantId: tenant.id,
      email: "sarah@acme.com",
      passwordHash,
      firstName: "Sarah",
      lastName: "Sales",
      roleId: salesRole.id,
    }).returning();

    const [salesUser2] = await db.insert(schema.users).values({
      tenantId: tenant.id,
      email: "mike@acme.com",
      passwordHash,
      firstName: "Mike",
      lastName: "Johnson",
      roleId: salesRole.id,
    }).returning();
    console.log("Created users: admin@acme.com, sarah@acme.com, mike@acme.com (password: password123)");

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
      { name: "TechStart Solutions", email: "info@techstart.com", phone: "+1-555-0101", company: "TechStart Solutions", website: "https://techstart.com", address: "123 Innovation Way", city: "San Francisco", state: "CA", country: "USA", postalCode: "94102", customerType: "customer", segment: "mid-market", industry: "Technology", paymentTerms: "net30" },
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

    console.log("\n========================================");
    console.log("Database seeded successfully!");
    console.log("========================================");
    console.log("\nLogin credentials:");
    console.log("  Email: admin@acme.com");
    console.log("  Password: password123");
    console.log("\nOr:");
    console.log("  Email: sarah@acme.com");
    console.log("  Password: password123");
    console.log("========================================\n");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed().then(() => process.exit(0)).catch(() => process.exit(1));
