import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface Skill {
  id?: number;
  category: string;
  items: string[];
  order_index: number;
}

function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [itemsText, setItemsText] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_BASE}/skills`);
      const data = await response.json();
      setSkills(data.data || []);
    } catch (err) {
      console.error('Failed to fetch skills', err);
    }
  };

  const handleSave = async () => {
    if (!editingSkill) return;

    const token = localStorage.getItem('cms_token');
    const method = editingSkill.id ? 'PUT' : 'POST';
    const items = itemsText.split('\n').filter(item => item.trim());

    try {
      await fetch(`${API_BASE}/skills`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...editingSkill, items }),
      });

      await fetchSkills();
      setEditingSkill(null);
      setItemsText('');
    } catch (err) {
      console.error('Failed to save skill');
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setItemsText(skill.items.join('\n'));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this skill category?')) return;

    const token = localStorage.getItem('cms_token');
    await fetch(`${API_BASE}/skills?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchSkills();
  };

  return (
    <div className="manager-section">
      <div className="section-header">
        <h2>Skills & Expertise</h2>
        <button onClick={() => { setEditingSkill({ category: '', items: [], order_index: 0 }); setItemsText(''); }} className="btn-primary">Add New</button>
      </div>

      {editingSkill && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingSkill.id ? 'Edit' : 'New'} Skill Category</h3>
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                value={editingSkill.category}
                onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Items (one per line)</label>
              <textarea
                value={itemsText}
                onChange={(e) => setItemsText(e.target.value)}
                rows={6}
              />
            </div>
            <div className="form-group">
              <label>Order Index</label>
              <input
                type="number"
                value={editingSkill.order_index}
                onChange={(e) => setEditingSkill({ ...editingSkill, order_index: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-actions">
              <button onClick={handleSave} className="btn-primary">Save</button>
              <button onClick={() => setEditingSkill(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="items-list">
        {skills.map((skill) => (
          <div key={skill.id} className="list-item">
            <h4>{skill.category}</h4>
            <p>{skill.items.length} items</p>
            <div className="item-actions">
              <button onClick={() => handleEdit(skill)} className="btn-small">Edit</button>
              <button onClick={() => handleDelete(skill.id!)} className="btn-small btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsManager;
