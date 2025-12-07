# Deployment Guide for Vercel

This guide will walk you through deploying your landing page CMS to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- Git installed locally

## Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with CMS"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

## Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration
5. Click "Deploy" (don't worry about environment variables yet)

## Step 3: Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Choose a name for your database
5. Select a region (same as your deployment region)
6. Click "Create"

After creation, Vercel will show you the environment variables. **Keep this page open.**

## Step 4: Connect Database to Project

1. In the Postgres database page, click "Connect Project"
2. Select your landing page project
3. This automatically adds all POSTGRES_* environment variables to your project

## Step 5: Add JWT Secret

1. Go to Project Settings → Environment Variables
2. Add a new variable:
   - **Name**: `JWT_SECRET`
   - **Value**: Generate a secure random string (at least 32 characters)
   - You can use this command to generate one:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
3. Make sure it's available for all environments (Production, Preview, Development)

## Step 6: Initialize Database Schema

You need to run the SQL schema to create all necessary tables:

### Option A: Via Vercel Dashboard (Recommended)

1. Go to your Vercel Postgres database
2. Click the "Data" tab
3. Click "Query"
4. Copy the entire contents of `api/db/schema.sql`
5. Paste into the query editor
6. Click "Run Query"

### Option B: Via Command Line

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project:
   ```bash
   vercel link
   ```

4. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

5. Run the schema:
   ```bash
   # If you have psql installed
   psql "$(grep POSTGRES_URL .env.local | cut -d '=' -f2)" < api/db/schema.sql
   ```

## Step 7: Redeploy Your Project

After setting up the database and environment variables:

1. Go to your Vercel project
2. Click "Deployments" tab
3. Click the three dots (•••) on the latest deployment
4. Click "Redeploy"
5. Check "Use existing Build Cache" (optional)
6. Click "Redeploy"

## Step 8: Create Your Admin User

Once deployed, create your first admin user:

### Option A: Via API Call

```bash
curl -X POST https://your-site.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "username": "admin",
    "email": "your-email@example.com",
    "password": "YourSecurePassword123!"
  }'
```

### Option B: Via Admin Interface

1. Go to `https://your-site.vercel.app/admin`
2. Since no users exist, you'll see a registration form
3. Fill in your details
4. Submit to create your admin account

## Step 9: Configure Your Content

1. Login to `/admin` with your credentials
2. Start adding content:
   - Update Hero section text
   - Add your About content
   - Add Skills & Expertise
   - Add Experience timeline
   - Add Portfolio items
   - Update Contact information
   - (Optional) Configure Blog RSS feed

## Step 10: Set Up Blog Integration (Optional)

### For Medium:

1. Go to Admin → Blog Settings
2. Select "Medium" as platform
3. Enter RSS URL: `https://medium.com/feed/@yourusername`
4. Enter your Medium username
5. Enable blog section
6. Save settings

### For Substack:

1. Go to Admin → Blog Settings
2. Select "Substack" as platform
3. Enter RSS URL: `https://yoursubstack.substack.com/feed`
4. Enter your Substack username
5. Enable blog section
6. Save settings

## Automatic Deployments

Vercel automatically deploys when you push to your GitHub repository:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

## Environment Variables for Local Development

To work locally with the same environment:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel env pull` to download environment variables
3. Run `npm run dev` to start local development

## Troubleshooting

### Database Connection Errors

**Error**: "Could not connect to database"

**Solution**:
- Verify all POSTGRES_* variables are set in Vercel
- Redeploy after adding variables
- Check database is in the same region as deployment

### API Routes Not Working

**Error**: 404 on /api/* routes

**Solution**:
- Ensure `vercel.json` exists and is properly configured
- Check that `api/` folder is in root directory
- Redeploy the project

### Authentication Failing

**Error**: "Unauthorized" or "Invalid token"

**Solution**:
- Verify JWT_SECRET is set in Vercel environment variables
- Clear browser localStorage and cookies
- Try creating a new admin user

### Blog Not Showing Posts

**Error**: No blog posts appear on homepage

**Solution**:
- Verify RSS URL is correct and publicly accessible
- Check blog is enabled in Admin → Blog Settings
- Verify RSS feed follows standard RSS 2.0 format
- Check browser console for errors

### Deployment Fails

**Error**: Build fails during deployment

**Solution**:
- Check Vercel deployment logs for specific errors
- Verify package.json has all dependencies
- Try `npm install` and `npm run build` locally
- Check TypeScript errors with `npm run lint`

## Performance Optimization

### Enable Caching

Vercel automatically caches static assets. For API routes:

```typescript
// Add to your API routes if needed
res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
```

### Image Optimization

For portfolio images, consider using:
- Vercel Image Optimization (automatically enabled)
- External CDN like Cloudinary or imgix
- Properly sized images (max 1200px width recommended)

## Security Checklist

- [ ] Changed JWT_SECRET to a strong random string
- [ ] Created admin user with strong password
- [ ] Environment variables are set in Vercel (not in code)
- [ ] `.env` is in `.gitignore`
- [ ] Database is in same region as deployment for better latency
- [ ] CORS is properly configured (currently allows all origins)

## Monitoring

### View Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment
5. View "Functions" tab to see serverless function logs

### Database Queries

1. Go to Storage → Your Postgres database
2. Click "Query" to run SQL queries
3. Monitor database usage in "Insights" tab

## Costs

### Vercel Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function execution

### Vercel Postgres Free Tier Includes:
- 256 MB database storage
- 60 hours of compute time/month

**For most personal landing pages, the free tier is sufficient.**

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- Check Vercel deployment logs for errors
- Review CMS_README.md for usage instructions

## Next Steps

After successful deployment:

1. Customize the design in `App.css` and `AdminApp.css`
2. Add your own branding and colors
3. Add analytics (Google Analytics, Plausible, etc.)
4. Set up custom domain in Vercel
5. Enable Web Analytics in Vercel project settings (free)
