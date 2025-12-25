import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedSystemEmailTemplates() {
  console.log("Seeding system email templates...\n");

  try {
    const existingSystemTemplates = await db.select().from(schema.emailTemplates)
      .where(eq(schema.emailTemplates.ownerType, 'system'))
      .limit(1);
    
    if (existingSystemTemplates.length > 0) {
      console.log("System email templates already exist. Skipping seed.");
      return;
    }

    const systemEmailTemplates = [
      {
        name: "Quotation Email",
        purpose: "quotation",
        subject: "Quotation #{{quotation.number}} from {{agency.name}}",
        body: `<p>Dear {{customer.name}},</p>

<p>Thank you for your interest in our services. Please find attached your quotation #{{quotation.number}}.</p>

<p><strong>Quotation Summary:</strong></p>
<ul>
  <li>Quotation Number: {{quotation.number}}</li>
  <li>Date: {{quotation.date}}</li>
  <li>Valid Until: {{quotation.validUntil}}</li>
  <li>Total Amount: {{quotation.total}}</li>
</ul>

<p>If you have any questions about this quotation, please don't hesitate to contact us.</p>

<p>Best regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'quotation.number', 'quotation.date', 'quotation.validUntil', 'quotation.total', 'user.name', 'agency.name'],
        isDefault: true,
        defaultFor: 'quotation',
      },
      {
        name: "Invoice Email",
        purpose: "invoice",
        subject: "Invoice #{{invoice.number}} from {{agency.name}}",
        body: `<p>Dear {{customer.name}},</p>

<p>Please find attached your invoice #{{invoice.number}} for the services provided.</p>

<p><strong>Invoice Details:</strong></p>
<ul>
  <li>Invoice Number: {{invoice.number}}</li>
  <li>Date: {{invoice.date}}</li>
  <li>Due Date: {{invoice.dueDate}}</li>
  <li>Amount Due: {{invoice.total}}</li>
</ul>

<p>Please ensure payment is made by the due date. If you have any questions regarding this invoice, please contact us.</p>

<p>Thank you for your business.</p>

<p>Best regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'invoice.number', 'invoice.date', 'invoice.dueDate', 'invoice.total', 'user.name', 'agency.name'],
        isDefault: true,
        defaultFor: 'invoice',
      },
      {
        name: "Payment Reminder",
        purpose: "payment_reminder",
        subject: "Payment Reminder: Invoice #{{invoice.number}} is Due",
        body: `<p>Dear {{customer.name}},</p>

<p>This is a friendly reminder that invoice #{{invoice.number}} is due for payment.</p>

<p><strong>Invoice Details:</strong></p>
<ul>
  <li>Invoice Number: {{invoice.number}}</li>
  <li>Original Due Date: {{invoice.dueDate}}</li>
  <li>Amount Outstanding: {{invoice.balance}}</li>
</ul>

<p>If you have already made this payment, please disregard this message. If you have any questions or need to discuss payment arrangements, please don't hesitate to reach out.</p>

<p>Thank you for your prompt attention to this matter.</p>

<p>Best regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'invoice.number', 'invoice.dueDate', 'invoice.balance', 'user.name', 'agency.name'],
        isDefault: true,
        defaultFor: 'payment_reminder',
      },
      {
        name: "Follow-up Email",
        purpose: "follow_up",
        subject: "Following Up on Our Proposal",
        body: `<p>Dear {{customer.name}},</p>

<p>I hope this email finds you well. I wanted to follow up on the proposal we sent regarding our services.</p>

<p>We understand you may be busy, but we'd love to answer any questions you might have or discuss how we can best meet your needs.</p>

<p>Would you be available for a brief call this week to discuss further?</p>

<p>Looking forward to hearing from you.</p>

<p>Best regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'user.name', 'agency.name'],
        isDefault: true,
        defaultFor: 'follow_up',
      },
      {
        name: "Welcome Email",
        purpose: "welcome",
        subject: "Welcome to {{agency.name}}!",
        body: `<p>Dear {{customer.name}},</p>

<p>Welcome to {{agency.name}}! We're thrilled to have you as our client.</p>

<p>We're committed to providing you with exceptional service and look forward to a successful partnership.</p>

<p>Here's what you can expect from us:</p>
<ul>
  <li>Dedicated support for all your needs</li>
  <li>Regular updates on project progress</li>
  <li>Transparent communication at every step</li>
</ul>

<p>If you have any questions or need assistance, please don't hesitate to reach out. We're here to help!</p>

<p>Best regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'user.name', 'agency.name'],
        isDefault: true,
        defaultFor: 'welcome',
      },
      {
        name: "Renewal Reminder",
        purpose: "renewal",
        subject: "Your Service with {{agency.name}} is Due for Renewal",
        body: `<p>Dear {{customer.name}},</p>

<p>This is a friendly reminder that your service agreement with us is approaching its renewal date.</p>

<p>We value your continued partnership and would love to continue serving you. Here are your renewal options:</p>

<ul>
  <li>Renew at your current rate</li>
  <li>Upgrade to a premium package for enhanced features</li>
  <li>Schedule a call to discuss custom options</li>
</ul>

<p>Please let us know how you'd like to proceed, or if you have any questions about your renewal options.</p>

<p>Thank you for being a valued client.</p>

<p>Best regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'user.name', 'agency.name'],
        isDefault: true,
        defaultFor: 'renewal',
      },
      {
        name: "Feedback Request",
        purpose: "feedback",
        subject: "We'd Love Your Feedback",
        body: `<p>Dear {{customer.name}},</p>

<p>Thank you for choosing {{agency.name}} for your recent project. We hope you're satisfied with the results.</p>

<p>Your feedback is invaluable to us and helps us continuously improve our services. Would you mind taking a few moments to share your experience?</p>

<p>We'd appreciate if you could let us know:</p>
<ul>
  <li>What did you like most about working with us?</li>
  <li>Is there anything we could have done better?</li>
  <li>Would you recommend us to others?</li>
</ul>

<p>Simply reply to this email with your thoughts, or feel free to give us a call.</p>

<p>Thank you for your time and continued support.</p>

<p>Best regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'user.name', 'agency.name'],
        isDefault: true,
        defaultFor: 'feedback',
      },
      {
        name: "Meeting Request",
        purpose: "meeting",
        subject: "Meeting Request: Let's Discuss Your Project",
        body: `<p>Dear {{customer.name}},</p>

<p>I hope this email finds you well. I'd like to schedule a meeting to discuss your project requirements and how we can best assist you.</p>

<p>Please let me know your availability for a brief call or video conference. I'm flexible with timing and can accommodate your schedule.</p>

<p>Alternatively, you can suggest a few time slots that work for you, and I'll confirm which one is best.</p>

<p>Looking forward to connecting with you soon.</p>

<p>Best regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'user.name', 'agency.name'],
        isDefault: true,
        defaultFor: 'meeting',
      },
      {
        name: "Thank You Email",
        purpose: "custom",
        subject: "Thank You from {{agency.name}}",
        body: `<p>Dear {{customer.name}},</p>

<p>Thank you for choosing {{agency.name}}. We truly appreciate your trust in our services.</p>

<p>It was a pleasure working with you, and we hope you're satisfied with the results. If there's anything more we can do for you, please don't hesitate to reach out.</p>

<p>We look forward to the opportunity to work with you again in the future.</p>

<p>Warm regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'user.name', 'agency.name'],
        isDefault: false,
        defaultFor: null,
      },
      {
        name: "Project Update",
        purpose: "custom",
        subject: "Project Update from {{agency.name}}",
        body: `<p>Dear {{customer.name}},</p>

<p>I wanted to provide you with an update on the current status of your project.</p>

<p><strong>Progress Summary:</strong></p>
<p>[Insert your progress details here]</p>

<p><strong>Next Steps:</strong></p>
<p>[Outline the upcoming milestones or tasks]</p>

<p>If you have any questions or would like to discuss the progress in more detail, please feel free to reach out.</p>

<p>Best regards,<br>
{{user.name}}<br>
{{agency.name}}</p>`,
        mergeFields: ['customer.name', 'user.name', 'agency.name'],
        isDefault: false,
        defaultFor: null,
      },
    ];

    for (const templateData of systemEmailTemplates) {
      await db.insert(schema.emailTemplates).values({
        ...templateData,
        tenantId: null, // null for system-wide templates
        createdBy: null, // null for system-created templates
        ownerType: 'system',
        ownerId: null,
        isShared: false,
        isSystemTemplate: true,
        isActive: true,
        version: 1,
      });
      
      console.log(`Created system email template: ${templateData.name}`);
    }

    console.log(`\nSuccessfully created ${systemEmailTemplates.length} system email templates!`);
    console.log("These templates are now available to all users in the Email Module.");

  } catch (error) {
    console.error("Error seeding system email templates:", error);
    throw error;
  }
}

seedSystemEmailTemplates().then(() => process.exit(0)).catch(() => process.exit(1));
