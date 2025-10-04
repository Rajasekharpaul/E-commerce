import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import './Checkout.css';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [shipping, setShipping] = useState({ name: user?.name || '', address: '', city: '', zip: '' });
  const [payment, setPayment] = useState({ card: '', exp: '', cvc: '' });
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  const placeOrder = async () => {
    setPlacing(true);
    try {
      await api.post('/order', { items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })), shipping, payment });
      clear();
      setSuccess(true);
    } finally {
      setPlacing(false);
    }
  };

  if (success) return <div className="card done"><h3>Order placed!</h3><p>Thank you for your purchase.</p></div>;

  return (
    <div className="checkout grid">
      <div className="card form">
        <h3>Shipping</h3>
        <div className="grid two">
          <input className="input" placeholder="Full Name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} />
          <input className="input" placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
          <input className="input" placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} />
          <input className="input" placeholder="ZIP" value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })} />
        </div>
        <h3>Payment</h3>
        <div className="grid two">
          <input className="input" placeholder="Card Number" value={payment.card} onChange={e => setPayment({ ...payment, card: e.target.value })} />
          <input className="input" placeholder="MM/YY" value={payment.exp} onChange={e => setPayment({ ...payment, exp: e.target.value })} />
          <input className="input" placeholder="CVC" value={payment.cvc} onChange={e => setPayment({ ...payment, cvc: e.target.value })} />
        </div>
      </div>
      <div className="card summary">
        <h3>Order Summary</h3>
        <div className="row"><span>Items ({items.length})</span><span className="price">${subtotal.toFixed(2)}</span></div>
        <button className="btn" onClick={placeOrder} disabled={placing || items.length === 0}>{placing ? 'Placing...' : 'Place Order'}</button>
      </div>
    </div>
  );
}


