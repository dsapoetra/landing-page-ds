import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './db/index';
import { hashPassword, comparePassword, generateToken, authenticateRequest } from './utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // POST /api/auth - Login
    if (req.method === 'POST') {
      const { action, username, password, email } = req.body;

      if (action === 'login') {
        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check for username or email
        const result = await query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);

        if (result.rows.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isValid = await comparePassword(password, user.password_hash);

        if (!isValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.username);

        return res.status(200).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      }

      if (action === 'register') {
        // First user registration only or authenticated admin
        const existingUsers = await query('SELECT COUNT(*) as count FROM users');
        const userCount = parseInt(existingUsers.rows[0].count);

        if (userCount > 0) {
          // Require authentication for additional users
          const authUser = authenticateRequest(req);
          if (!authUser) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
        }

        if (!username || !password || !email) {
          return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        // Check if user exists
        const existing = await query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);

        if (existing.rows.length > 0) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }

        const passwordHash = await hashPassword(password);
        const result = await query(
          'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
          [username, email, passwordHash]
        );

        const newUser = result.rows[0];
        const token = generateToken(newUser.id, newUser.username);

        return res.status(201).json({
          token,
          user: newUser,
        });
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    // GET /api/auth - Verify token
    if (req.method === 'GET') {
      const user = authenticateRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res.status(200).json({ user });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
