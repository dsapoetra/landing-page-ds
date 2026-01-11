import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

// Import handlers
import authHandler from './auth';
import blogHandler from './blog';
import contentHandler from './content';
import experiencesHandler from './experiences';
import portfolioHandler from './portfolio';
import skillsHandler from './skills';
import uploadHandler from './upload';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Adapter to convert Express req/res to Vercel-like req/res
const adapt = (handler: Function) => async (req: express.Request, res: express.Response) => {
  try {
    // Merge params into query to match Vercel behavior
    (req as any).query = { ...req.query, ...req.params };
    await handler(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Routes
app.all('/api/auth', adapt(authHandler));
app.all('/api/blog', adapt(blogHandler));
app.all('/api/content', adapt(contentHandler));
app.all('/api/experiences', adapt(experiencesHandler));
app.all('/api/experiences/:id', adapt(experiencesHandler));
app.all('/api/portfolio', adapt(portfolioHandler));
app.all('/api/portfolio/:id', adapt(portfolioHandler));
app.all('/api/skills', adapt(skillsHandler));
app.all('/api/skills/:id', adapt(skillsHandler));
app.all('/api/upload', adapt(uploadHandler));

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
