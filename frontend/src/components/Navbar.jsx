import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = !!(user && ((user.role && String(user.role).toLowerCase() === 'admin') || user.isAdmin));
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="logo">ShopGlow</Link>
        <nav className="nav-links">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-right">
          {user && <span className="user-display">Hi, {user.username || user.name || user.email}</span>}
          <Link to="/cart" className="cart-pill">Cart <span className="badge">{cartCount}</span></Link>
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-name">{user.username || user.name || user.email}</Link>
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-outline">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


