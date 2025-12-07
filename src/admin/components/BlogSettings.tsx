import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function BlogSettings() {
  const [platform, setPlatform] = useState<'medium' | 'substack'>('medium');
  const [rssUrl, setRssUrl] = useState('');
  const [username, setUsername] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/blog`);
      const data = await response.json();

      if (data.settings) {
        setPlatform(data.settings.platform);
        setUsername(data.settings.username || '');
      }

      if (data.data) {
        setPreview(data.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to fetch blog settings', err);
    }
  };

  const handleSave = async () => {
    if (!rssUrl) {
      alert('RSS URL is required');
      return;
    }

    const token = localStorage.getItem('cms_token');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform,
          rss_url: rssUrl,
          username,
          enabled,
        }),
      });

      if (response.ok) {
        alert('Blog settings saved successfully!');
        fetchSettings();
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getRssUrlHelper = () => {
    if (platform === 'medium') {
      return 'Format: https://medium.com/feed/@username';
    } else {
      return 'Format: https://yoursubstack.substack.com/feed';
    }
  };

  return (
    <div className="manager-section">
      <h2>Blog Settings</h2>

      <div className="content-form">
        <div className="form-group">
          <label>Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
            <option value="medium">Medium</option>
            <option value="substack">Substack</option>
          </select>
          <small className="help-text">{getRssUrlHelper()}</small>
        </div>

        <div className="form-group">
          <label>RSS Feed URL</label>
          <input
            type="text"
            value={rssUrl}
            onChange={(e) => setRssUrl(e.target.value)}
            placeholder={platform === 'medium' ? 'https://medium.com/feed/@username' : 'https://yoursubstack.substack.com/feed'}
          />
        </div>

        <div className="form-group">
          <label>Username (optional)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Enable blog section
          </label>
        </div>

        <button onClick={handleSave} disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {preview.length > 0 && (
        <div className="blog-preview">
          <h3>Preview (Latest 3 Posts)</h3>
          <div className="preview-list">
            {preview.map((post, index) => (
              <div key={index} className="preview-item">
                <h4>{post.title}</h4>
                <p className="preview-date">{new Date(post.pubDate).toLocaleDateString()}</p>
                <p className="preview-snippet">{post.contentSnippet}</p>
                <a href={post.link} target="_blank" rel="noopener noreferrer">Read more →</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogSettings;
