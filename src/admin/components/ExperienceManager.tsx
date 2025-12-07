import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface Experience {
  id?: number;
  job_title: string;
  company: string;
  period: string;
  description: string;
  order_index: number;
}

function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${API_BASE}/experiences`);
      const data = await response.json();
      setExperiences(data.data || []);
    } catch (err) {
      console.error('Failed to fetch experiences', err);
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    const token = localStorage.getItem('cms_token');
    const method = editing.id ? 'PUT' : 'POST';

    try {
      await fetch(`${API_BASE}/experiences`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editing),
      });

      await fetchExperiences();
      setEditing(null);
    } catch (err) {
      console.error('Failed to save experience');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this experience?')) return;

    const token = localStorage.getItem('cms_token');
    await fetch(`${API_BASE}/experiences?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchExperiences();
  };

  return (
    <div className="manager-section">
      <div className="section-header">
        <h2>Experience</h2>
        <button onClick={() => setEditing({ job_title: '', company: '', period: '', description: '', order_index: 0 })} className="btn-primary">Add New</button>
      </div>

      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editing.id ? 'Edit' : 'New'} Experience</h3>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                value={editing.job_title}
                onChange={(e) => setEditing({ ...editing, job_title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                value={editing.company}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Period</label>
              <input
                type="text"
                value={editing.period}
                onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                placeholder="e.g., 2020 - Present"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Order Index</label>
              <input
                type="number"
                value={editing.order_index}
                onChange={(e) => setEditing({ ...editing, order_index: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-actions">
              <button onClick={handleSave} className="btn-primary">Save</button>
              <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="items-list">
        {experiences.map((exp) => (
          <div key={exp.id} className="list-item">
            <h4>{exp.job_title}</h4>
            <p>{exp.company} • {exp.period}</p>
            <div className="item-actions">
              <button onClick={() => setEditing({ ...exp })} className="btn-small">Edit</button>
              <button onClick={() => handleDelete(exp.id!)} className="btn-small btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExperienceManager;
