import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("ERROR: SUPABASE_DATABASE_URL or DATABASE_URL required");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function seedProduction() {
  const client = await pool.connect();

  try {
    console.log("Starting production seed...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS modules (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name VARCHAR NOT NULL UNIQUE,
        display_name VARCHAR NOT NULL,
        description TEXT,
        icon VARCHAR,
        is_core BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const defaultModules = [
      { name: "contacts", displayName: "Contacts", description: "Manage your contacts", icon: "users", isCore: true },
      { name: "customers", displayName: "Customers", description: "Manage customers and accounts", icon: "building", isCore: true },
      { name: "deals", displayName: "Deals", description: "Track sales opportunities", icon: "briefcase", isCore: true },
      { name: "tasks", displayName: "Tasks", description: "Manage tasks and activities", icon: "check-square", isCore: true },
      { name: "products", displayName: "Products", description: "Product and service catalog", icon: "package", isCore: true },
      { name: "quotations", displayName: "Quotations", description: "Create and manage quotes", icon: "file-text", isCore: true },
      { name: "invoices", displayName: "Invoices", description: "Billing and invoicing", icon: "receipt", isCore: true },
      { name: "activities", displayName: "Activities", description: "Track calls, meetings, and notes", icon: "activity", isCore: true },
      { name: "reports", displayName: "Reports", description: "Analytics and reporting", icon: "bar-chart", isCore: true },
    ];

    for (const mod of defaultModules) {
      await client.query(
        `INSERT INTO modules (name, display_name, description, icon, is_core)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (name) DO NOTHING`,
        [mod.name, mod.displayName, mod.description, mod.icon, mod.isCore]
      );
    }
    console.log("Modules seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name VARCHAR NOT NULL UNIQUE,
        display_name VARCHAR NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        billing_cycle VARCHAR DEFAULT 'monthly',
        is_active BOOLEAN DEFAULT true,
        is_popular BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        features TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS package_modules (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        package_id VARCHAR NOT NULL,
        module_id VARCHAR NOT NULL,
        UNIQUE(package_id, module_id)
      )
    `);

    const modulesResult = await client.query(`SELECT id, name FROM modules`);
    const moduleMap = new Map(modulesResult.rows.map((r: any) => [r.name, r.id]));

    const starterModules = ['contacts', 'deals', 'tasks'];
    const professionalModules = ['contacts', 'customers', 'deals', 'tasks', 'products', 'quotations', 'activities'];
    const enterpriseModules = ['contacts', 'customers', 'deals', 'tasks', 'products', 'quotations', 'invoices', 'activities', 'reports'];

    const packages = [
      {
        name: 'starter',
        displayName: 'Starter',
        description: 'Perfect for small teams just getting started with CRM',
        price: 29.00,
        features: ['Up to 5 team members', '1,000 contacts', 'Basic pipeline management', 'Email support', 'Mobile app access'],
        moduleNames: starterModules,
        sortOrder: 1,
        isPopular: false
      },
      {
        name: 'professional',
        displayName: 'Professional',
        description: 'For growing teams that need more power and flexibility',
        price: 79.00,
        features: ['Up to 25 team members', '10,000 contacts', 'Advanced pipeline & forecasting', 'Customer management', 'Quotation management', 'Activity tracking', 'Priority email support', 'API access'],
        moduleNames: professionalModules,
        sortOrder: 2,
        isPopular: true
      },
      {
        name: 'enterprise',
        displayName: 'Enterprise',
        description: 'For large organizations with advanced needs',
        price: 199.00,
        features: ['Unlimited team members', 'Unlimited contacts', 'All CRM modules included', 'Advanced reporting & analytics', 'Invoice management', 'Custom integrations', 'Dedicated account manager', '24/7 phone support', 'SLA guarantees'],
        moduleNames: enterpriseModules,
        sortOrder: 3,
        isPopular: false
      }
    ];

    for (const pkg of packages) {
      const result = await client.query(
        `INSERT INTO packages (name, display_name, description, price, billing_cycle, is_active, is_popular, sort_order, features)
         VALUES ($1, $2, $3, $4, 'monthly', true, $5, $6, $7)
         ON CONFLICT (name) DO UPDATE SET display_name = $2, description = $3, price = $4
         RETURNING id`,
        [pkg.name, pkg.displayName, pkg.description, pkg.price, pkg.isPopular, pkg.sortOrder, pkg.features]
      );

      const packageId = result.rows[0].id;
      for (const modName of pkg.moduleNames) {
        const moduleId = moduleMap.get(modName);
        if (moduleId) {
          await client.query(
            `INSERT INTO package_modules (package_id, module_id)
             VALUES ($1, $2)
             ON CONFLICT (package_id, module_id) DO NOTHING`,
            [packageId, moduleId]
          );
        }
      }
    }
    console.log("Packages seeded");

    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name VARCHAR NOT NULL UNIQUE,
        permissions TEXT[]
      )
    `);

    await client.query(
      `INSERT INTO roles (name, permissions)
       VALUES ('admin', ARRAY['*'])
       ON CONFLICT (name) DO NOTHING`
    );
    console.log("Admin role seeded");

    console.log("Production seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedProduction().catch(console.error);
