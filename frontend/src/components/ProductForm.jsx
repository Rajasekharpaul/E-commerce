import { useState } from 'react';
import './ProductForm.css';

export default function ProductForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (form.price === '' || isNaN(Number(form.price))) e.price = 'Number required';
    if (!form.image.trim()) e.image = 'Required';
    if (!form.category.trim()) e.category = 'Required';
    if (form.stock !== '' && isNaN(Number(form.stock))) e.stock = 'Number required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      // Backend expects 'title'
      title: form.name.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      stock: form.stock === '' ? undefined : Number(form.stock)
    };
    await onSubmit?.(payload);
    setForm({ name: '', price: '', image: '', category: '', description: '', stock: '' });
  };

  return (
    <form className="product-form card" onSubmit={handleSubmit}>
      <div className="row">
        <div className="field">
          <label>Name</label>
          <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div className="field">
          <label>Price</label>
          <input className="input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label>Image URL</label>
          <input className="input" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          {errors.image && <span className="error-text">{errors.image}</span>}
        </div>
        <div className="field">
          <label>Category</label>
          <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="beauty">Beauty</option>
            <option value="sports">Sports</option>
            <option value="accessories">Accessories</option>
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label>Description</label>
          <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="field">
          <label>Stock</label>
          <input className="input" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          {errors.stock && <span className="error-text">{errors.stock}</span>}
        </div>
      </div>
      <div className="actions">
        <button className="btn" disabled={submitting} type="submit">{submitting ? 'Adding…' : 'Add Product'}</button>
      </div>
    </form>
  );
}


