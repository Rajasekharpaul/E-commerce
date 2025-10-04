import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import './Admin.css';
import ProductForm from '../components/ProductForm.jsx';

export default function Admin() {
  const [tab, setTab] = useState('products');
  return (
    <div className="admin">
      <div className="tabs card">
        <button className={`btn ${tab==='products'?'':'btn-outline'}`} onClick={() => setTab('products')}>Products</button>
        <button className={`btn ${tab==='orders'?'':'btn-outline'}`} onClick={() => setTab('orders')}>Orders</button>
        <button className={`btn ${tab==='users'?'':'btn-outline'}`} onClick={() => setTab('users')}>Users</button>
      </div>
      {tab === 'products' && <AdminProducts />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'users' && <AdminUsers />}
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', image: '' });
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await api.get('/products');
    setProducts(data || []);
  };
  useEffect(() => { load(); }, []);

  // create handled by ProductForm onSubmit

  const startEdit = (p) => {
    setEditId(p.id || p._id);
    setEditForm({ name: (p.name || p.title || ''), price: String(p.price ?? ''), image: p.image || '' });
  };

  const saveEdit = async (id) => {
    const payload = { ...editForm, price: Number(editForm.price) };
    // Backend expects 'title' not 'name'
    if (payload.name && !payload.title) { payload.title = payload.name; delete payload.name; }
    const { data } = await api.put(`/products/${id}`, payload);
    setProducts(prev => prev.map(p => (p.id === id || p._id === id) ? data : p));
    setEditId(null);
    setEditForm({ name: '', price: '', image: '' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: '', price: '', image: '' });
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => (p.id || p._id) !== id));
  };
  return (
    <div className="card section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h3>Manage Products</h3>
        <button className="btn" onClick={() => setShowForm(v => !v)}>{showForm ? 'Close Form' : 'Add Product'}</button>
      </div>
      {showForm && (
        <ProductForm onSubmit={async (payload) => {
          const { data } = await api.post('/products', payload);
          setProducts(p => [data, ...p]);
          setShowForm(false);
        }} />
      )}
      <div className="list">
        {products.map(p => {
          const pid = p.id || p._id;
          const isEditing = editId === pid;
          return (
            <div key={pid} className="row" style={{ gap: 10 }}>
              {isEditing ? (
                <>
                  <input className="input" style={{ maxWidth: 220 }} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                  <input className="input" style={{ maxWidth: 120 }} value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                  <input className="input" style={{ flex: 1 }} value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })} />
                  <button className="btn" onClick={() => saveEdit(pid)}>Save</button>
                  <button className="btn btn-outline" onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <span style={{ minWidth: 220 }}>{p.name}</span>
                  <span className="price" style={{ minWidth: 100 }}>${Number(p.price).toFixed(2)}</span>
                  <span className="muted" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.image}</span>
                  <button className="btn" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn btn-outline" onClick={() => remove(pid)}>Delete</button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/admin/orders').then(({ data }) => setOrders(data || [])); }, []);
  return (
    <div className="card section">
      <h3>Manage Orders</h3>
      <div className="list">
        {orders.map(o => (
          <div key={o.id} className="row">
            <span>#{o.id}</span>
            <span className="muted">{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/users');
      setUsers(data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="card section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h3>Manage Users</h3>
        <button className="btn btn-outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
      </div>
      {error && <p className="error-text" style={{ marginTop: 8 }}>{error}</p>}
      <div className="list" style={{ marginTop: 12 }}>
        {users.map(u => (
          <div key={u.id || u._id} className="row">
            <span style={{ minWidth: 220 }}>{u.username || u.name || '(no name)'}</span>
            <span className="muted" style={{ flex: 1 }}>{u.email}</span>
            <span className="muted" style={{ minWidth: 120, textTransform: 'capitalize' }}>{u.role || 'user'}</span>
          </div>
        ))}
        {!loading && !users.length && !error && (
          <p className="muted">No users found.</p>
        )}
      </div>
    </div>
  );
}


