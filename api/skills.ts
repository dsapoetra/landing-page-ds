import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db/index';
import { authenticateRequest } from './utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM skills ORDER BY order_index ASC');
      return res.status(200).json({ data: result.rows });
    }

    if (req.method === 'POST') {
      const user = authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { category, items, order_index } = req.body;

      if (!category || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await query(
        'INSERT INTO skills (category, items, order_index) VALUES ($1, $2, $3) RETURNING *',
        [category, items, order_index || 0]
      );

      return res.status(201).json({ data: result.rows[0] });
    }

    if (req.method === 'PUT') {
      const user = authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id, category, items, order_index } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      const result = await query(
        `UPDATE skills
         SET category = COALESCE($2, category),
             items = COALESCE($3, items),
             order_index = COALESCE($4, order_index),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id, category, items, order_index]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Skill not found' });
      }

      return res.status(200).json({ data: result.rows[0] });
    }

    if (req.method === 'DELETE') {
      const user = authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      await query('DELETE FROM skills WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Skill deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Skills API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
