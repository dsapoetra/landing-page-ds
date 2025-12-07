import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db/index';
import { authenticateRequest } from './utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Fetch all published portfolio items
    if (req.method === 'GET') {
      const result = await query(
        'SELECT * FROM portfolio_items WHERE published = true ORDER BY order_index ASC, created_at DESC'
      );
      return res.status(200).json({ data: result.rows });
    }

    // POST - Create new portfolio item (authenticated)
    if (req.method === 'POST') {
      const user = authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { title, description, image_url, link, category, order_index } = req.body;

      if (!title || !description || !image_url || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await query(
        `INSERT INTO portfolio_items (title, description, image_url, link, category, order_index)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, description, image_url, link || '', category, order_index || 0]
      );

      return res.status(201).json({ data: result.rows[0] });
    }

    // PUT - Update portfolio item (authenticated)
    if (req.method === 'PUT') {
      const user = authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id, title, description, image_url, link, category, order_index, published } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      const result = await query(
        `UPDATE portfolio_items
         SET title = COALESCE($2, title),
             description = COALESCE($3, description),
             image_url = COALESCE($4, image_url),
             link = COALESCE($5, link),
             category = COALESCE($6, category),
             order_index = COALESCE($7, order_index),
             published = COALESCE($8, published),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id, title, description, image_url, link, category, order_index, published]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Portfolio item not found' });
      }

      return res.status(200).json({ data: result.rows[0] });
    }

    // DELETE - Delete portfolio item (authenticated)
    if (req.method === 'DELETE') {
      const user = authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      await query('DELETE FROM portfolio_items WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Portfolio item deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Portfolio API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
