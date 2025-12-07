import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { getPool } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '..', '..', '.env');
config({ path: envPath, override: true });

async function createAdmin() {
  const email = 'angga.dimassaputra@gmail.com';
  const password = 'D54poetra';
  const username = 'admin';

  try {
    console.log('Creating admin user...\n');

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert the user
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email)
       DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = CURRENT_TIMESTAMP
       RETURNING id, username, email, created_at`,
      [username, email, passwordHash]
    );

    console.log('✓ Admin user created successfully!');
    console.log('\nUser details:');
    console.log('  ID:', result.rows[0].id);
    console.log('  Username:', result.rows[0].username);
    console.log('  Email:', result.rows[0].email);
    console.log('  Created at:', result.rows[0].created_at);
    console.log('\nYou can now login with:');
    console.log('  Email:', email);
    console.log('  Password:', password);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdmin();
