import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import formidable from 'formidable';
import { authenticateRequest } from './utils/auth';
import { readFile } from 'fs/promises';

// Disable body parsing, need to handle multipart data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate user
  const user = authenticateRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: 'Upload failed' });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Handle both single file and array of files
      const uploadedFile = Array.isArray(file) ? file[0] : file;

      if (!uploadedFile || !uploadedFile.filepath) {
        return res.status(400).json({ error: 'Invalid file' });
      }

      try {
        // Read the file from temp location
        const fileBuffer = await readFile(uploadedFile.filepath);

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const ext = uploadedFile.originalFilename?.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${randomString}.${ext}`;

        // Upload to Vercel Blob
        const blob = await put(filename, fileBuffer, {
          access: 'public',
          contentType: uploadedFile.mimetype || 'image/jpeg',
        });

        return res.status(200).json({
          success: true,
          url: blob.url,
          filename: filename,
        });
      } catch (uploadError) {
        console.error('Blob upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload to storage' });
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
