import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL;

    if (!connectionString) {
      console.error('POSTGRES_URL environment variable is not set!');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('POSTGRES')));
      throw new Error('Database connection string is not configured. Please set POSTGRES_URL environment variable.');
    }

    console.log('Connecting to database with connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result;
}
