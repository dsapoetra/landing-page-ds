import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function ContentManager() {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'contact'>('hero');
  const [heroContent, setHeroContent] = useState<any>({});
  const [aboutContent, setAboutContent] = useState('');
  const [contactInfo, setContactInfo] = useState<any>({});

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE}/content?type=${activeTab}`);
      const data = await response.json();

      if (data.data) {
        if (activeTab === 'hero') setHeroContent(data.data);
        else if (activeTab === 'about') setAboutContent(data.data.content || '');
        else if (activeTab === 'contact') setContactInfo(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch content', err);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('cms_token');
    let body: any = { type: activeTab };

    if (activeTab === 'hero') {
      body = { ...body, ...heroContent };
    } else if (activeTab === 'about') {
      body.content = aboutContent;
    } else if (activeTab === 'contact') {
      body = { ...body, ...contactInfo };
    }

    try {
      await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      alert('Content saved successfully!');
    } catch (err) {
      alert('Failed to save content');
    }
  };

  return (
    <div className="manager-section">
      <h2>Content Management</h2>

      <div className="tabs">
        <button
          className={activeTab === 'hero' ? 'active' : ''}
          onClick={() => setActiveTab('hero')}
        >
          Hero Section
        </button>
        <button
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          About Section
        </button>
        <button
          className={activeTab === 'contact' ? 'active' : ''}
          onClick={() => setActiveTab('contact')}
        >
          Contact Info
        </button>
      </div>

      <div className="content-form">
        {activeTab === 'hero' && (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={heroContent.title || ''}
                onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <textarea
                value={heroContent.subtitle || ''}
                onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Primary CTA Text</label>
              <input
                type="text"
                value={heroContent.cta_primary_text || ''}
                onChange={(e) => setHeroContent({ ...heroContent, cta_primary_text: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Primary CTA Link</label>
              <input
                type="text"
                value={heroContent.cta_primary_link || ''}
                onChange={(e) => setHeroContent({ ...heroContent, cta_primary_link: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Secondary CTA Text</label>
              <input
                type="text"
                value={heroContent.cta_secondary_text || ''}
                onChange={(e) => setHeroContent({ ...heroContent, cta_secondary_text: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Secondary CTA Link</label>
              <input
                type="text"
                value={heroContent.cta_secondary_link || ''}
                onChange={(e) => setHeroContent({ ...heroContent, cta_secondary_link: e.target.value })}
              />
            </div>
          </>
        )}

        {activeTab === 'about' && (
          <div className="form-group">
            <label>About Content</label>
            <textarea
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              rows={10}
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={contactInfo.email || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input
                type="text"
                value={contactInfo.linkedin || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>GitHub URL</label>
              <input
                type="text"
                value={contactInfo.github || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, github: e.target.value })}
              />
            </div>
          </>
        )}

        <button onClick={handleSave} className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
}

export default ContentManager;
