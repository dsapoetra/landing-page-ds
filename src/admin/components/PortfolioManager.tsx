import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface PortfolioItem {
  id?: number;
  title: string;
  description: string;
  image_url: string;
  link: string;
  category: string;
  order_index: number;
  published: boolean;
}

function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_BASE}/portfolio`);
      const data = await response.json();
      setItems(data.data || []);
    } catch (err) {
      setError('Failed to fetch portfolio items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (item: PortfolioItem) => {
    const token = localStorage.getItem('cms_token');
    const method = item.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(`${API_BASE}/portfolio`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        await fetchItems();
        setEditingItem(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save item');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const token = localStorage.getItem('cms_token');

    try {
      const response = await fetch(`${API_BASE}/portfolio?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchItems();
      } else {
        setError('Failed to delete item');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem({ ...item });
  };

  const handleNew = () => {
    setEditingItem({
      title: '',
      description: '',
      image_url: '',
      link: '',
      category: '',
      order_index: 0,
      published: true,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="manager-section">
      <div className="section-header">
        <h2>Portfolio Items</h2>
        <button onClick={handleNew} className="btn-primary">Add New</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {editingItem && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingItem.id ? 'Edit' : 'New'} Portfolio Item</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(editingItem); }}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <ImageUpload
                currentImage={editingItem.image_url}
                onImageUploaded={(url) => setEditingItem({ ...editingItem, image_url: url })}
                label="Portfolio Image"
              />
              <div className="form-group">
                <label>Link</label>
                <input
                  type="text"
                  value={editingItem.link}
                  onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Order Index</label>
                <input
                  type="number"
                  value={editingItem.order_index}
                  onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingItem.published}
                    onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  />
                  Published
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.image_url} alt={item.title} />
            <h4>{item.title}</h4>
            <p>{item.category}</p>
            <div className="item-actions">
              <button onClick={() => handleEdit(item)} className="btn-small">Edit</button>
              <button onClick={() => handleDelete(item.id!)} className="btn-small btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioManager;
