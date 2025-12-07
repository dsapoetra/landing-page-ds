import type { VercelRequest, VercelResponse } from '@vercel/node';
import Parser from 'rss-parser';
import { query } from './db/index';
import { authenticateRequest } from './utils/auth';

const parser = new Parser();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Fetch blog posts from RSS
    if (req.method === 'GET') {
      // Get blog settings
      const settingsResult = await query(
        'SELECT * FROM blog_settings WHERE enabled = true ORDER BY id DESC LIMIT 1'
      );

      if (settingsResult.rows.length === 0) {
        return res.status(200).json({ data: [], settings: null });
      }

      const settings = settingsResult.rows[0];

      try {
        const feed = await parser.parseURL(settings.rss_url);

        const posts = feed.items.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          author: item.creator || item['dc:creator'] || settings.username,
          contentSnippet: item.contentSnippet?.substring(0, 200) + '...' || '',
          categories: item.categories || [],
          guid: item.guid || item.link,
        }));

        return res.status(200).json({
          data: posts,
          settings: {
            platform: settings.platform,
            username: settings.username,
          },
        });
      } catch (error) {
        console.error('RSS feed parsing error:', error);
        return res.status(200).json({
          data: [],
          error: 'Failed to fetch blog posts',
          settings: {
            platform: settings.platform,
            username: settings.username,
          },
        });
      }
    }

    // POST/PUT - Update blog settings (authenticated)
    if (req.method === 'POST' || req.method === 'PUT') {
      const user = authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { platform, rss_url, username, enabled } = req.body;

      if (!platform || !rss_url) {
        return res.status(400).json({ error: 'Platform and RSS URL are required' });
      }

      if (!['medium', 'substack'].includes(platform)) {
        return res.status(400).json({ error: 'Platform must be "medium" or "substack"' });
      }

      // Check if settings exist
      const existing = await query('SELECT id FROM blog_settings LIMIT 1');

      let result;
      if (existing.rows.length > 0) {
        result = await query(
          `UPDATE blog_settings SET
             platform = $1,
             rss_url = $2,
             username = $3,
             enabled = COALESCE($4, enabled),
             updated_at = CURRENT_TIMESTAMP
           WHERE id = $5 RETURNING *`,
          [platform, rss_url, username, enabled, existing.rows[0].id]
        );
      } else {
        result = await query(
          'INSERT INTO blog_settings (platform, rss_url, username, enabled) VALUES ($1, $2, $3, $4) RETURNING *',
          [platform, rss_url, username, enabled !== undefined ? enabled : true]
        );
      }

      return res.status(200).json({ data: result.rows[0] });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Blog API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
