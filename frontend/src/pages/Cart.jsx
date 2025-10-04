import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './Cart.css';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const goCheckout = () => navigate('/checkout');

  if (!items.length) return (
    <div className="card empty">
      <p>Your cart is empty.</p>
      <Link to="/products" className="btn">Browse products</Link>
    </div>
  );

  return (
    <div className="cart grid">
      <div className="cart-items card">
        {items.map(({ product, quantity }) => (
          <div key={product.id || product._id} className="cart-row">
            <img src={product.image} alt="" />
            <div className="grow">
              <p>{product.name || product.title}</p>
              <p className="muted">${Number(product.price).toFixed(2)}</p>
            </div>
            <input className="input qty" type="number" min="1" value={quantity}
              onChange={e => updateQuantity(product.id || product._id, Number(e.target.value))} />
            <button className="btn btn-outline" onClick={() => removeItem(product.id || product._id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="summary card">
        <h3>Summary</h3>
        <div className="row"><span>Subtotal</span><span className="price">${subtotal.toFixed(2)}</span></div>
        <button className="btn" onClick={goCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
}


