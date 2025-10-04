import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="details grid">
      <div className="image card"><img src={product.image} alt={product.name} /></div>
      <div className="info card">
        <h2>{product.name || product.title}</h2>
        <p className="price">${product.price?.toFixed(2)}</p>
        <p className="muted">{product.description}</p>
        <div className="actions">
          <input className="input" type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} />
          <button className="btn" onClick={() => addItem(product, qty)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}


