import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <div className="product-card card">
      <Link to={`/products/${product.id || product._id}`} className="image-wrap">
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="product-body">
        <Link to={`/products/${product.id || product._id}`} className="name">{product.name || product.title}</Link>
        <div className="product-meta">
          <span className="price">${product.price.toFixed(2)}</span>
          <button className="btn" onClick={() => addItem(product, 1)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}


