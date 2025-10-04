import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero card">
      <div className="hero-content">
        <h1>Discover the latest tech & lifestyle picks</h1>
        <p>Curated products, bold design, and seamless checkout. Elevate your everyday.</p>
        <Link to="/products" className="btn">Shop Now</Link>
        <div className="hero-images">
          <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop" alt="Phone" />
          <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop" alt="Headphones" />
          <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop" alt="Watch" />
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop" alt="Shoes" />
          <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop" alt="Backpack" />
        </div>
      </div>
    </section>
  );
}


