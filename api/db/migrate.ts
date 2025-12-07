import { config } from 'dotenv';
import { getPool } from './index.js';
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root
const envPath = join(__dirname, '..', '..', '.env');
const result = config({ path: envPath, override: true });

interface Migration {
  id: number;
  name: string;
  executed_at: Date;
}

async function createMigrationsTable() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Migrations table ready');
}

async function getExecutedMigrations(): Promise<Set<string>> {
  const pool = getPool();
  const result = await pool.query<Migration>(
    'SELECT name FROM migrations ORDER BY id'
  );
  return new Set(result.rows.map(row => row.name));
}

async function getMigrationFiles(): Promise<string[]> {
  const migrationsDir = join(__dirname, 'migrations');
  const files = await readdir(migrationsDir);
  return files
    .filter(file => file.endsWith('.sql'))
    .sort();
}

async function executeMigration(filename: string) {
  const pool = getPool();
  const migrationsDir = join(__dirname, 'migrations');
  const filepath = join(migrationsDir, filename);

  console.log(`Running migration: ${filename}`);

  const sql = await readFile(filepath, 'utf-8');

  try {
    await pool.query('BEGIN');
    await pool.query(sql);
    await pool.query(
      'INSERT INTO migrations (name) VALUES ($1)',
      [filename]
    );
    await pool.query('COMMIT');
    console.log(`  ✓ ${filename} completed successfully`);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(`  ✗ ${filename} failed:`, error);
    throw error;
  }
}

export async function runMigrations() {
  try {
    console.log('Starting database migrations...\n');

    await createMigrationsTable();

    const executedMigrations = await getExecutedMigrations();
    const migrationFiles = await getMigrationFiles();

    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.has(file)
    );

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migration(s)\n`);

    for (const migration of pendingMigrations) {
      await executeMigration(migration);
    }

    console.log('\nAll migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\nMigration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}
