import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';
import './ProductList.css';

export default function ProductList({ featuredOnly = false }) {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get('/products').then(({ data }) => setProducts(data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const safeIncludes = (value, q) => String(value || '').toLowerCase().includes(String(q || '').toLowerCase());
    let list = Array.isArray(products) ? [...products] : [];
    if (featuredOnly) list = list.slice(0, 8);
    if (query) list = list.filter(p => safeIncludes(p.name || p.title, query));
    if (category) list = list.filter(p => (p.category || '') === category);
    list.sort((a, b) => {
      const catA = String(a.category || '').toLowerCase();
      const catB = String(b.category || '').toLowerCase();
      if (catA !== catB) return catA.localeCompare(catB);
      const nameA = String(a.name || a.title || '').toLowerCase();
      const nameB = String(b.name || b.title || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
    return list;
  }, [products, query, category, featuredOnly]);

  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const list = (products || []).filter(p => (p.name || p.title || '').toLowerCase().includes(q));
    return list.slice(0, 5);
  }, [products, query]);

  const onSuggestionClick = (p) => {
    setQuery(p.name || p.title || '');
    setShowSuggestions(false);
    navigate(`/products/${p.id || p._id}`);
  };

  return (
    <div>
      {!featuredOnly && (
        <div className="filters card">
          <input className="input" placeholder="Search products..." value={query} onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} onFocus={() => query && setShowSuggestions(true)} />
          <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
          </select>
          <button className="btn" onClick={() => setShowSuggestions(true)}>Search</button>
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map(p => (
                <div key={p.id || p._id} className="item" onMouseDown={() => onSuggestionClick(p)}>
                  {(p.name || p.title) || ''}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-2 grid-cols-3 grid-cols-4">
          {filtered.map(p => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}


