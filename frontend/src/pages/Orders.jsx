import { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/order').then(({ data }) => setOrders(data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="card" style={{ padding: 16 }}>
      <h2>Order History</h2>
      {!orders.length ? <p className="muted">No orders yet.</p> : (
        <div style={{ display: 'grid', gap: 10 }}>
          {orders.map(o => (
            <div key={o.id} className="card" style={{ padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>#{o.id}</strong>
                <span className="muted">${o.total?.toFixed(2)}</span>
              </div>
              <p className="muted">{new Date(o.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


