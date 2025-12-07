# Landing Page CMS

A full-stack Content Management System for your landing page with PostgreSQL database and Medium/Substack blog integration.

## Features

- **Full CMS Admin Dashboard** - Manage all content from `/admin` route
- **PostgreSQL Database** - Powered by Vercel Postgres
- **Authentication** - Secure JWT-based authentication
- **Blog Integration** - Automatic RSS feed from Medium or Substack
- **Dynamic Content** - All sections are editable via CMS:
  - Hero Section
  - About Section
  - Skills & Expertise
  - Experience Timeline
  - Portfolio Items
  - Contact Information
  - Blog Posts (from RSS)

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Vercel Serverless Functions
- **Database**: PostgreSQL (Vercel Postgres)
- **Authentication**: JWT + bcrypt
- **Styling**: CSS with custom variables
- **Deployment**: Vercel

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── db/
│   │   ├── index.ts       # Database connection
│   │   └── schema.sql     # Database schema
│   ├── utils/
│   │   └── auth.ts        # Authentication utilities
│   ├── auth.ts            # Authentication endpoint
│   ├── portfolio.ts       # Portfolio CRUD
│   ├── skills.ts          # Skills CRUD
│   ├── experiences.ts     # Experience CRUD
│   ├── content.ts         # Hero/About/Contact content
│   └── blog.ts            # Blog RSS feed integration
├── src/
│   ├── admin/             # CMS Admin interface
│   │   ├── components/    # Admin UI components
│   │   ├── AdminApp.tsx   # Admin main component
│   │   └── AdminApp.css   # Admin styles
│   ├── App.tsx            # Main landing page
│   ├── App.css            # Landing page styles
│   └── main.tsx           # React router setup
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing project
3. Go to Storage tab
4. Create a new Postgres database
5. Copy the environment variables

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Vercel Postgres credentials:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials from Vercel.

### 4. Initialize Database

Run the SQL schema to create tables. You can do this in one of two ways:

**Option A: Via Vercel Dashboard**
1. Go to your Postgres database in Vercel
2. Open the "Data" tab
3. Click "Query"
4. Copy the contents of `api/db/schema.sql` and run it

**Option B: Via psql command line**
```bash
psql "$POSTGRES_URL" < api/db/schema.sql
```

### 5. Create First Admin User

After deployment, you'll need to create your first admin user. This can only be done once (first user registration doesn't require authentication).

Make a POST request to your deployed site:

```bash
curl -X POST https://your-site.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "username": "admin",
    "email": "admin@example.com",
    "password": "your-secure-password"
  }'
```

Or use the admin interface at `https://your-site.vercel.app/admin` (registration form will appear if no users exist).

### 6. Deploy to Vercel

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

### 7. Set Environment Variables in Vercel

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from your `.env` file
3. Make sure to set `JWT_SECRET` to a strong random string in production

## Usage

### Access the CMS Admin

1. Navigate to `https://your-site.vercel.app/admin`
2. Login with your admin credentials
3. Manage all content from the dashboard

### Admin Features

#### Portfolio Management
- Add, edit, delete portfolio items
- Upload images (external URLs)
- Set order and publish status
- Categorize items

#### Skills Management
- Create skill categories
- Add multiple items per category
- Reorder categories

#### Experience Management
- Add job history entries
- Edit timeline with company, title, period
- Reorder experiences

#### Content Management
- **Hero Section**: Edit title, subtitle, CTA buttons
- **About Section**: Edit about text
- **Contact Info**: Update email, LinkedIn, GitHub links

#### Blog Settings
- Choose platform (Medium or Substack)
- Enter RSS feed URL
  - Medium: `https://medium.com/feed/@username`
  - Substack: `https://yoursubstack.substack.com/feed`
- Preview latest posts
- Enable/disable blog section

### API Endpoints

All API endpoints are available at `/api/`:

- `POST /api/auth` - Login/Register
- `GET /api/portfolio` - Get all portfolio items
- `POST /api/portfolio` - Create portfolio item (auth required)
- `PUT /api/portfolio` - Update portfolio item (auth required)
- `DELETE /api/portfolio?id={id}` - Delete portfolio item (auth required)
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (auth required)
- `PUT /api/skills` - Update skill (auth required)
- `DELETE /api/skills?id={id}` - Delete skill (auth required)
- `GET /api/experiences` - Get all experiences
- `POST /api/experiences` - Create experience (auth required)
- `PUT /api/experiences` - Update experience (auth required)
- `DELETE /api/experiences?id={id}` - Delete experience (auth required)
- `GET /api/content?type={hero|about|contact}` - Get content
- `POST /api/content` - Update content (auth required)
- `GET /api/blog` - Get blog posts from RSS
- `POST /api/blog` - Update blog settings (auth required)

## Security Notes

1. **Change JWT_SECRET** in production to a strong random string
2. **Use HTTPS** - Vercel provides this by default
3. **First User** - Only the first user can self-register, additional users require authentication
4. **Database** - Vercel Postgres is automatically secured
5. **Environment Variables** - Never commit `.env` to git

## Development

### Local Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing API Endpoints Locally

When running locally, API endpoints will be proxied through Vite dev server at `http://localhost:5173/api/*`.

## Troubleshooting

### Database Connection Issues
- Verify all POSTGRES_* environment variables are set correctly
- Check Vercel Postgres dashboard for connection strings
- Ensure database is in the same region as your deployment

### Authentication Issues
- Clear localStorage and try logging in again
- Verify JWT_SECRET is set in environment variables
- Check browser console for error messages

### Blog Not Showing
- Verify RSS URL is correct and accessible
- Check blog settings are enabled in CMS
- Ensure blog platform (Medium/Substack) RSS feed is public

### API Errors
- Check Vercel function logs in dashboard
- Verify all environment variables are set
- Check database schema is initialized correctly

## Migration from Static Content

If you have existing static content in your landing page:

1. Deploy the CMS
2. Login to `/admin`
3. Manually enter your existing content into the CMS
4. The app will automatically fetch from API when available, falling back to defaults

## License

MIT

## Support

For issues or questions, please create an issue in the GitHub repository.
