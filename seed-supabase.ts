import pkg from 'pg';
import * as bcrypt from 'bcryptjs';

const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.SUPABASE_DATABASE_URL });

async function seedData() {
  try {
    // Create demo tenant
    const tenantResult = await pool.query(
      'INSERT INTO tenants (id, name, status) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING RETURNING id',
      ['demo-tenant', 'Demo Tenant', 'active']
    );
    console.log('Tenant created/exists:', tenantResult.rows.length > 0);

    // Create demo user
    const passwordHash = await bcrypt.hash('password123', 10);
    const userResult = await pool.query(
      'INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role_id, is_admin, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING RETURNING id',
      [
        'demo-user',
        'demo-tenant',
        'demo@acmetech.com',
        passwordHash,
        'Demo',
        'User',
        'admin-role',
        true,
        true
      ]
    );
    console.log('User created/exists:', userResult.rows.length > 0);
    
    // Create super admin tenant and user
    const adminTenant = await pool.query(
      'INSERT INTO tenants (id, name, status) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING RETURNING id',
      ['nexus-admin', 'Nexus CRM Admin', 'active']
    );
    console.log('Admin tenant created/exists:', adminTenant.rows.length > 0);
    
    const adminHash = await bcrypt.hash('password123', 10);
    const adminUser = await pool.query(
      'INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role_id, is_admin, is_active, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING RETURNING id',
      [
        'superadmin-user',
        'nexus-admin',
        'superadmin@nexuscrm.com',
        adminHash,
        'Super',
        'Admin',
        'super-admin-role',
        true,
        true,
        'super_admin'
      ]
    );
    console.log('Super admin created/exists:', adminUser.rows.length > 0);

    console.log('✓ Seed data applied successfully');
    
    // Verify
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`Total users in Supabase: ${userCount.rows[0].count}`);
    
  } catch (err: any) {
    console.error('Seed error:', err.message);
  } finally {
    await pool.end();
  }
}

seedData();
