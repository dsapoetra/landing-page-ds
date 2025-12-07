# Quick Start Guide

Get your CMS-powered landing page running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Local Environment

### Option A: Local Development with PostgreSQL (Recommended)

1. **Copy environment file**:
```bash
cp .env.example .env
```

2. **Update `.env` with your local PostgreSQL credentials**:
```env
POSTGRES_URL=postgres://username:password@localhost:5432/database_name
JWT_SECRET=your-secure-random-string
```

3. **Run database migrations**:
```bash
npm run migrate
```

4. **Create admin user**:
```bash
npm run create-admin
```

5. **Install Vercel CLI** (needed for API routes):
```bash
npm install -g vercel
```

6. **Start the development server**:
```bash
vercel dev
```

Visit `http://localhost:3000` - Full CMS functionality enabled!

### Option B: Frontend Only (Without Database)

To see the frontend without CMS features:

```bash
npm run dev
```

Visit `http://localhost:5173` - You'll see the default content with fallbacks.

## 3. Set Up for Full CMS Functionality

### Deploy to Vercel First

The easiest way to set up the database is through Vercel:

1. Push your code to GitHub
2. Import to Vercel
3. Add Vercel Postgres from Storage tab
4. Set JWT_SECRET in environment variables
5. Run the schema from `api/db/schema.sql` in Vercel Postgres Query tab
6. Create admin user at `/admin`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.

## 4. Access the CMS

After deployment:

1. Go to `https://your-site.vercel.app/admin`
2. Create your admin account (first user only)
3. Start managing your content!

## File Overview

- `CMS_README.md` - Complete CMS documentation
- `DEPLOYMENT.md` - Step-by-step Vercel deployment guide
- `api/` - Backend serverless functions
- `src/admin/` - CMS admin interface
- `src/App.tsx` - Main landing page (now dynamic!)

## What's New?

Your landing page now has:

- **Dynamic Content** - All sections fetch from PostgreSQL database
- **Admin Dashboard** - Manage content at `/admin` route
- **Blog Integration** - Auto-fetch from Medium or Substack RSS
- **Authentication** - Secure JWT-based admin access
- **CRUD APIs** - Full REST API for all content types

## Common Commands

```bash
# Local development with API (recommended)
vercel dev

# Frontend only development (no API/database)
npm run dev

# Database operations
npm run migrate        # Run database migrations
npm run create-admin   # Create/reset admin user

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Deploy to Vercel
vercel
```

## Environment Variables Needed

Copy `.env.example` to `.env` and fill in:

```env
# Note: No quotes needed in .env files
POSTGRES_URL=postgres://username:password@localhost:5432/database_name
JWT_SECRET=generate-a-secure-random-string
```

For local development, use your local PostgreSQL credentials.
For Vercel deployment, these will be auto-populated when you add Vercel Postgres.

## Next Steps

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
2. Read [CMS_README.md](./CMS_README.md) for full documentation
3. Customize styles in `App.css` and `admin/AdminApp.css`
4. Add your content via the CMS admin panel

## Need Help?

Check the troubleshooting sections in:
- [CMS_README.md](./CMS_README.md#troubleshooting)
- [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)
