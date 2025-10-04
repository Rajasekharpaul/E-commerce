import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';

export default function Profile() {
  const { user, token } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => { setName(user?.name || ''); setEmail(user?.email || ''); }, [user]);

  const onSave = async (e) => {
    e.preventDefault();
    setMessage('');
    await api.put('/users/me', { name, email, password: password || undefined });
    setMessage('Profile updated');
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: '0 auto', padding: 16 }}>
      <h2>Profile</h2>
      {message && <p className="muted">{message}</p>}
      <form onSubmit={onSave} style={{ display: 'grid', gap: 10 }}>
        <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="New Password (optional)" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn">Save</button>
      </form>
    </div>
  );
}


