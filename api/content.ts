import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db/index';
import { authenticateRequest } from './utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { type } = req.query;

      if (!type || !['about', 'hero', 'contact'].includes(type as string)) {
        return res.status(400).json({ error: 'Invalid content type' });
      }

      let result;
      if (type === 'about') {
        result = await query('SELECT * FROM about_content ORDER BY id DESC LIMIT 1');
      } else if (type === 'hero') {
        result = await query('SELECT * FROM hero_content ORDER BY id DESC LIMIT 1');
      } else if (type === 'contact') {
        result = await query('SELECT * FROM contact_info ORDER BY id DESC LIMIT 1');
      }

      return res.status(200).json({ data: result.rows[0] || null });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const user = authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { type, ...content } = req.body;

      if (!type || !['about', 'hero', 'contact'].includes(type)) {
        return res.status(400).json({ error: 'Invalid content type' });
      }

      let result;
      if (type === 'about') {
        const { content: aboutContent } = content;
        if (!aboutContent) {
          return res.status(400).json({ error: 'Content is required' });
        }

        // Check if exists
        const existing = await query('SELECT id FROM about_content LIMIT 1');
        if (existing.rows.length > 0) {
          result = await query(
            'UPDATE about_content SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [aboutContent, existing.rows[0].id]
          );
        } else {
          result = await query(
            'INSERT INTO about_content (content) VALUES ($1) RETURNING *',
            [aboutContent]
          );
        }
      } else if (type === 'hero') {
        const { title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link } = content;

        const existing = await query('SELECT id FROM hero_content LIMIT 1');
        if (existing.rows.length > 0) {
          result = await query(
            `UPDATE hero_content SET
               title = COALESCE($1, title),
               subtitle = COALESCE($2, subtitle),
               cta_primary_text = COALESCE($3, cta_primary_text),
               cta_primary_link = COALESCE($4, cta_primary_link),
               cta_secondary_text = COALESCE($5, cta_secondary_text),
               cta_secondary_link = COALESCE($6, cta_secondary_link),
               updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 RETURNING *`,
            [title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, existing.rows[0].id]
          );
        } else {
          result = await query(
            `INSERT INTO hero_content (title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link]
          );
        }
      } else if (type === 'contact') {
        const { email, linkedin, github } = content;

        const existing = await query('SELECT id FROM contact_info LIMIT 1');
        if (existing.rows.length > 0) {
          result = await query(
            `UPDATE contact_info SET
               email = COALESCE($1, email),
               linkedin = COALESCE($2, linkedin),
               github = COALESCE($3, github),
               updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 RETURNING *`,
            [email, linkedin, github, existing.rows[0].id]
          );
        } else {
          result = await query(
            'INSERT INTO contact_info (email, linkedin, github) VALUES ($1, $2, $3) RETURNING *',
            [email, linkedin, github]
          );
        }
      }

      return res.status(200).json({ data: result.rows[0] });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Content API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
