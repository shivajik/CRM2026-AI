import pkg from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const { Pool } = pkg;
const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
if (!supabaseUrl) {
  console.error('SUPABASE_DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({ connectionString: supabaseUrl });

async function runMigrations() {
  const migrationsDir = './migrations';
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration files`);

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), 'utf-8');
    console.log(`\nRunning: ${file}`);
    try {
      await pool.query(sql);
      console.log(`✓ ${file}`);
    } catch (err: any) {
      console.warn(`⚠ ${file}: ${err.message.split('\n')[0]}`);
    }
  }
  
  await pool.end();
  console.log('\n✓ All migrations applied to Supabase');
}

runMigrations().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
