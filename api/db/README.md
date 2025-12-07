# Database Migrations

This directory contains the database schema and migration system for the landing page CMS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your database connection by setting the `POSTGRES_URL` environment variable in your `.env` file:
```
POSTGRES_URL=your_postgres_connection_string
```

## Running Migrations

To run all pending migrations:

```bash
npm run migrate
```

The migration system will:
- Create a `migrations` table if it doesn't exist
- Track which migrations have been executed
- Run only new migrations that haven't been executed yet
- Use transactions to ensure data integrity

## Creating New Migrations

To create a new migration:

1. Create a new `.sql` file in the `migrations/` directory
2. Use a numbered prefix (e.g., `002_add_new_table.sql`)
3. Write your SQL statements in the file

Example migration file:
```sql
-- Migration: Add new feature
-- Created: 2025-12-07
-- Description: Adds a new table for feature X

CREATE TABLE IF NOT EXISTS new_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Migration Files

- `001_initial_schema.sql` - Initial database schema with all core tables
- `schema.sql` - Reference schema file (kept for documentation)

## Database Tables

The database includes the following tables:

- **users** - CMS authentication
- **portfolio_items** - Portfolio projects
- **skills** - Skills and expertise categories
- **experiences** - Work experience/job history
- **about_content** - About section content
- **hero_content** - Hero section content
- **contact_info** - Contact information
- **blog_settings** - Blog RSS feed configuration
- **migrations** - Migration tracking (auto-created)

## Notes

- Migrations are executed in alphabetical order
- Each migration runs in a transaction
- Failed migrations will be rolled back automatically
- The migration system is idempotent - you can run it multiple times safely
